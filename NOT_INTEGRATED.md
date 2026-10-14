# Not integrated with backend

## Admin

- **Dashboard** `/admin` — instructor, student, shorts, and coin totals; purchases vs payouts chart; activity feed. The date range does not load data.
- **Instructor detail** `/admin/instructors/:id` — profile, plan name, expertise, courses, and shorts load from the API. Suspend / activate is saved in the browser only.
- **Students** `/admin/students` — list, coins, invoice count, last purchase, and status load from the API. Suspend / activate is saved in the browser only.
- **Student detail** `/admin/students/:id` — profile, coin balance, and invoices load from the API. Suspend / activate is saved in the browser only.
- **Courses** `/admin/courses` — catalog and hide / unhide load from the API.
- **Course detail** `/admin/courses/:id` — enrollment count and coins earned load from the API. Summary, lesson count, price, completion, outline, lesson preview, and hide / unhide stay local.
- **Invoices, purchases** `/admin/invoices` — coin packs, invoice list, invoice detail, and refund load from the API.
- **Platform settings** `/admin/settings` — support email, creator split, USD per coin, and maintenance mode load from the API.

## Instructor

- **Dashboard** `/dashboard` — earnings, views, students, completion, revenue chart, and live transactions. The date range does not load data.
- **Courses** `/dashboard/courses` — each card’s duration, student count, and completion. Sort by enrollments or completion has no metrics.
- **Shorts** `/dashboard/shorts` — card duration.

## Both

- Header search
