import { fixupConfigRules } from '@eslint/compat';
import nextConfig from 'eslint-config-next';

export default [
  ...fixupConfigRules(nextConfig),
  {
    rules: {
      // Disabled: false positive in Next.js SSR context. localStorage and URL params
      // are only available client-side, so useEffect is the correct initialization
      // pattern - lazy useState initializers would crash on the server.
      'react-hooks/set-state-in-effect': 'off',

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
