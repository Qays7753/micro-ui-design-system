/** @type {import('stylelint').Config} */
export default {
  plugins: ['stylelint-no-unsupported-browser-features'],
  rules: {
    // Feature support is checked against the browserslist query in package.json
    // (plan section 2 / K17). Anything unsupported on the target floor fails.
    'plugin/no-unsupported-browser-features': [true, { severity: 'error' }],
    'color-no-invalid-hex': true,
    'block-no-empty': true,
    'comment-no-empty': true,
    'no-duplicate-selectors': true,
    'declaration-block-no-duplicate-custom-properties': true,
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'no-empty-source': true,
    'function-calc-no-unspaced-operator': true,
    'media-feature-name-no-unknown': true,
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'at-rule-no-unknown': [true, { ignoreAtRules: ['theme'] }],
    'custom-property-pattern': '^([a-z]+-)*[a-z][a-z0-9-]*$',
    'selector-class-pattern': '^mds-[a-z][a-z0-9-]*$',
  },
  ignoreFiles: ['dist/**', 'node_modules/**'],
};
