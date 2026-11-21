/* @micro/ui/product — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/product-context/*.js — سياق المنتج C07–C12 وC14. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface ProductLabels {
  'phase.loading': string;
  'phase.empty': string;
  'phase.success': string;
  'phase.error': string;
  'phase.rejected': string;
  'phase.disabled': string;
  'phase.pending': string;
  'phase.uncertain': string;
  'phase.denied': string;
  'phase.expired': string;
  'phase.signedOut': string;
  'phase.conflict': string;
  'confirm.missingComponent': string;
  'confirm.title': string;
  'confirm.cancel': string;
  'confirm.ok': string;
  'form.requiredFields': string;
  'form.missingFieldPrefix': string;
  'form.missingFieldFallback': string;
  'media.unavailable': string;
  'media.carouselLabel': string;
  'media.cardLabelPrefix': string;
  'media.imageAltFallback': string;
  'media.imageError': string;
  'media.linkUnavailable': string;
  'media.prev': string;
  'media.next': string;
  'attachments.label': string;
  'attachments.addMore': string;
  'attachments.replaceSelection': string;
  'attachments.choose': string;
  'attachments.fileError': string;
  'attachments.fileErrorDetail': string;
  'attachments.remove': string;
  'attachments.removeAriaPrefix': string;
  'attachments.removeAll': string;
  'attachments.requiredNotice': string;
  'shell.previousContextHidden': string;
  'shell.reauth': string;
  'shell.chooseContext': string;
  'shell.noScopeTitle': string;
  'shell.noScopeDetail': string;
  'shell.driverScopeTitle': string;
  'shell.driverScopeDetail': string;
  'shell.noPermission': string;
  'connection.offline': string;
  'connection.local': string;
  'connection.weak': string;
  'connection.manageNotice': string;
  'connection.genericNotice': string;
  'stateCard.recheck': string;
  'context.accountFallback': string;
  'context.unavailableTitle': string;
  'context.unavailableDetail': string;
  'context.invalidListTitle': string;
  'context.selectLabel': string;
  'context.destination.manage': string;
  'context.destination.market': string;
  'context.destination.delivery': string;
  'context.navLabel': string;
  'context.noDestinationsTitle': string;
  'context.noDestinationsDetail': string;
  'delivery.title': string;
  'delivery.pickup': string;
  'delivery.dropoff': string;
  'common.unavailable': string;
  'delivery.addressesUnavailable': string;
  'delivery.pickupField': string;
  'delivery.dropoffField': string;
  'delivery.noteField': string;
  'delivery.requestAction': string;
  'delivery.requestConfirm': string;
  'common.unitFallback': string;
  'delivery.validityFallback': string;
  'delivery.quote.accept': string;
  'delivery.quote.decline': string;
  'delivery.quote.assign': string;
  'delivery.quote.confirmPrefix': string;
  'common.unavailablePlain': string;
  'delivery.change.current': string;
  'delivery.change.proposed': string;
  'delivery.partyStatusFallback': string;
  'delivery.change.requestAction': string;
  'delivery.change.confirm': string;
  'delivery.proof.noteField': string;
  'delivery.proof.returnAction': string;
  'delivery.proof.deliveryAction': string;
  'delivery.proof.attachmentRequired': string;
  'delivery.proof.confirm': string;
  'delivery.updateStatusAction': string;
  'market.editorTitle': string;
  'market.searchTitle': string;
  'market.listingTitle': string;
  'market.searchField': string;
  'market.searchAction': string;
  'market.titleField': string;
  'market.descriptionField': string;
  'market.priceField': string;
  'market.priceUnitFallback': string;
  'market.publishAction': string;
  'market.saveDraftAction': string;
  'market.publishConfirmPrefix': string;
  'market.publishConfirmPrice': string;
  'market.reviewNoteTitle': string;
  'market.editAction': string;
  'market.reportAction': string;
  'market.reportConfirm': string;
  'operation.title': string;
  'operation.referencePrefix': string;
  'operation.actions.recheck': string;
  'operation.actions.retry': string;
  'assistant.logLabel': string;
  'assistant.userSpeaker': string;
  'assistant.noteSpeaker': string;
  'assistant.retryAction': string;
  'assistant.proposalExpired': string;
  'assistant.proposalCompleted': string;
  'assistant.proposalUnavailable': string;
  'assistant.emptyLog': string;
  'assistant.searchingStatus': string;
  'assistant.preparingStatus': string;
  'assistant.newMessagesAction': string;
  'assistant.proposalTitle': string;
  'assistant.proposalActionFallback': string;
  'assistant.messageField': string;
  'assistant.sendAction': string;
  'review.reportTitle': string;
  'review.itemTitle': string;
  'review.reasonField': string;
  'review.categoryField': string;
  'review.submitAction': string;
  'review.submitConfirm': string;
  'review.reasonTitle': string;
  'review.attachmentsRestricted': string;
  'review.decisionNoteField': string;
  'review.approveAction': string;
  'review.rejectAction': string;
  'review.requestInfoAction': string;
  'review.decisionConfirmPrefix': string;
  'review.decisionConfirmOn': string;
  'review.subjectFallback': string;
  'manage.title': string;
  'manage.summaryTitle': string;
  'manage.listTitle': string;
  'manage.formTitle': string;
  'manage.amountField': string;
  'manage.typeField': string;
  'manage.type.sale': string;
  'manage.type.expense': string;
  'manage.dateField': string;
  'manage.noteField': string;
  'manage.submitAction': string;
  'manage.clearAction': string;
  'manage.emptyList': string;
  'manage.submitConfirm': string;
  'market.resultsTitle': string;
  'market.noAdsTitle': string;
  'market.noAdsDetail': string;
  'market.noResultsTitle': string;
  'market.noResultsDetail': string;
  'review.queueTitle': string;
  'review.kind.listing': string;
  'review.kind.flag': string;
  'review.kind.driverApplication': string;
  'review.emptyQueue': string;
}

export type ProductType = 'context' | 'state' | 'market' | 'delivery' | 'assistant' | 'review' | 'manage';

export interface ProductScope {
  contextId: string | null;
  workspaceId: string | null;
  roleId: string;
  kind: 'business' | 'driver' | 'review' | (string & {});
  label?: string;
  [key: string]: unknown;
}

export interface ProductResolveToken {
  instanceId: string;
  generation: number;
  requestId: string;
  contextKey: string | null;
}

export interface ProductIntentDetail {
  type: ProductType | string;
  action: string;
  scope: ProductScope | null;
  request: ProductResolveToken;
  payload: Record<string, unknown>;
}

/** نموذج سياق المنتج — المضيف يمرره كاملًا؛ الحقول الدقيقة لكل تركيب في مواصفة العائلة. */
export interface ProductModel {
  /** يحدد الـrenderer عند استعمال init(root, model)؛ mount يمرره معاملًا ثانيًا. */
  type?: ProductType;
  scope: ProductScope;
  dataContext?: ProductScope;
  phase?: string;
  connection?: 'online' | 'offline' | 'local' | 'weak' | (string & {});
  destination?: string;
  permissions?: string[];
  revision?: string;
  [key: string]: unknown;
}

export interface ProductInstance {
  root: Element;
  /** = replace: استبدال النموذج وإعادة التصيير. */
  update(model: ProductModel): boolean;
  replace(value: ProductModel): boolean;
  resolve(token: ProductResolveToken, next: ProductModel): boolean;
  getState(): unknown;
  destroy(): void;
}

/** init الموحد (R4): يختار الـrenderer من model.type ويفوّض إلى mount. */
export function init(root: Element, model: ProductModel): ProductInstance;
export function mount(root: Element, type: ProductType, value: ProductModel): ProductInstance;
export function register(type: string, renderer: unknown): void;
export function contextKey(scope: unknown): string | null;
export function destroy(root: Element): void;
export function getInstance(root: Element): ProductInstance | null;
export function setLabels(partial: Partial<ProductLabels>): void;

declare global {
  interface HTMLElementEventMap {
    'micro-product:intent': CustomEvent<ProductIntentDetail>;
  }
}
