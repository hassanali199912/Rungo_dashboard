# SahelBooks — Reusable Component Kit (Agent Handoff)

Use this file to rebuild another React + TypeScript app with the **same reusable building blocks**: forms, Zod validation, tables, charts, list-page chrome, modals, and alerts.

**Ignore colors and theme.** Do not copy `src/theme.ts` or brand palette. Apply the target project's own theme. Keep component **APIs, file layout, and composition patterns**.

---

## 1. How to use this document

1. Copy the **kit folders** listed in §3 (not whole feature pages).
2. Install the **libraries** in §2.
3. Wire path aliases, i18n, and `FormProvider` the same way.
4. Build new pages using the **recipes** in §11.

Reference implementation: this repo (`sahelbooks`). Prefer reading the source files named below over inventing a new API.

---

## 2. Stack and libraries

| Concern | Library | Version in this repo | Role |
|---|---|---|---|
| App shell | React + TypeScript + Vite | React 19, TS 5.9, Vite 7 | SPA |
| UI primitives | `@mui/material` + `@mui/icons-material` | v7 | Layout, Dialog, Table, Chip, Autocomplete |
| Styling helpers | `@emotion/react`, `@emotion/styled`, Tailwind v4 | — | `sx`, styled buttons; Tailwind optional |
| Forms | `react-hook-form` | ^7.71 | Field state, `Controller`, `useFieldArray` |
| Form resolver | `@hookform/resolvers` | ^5.2 | `zodResolver` |
| Validation | `zod` | ^4.3 | Schemas, inferred form types |
| HTTP | `axios` | ^1.13 | `src/config` HTTP client |
| Routing | `react-router-dom` | v7 | Public + `/user` routes |
| i18n | `i18next`, `react-i18next`, `i18next-browser-languagedetector` | — | Labels, validation messages, RTL `dir` |
| Charts (line/area/bar) | `apexcharts` + `react-apexcharts` | 5.x / 2.x | Dashboard + report charts |
| Charts (donut) | `chart.js` + `react-chartjs-2` | 4.x / 5.x | Doughnut charts |
| Dates | `date-fns` + `react-date-range` | — | Date fields + range picker |
| Toasts | `react-hot-toast` | — | Lightweight success/error |
| Confirm / delete | `sweetalert2` + `sweetalert2-react-content` | — | `DeteleModal`, `showSwal` |
| State (optional) | `@reduxjs/toolkit` + `react-redux` | — | App-wide state; not required for the kit |
| Icons extra | `react-icons` | — | Occasional; prefer MUI icons |

**Do not use raw MUI `TextField` inside forms.** All inputs go through `AppFormField`.

---

## 3. Files to copy (the kit)

Copy these trees first. Page folders under `src/feature/user/pages/*` are **examples**, not the kit.

```
src/components/form/                          # Form field factory + primitives
src/components/form/FormWrapper.tsx
src/components/form/AppFormField.tsx
src/components/form/formFieldLayout.ts        # Shared input sizing / label layout
src/components/form/App*.tsx                  # All field implementations
src/components/form/DateRangePicker.tsx
src/components/form/ProfileImageUploader.tsx

src/components/wrappers/SectionContainerCardDashboard.tsx
src/components/wrappers/SectionContainerCardWrapper.tsx
src/components/wrappers/InnerSectionCardWrapper.tsx

src/components/ui/AppBtn.tsx
src/components/ui/ActionsDropdownMenu.tsx
src/components/ui/PriceSymbol.tsx
src/components/ui/appToast.tsx

src/components/modals/DeteleModal.tsx
src/components/modals/SwalReusable.tsx
src/components/modals/ResetModalConform.tsx

src/feature/user/components/table/            # Entire table kit
src/feature/user/components/skeletons/        # Table / tabs / stat / pagination skeletons

src/feature/user/components/form-preview/     # Document (invoice-like) forms
src/feature/user/components/form-preview/StaticCards.tsx
src/feature/user/components/form-preview/DocumentForm.tsx
src/feature/user/components/form-preview/DocumentFormMap.ts
src/feature/user/components/form-preview/DocumentDetailsView.tsx
src/feature/user/components/form-preview/*-form/   # Invoice, Bill, Credit, Debit, Recurring

src/feature/user/components/ui/ReusableTabs.tsx
src/feature/user/components/ui/SearchBoxComponentWithFilter.tsx
src/feature/user/components/ui/StatusBadge.tsx
src/feature/user/components/ui/ReusableButtonGroup.tsx
src/feature/user/components/ui/ReusableSegmentedControl.tsx
src/feature/user/components/ui/ReportBarChartWithLegend.tsx
src/feature/user/components/ui/ReportKpiCard.tsx
src/feature/user/components/ui/ReportKpiCardsGroup.tsx
src/feature/user/components/ui/ReportHeaderFilters.tsx

src/schemas/                                  # Zod schemas (copy pattern; trim unused domains)
src/shared/types/generalTypes.ts              # Option, table action types
src/shared/types/TempOption.ts                # Row action menu factories
src/shared/types/reports.types.ts             # Chart / KPI / report filter types

src/language/config.ts
src/language/locales/ar/index.json            # At least `form`, `validation`, `dashboard_Table`, `stats`
src/language/locales/en/index.json
```

