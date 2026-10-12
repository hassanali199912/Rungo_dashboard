# Instructor profile — settings page API

Guide for the instructor dashboard **settings** page: load and edit profile (including avatar), pick a major from Reference, and change password in a separate form.

Every route needs:

```http
Authorization: Bearer <accessToken>
```

The token user must have role `instructor`.

Base URL example: `http://localhost:3030` (use your `PORT` if different).

---

## Endpoints overview

| Goal | Method | Path | Content-Type |
| --- | --- | --- | --- |
| Load profile for the form | `GET` | `/users/me/profile` | — |
| Save profile (+ optional avatar) | `PATCH` | `/users/me/profile` | `multipart/form-data` |
| Change password | `POST` | `/users/me/change-password` | `application/json` |
| Majors select list | `GET` | `/reference/major` | — |

---

## 1. Get my profile

`GET /users/me/profile`

**Role:** `instructor`

Use this to fill the settings form. Show `email` in a **disabled** input. Do not send email on save.

### Example response

```json
{
  "id": "uuid",
  "email": "instructor@example.com",
  "displayName": "Jane Instructor",
  "bio": "Teaching React and NestJS",
  "majorCode": "computer-science",
  "twitterUrl": "https://x.com/jane",
  "instagramUrl": null,
  "facebookUrl": null,
  "linkedinUrl": "https://linkedin.com/in/jane",
  "youtubeUrl": null,
  "githubUrl": "https://github.com/jane",
  "avatarUrl": "/uploads/avatars/<userId>/avatar.jpg",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-10-12T00:00:00.000Z"
}
```

### Form field mapping

| UI | API field | Notes |
| --- | --- | --- |
| Name | `displayName` | Editable |
| Email | `email` | Display only — disabled |
| Major | `majorCode` | Value from Reference major `code` |
| X (Twitter) | `twitterUrl` | Full URL with protocol, or empty to clear |
| Instagram | `instagramUrl` | Same |
| Facebook | `facebookUrl` | Same |
| LinkedIn | `linkedinUrl` | Same |
| YouTube | `youtubeUrl` | Same |
| GitHub | `githubUrl` | Same |
| Bio | `bio` | Textarea |
| Avatar preview | `avatarUrl` | Prefix with API origin if relative (`/uploads/...`) |

---

## 2. Update profile

`PATCH /users/me/profile`

**Role:** `instructor`  
**Body:** `multipart/form-data`

All text fields are optional. Send only what changed, or send the full form. **Do not send `email`.**

| Field | Type | Rules |
| --- | --- | --- |
| `displayName` | text | 1–100 characters if present |
| `bio` | text | Max 1000; empty string clears to `null` |
| `majorCode` | text | Must be an active Reference `major` code; empty clears |
| `twitterUrl` | text | Must be a URL with protocol (`https://...`), or empty to clear |
| `instagramUrl` | text | Same |
| `facebookUrl` | text | Same |
| `linkedinUrl` | text | Same |
| `youtubeUrl` | text | Same |
| `githubUrl` | text | Same |
| `avatar` | file | Optional. jpeg, png, or webp. Max 5MB. Field name must be `avatar` |

### Avatar

- Stored at `/uploads/avatars/{userId}/avatar.{ext}` and returned as `avatarUrl`.
- Replacing an avatar removes the previous file under `/uploads/avatars/` when it is a local upload.
- Serve the image with the same host as the API (static `/uploads/` prefix).

### Example (concept)

```http
PATCH /users/me/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

displayName=Jane Instructor
bio=Teaching React
majorCode=computer-science
twitterUrl=https://x.com/jane
instagramUrl=
facebookUrl=
linkedinUrl=https://linkedin.com/in/jane
youtubeUrl=
githubUrl=https://github.com/jane
avatar=<file>
```

Response shape matches `GET /users/me/profile`.

---

## 3. Change password (separate component)

`POST /users/me/change-password`

**Role:** `instructor`  
**Body:** JSON

```json
{
  "oldPassword": "current-secret",
  "newPassword": "new-secret-at-least-8"
}
```

| Field | Rules |
| --- | --- |
| `oldPassword` | Required; must match the current password |
| `newPassword` | Required; minimum 8 characters |

### Success

```json
{ "ok": true }
```

Wrong current password → `400` with message like `Current password is incorrect`.

Keep this form separate from the profile PATCH. Do not mix password fields into the multipart profile request.

---

## 4. Majors select list

`GET /reference/major`

Returns Reference items of type `major` (typically `code`, `label` / display name, `isActive`). Bind the select’s **value** to `code` and store that in `majorCode` on save.

You can also use `GET /reference` for the full catalog if the UI already loads all types once.

---

## Suggested settings-page wiring

1. On open (parallel):
   - `GET /users/me/profile`
   - `GET /reference/major`
2. Profile form: bind fields above; email disabled.
3. On save profile: `PATCH /users/me/profile` as multipart (include `avatar` only if the user picked a new file).
4. Password card: `POST /users/me/change-password` with old + new; clear inputs on success.

---

## Errors the UI should handle

| Situation | Typical HTTP |
| --- | --- |
| Missing / invalid token | `401` |
| Non-instructor role | `403` |
| Unknown `majorCode` | `400` |
| Invalid social URL / avatar type or size | `400` |
| Wrong `oldPassword` | `400` |
| `newPassword` shorter than 8 | `400` |

---

## Auth reminder

Login / register for the dashboard stay under `/auth` (existing collection). After login, keep the access token and send it on these routes. Profile changes do not rotate tokens; password change does not invalidate the current access token automatically — the front can keep the session or force re-login if product requires it.
