/* @micro/ui/access-gateway — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/access-gateway/access-gateway.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface AccessGatewayLabels {
  'passwordReveal.label': string;
  'recovery.uncertain': string;
  'recovery.error': string;
  'provider.connectingLabel': string;
  'provider.connectingMessage': string;
  'provider.success': string;
  'provider.failure': string;
  'provider.uncertain': string;
  'provider.error': string;
  'form.incomplete': string;
  'validation.email': string;
  'validation.password': string;
  'validation.passwordMinLengthPrefix': string;
  'validation.passwordMinLengthSuffix': string;
  'validation.passwordRequired': string;
  'validation.emailAndPasswordRequired': string;
  'demo.notice': string;
  'submit.loadingLabel': string;
  'submit.pendingMessage': string;
  'submit.error': string;
}

/** معاملات init (نفس كائن handlers في 0.1.0). */
export interface AccessGatewayHandlers {
  labels?: Partial<AccessGatewayLabels>;
  onSubmit?(credentials: { email: string; password: string }): unknown;
  onRecovery?(): unknown;
  providers?: Record<string, () => unknown>;
}

export interface AccessGatewayInstance {
  root: Element | Document;
  /** تحديث callbacks وتوافر الإجراءات دون ربط مضاعف. */
  update(handlers?: AccessGatewayHandlers): void;
  destroy(): void;
}

export function init(root?: Element | Document, handlers?: AccessGatewayHandlers): AccessGatewayInstance;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): AccessGatewayInstance | null;
export function setLabels(partial: Partial<AccessGatewayLabels>): void;
/** @deprecated منذ 0.2.0 (R-D10) — تحديث callbacks؛ استخدم init أو instance.update(handlers). */
export function update(root?: Element | Document, handlers?: AccessGatewayHandlers): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root?: Element | Document): void;

declare global {
  interface HTMLElementEventMap {
    'micro-access:submitted': CustomEvent<{ result: unknown }>;
  }
}