Charts live next to the page that uses them (see §7). Copy those files as **templates**, then swap series data.

### Path aliases (`vite.config.ts` + `tsconfig`)

```
@/*           → src/*
@components/* → src/components/*
@features/*   → src/feature/*
@assets/*     → src/assets/*
@config/*     → src/config/*
```

Prefer `@/` for cross-feature imports.

---

## 4. Project map (what each folder is for)

```
src/
├── components/                 # Shared across public + dashboard
│   ├── form/                   # THE form kit
│   ├── modals/                 # Delete / Swal / confirm
│   ├── ui/                     # Buttons, toast, price, dropdown
│   ├── wrappers/               # Page shells
│   └── box/                    # Search / title boxes (marketing + help)
├── feature/
│   ├── public/                 # Marketing + auth pages (not the kit)
│   └── user/
│       ├── components/
│       │   ├── table/          # THE table kit
│       │   ├── form-preview/   # Document create/edit + live preview maps
│       │   ├── modals/         # Feature CRUD modals (AddEdit*)
│       │   ├── skeletons/
│       │   └── ui/             # Tabs, search+filter, KPI, report charts
│       └── pages/<Feature>/    # One folder per route; sibling *Data.ts
├── schemas/                    # One Zod file per domain
├── shared/types/               # Shared TS interfaces
├── language/                   # i18n
├── routes/                     # publicRoutes.tsx, userRoutes.tsx
├── config/                     # httpClient, env
├── provider/                   # Auth / business context
└── layout/                     # Public + user chrome
```

**Convention:** page-local mock data sits beside the page (`billFormData.ts`, `dashboardChartData.ts`, `chartOfAccountsData.tsx`). Shared types go in `src/shared/types/`. Form types are inferred from Zod in `src/schemas/`.

---

## 5. Forms

### 5.1 Required stack (never skip a layer)

1. Zod schema in `src/schemas/<domain>.schema.ts` → export schema, `FormValues`, `defaultValues`
2. `useForm` + `zodResolver`
3. `FormWrapper` (provides `FormProvider` + `<form onSubmit>`)
4. Every input is `AppFormField` with a `name` that matches the schema

```tsx
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categorySchema,
  categoryDefaultValues,
  type CategoryFormValues,
} from "@/schemas/category.schema";

const methods = useForm<CategoryFormValues>({
  resolver: zodResolver(categorySchema) as Resolver<CategoryFormValues>,
  defaultValues: categoryDefaultValues,
});

<FormWrapper methods={methods} onSubmit={onSubmit}>
  <AppFormField
    name="name"
    type="text"
    label={t("form.category_name")}
    placeholder={t("form.category_name_placeholder")}
  />
  <AppFormField
    name="type"
    type="radio"
    label={t("form.type")}
    options={[
      { label: t("form.product"), value: "product" },
      { label: t("form.service"), value: "service" },
    ]}
  />
</FormWrapper>
```

