# DriverJobCard — مهمة توصيل عند السائق

مهمة موجهة إلى السائق في وضع السائق، وفق مواصفات الدفعة الثانية §4.8: العنوان والموقعان والتواصل مع المالك والمراحل، ومساحة الفعل بحسب المرحلة، وكل لمس ≥ 56.

## متى يُستخدم
- قائمة مهام السائق.

## متى لا يُستخدم
- عند المالك (DeliveryRequestCard).

## الخصائص
| الخاصية | القيم | ملاحظة |
|---|---|---|
| `label` / `origin` / `destination` | نص | المناطق والعنوانان |
| `owner` / `phone` | نص | ContactBar بكثافة السائق |
| `items` / `value` | مراحل/فهرس | JobTrack |
| `stage` | `quoting` · `active` · `blocked` · `awaiting-owner` | مساحة الفعل |
| `quote` / `action` / `proposal` | عنصر | عناصر التطبيق؛ أساسي أو سحب واحد فقط (ق2) |
| `evidence` | منطقي | EvidenceSlot قبل السحب |

SlideToConfirm وAmountField المطلوبان هنا من مرحلة 4 (يُكمَّل بعد الدمج). ق1: أهداف اللمس ≥ touch-driver عبر CSS.
