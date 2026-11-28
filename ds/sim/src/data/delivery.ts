/**
 * §5.2.6 التوصيل — deliveries ت1–ت4 and the two drivers.
 * ت1's valid quote (3 د) expires two hours after the simulation opens
 * (sim.quote-expiry-minutes = 120, addendum م-ر20).
 */
import type { Delivery, Driver } from './types';

export const QUOTE_EXPIRY_MINUTES = 120;

export const DELIVERIES: readonly Delivery[] = [
  {
    id: 'ت1',
    owner: 'ورشة الياسمين',
    from: 'طبربور',
    to: 'مرج الحمام',
    date: '2026-11-27',
    time: '16:00',
    driver: 'عمر الزعبي',
    quotes: [
      { amount: 3500, time: '10:05', state: 'superseded' },
      { amount: 3000, time: '10:40', state: 'valid', expiresInMinutes: QUOTE_EXPIRY_MINUTES },
    ],
    status: 'quoteArrived',
    evidence: null,
    linkedOrderId: '1175',
  },
  {
    id: 'ت2',
    owner: 'ورشة الياسمين',
    from: 'طبربور',
    to: 'الزرقاء، حي معصوم',
    date: '2026-11-26',
    time: '17:00',
    driver: 'عمر الزعبي',
    quotes: [{ amount: 3000, time: '16:00', state: 'accepted' }],
    status: 'done',
    evidence: null,
    evidenceProvided: 'photo',
    linkedOrderId: '1186',
    linkedMovementId: 'ح14',
  },
  {
    id: 'ت3',
    owner: 'ورشة الياسمين',
    from: 'طبربور',
    to: 'الزرقاء، حي معصوم',
    date: '2026-11-27',
    time: '12:00',
    driver: 'عمر الزعبي',
    quotes: [{ amount: 2500, time: '11:30', state: 'accepted' }],
    status: 'inProgress',
    evidence: 'photo',
    evidenceProvided: null,
    description: 'كوز قماش للخياطة المتعاونة — من مخزن الورشة',
  },
  {
    id: 'ت4',
    owner: 'صالون لمسة',
    from: 'طبربور',
    to: 'إربد، شارع الجامعة',
    date: '2026-11-28',
    time: '09:00',
    driver: 'عمر الزعبي',
    quotes: [],
    status: 'awaitingQuote',
    evidence: null,
  },
];

/** §5.2.6 السائقان. */
export const DRIVERS: readonly Driver[] = [
  {
    id: 'omar',
    name: 'عمر الزعبي',
    status: 'approved',
    phone: '079 123 4567',
    vehicle: 'سيارة صغيرة',
    plate: '13-55021',
    areas: ['طبربور', 'الزرقاء'],
    attachments: [],
  },
  {
    id: 'yazan',
    name: 'يزن القضاة',
    status: 'pendingReview',
    phone: '078 555 0142',
    vehicle: 'فان صغير',
    plate: '22-48913',
    areas: ['الزرقاء', 'طبربور'],
    attachments: ['صورة الهوية', 'رخصة القيادة', 'إثبات المركبة'],
  },
];