Reference modal: `src/feature/user/components/modals/AddEditCategoryModal.tsx`.

### 5.2 `AppFormField` — single entry point

**File:** `src/components/form/AppFormField.tsx`

Every field binds through `react-hook-form` `Controller` + `useFormContext()`. Zod error messages are **i18n keys**; fields call `t(error.message)`.

| `type` | Implementation | Notes |
|---|---|---|
| `text` | `AppTextField` | Default |
| `email` | `AppEmailField` | |
| `emailStatus` | `AppEmailStatusField` | Extra `emailStatus` prop |
| `password` | `AppPasswordField` | Show/hide |
| `passwordWithBar` | `AppPasswordWithBarField` | Strength bar |
| `tel` | `AppPhoneField` | |
| `number` | `AppNumberField` | |
| `textarea` | `AppTextAreaField` | `minRows` / `maxRows` |
| `richtext` | `AppRichTextField` | |
| `date` | `AppDateField` | |
| `autocomplete` | `AppAutocomplete` | `options: Option[]` (`{ label, value }`) |
| `multiAutocomplete` | `AppMultiAutocomplete` | `options: MultiSelectOption[]` |
| `checkbox` | `AppCheckboxField` | |
| `radio` | `AppRadioField` | `options`, `row?: boolean` (default true) |
| `otp` | `AppOtpField` | `length` |
| `upload` | `AppUploadField` | `multiple`, `accept` |
| `profileImage` | `ProfileImageUploader` | |
| `color` | `AppColorField` | |
| `cardExpiry` | `AppCardExpiryField` | |
| `cvv` | `AppCvvField` | |

Shared props:

```ts
name: string;          // RHF path, e.g. "lineItems.0.price"
label: string;
type: FieldType;
placeholder?: string;
required?: boolean;
disabled?: boolean;
options?: Option[] | MultiSelectOption[];
showLable?: boolean;   // typo is in the API — keep it
labelLayout?: "vertical" | "horizontal";
sx?: SxProps<Theme>;
```

`Option` / `MultiSelectOption` live in `src/shared/types/generalTypes.ts`.

Standalone (not routed through `AppFormField`):

- `DateRangePicker` — `onApply({ startDate, endDate })`, quick ranges via `date-fns`
- `formFieldLayout.ts` — shared label/input spacing; keep so all fields look consistent

### 5.3 `FormWrapper`

**File:** `src/components/form/FormWrapper.tsx`

```ts
interface FormWrapperProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
}
```

Wraps children in `FormProvider` and a MUI `Box component="form"` with `noValidate` and `methods.handleSubmit(onSubmit)`.

### 5.4 Document / invoice-style forms

For multi-section documents (customer, dates, line items, tax, bank, totals):

| Piece | Path | Job |
|---|---|---|
| Form UI | `form-preview/<doc>-form/<Doc>DocumentForm.tsx` | RHF `useFieldArray` line items + `AppFormField` |
| Mapper | `form-preview/<Doc>DocumentFormMap.ts` | Form values → preview view model + totals |
| Preview | `form-preview/<Doc>DocumentDetailsView.tsx` | Read-only document |
| Schema | `src/schemas/<doc>.schema.ts` | Line items array + `superRefine` |
| Catalog helper | `modals/productCatalog.ts` | Append products into empty line rows |

Shared helpers (`DocumentFormMap.ts` / per-doc maps):

- `computeLineTotal(qty, price, discountPct)`
- `buildTotalsFromLineItems(lineItems, withoutTax, tax15)` — subtotal, discount, VAT 15%, total

Line-item pattern: `useFieldArray({ control, name: "lineItems" })` + register `appendProducts` so a product modal can fill rows.

Copy **Invoice** as the template:  
`src/feature/user/components/form-preview/invoice-form/` + `src/schemas/invoice.schema.ts`.

---

## 6. Validation (Zod + i18n)

### 6.1 Schema file contract

One file per domain: `src/schemas/<domain>.schema.ts`

