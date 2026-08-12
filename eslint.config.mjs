import { fixupConfigRules } from '@eslint/compat';
import nextConfig from 'eslint-config-next';
import tailwind from 'eslint-plugin-tailwindcss';

export default [
  ...fixupConfigRules(nextConfig),
  {
    plugins: { tailwindcss: tailwind },
    settings: {
      // Tailwind v4 moved the token list out of a JS config and into CSS, so the checker reads
      // the stylesheet. THIS IS WHAT MAKES THE RULE SELF-MAINTAINING: the legal class list is
      // generated from the @theme block, so adding a token to globals.css is the only way to
      // make a class legal, and the checker can never drift from the design system.
      tailwindcss: { cssConfigPath: 'src/app/globals.css' },
    },
    rules: {
      // Disabled: false positive in Next.js SSR context. localStorage and URL params
      // are only available client-side, so useEffect is the correct initialization
      // pattern - lazy useState initializers would crash on the server.
      'react-hooks/set-state-in-effect': 'off',

      // THE DESIGN SYSTEM'S CENTRAL RULE, ENFORCED.
      //
      // Every Modryn design system opens with some version of "if a screen needs a value that
      // isn't in this file, add it here first, then use it." On the first build to use the v4
      // blueprint, that rule had no teeth and produced exactly the failure you would predict:
      // `text-body-lg` shipped on the landing page and COMPILED TO NOTHING. The line silently
      // fell back to inherited 16px and nobody noticed for days. Meanwhile the em-dash rule
      // below was a lint error, so the cosmetic rule was the enforced one.
      //
      // Catches one thing: a class that LOOKS like a token but is not one.
      //   text-body-lg     a token that does not exist
      //   bg-surface-2     a plausible variant of a real token
      //
      // It also caught a live bug within a minute of being switched on: two tokens had been
      // defined as `--parse-fill` / `--parse-line` rather than `--color-parse-*`, so they were
      // outside a Tailwind namespace, generated no utility, and the element had been falling
      // back to the browser's default yellow <mark>. Invisible to review, invisible to tsc.
      'tailwindcss/no-custom-classname': [
        'error',
        {
          // Legitimate one-offs live here and NOWHERE ELSE. If this list grows past a handful,
          // that is a signal the system is missing a token, not that the rule is wrong.
          whitelist: [
            // Hand-written utilities defined in globals.css outside @theme.
            'cursor-blink',
            // Structural, not visual: these carry no design decision.
            'sr-only',
            'group',
          ],
        },
      ],

      // The third case, and it needs its own rule: `text-[13px]` is VALID Tailwind syntax, so
      // no-custom-classname passes it. It is also exactly the one-off a design system forbids:
      // a value inlined into a component instead of added to @theme.
      //
      // Deliberately a WARNING. Structural arbitraries are legitimate and common
      // (`content-['']`, `grid-rows-[0fr]`, `transition-[grid-template-rows]`), so as an error
      // this would be suppressed everywhere within a week and stop meaning anything. As a
      // warning, a hardcoded `text-[13px]` still shows up in the output where you will see it.
      'tailwindcss/no-arbitrary-value': 'warn',

      // NO EM DASHES IN APP CONTENT (Luke, 2026-08-11: "that's a violation").
      //
      // Studio-wide house style, which is exactly why it lives in the boilerplate rather than in
      // one project's config: a rule nobody enforces is a rule that comes back, and a rule that
      // only exists in the project where it was first noticed protects nothing after that.
      //
      // Fires on JSX text and on string/template literals, which is where user-visible copy
      // lives. COMMENTS AND MARKDOWN ARE EXEMPT on purpose: they are documentation, not app
      // content. The moment a character can reach a user, it is content.
      //
      // Escape hatch, for the rare legitimate case (a quoted source, a data fixture):
      //   // eslint-disable-next-line no-restricted-syntax
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXText[value=/\\u2014/]',
          message:
            'No em dashes in app content. Use a colon, a full stop, or parentheses instead.',
        },
        {
          selector: 'Literal[value=/\\u2014/]',
          message:
            'No em dashes in app content. Use a colon, a full stop, or parentheses instead.',
        },
        {
          selector: 'TemplateElement[value.raw=/\\u2014/]',
          message:
            'No em dashes in app content. Use a colon, a full stop, or parentheses instead.',
        },
      ],
    },
  },
];
