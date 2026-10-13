# Not integrated with backend

Pages and features in the **admin** and **instructor** apps that still use mock data, hardcoded numbers, or browser storage. Auth, and the screens listed at the bottom, already call the API.

Shared chrome (both roles):

- Header search does not query anything.
- Notifications button has no feed or API.

---

## Admin

### Dashboard — `/admin`

The whole overview is static. The date range control does not change the numbers.

- Instructor, student, shorts, and coin totals
- Purchases vs payouts chart
- Recent activity feed

### Instructors

| Page | Route | What is still local |
| --- | --- | --- |
| Instructor detail | `/admin/instructors/:id` | Profile, plan, expertise, course list, and shorts list come from mock data. Suspend / activate is saved in `localStorage`, not on the user. The instructors table does not open this page. |

The instructors **list** and **toggle active** already use `/users/by-role/instructor`.

### Students

| Page | Route | What is still local |
| --- | --- | --- |
| Students | `/admin/students` | Entire table (name, email, coins, invoice count, last purchase, status) is mock. Suspend / activate is `localStorage` only. |
| Student detail | `/admin/students/:id` | Profile, coin balance, and that student’s invoices are mock. Suspend / activate is `localStorage` only. |

### Courses

| Page | Route | What is still local |
| --- | --- | --- |
| Courses | `/admin/courses` | Catalog (title, instructor, domain, students, lessons, price, duration, hidden) is mock. Hide / unhide is `localStorage` only. |
| Course detail | `/admin/courses/:id` | Summary, student and completion stats, revenue, chapter outline, and lesson preview use mock content. Hide / unhide is `localStorage` only. |

### Public shorts — `/admin/shorts`

List, filters, and video preview already use the shorts API. There is no admin action to hide, activate, or remove a short.

### Invoices — `/admin/invoices`

Coin packages (list, create, edit, delete) already use the coin-package API.

Still local on the **purchases** tab:

- Invoice list
- Invoice detail dialog
- Mark as refunded (`localStorage` only)

### Settings — `/admin/settings`

Profile and password already use the user profile API. Light / dark mode is a client preference.

Still local on **platform settings**:

- Support email
- Creator revenue split
- USD per coin
- Maintenance mode

Saved only in `localStorage` (`runro.admin.platform`).

### Subscriptions — `/admin/subscriptions`

Integrated: plan catalog and assigning or updating an instructor’s subscription.

---

## Instructor

### Dashboard — `/dashboard`

The whole overview is static. The date range control does not change the numbers.

- Earnings, views, active students, completion
- Revenue chart
- Live transactions

### Courses — `/dashboard/courses`

The course list, covers, price, publish state, and lesson count already come from the courses API. Create, edit, outline, chapters, lessons, and publish on `/dashboard/courses/new` and `/dashboard/courses/:courseId` are integrated.

Still not from the API on the list:

- Statistic cards (total courses, active students, average completion, linked shorts) use fixed numbers
- Each card’s duration, student count, and completion are placeholders (`—`)
- Sort by enrollments or completion has no real metrics to sort on

### Shorts

Integrated: list, statistics, create, edit, delete, and active toggle (`/dashboard/shorts`, `/dashboard/shorts/new`, `/dashboard/shorts/:id/edit`).

Card duration is still a placeholder (`—`).

### Subscription — `/dashboard/subscription`

Integrated: current plan, history, and subscribe.

### Settings — `/dashboard/settings`

Integrated: profile (including avatar and major) and change password. Light / dark mode is a client preference.