```ts
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, { message: "validation.required" }).max(50, { message: "validation.max_50" }),
  type: z.enum(["product", "service"]).default("product"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const categoryDefaultValues: CategoryFormValues = {
  name: "",
  type: "product",
};
```

Rules:

- Validation `message` is always an i18n key, never a user-facing string.
- Infer the form type with `z.infer<typeof schema>`.
- Export `defaultValues` next to the schema.
- Optional empty strings: `.optional().or(z.literal(""))`.
- Numbers from inputs: `z.coerce.number()`.
- Cross-field rules: `.superRefine(...)`.

### 6.2 Shared validation keys

Defined in `src/language/locales/{ar,en}/index.json` under `validation`:

| Key | Use |
|---|---|
| `validation.required` | Empty required field |
| `validation.min_2` / `min_3` / `min_5` / `min_6` / `min_10` | Min length |
| `validation.min_6_password` | Password min |
| `validation.max_50` / `max_100` / `max_255` | Max length |
| `validation.email_invalid` | Email |
| `validation.phone_invalid` | Phone regex |
| `validation.number_invalid` | Coerced numbers |
| `validation.password_mismatch` | Confirm password |
| `validation.password_strength` | Complexity |
| `validation.end_before_start` | Date range |
| `validation.line_items_required` | At least one named line |
| `validation.card_number_invalid` / `expiry_invalid` / `cvv_invalid` | Cards |

Add the same key to **both** `ar` and `en` JSON files.

### 6.3 How errors reach the UI

Field primitives read `fieldState.error.message` and render `t(error.message)`. Example: `AppTextField.tsx`.

### 6.4 Schema catalog in this repo (copy what you need)

Auth: `login`, `register`, `forgotPassword`, `passwordChange`  
Parties: `customer`, `vendor`, `contact`, `addUser`  
Catalog: `product`, `category`, `account`  
Documents: `invoice`, `bill`, `estimate`, `credit`, `debit`, `recurring`, `recurringInvoice`  
Money: `income`, `expense`, `paymentRecourd`, `addPaymentCard`, `projectPayment`  
Settings: `emailSettings`, `inventorySettings`, `paymentSettings`, `spendingSetting`, `advancedTaxSettings`, `personalInformation`  
Other: `journal`, `taxReturn`, `addEditTax`, `exportReports`, `createBackup`, `integrationConnect`, `affiliate`, `automaticSync`, `customInvoice`, `projectInfo`, `projectAddress`

Good reference schemas:

- Simple CRUD: `category.schema.ts`
- Party + optional address: `customer.schema.ts`
- Line items + refine: `invoice.schema.ts`
- Auth: `login.schema.ts`

---

## 7. Tables

### 7.1 Which table to use

| Component | File | When |
|---|---|---|
| `AppTable` | `table/AppTable.tsx` | Dashboard list pages. Thin wrapper: fake 3s loading + i18n empty text, then `ReusableTable`. |
| `ReusableTable` | `table/ReusableTable.tsx` | Selection + bulk actions + client pagination (10 / page). |
| `NormalReusableTable` | `table/NormalReusableTable.tsx` | Read-only / report tables. No checkboxes, no pagination. Optional `footerRow`. |

Barrel: `src/feature/user/components/table/index.ts`.

### 7.2 Column types (`ReusableTableColumn<T>`)

**File:** `src/feature/user/components/table/types.ts`  
Renderer: `table/tableCellRenderer.tsx` → cells in `table/cells.tsx`.

| `type` | Renders | Extra fields |
|---|---|---|
| `text` | Single line | `getValue?` |
| `doubleText` | Title + subtitle | `subtitleKey` / `getSubtitle` |
| `productInfo` | Image + title + subtitle | `image` / `getImage` |
| `accountType` | Badge + subtitle | `accountTypeVariant` / `getAccountTypeVariant` |
| `status` | Built-in 4-state chip via numeric index | `getStatus: (row) => number` |
| `customStatus` | Chip from `statusOptions[index]` | `getStatus`, `statusOptions` |
| `total` | Amount via `PriceSymbol` | `totalColor`, `hideZeroTotal` |
| `span` | Emphasized text | |
| `actions` | Row actions | `renderActions(row)` |
| `custom` | Anything | `render(row)` |

