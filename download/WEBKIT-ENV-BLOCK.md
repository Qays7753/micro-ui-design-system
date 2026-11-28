# حاجز WebKit البيئي في هذه الحاوية (مُوثّق للاستنساخ)

المشكلة: playwright 1.57 (المثبت في .venv) يطلب webkit-2359، و MiniBrowser-wpe يحتاج سلسلة مكتبات نظام غير موجودة بلا sudo: libgtk-4, libgstgl, libsoup-3, libmanette, libenchant-2, libsecret, libGLESv2, libEGL, libgudev, libhidapi, libevdev, libbacktrace.

ما جُرّب:
1. تنزيل الـdebs إلى /tmp/wk-libs واستخراجها ومزرعة روابط في /tmp/wk-libs/farm — الثنائي يُقلع ويطبع إصداره.
2. غلاف pw_run.sh يصدّر LD_LIBRARY_PATH ثم يستدعي pw_run.sh.orig — يعمل من الصدفة.
3. نسخ المزرعة إلى minibrowser-wpe/lib و sys/lib.
4. Xvfb :99 — لا؛ WPE لا يستخدم X.
5. EGL_PLATFORM=surfaceless + GALLIUM_DRIVER=llvmpipe + LIBGL_ALWAYS_SOFTWARE — لا.

النقطة التي يتعثر عندها كل شيء: `Could not create EGL display: no supported platform available` — لا يوجد Mesa EGL vendor (libEGL_mesa.so) في الحاوية ولا dri driver لعرضه. أي إصلاح للبيئة يحتاج تثبيت نظامي (sudo apt install libgl1-mesa-dri libegl-mesa0 libgtk-4-1 …) أو حاوية بها هذه الحزم.

chromium: يعمل إطلاقًا وتحميلًا، لكن جولة ds-states على الفهرس الكامل (322 زرًا، كل واحد بضغطة قياس) تكسر EPIPE في driver هذه الحاوية — عند نطاق هدف صريح (17 عنصرًا) تعمل البوابة وتعطي نتائج صحيحة.

خطوة الاستئناف حين تُصلح البيئة: أعِد جولات البوابات الخمس عشرة المتبقية على المحركين، ثم الصور (uv run python scripts-local/snap-domains.py <sections>)، ثم check-all، ثم commit إغلاق B4.
