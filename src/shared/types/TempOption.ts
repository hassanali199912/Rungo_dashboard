
import type { TableActionMenuItem } from "./generalTypes";

/**
 * Temporary repeat options for recurring actions (e.g. billing intervals)
 */
export const repeatOptions: { label: string; value: string }[] = [
  { label: "يومي", value: "daily" },               // Daily
  { label: "أسبوعي", value: "weekly" },            // Weekly
  { label: "كل 15 يوم", value: "every-15-days" },  // Every 15 Days
  { label: "شهري", value: "monthly" },             // Monthly
  { label: "ربع سنوي", value: "quarterly" },       // Quarterly
  { label: "سنوي", value: "yearly" }               // Yearly
];
export const repeatOptionsRedio: { label: string; value: string }[] = [
  { label: "لا يوجد تاريخ إنتهاء", value: "no_date" },
  { label: "بعد عدد من التكرارات", value: "number" },
  { label: "الإنتهاء في تاريخ محدد", value: "date" },
];

export interface EstimateActionHandlers {
  onPreview?: () => void;
  onSend?: () => void;
  onConvertToInvoice?: () => void;
  onSendViaWhatsapp?: () => void;
  onViewAsCustomer?: () => void;
  onCreateShareableLink?: () => void;
  onPrint?: () => void;
  onExportPdf?: () => void;
  onCreateCopy?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  // Add handlers for recurring options
  onConvertToRecurring?: () => void;
  onStopRecurring?: () => void;
}

const noop = () => { };

/**
 * Create estimate options
 * @param handlers Action handlers including optional recurring actions
 * @param opts.controlRecurring - optionally pass { showConvertToRecurring?: boolean, showStopRecurring?: boolean }
 */
export const createEstimateOptions = (
  handlers: EstimateActionHandlers = {}): TableActionMenuItem[] => {
  const items: TableActionMenuItem[] = [];

  if (handlers.onPreview) {
    items.push({
      key: "preview",
      label: "معاينة",
      onClick: handlers.onPreview,
    });
  }
  if (handlers.onSend) {
    items.push({
      key: "send",
      label: "أرسل",
      onClick: handlers.onSend,
    });
  }
  if (handlers.onConvertToInvoice) {
    items.push({
      key: "convert-to-invoice",
      label: "تحويل الى فاتورة",
      onClick: handlers.onConvertToInvoice,
    });
  }
  if (handlers.onSendViaWhatsapp) {
    items.push({
      key: "send-via-whatsapp",
      label: "الارسال عبر واتساب",
      onClick: handlers.onSendViaWhatsapp,
    });
  }
  if (handlers.onViewAsCustomer) {
    items.push({
      key: "view-as-customer",
      label: "العرض ك عميل",
      onClick: handlers.onViewAsCustomer,
    });
  }
  if (handlers.onCreateShareableLink) {
    items.push({
      key: "create-shareable-link",
      label: "انشاء رابط قابل للمشاركة",
      onClick: handlers.onCreateShareableLink,
    });
  }
  if (handlers.onPrint) {
    items.push({
      key: "print",
      label: "طباعة",
      onClick: handlers.onPrint,
    });
  }
  if (handlers.onExportPdf) {
    items.push({
      key: "export-pdf",
      label: "تصدير بصيغة بي دي اف",
      onClick: handlers.onExportPdf,
    });
  }
  if (handlers.onCreateCopy) {
    items.push({
      key: "create-copy",
      label: "انشاء نسخة",
      onClick: handlers.onCreateCopy,
    });
  }
  if (handlers.onEdit) {
    items.push({
      key: "edit",
      label: "تعديل",
      onClick: handlers.onEdit,
    });
  }
  if (handlers.onDelete) {
    items.push({
      key: "delete",
      label: "حذف",
      onClick: handlers.onDelete,
      color: "error",
    });
  }

  if (handlers && handlers?.onConvertToRecurring) {
    items.splice(
      3,
      0,
      {
        key: "convert-to-recurring",
        label: "تحويل الى فاتورة متكررة",
        onClick: handlers.onConvertToRecurring ?? noop,
      }
    );
  }
  if (handlers && handlers?.onStopRecurring) {
    items.splice(
      3,
      0,
      {
        key: "stop-recurring",
        label: "إيقاف التكرار",
        onClick: handlers.onStopRecurring ?? noop,
      }
    );
  }
  return items;
};


// Limited options version
export const createLimitedEstimateOptions = (
  handlers: EstimateActionHandlers = {},
  opts?: { showConvertToRecurring?: boolean; showStopRecurring?: boolean }
): TableActionMenuItem[] => {

  const items: TableActionMenuItem[] = [
    {
      key: "preview",
      label: "معاينة",
      onClick: handlers.onPreview ?? noop,
    },
    {
      key: "send",
      label: "أرسل",
      onClick: handlers.onSend ?? noop,
    },
    {
      key: "edit",
      label: "تعديل",
      onClick: handlers.onEdit ?? noop,
    },
    {
      key: "delete",
      label: "حذف",
      onClick: handlers.onDelete ?? noop,
      color: "error",
    },
  ];

  if (opts?.showConvertToRecurring) {
    items.splice(
      2,
      0,
      {
        key: "convert-to-recurring",
        label: "تحويل الى فاتورة متكررة",
        onClick: handlers.onConvertToRecurring ?? noop,
      }
    );
  }

  if (opts?.showStopRecurring) {
    items.splice(
      2,
      0,
      {
        key: "stop-recurring",
        label: "إيقاف التكرار",
        onClick: handlers.onStopRecurring ?? noop,
      }
    );
  }

  return items;
};