```ts
interface ReusableTableColumn<T> {
  key: keyof T | string;
  label: string;
  type: TableColumnType;
  align?: "left" | "right" | "center";
  width?: number | string;
  getValue?: (row: T) => ReactNode;
  subtitleKey?: keyof T;
  getSubtitle?: (row: T) => ReactNode;
  getImage?: (row: T) => ReactNode;
  getStatus?: (row: T) => number;
  statusOptions?: StatusOption[];
  renderActions?: (row: T) => ReactNode;
  render?: (row: T) => ReactNode;
}
```

Header labels: `t("dashboard_Table.headers.*")`.

### 7.3 `ReusableTable` props

```ts
columns: ReusableTableColumn<T>[];
data: T[];
loading?: boolean;
emptyMessage?: string;
onRowSelect?: (selectedRows: T[]) => void;
onSelectAll?: (selectedRows: T[]) => void;
actions?: BulkAction<T>[];          // first 3 as buttons, rest in ⋮ menu
getRowId?: (row: T, index: number) => string | number;
loadingRowCount?: number;
selectionMode?: "multiple" | "single";
```

`BulkAction<T>`: `{ key, label, onClick(selectedRows), color? }`.

Internals (do not reimplement unless you copy the folder):

- `TableHeader` / `TableBodyContent` / `TableDataRow`
- `TablePagination` (client slice, 10 rows)
- `TableSkeleton` + `PaginationSkeleton`

`NormalReusableTable` extras: `footerRow?: T`.

### 7.4 Row actions

| Component | File | Use |
|---|---|---|
| `TableAction` | `table/TableAction.tsx` | `variant="buttons"` (view/edit/delete icons) or `variant="dropdown"` (`menuActions`) |
| `ActionWithText` | `table/ActionWithText.tsx` | Dropdown + optional inline link (e.g. “Record payment”) |

Menu item shape (`generalTypes.ts`):

```ts
interface TableActionMenuItem {
  key: string;
  label: string;
  onClick: () => void;
  color?: "error" | "default";
  disabled?: boolean;
}
```

Ready-made document menus: `createEstimateOptions(handlers)` / `createLimitedEstimateOptions` in `src/shared/types/TempOption.ts` (preview, send, WhatsApp, delete, convert, …). Pass only the handlers you need.

### 7.5 List-page table recipe

Canonical page: `src/feature/user/pages/invoice/Invoice.tsx`.

```tsx
const columns: ReusableTableColumn<Row>[] = [
  { key: "id", label: t("dashboard_Table.headers.invoice_id"), type: "text" },
  { key: "name", label: t("dashboard_Table.headers.client_name"), type: "text" },
  { key: "total", label: t("dashboard_Table.headers.total"), type: "total" },
  { key: "status", label: t("dashboard_Table.headers.state"), type: "status", getStatus: (r) => r.status },
  {
    key: "actions",
    label: t("dashboard_Table.headers.action"),
    type: "actions",
    renderActions: (row) => (
      <ActionWithText
        menuActions={createEstimateOptions({
          onDelete: () => handleOpenDeleteModal(row.id),
          onPreview: () => navigate("..."),
        })}
        text={t("dashboard_Table.record_payment")}
        showText={row.status === 1}
        onClickText={() => setPaymentModal(true)}
      />
    ),
  },
];

<AppTable
  data={filteredRows}
  columns={columns}
  actions={bulkActions}
  getRowId={(row) => row.id}
/>
```

Same composition is used on Bill, Estimate, Credits, Debit, Recurring, Products, Customers, Vendors.

---

## 8. Charts

There is **no single Chart wrapper**. Reuse the **library + options pattern**. Put series in a sibling `*ChartData.ts`. Respect RTL via `i18n.dir()`.

