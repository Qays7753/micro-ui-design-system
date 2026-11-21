// الجولة الثانية (قرار المالك بعد مراجعة c573118): no-undef على مصدر المكتبة —
// كل متغير مستخدم في components/ وshared/ يجب أن يكون معرفًا أو عامًّا للمتصفح.
import globals from 'globals';

export default [
  {
    files: ['components/**/*.js', 'shared/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    rules: {
      'no-undef': 'error',
    },
  },
];
