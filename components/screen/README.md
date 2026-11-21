# Screen — هيكل شاشة الهاتف

هيكل شاشة واحدة: شريط علوي، محتوى يتمرر وحده، شريط إجراءات وشريط تنقل — داخل ارتفاع الشاشة الحقيقي (100dvh). المرجع الوحيد لشكل شاشة الهاتف؛ كل شاشات [صفحة المعاينة](../../previews/screen/index.html) مبنية عليه. الحالة `draft-for-review`.

## الاستخدام

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

<div class="m-screen" data-micro-screen>
  <header class="m-screen__top"><!-- m-appbar من عائلة navigation --></header>
  <main class="m-screen__content">
    <section class="m-screen__section"><!-- المحتوى --></section>
  </main>
  <footer class="m-screen__actions">
    <button class="m-btn m-btn--primary" type="button">حفظ</button>
  </footer>
  <nav class="m-screen__nav"><!-- m-navbar من عائلة navigation --></nav>
</div>
<script type="module">
  import { init } from '@micro/ui/screen';
  init(); // أو IIFE: MicroScreen.init() تلقائي عند التحميل
</script>
```

- `viewport-fit=cover` **مطلوب من المضيف** لتفعيل حواف الشاشة الآمنة (بدونه ترجع `env(safe-area-inset-*)` إلى 0).
- `data-actions="keyboard-follow"` يرفع شريط الإجراءات فوق لوحة المفاتيح (شاشات النماذج)، و`keyboard-hide` يخفيه (الافتراضي عند وجود شريط تنقل سفلي).
- `update(root)` بعد تغيير محتوى الأشرطة ديناميكيًا لإعادة القياس.

## الواجهة

`init(root?, options?)` → `{ update(), destroy() }`، `update(root?)`، `destroy(root?)`، `getInstance(root?)` — العقد الموحد. لا يملك route ولا history ولا بيانات ولا نصوصًا.

الكامل: [المواصفة](specification.md) · [عقد السلوك الأصلي](../../docs/NATIVE-BEHAVIOR.md) · [مثال مستقل](example-usage.html)