| Chart | Library | File to clone |
|---|---|---|
| Area (dual series) | ApexCharts | `pages/dashboard/DashboardNetIncomeChart.tsx` |
| Area (cash) | ApexCharts | `pages/dashboard/DashboardCashBalanceChart.tsx` |
| Grouped bar | ApexCharts | `pages/dashboard/DashboardNewProductsBarChart.tsx` |
| Distributed bar + legend | ApexCharts | `components/ui/ReportBarChartWithLegend.tsx` |
| Doughnut | Chart.js | `pages/dashboard/DashboardMostSoldDonut.tsx`, `DashboardExpenseDonut.tsx` |

### 8.1 ApexCharts conventions

- `import Chart from "react-apexcharts"` + `ApexOptions`
- Hide toolbar: `chart.toolbar.show = false`
- Disable zoom on dashboards
- Categories: Arabic vs English month/day arrays (`months_ar` / `months_en` in `dashboardChartData.ts`)
- Format Y in `yaxis.labels.formatter` / `tooltip.y.formatter`
- Wrap in a card (`SectionCardWrapper` on dashboard, or a simple MUI `Box`)

`ReportBarChartWithLegend` API (reusable):

```ts
interface ReportBarChartWithLegendProps {
  title: string;
  subtitle?: string;
  items: ReportBarChartItem[]; // { key, label, value, displayValue, bgColor, color }
  height?: number;             // default 300
}
```

Type: `src/shared/types/reports.types.ts`.

### 8.2 Chart.js doughnut conventions

```ts
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
```

Segment data: `dashboardChartData.ts` → `mostSoldSegments` / `expenseSegments` (`nameKey`, `pct`).

### 8.3 Chart data file

`src/feature/user/pages/dashboard/dashboardChartData.ts` — static series + month labels. Mark replacements with `// replace with API`.

---

## 9. List-page chrome (compose with tables)

A typical dashboard list page is **not** just a table. Compose:

```
SectionContainerCardDashboard     // page title + primary Add + overflow menu
  StaticCards                     // KPI strip
  SearchBoxComponentWithFilter    // search + date/state filters + column visibility
  ReusableTabs                    // status tabs with counts
  AppTable                        // data
  DeteleModal / SendWithEmailModal / …
```

### 9.1 Page shell — `SectionContainerCardDashboard`

**File:** `src/components/wrappers/SectionContainerCardDashboard.tsx`

```ts
variant?: "withBg" | "noBg";
title?: string;
addAction?: { label: string; onClick: () => void; icon?: ReactElement };
subAction?: ActionLable;
multibleSubAction?: MultibleActionWithIcon[];
menuOptions?: ActionLable[];
```

### 9.2 Stat cards — `StaticCards`

**File:** `src/feature/user/components/form-preview/StaticCards.tsx`

```ts
interface StatCard {
  key: string;
  titleKey: string;       // i18n, usually stats.*
  defaultTitle: string;
  value: number | string;
  iconBg: string;
  iconColor: string;
  subValue?: number;      // rendered with PriceSymbol
  extraChiled?: ReactElement;
}

<StaticCards cards={cards} type="primary" | "secandary" />
```

Has a matching `StaticCardSkeleton` (demo 3s delay — replace with real loading when you wire APIs).

### 9.3 Search + filters

**Dashboard lists:** `src/feature/user/components/ui/SearchBoxComponentWithFilter.tsx`

```ts
value?: string;
onSearchChange?: (value: string) => void;
onFiltersChange?: (filters: {
  startDate: string;
  endDate: string;
  customerName: string;
  state: string;
}) => void;
stateOptions?: { label: string; value: string }[];
columnOptions?: { key: string; label: string; visible?: boolean }[];
onColumnVisibilityChange?: (key: string, visible: boolean) => void;
shape?: number;  // visual variant
```

**Help / marketing search:** `src/components/box/SearchBoxComponent.tsx` — not for dashboard tables.

### 9.4 Tabs — `ReusableTabs`

**File:** `src/feature/user/components/ui/ReusableTabs.tsx`

```ts
interface ReusableTabItem {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
  background?: string;
  color?: string;
  icon?: ReactNode;
}

<ReusableTabs
  type="main" | "btns"
  tabs={tabs}
  value={selectedTab}
  onChange={setSelectedTab}
  showBottomBorder
/>
```

