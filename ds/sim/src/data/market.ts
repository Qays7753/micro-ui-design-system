/**
 * §5.2.7–5.2.9 — the market listings, the review queue, the notifications.
 */
import type { Listing, ReviewItem, SimNotification } from './types';

/** §5.2.7 السوق. */
export const LISTINGS: readonly Listing[] = [
  { id: 'ع1', supplier: 'مخبز الأصيل للجملة', title: 'طحين أبيض 50 كغ', price: 22000, availability: 'available', qty: 40, status: 'approved', imageCount: 4, governorate: 'إربد', category: 'مواد خام', minOrder: 'كيسان' },
  {
    id: 'ع2',
    supplier: 'مخبز الأصيل للجملة',
    title: 'بسكويت شاي، كرتونة 12 قطعة',
    price: null,
    tiers: [
      { min: 1, max: 9, price: 2500 },
      { min: 10, max: 49, price: 2250 },
      { min: 50, max: null, price: 2000 },
    ],
    availability: 'onDemand',
    qty: null,
    status: 'approved',
    imageCount: 3,
    governorate: 'إربد',
    category: 'مخبوزات',
    minOrder: '5 كراتين',
  },
  { id: 'ع3', supplier: 'مخبز الأصيل للجملة', title: 'خبز صاج، ربطة 10', price: 1500, availability: 'available', qty: null, status: 'underReview', since: 'منذ 5 ساعات', imageCount: 2, governorate: 'إربد', category: 'مخبوزات', minOrder: '10 ربطات' },
  { id: 'ع4', supplier: 'مخبز الأصيل للجملة', title: 'كعك بالسمسم، كيس 1 كغ', price: 3000, editedPrice: 2750, availability: 'available', qty: null, status: 'approvedWithEdit', since: 'منذ ساعة', imageCount: 2, governorate: 'إربد', category: 'مخبوزات', minOrder: '5 أكياس' },
  { id: 'ع5', supplier: 'مخبز الأصيل للجملة', title: 'معمول تمر، علبة 24', price: 6500, availability: 'available', qty: null, status: 'rejected', rejectReason: 'الصور غير واضحة', imageCount: 1, governorate: 'إربد', category: 'حلويات', minOrder: 'علبتان' },
  { id: 'ع6', supplier: 'مؤسسة الخطيب للأقمشة', title: 'قماش ساتان، لفّة 25 م', price: 95000, availability: 'temporarilyUnavailable', qty: null, status: 'approved', imageCount: 3, governorate: 'الزرقاء', category: 'أقمشة', minOrder: 'لفّة', reports: ['معلومات مضللة', 'معلومات مضللة', 'إعلان مزعج'] },
  { id: 'ع7', supplier: 'مؤسسة الخطيب للأقمشة', title: 'خيوط بوليستر، علبة 12', price: 6500, availability: 'available', qty: 40, status: 'approved', imageCount: 2, governorate: 'الزرقاء', category: 'خيوط', minOrder: 'علبة' },
  { id: 'ع8', supplier: 'مطبخ أم خالد', title: 'مقلوبة مجمدة، صينية 4 أشخاص', price: 9000, availability: 'onDemand', qty: null, status: 'underReview', since: 'منذ 3 ساعات', imageCount: 2, governorate: 'الزرقاء', category: 'أطعمة', minOrder: 'صينيتان', firstListing: true },
];

/** §5.2.8 طابور المراجعة (الأقدم أولاً). */
export const REVIEW_QUEUE: readonly ReviewItem[] = [
  { kind: 'listing', ref: 'ع3', since: 'منذ 5 ساعات' },
  { kind: 'listing', ref: 'ع8', since: 'منذ 3 ساعات' },
  { kind: 'listingEdit', ref: 'ع4', since: 'منذ ساعة' },
];

export const REPORTS_QUEUE: readonly ReviewItem[] = [{ kind: 'listing', ref: 'ع6', since: '3 بلاغات' }];

export const DRIVERS_QUEUE: readonly ReviewItem[] = [{ kind: 'driver', ref: 'yazan', since: 'منذ يومين' }];

/** §5.2.9 الإشعارات. */
export const NOTIFICATIONS: readonly SimNotification[] = [
  { key: 'quote_submitted', role: 'owner', object: 'ت1', time: '10:40 ص', read: false },
  { key: 'quote_expiring', role: 'owner', object: 'ت1', time: 'قبل الانتهاء بساعة', read: false },
  { key: 'status_changed', role: 'owner', object: 'ت3', time: '11:55 ص', read: false },
  { key: 'booking_outcome', role: 'owner', object: 'ت2', time: 'أمس 5:10 م', read: true },
  { key: 'report_replied', role: 'owner', object: 'ع6', time: 'أمس 2:00 م', read: true },
  { key: 'booking_request_received', role: 'driver', object: 'ت4', time: '9:10 ص', read: false },
  { key: 'evidence_expiry_reminder', role: 'driver', object: 'ت3', time: '11:30 ص', read: false },
  { key: 'driver_review_decision', role: 'driver', object: 'اعتماد عمر الزعبي', time: '24/11 10:00 ص', read: true },
  { key: 'moderation_decision', role: 'supplier', object: 'ع5', time: 'أمس 4:00 م', read: false },
  { key: 'listing_freshness_reminder', role: 'supplier', object: 'ع2', time: '9:00 ص', read: false },
];
