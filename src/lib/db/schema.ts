// Baseline schema — auth identity, product analytics, alert throttling, waitlist.
// Everything here is generic scaffolding every Modryn build needs. Your domain tables go
// BELOW the marker at the bottom; don't edit the auth tables (Better Auth owns their shape).
import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  index,
  uniqueIndex,
  doublePrecision,
  customType,
  primaryKey,
} from 'drizzle-orm/pg-core';

// ── Better Auth tables. Managed by better-auth via the Drizzle adapter. ──────────────
// Physical names are auth_-prefixed so `auth_session` can never collide with a domain
// table called `session` (a real collision on a previous build). See src/lib/auth.ts.
export const authUser = pgTable('auth_user', {
  id: text('id').primaryKey(),
  name: text('name'), // nullable: Google supplies one, the emailed-code path does not
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const authSession = pgTable('auth_session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => authUser.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const authAccount = pgTable('auth_account', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => authUser.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const authVerification = pgTable('auth_verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ── analytics_event — the free, self-hosted product funnel (no Google Analytics). ────
// The user is referenced by id and cascades on delete, so an erasure request takes this
// with it — analytics must not become a second un-deletable store of personal data. No IP
// is captured for the same reason; `user_agent` is kept only to filter bots.
export const analyticsEvent = pgTable(
  'analytics_event',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    // Null until the visitor signs in — most funnel events fire before there is a user.
    userId: text('user_id').references(() => authUser.id, { onDelete: 'cascade' }),
    // First-party cookie, survives tabs and reloads (a sessionStorage-only id resets per
    // tab and silently inflates the session count).
    visitorId: text('visitor_id'),
    // Per-tab, so a single visitor's separate visits stay distinguishable.
    sessionId: text('session_id'),
    properties: jsonb('properties'),
    path: text('path'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Every funnel query filters name + date; without this they are all seq scans.
    index('analytics_event_name_created_idx').on(t.name, t.createdAt),
    index('analytics_event_visitor_idx').on(t.visitorId),
    index('analytics_event_user_idx').on(t.userId),
  ],
);

// ── alert_throttle — flood control for founder alerts. ───────────────────────────────
// A durable, cross-instance cooldown: an in-memory Map is per-instance on serverless and
// therefore close to meaningless, so one error loop either buries the signal or hits
// Gmail's ~500/day cap. One row per alert kind; see sendNotification's `throttleKey`.
export const alertThrottle = pgTable('alert_throttle', {
  key: text('key').primaryKey(),
  lastSentAt: timestamp('last_sent_at', { withTimezone: true }).notNull().defaultNow(),
});

// ── waitlist_signup — pre-launch email capture, reviewed in /admin. ──────────────────
// Unique on email so a resubmit (refresh, retry) is a no-op, not a duplicate row.
export const waitlistSignup = pgTable('waitlist_signup', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────────────
// DOMAIN TABLES — add yours below this line.
//
// After any change here: `npx drizzle-kit generate` then `migrate`. NEVER `push` — see
// CLAUDE.md. One push makes migrate skip older migrations forever, silently, exit 0.
// ─────────────────────────────────────────────────────────────────────────────────────

/* THE MODEL, and the full reasoning is in docs/architecture.md. The short version, because it
 * governs every table below:
 *
 *   THE DRAWING IS THE TRUTH. A takeoff is a REPORT on geometry, not a stored document, and a
 *   render is an ILLUSTRATION of it. No quantity is ever persisted — they are computed on read
 *   from the drawing plus the material rules, so nothing can go stale, because nothing is kept.
 *   The moment a stored number can disagree with the shape it describes, this product's entire
 *   claim (that its numbers are trustworthy) is gone.
 */

// Postgres `bytea`. Drizzle has no first-class bytea, and this is the same shape yard uses.
const bytea = customType<{ data: Buffer; notNull: true }>({
  dataType: () => 'bytea',
});

/* ── property — one piece of ground, owned by one account ──────────────────────────────
 *
 * `user_id` IS UNIQUE, AND THAT STATES THE PRODUCT RATHER THAN IMPLYING IT. One account has at
 * most one property in v1 (spec.md, NOT IN V1). Dropping a unique constraint later is a one-line
 * migration; discovering the hard way that two rows existed is not.
 *
 * The tenant column exists BEFORE there is a second user, deliberately. Without it the app is
 * single-tenant by construction — one row readable by anyone holding a session — which is
 * survivable while the allowlist is one address and fatal the moment it is not. The cost of
 * adding it only ever rises. */
export const property = pgTable(
  'property',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => authUser.id, { onDelete: 'cascade' }),
    address: text('address').notNull(),
    // Every external lookup keys off these, not off the address string.
    lat: doublePrecision('lat').notNull(),
    lng: doublePrecision('lng').notNull(),

    /* DERIVED AND CONFIRMED ARE TWO COLUMNS, NOT ONE MERGED BLOB, and that is the schema carrying
     * the product's central distinction. A value a source returned and a value the owner checked
     * with a tape are different KINDS of fact: one is a starting assumption, the other is what a
     * materials purchase rests on. Merged, "who said this" becomes a per-field convention that
     * drifts; split, it is structural.
     *
     * NOTHING EVER OVERWRITES `derived`. The read layer overlays `confirmed` on top of it, so a
     * bad correction is always recoverable and a re-capture can never silently discard a
     * measurement somebody walked outside to take. */
    derived: jsonb('derived').notNull(), // parcel rings, house footprint, imagery + flux manifests, zone, slope, aspect
    confirmed: jsonb('confirmed').notNull().default({}), // sun/slope overrides, marked water areas

    /* Geometry merged in from completed projects (spec S9). A COPY, not a join: see the deletion
     * policy in architecture.md. Deleting the paperwork does not un-build the patio. */
    existing: jsonb('existing').notNull().default({ shapes: [] }),

    capturedAt: timestamp('captured_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  }
  /* NO SEPARATE INDEX ON user_id. The `.unique()` above already creates one, and a second index
   * over the same column is pure write cost with no read benefit. The architecture doc's gate
   * asks that every filtered column be indexed; this one is, by the constraint that also states
   * one-property-per-account. */
);

/* ── property_asset — bytes: imagery, sun-flux layers, owner photos, AI renders ─────────
 *
 * KEYED ON (property_id, name), NOT ON name, and yard already paid for this twice. With `name`
 * alone as the key: every capture produces a `z18.png`, so the second account's upsert overwrites
 * the first account's imagery in place — silently, with a successful exit. The read bug was worse
 * — a lookup by name resolved globally, so any signed-in account could fetch another account's
 * satellite imagery by guessing a filename that is identical for everybody. Both were invisible
 * while the allowlist held one address. */
export const propertyAsset = pgTable(
  'property_asset',
  {
    propertyId: uuid('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),
    // The name the record references, e.g. `z18.png`, `flux-07.png`, `photo-<uuid>.jpg`.
    name: text('name').notNull(),
    kind: text('kind').notNull(), // imagery | flux | photo | render
    bytes: bytea('bytes').notNull(),
    contentType: text('content_type').notNull(),
    /* Content hash, not a timestamp. The asset URL carries it, so a re-capture producing identical
     * bytes keeps its URL and a changed one gets a new URL — which is what makes the immutable
     * cache header safe and stops the field view showing last year's yard. */
    etag: text('etag').notNull(),
    capturedAt: timestamp('captured_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.propertyId, t.name] }),
    index('property_asset_kind_idx').on(t.propertyId, t.kind),
  ]
);

/* ── project — one piece of work on the ground ─────────────────────────────────────────
 *
 * The four views (Look, Plan, Takeoff, Build) are VIEWS OF THIS ROW, not four records. Look and
 * Plan are the same patio seen two ways; Takeoff and Build are reports on it.
 *
 * UNIQUE ON (property_id, slug), and never resolved by slug alone anywhere in the app. A slug is
 * guessable — half of these will be called `patio` — so resolving one without an owner hands any
 * signed-in account somebody else's project. */
export const project = pgTable(
  'project',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    propertyId: uuid('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    title: text('title').notNull(), // the owner's words, not ours
    kind: text('kind').notNull(), // patio | path | bed — selects the guide and the material rules
    status: text('status').notNull().default('draft'), // draft | sized | building | complete

    // Source photo name, the regions drawn on it, and the prompt history. The LOOK half.
    look: jsonb('look').notNull().default({}),

    /* THE TRUTH. Shapes with dimensions, each dimension carrying its own
     * `{ value, source: 'derived' | 'measured', at }` — which is how the takeoff knows which
     * numbers rest on something somebody actually checked. Materials, depths, plant placements.
     *
     * jsonb rather than normalised shape/vertex tables because NOTHING QUERIES ACROSS SHAPES:
     * every read is "this project's drawing, whole". Normalising would buy query shapes nobody
     * needs and cost a migration per geometry change while the shape is still moving. Revisit if
     * a query ever needs to filter shapes across projects. */
    drawing: jsonb('drawing').notNull().default({ shapes: [] }),

    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('project_property_slug_idx').on(t.propertyId, t.slug),
    index('project_property_status_idx').on(t.propertyId, t.status),
  ]
);

/* ── generation — one AI render request, and what it produced ───────────────────────────
 *
 * Kept as a row rather than folded into `project.look` because the spec requires the prompt and
 * parameters to survive a FAILURE with the drawing intact (S3): "this failed and your work is
 * where you left it" is the whole difference for an action that costs money. A failed generation
 * is a row with status `failed` and no asset, not a lost prompt. */
export const generation = pgTable(
  'generation',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    // → property_asset.name. Null while pending, and after a failure.
    assetName: text('asset_name'),
    prompt: text('prompt').notNull(),
    params: jsonb('params').notNull().default({}), // material, look, season, model id
    status: text('status').notNull().default('pending'), // pending | ready | failed
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('generation_project_idx').on(t.projectId, t.createdAt)]
);

/* ── build_gate — a stop-work check the owner ticked ────────────────────────────────────
 *
 * The only thing the build guide writes. A table rather than a field on `drawing` because it is
 * written independently of the geometry and read to gate the next step.
 *
 * KEYED ON THE GUIDE'S OWN STEP KEY, not on an index, so re-ordering a guide's steps cannot
 * silently un-tick a gate somebody really passed — which for `811-marked` is not a cosmetic
 * concern. */
export const buildGate = pgTable(
  'build_gate',
  {
    projectId: uuid('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    stepKey: text('step_key').notNull(), // stable key from the guide, e.g. `811-marked`
    checkedAt: timestamp('checked_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.stepKey] })]
);