`main` = underline tabs. `btns` = pill/button tabs. Filter table `data` from `value` in the page (`useMemo`), do not put filter logic inside the table.

### 9.5 Other controls

| Component | File | Use |
|---|---|---|
| `StatusBadge` | `ui/StatusBadge.tsx` | Chip: `upcoming` \| `overdue` \| `paid` \| `default` |
| `ReusableButtonGroup` | `ui/ReusableButtonGroup.tsx` | Toggle group (`items`, `value`, `onChange`) |
| `ReusableSegmentedControl` | `ui/ReusableSegmentedControl.tsx` | Segmented filter (`options[].onClick`) |
| `ReportKpiCard` / `ReportKpiCardsGroup` | `ui/` | Report header KPIs |
| `ReportHeaderFilters` | `ui/ReportHeaderFilters.tsx` | Period / date / tax-return filters (`reports.types.ts`) |
| `AppBtn` | `components/ui/AppBtn.tsx` | `customType`: `primary` \| `outline` \| `outline-gray` \| `solid`; optional `to` for router link |
| `ActionsDropdownMenu` | `components/ui/ActionsDropdownMenu.tsx` | Overflow menus (`ActionsDropdownItem`) |
| `PriceSymbol` | `components/ui/PriceSymbol.tsx` | Currency + amount (tables/totals) |

---

## 10. Modals and alerts

### 10.1 Feature modal pattern

Location: `src/feature/user/components/modals/AddEdit<Entity>Modal.tsx`

Props: `open`, `handleClose`, `data?` (edit), `onSave?`.

Inside: MUI `Dialog` + `FormWrapper` + `AppFormField` + Zod. On open: `methods.reset(data ?? defaultValues)`. On close: reset + `clearErrors`.

### 10.2 Delete

```tsx
<DeteleModal
  open={isDeleteModalOpen}
  onClose={handleCloseDeleteModal}
  onConfirm={handleConfirmDelete}
/>
```

**File:** `src/components/modals/DeteleModal.tsx` — SweetAlert2 warning. Copy has a typo in the filename (`Detele`); keep it if you copy the import graph.

After success:

```ts
import { showSwal, swalSuccessDeleted } from "@/components/modals/SwalReusable";
showSwal(swalSuccessDeleted);
```

`showSwal` also has `swalSuccessInserted` and variants: `default` | `danger` | `success` | `info` | `gray`.

Toasts: `react-hot-toast` via `src/components/ui/appToast.tsx`.

---

## 11. Recipes for the receiving agent

### A. New CRUD list page

1. Create `src/feature/user/pages/<Feature>/<Feature>.tsx` + optional `<feature>Data.ts`.
2. Add route in `src/routes/userRoutes.tsx`.
3. Types: row interface in the page or `src/shared/types/`.
4. Schema: `src/schemas/<feature>.schema.ts`.
5. i18n: `form.*`, `dashboard_Table.headers.*`, `stats.*` in **ar + en**.
6. Compose: `SectionContainerCardDashboard` → `StaticCards` → `SearchBoxComponentWithFilter` → `ReusableTabs` → `AppTable`.
7. Columns: `text` / `total` / `status` / `actions` as in Invoice.
8. Add/edit: `AddEdit<Entity>Modal` with `AppFormField`.
9. Delete: `DeteleModal` + `showSwal`.

### B. New simple form (settings / auth)

1. Schema + `defaultValues`.
2. `useForm` + `zodResolver`.
3. `FormWrapper` + `AppFormField` only.
4. Submit button: `AppBtn type="submit"`.

### C. New document (invoice-like)

1. Clone `invoice.schema.ts` (line items + `superRefine`).
2. Clone `invoice-form/` (form + map + details view).
3. Wire product modal through `onRegisterLineItemsActions`.
4. Preview page reads mapper output, not the raw form.

### D. New dashboard chart

1. Add series to `*ChartData.ts`.
2. Clone `DashboardNetIncomeChart` (area) or `DashboardNewProductsBarChart` (bar) or `DashboardMostSoldDonut` (donut).
3. Swap categories with `i18n.dir()` month/day labels.
4. Keep toolbar hidden; do not invent a new chart library.

