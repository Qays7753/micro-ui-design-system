# Micro — شاشات الدخول

## التدفق

```
splash.html ─► welcome.html (الدخول عبر Google فقط)
                    │  Google يعيد ID token
                    ▼
        MICRO_AUTH_CONFIG.verifyCredential(token)   ← يقرّره التطبيق المضيف على الخادم
                    │
        ┌───────────┴────────────┐
   status: 'new'           status: 'returning'
        ▼                        ▼
  new-user.html          returning-user.html
  «مرحبًا بك في Micro»    «أهلًا بعودتك»
        └──── زر المتابعة ← appUrl ────┘
```

- تظهر شاشة واحدة فقط من 3 أو 4، حسب ما يعيده التطبيق المضيف. الواجهة لا تستنتج «جديد/عائد» من البريد أو من أي شيء محلي.
- الإلغاء أو فشل الاتصال أو رفض المصادقة: يبقى المستخدم في `welcome.html` وتظهر رسالة واضحة. لا ينتقل لأي ترحيب.
- الشاشتان 3 و4 تعيدان المستخدم إلى `welcome.html` إذا فُتحتا مباشرة بدون تسجيل دخول (عند ضبط `googleClientId`).

## المجلدات

| المسار | المحتوى |
|---|---|
| `web/splash.html` | الشاشة 1 — بدون أي تغيير |
| `web/welcome.html` | الشاشة 2 — الدخول عبر Google |
| `web/new-user.html` | الشاشة 3 — مستخدم جديد |
| `web/returning-user.html` | الشاشة 4 — مستخدم عائد |
| `web/js/micro-auth.config.js` | **الملف الوحيد الذي يعدّله المطوّر** |
| `web/js/google-auth.js` | تحميل Google Identity Services، الحالات، والتفرّع |
| `web/js/welcome-screen.js` | تعبئة الاسم والحساب في الشاشتين 3 و4 |
| `web/css/micro-auth.css` | كل الأنماط؛ الألوان والمقاسات متغيرات في أوله |
| `tokens/micro-auth-tokens.json` | الألوان ووظائفها، الخط، الزوايا، الحركة |
| `svg/` | خلفيتا الشاشتين 1 و2 كأصل متجهي شفاف |
| `previews/` | لقطة لكل شاشة 1170×2532، و`states/` لحالات الشاشة 2 |

## الربط (للمطوّر)

في `web/js/micro-auth.config.js`:

1. `googleClientId`: معرّف OAuth Web Client من Google Cloud.
2. `verifyCredential(token)`: يرسل الـ ID token إلى خادم Micro للتحقق، ويعيد
   `{ status: 'new' | 'returning', user: { name, email, picture } }`.
   للرفض: `throw` خطأ فيه `code = 'auth'`. فشل الشبكة يظهر تلقائيًا كخطأ اتصال.
3. `appUrl`: وجهة زر المتابعة في الشاشتين 3 و4.
4. `signOut` (اختياري): يُستدعى عند «استخدم حسابًا آخر».

إذا كان التطبيق المضيف يكتشف إلغاء نافذة Google: `MicroAuth.showError('cancelled')`.

## Google

- الزر يرسمه Google Identity Services بنفسه داخل `#google-button` (`theme: outline`, `shape: pill`, `size: large`, `locale: ar`). لا يوجد أي رسم بديل لشعار Google أو للزر.
- بدون `googleClientId` يظهر مكان الزر فارغًا بإطار منقّط، ولا يحدث أي اتصال.

## معاينة الحالات (للمراجعة فقط، لا تسجّل دخول أحد)

- `welcome.html?preview-state=loading | error-network | error-cancelled | error-auth`
- `new-user.html?preview` و `returning-user.html?preview` (اسم وبريد تجريبيان)

## ملاحظات

- صور `previews/` مرسومة بخط بديل لأن IBM Plex Sans Arabic لم يكن متاحًا عند التصدير؛ الصفحات نفسها تحمّل الخط الصحيح من Google Fonts.
- روابط «الشروط» و«سياسة الخصوصية» تشير إلى `#` حاليًا.
- لوحة Claude Design لم تُحدَّث وما زالت على التدفق السابق.
