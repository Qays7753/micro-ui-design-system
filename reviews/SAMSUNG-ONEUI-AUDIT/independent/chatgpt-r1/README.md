# أدلة مراجعة ChatGPT المستقلة

الرأسe60e8e8؛ مصدر components/previews/shared/tools مطابقa5500c9. Chromium153.0.8010.0. JSON المعادة تفصلoriginal_tool_metadata الثابتة في السكربت الأصلي عنreplay_metadata الفعلية؛ لا تفسر الأولى كبيئة المراجع.

إعادة التشغيل من جذر المستودع، معoutput خارج المستودع ومسار متصفح متاح فعليًا:

```bash
python3 reviews/SAMSUNG-ONEUI-AUDIT/independent/chatgpt-r1/replay.py --chromium /path/to/chromium --output /tmp/micro-sui-replay
python3 reviews/SAMSUNG-ONEUI-AUDIT/independent/chatgpt-r1/segment-probe.py --chromium /path/to/chromium --output /tmp/micro-sui-extra
python3 reviews/SAMSUNG-ONEUI-AUDIT/independent/chatgpt-r1/announcement-probe.py --chromium /path/to/chromium --output /tmp/micro-sui-extra
```

الأدوات تجمع القياسات وليست assertions قبول شاملة. اقرأ النتائج وقيودها؛ الصوت والمنصات الفعليةNOT RUN. لا تضبط المسارات أوmetadata التاريخية لتدعي بيئة لم تشغلها.