### E. New report chart with legend

Use `ReportBarChartWithLegend` + `ReportBarChartItem[]`. Do not fork Apex options unless the chart type changes.

---

## 12. i18n (required by forms and tables)

**Config:** `src/language/config.ts`  
Namespaces: `index` (default), `invoicing`. Fallback language: `ar`. `languageChanged` sets `document.documentElement.dir` to `rtl` | `ltr`.

| UI | JSON object | Example |
|---|---|---|
| Form labels / placeholders | `form` | `t("form.customer_name")`, `t("form.email_placeholder")` |
| Table headers / row actions | `dashboard_Table` | `t("dashboard_Table.headers.client_name")` |
| Status / KPI / tabs | `stats` | `t("stats.paid")` |
| Validation | `validation` | Zod messages |
| Page titles | dedicated key | `t("invoice_page.title")` |

Naming: labels `snake_case`; placeholders `{field}_placeholder`.

---

## 13. Supporting types

**`src/shared/types/generalTypes.ts`** — copy with the form + table kit:

- `Option`, `MultiSelectOption`
- `TableActionMenuItem`, `ActionsDropdownItem`
- `ActionLable`, `MultibleActionWithIcon`

**`src/shared/types/reports.types.ts`** — report KPIs, bar items, header filter result unions.

**`src/shared/types/TempOption.ts`** — `createEstimateOptions` and repeat-interval option lists.

---

## 14. What not to copy

- `src/theme.ts` and hardcoded brand colors (user request: ignore theme).
- Marketing pages under `src/feature/public/` unless you need the same landing sections.
- Demo `setTimeout(..., 3000)` loading in `AppTable`, `ReusableTabs`, `StaticCards` — replace with real request state.
- Built-in `StatusCell` Arabic labels (`نشط`, `متوقف`, …) — prefer `customStatus` + i18n `statusOptions` in a new app.

---

## 15. Source-of-truth files (read these first)

| Topic | Read |
|---|---|
| Field factory | `src/components/form/AppFormField.tsx` |
| Form provider | `src/components/form/FormWrapper.tsx` |
| Table types | `src/feature/user/components/table/types.ts` |
| Table behavior | `src/feature/user/components/table/ReusableTable.tsx` |
| Cell rendering | `src/feature/user/components/table/tableCellRenderer.tsx` |
| List page composition | `src/feature/user/pages/invoice/Invoice.tsx` |
| CRUD modal | `src/feature/user/components/modals/AddEditCategoryModal.tsx` |
| Simple schema | `src/schemas/category.schema.ts` |
| Line-item schema | `src/schemas/invoice.schema.ts` |
| Document form | `src/feature/user/components/form-preview/invoice-form/InvoiceDocumentForm.tsx` |
| Apex bar reusable | `src/feature/user/components/ui/ReportBarChartWithLegend.tsx` |
| Apex area template | `src/feature/user/pages/dashboard/DashboardNetIncomeChart.tsx` |
| Chart.js donut | `src/feature/user/pages/dashboard/DashboardMostSoldDonut.tsx` |
| Validation messages | `src/language/locales/en/index.json` → `validation` |

---

## 16. Receiving-agent checklist

- [ ] Install RHF, Zod, `@hookform/resolvers`, MUI v7, ApexCharts, Chart.js, i18next, SweetAlert2, date-fns, react-date-range
- [ ] Copy `src/components/form/**` and never use raw MUI inputs in forms
- [ ] Copy `src/feature/user/components/table/**` + table skeletons
- [ ] Copy wrappers, `AppBtn`, `StaticCards`, `ReusableTabs`, `SearchBoxComponentWithFilter`
- [ ] New schema = file in `src/schemas/` with i18n validation keys
- [ ] New list page = shell + stats + search + tabs + `AppTable`
- [ ] New chart = clone an existing Apex/Chart.js file + sibling data module
- [ ] Both `ar` and `en` locale files updated
- [ ] Theme/colors taken from the **new** project, not SahelBooks
