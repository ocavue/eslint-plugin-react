'use strict';

const fromEntries = require('object.fromentries');
const entries = require('object.entries');

const allRules = require('./lib/rules');

function filterRules(rules, predicate) {
  return fromEntries(entries(rules).filter((entry) => predicate(entry[1])));
}

/**
 * @param {object} rules - rules object mapping rule name to rule module
 * @returns {Record<string, 2>}
 */
function configureAsError(rules) {
  return fromEntries(Object.keys(rules).map((key) => [`react/${key}`, 2]));
}

const activeRules = filterRules(allRules, (rule) => !rule.meta.deprecated);
const activeRulesConfig = configureAsError(activeRules);

const deprecatedRules = filterRules(allRules, (rule) => rule.meta.deprecated);

// for legacy config system
const plugins = [
  'react',
];

const SEVERITY_ERROR = /** @type {2} */ (2);
const SEVERITY_OFF = /** @type {0} */ (0);

const plugin = {
  deprecatedRules,
  rules: allRules,
  configs: {
    recommended: {
      plugins,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'react/display-name': SEVERITY_ERROR,
        'react/jsx-key': SEVERITY_ERROR,
        'react/jsx-no-comment-textnodes': SEVERITY_ERROR,
        'react/jsx-no-duplicate-props': SEVERITY_ERROR,
        'react/jsx-no-target-blank': SEVERITY_ERROR,
        'react/jsx-no-undef': SEVERITY_ERROR,
        'react/jsx-uses-react': SEVERITY_ERROR,
        'react/jsx-uses-vars': SEVERITY_ERROR,
        'react/no-children-prop': SEVERITY_ERROR,
        'react/no-danger-with-children': SEVERITY_ERROR,
        'react/no-deprecated': SEVERITY_ERROR,
        'react/no-direct-mutation-state': SEVERITY_ERROR,
        'react/no-find-dom-node': SEVERITY_ERROR,
        'react/no-is-mounted': SEVERITY_ERROR,
        'react/no-render-return-value': SEVERITY_ERROR,
        'react/no-string-refs': SEVERITY_ERROR,
        'react/no-unescaped-entities': SEVERITY_ERROR,
        'react/no-unknown-property': SEVERITY_ERROR,
        'react/no-unsafe': SEVERITY_OFF,
        'react/prop-types': SEVERITY_ERROR,
        'react/react-in-jsx-scope': SEVERITY_ERROR,
        'react/require-render-return': SEVERITY_ERROR,
      },
    },
    all: {
      plugins,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: activeRulesConfig,
    },
    'jsx-runtime': {
      plugins,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        jsxPragma: null, // for @typescript/eslint-parser
      },
      rules: {
        'react/react-in-jsx-scope': SEVERITY_OFF,
        'react/jsx-uses-react': SEVERITY_OFF,
      },
    },
  },
};

plugin.configs.flat = {
  recommended: {
    plugins: { react: plugin },
    rules: plugin.configs.recommended.rules,
    languageOptions: { parserOptions: plugin.configs.recommended.parserOptions },
  },
  all: {
    plugins: { react: plugin },
    rules: plugin.configs.all.rules,
    languageOptions: { parserOptions: plugin.configs.all.parserOptions },
  },
  'jsx-runtime': {
    plugins: { react: plugin },
    rules: plugin.configs['jsx-runtime'].rules,
    languageOptions: { parserOptions: plugin.configs['jsx-runtime'].parserOptions },
  },
};

module.exports = plugin;
