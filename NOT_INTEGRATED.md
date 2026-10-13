# Not integrated with backend

## Admin

- **Dashboard** `/admin` — instructor, student, shorts, and coin totals; purchases vs payouts chart; activity feed. The date range does not load data.
- **Instructor detail** `/admin/instructors/:id` — profile, plan, expertise, courses, and shorts. Suspend / activate is saved in the browser only.
- **Students** `/admin/students` — list, coins, invoice count, last purchase, and status. Suspend / activate is saved in the browser only.
- **Student detail** `/admin/students/:id` — profile, coin balance, and invoices. Suspend / activate is saved in the browser only.
- **Courses** `/admin/courses` — catalog and hide / unhide.
- **Course detail** `/admin/courses/:id` — summary, stats, revenue, outline, lesson preview, and hide / unhide.
- **Invoices, purchases** `/admin/invoices` — invoice list, invoice detail, and mark as refunded.
- **Platform settings** `/admin/settings` — support email, creator split, USD per coin, and maintenance mode.

## Instructor

- **Dashboard** `/dashboard` — earnings, views, students, completion, revenue chart, and live transactions. The date range does not load data.
- **Courses** `/dashboard/courses` — each card’s duration, student count, and completion. Sort by enrollments or completion has no metrics.
- **Shorts** `/dashboard/shorts` — card duration.

## Both

- Header search
- Notifications
