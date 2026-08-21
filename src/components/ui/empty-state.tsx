import type { LucideIcon } from 'lucide-react';

// The screen when there is nothing to show. Deliberately a primitive rather than something each
// screen improvises, because the improvised version is always "No items" and that is the version
// that reads as broken.
//
// `title` says what is missing in the product's own words; `description` says what to do about
// it. An empty state with no next action is a dead end, so `action` is where the CTA goes.
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border-border flex flex-col items-center rounded-md border border-dashed px-6 py-12 text-center">
      <Icon size={24} aria-hidden className="text-muted" />
      <p className="text-title3 mt-4 text-balance">{title}</p>
      {description && <p className="text-body0 text-muted mt-2 max-w-sm text-pretty">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
