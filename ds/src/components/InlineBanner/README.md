# InlineBanner

الشريط المثبت أعلى المحتوى (الموجز 517، و658، و23.23، و23.17).

## متى تُستخدم

- للشبكة والصلاحيات والمعلومة، مثبت أعلى المحتوى (517). «عاد الاتصال، لديك مسودة» مع زر «راجع واحفظ» (658).

## الشكل (1649)

- **النبرة من `tone`** · أيقونة 20 + نص · **لا سطح ملوّن كامل** — زوج الألوان الفاتح من 5.2:
  - `offline`: WifiSlash بلون المشكلة — «الاتصال انقطع»
  - `locked`: LockSimple بلون المحايد — «هذا خارج صلاحياتك»
  - `info`: Info بلون المعلومة
- `position: sticky` أعلى المحتوى، الطبقة `layer.content` (1242).
- زر إجراء اختياري في النهاية (658).

## قارئ الشاشة (23.17)

انقطاع الشبكة يُعلن مؤدبًا (`role="status"`). الفوري يبقى لفشل الحفظ في `SaveState` وحده.

## الخصائص (23.18)

`tone`، `label`، `trailing`، والتمريرات القياسية.

## مثال

```tsx
import { InlineBanner, Button, t } from '@micro/ds';

<InlineBanner
  tone="offline"
  label={t('banner.offline')}
/>
<InlineBanner
  tone="info"
  label={t('banner.backOnline')}
  trailing={<Button variant="secondary" size="sm">{t('button.reviewAndSave')}</Button>}
/>
```
