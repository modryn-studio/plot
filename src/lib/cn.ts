import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// The locked type scale (globals.css @theme) defines text-* SIZE tokens - text-micro through
// text-hero - alongside Tailwind's own text-* COLOR utilities (text-accent, text-muted, ...).
// Bare `twMerge` doesn't know our custom size tokens are a font-size group, so it silently treats
// `text-subtitle1` and `text-accent-fg` as the same conflict group and drops one - e.g.
// `cn('text-accent-fg', 'text-subtitle1')` used to lose the color entirely. Registering the scale
// as its own font-size group fixes that for every future `cn()` call, not just one component.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // Keep in sync with the @theme type scale in globals.css - a step missing here is silently
      // treated as a text COLOR and merged away against one.
      // `mega` removed 2026-07-30 with the token. A step left listed here after its token is gone
      // is worse than useless: tailwind-merge would keep treating `text-mega` as a size and
      // silently swallow whatever real size it sat beside.
      // MUST MATCH the @theme type scale in globals.css exactly. This list had drifted from an
      // older project's scale and listed seven tokens that do not exist here, which is part of
      // how a nonexistent `text-subtitle1` survived in a downstream build: tailwind-merge happily
      // treats an unknown name as a valid font size.
      //
      // `tailwindcss/no-custom-classname` now catches a class that is not a token. Nothing
      // catches a token missing FROM THIS LIST, which fails the other way (silently merged away
      // against a colour), so update it by hand whenever the scale changes.
      'font-size': [
        {
          text: [
            'title0',
            'title1',
            'title2',
            'title3',
            'title4',
            'title5',
            'title6',
            'numeric1',
            'numeric2',
            'subtitle1',
            'subtitle2',
            'subtitle3',
            'subtitle4',
            'body0',
            'body0-medium',
            'body0-bold',
            'body1',
            'body1-medium',
            'body1-bold',
            'body2',
            'body2-bold',
            'button1',
            'button2',
            'button3',
            'metadata1',
            'metadata1-medium',
            'metadata1-bold',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  // The classname checker treats every argument to `cn()` as a class string, which is right at
  // every call site and wrong exactly here: this is `cn`'s own definition, so `inputs` is a
  // variable, not a class. The only legitimate suppression of this rule in the codebase.
  // eslint-disable-next-line tailwindcss/no-custom-classname
  return twMerge(clsx(inputs));
}
