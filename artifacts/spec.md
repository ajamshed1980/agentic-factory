```markdown
# RFC: IdeaBoard MVP

## Context

IdeaBoard is a minimal web application for individuals to collect, tag, and share ideas as notes. The MVP targets authenticated users, allowing them to create, tag, search, and share notes via a public URL. 

Stack:  
- Next.js (app directory)
- TypeScript
- Tailwind CSS  
- Postgres (Neon) + Drizzle ORM
- Playwright for e2e  
- Deployed to Vercel  
- No 3rd-party analytics/trackers

---

## Goals

- User authentication (email/password or social OAuth)
- Create/edit/delete notes
- Tag notes
- Search notes by keyword and/or tag
- Public shareable page for each note (read-only)
- Basic, clean UI

## Non-Goals

- Note attachments/files
- Rich-text formatting
- Teams/collaborators/multi-user notes
- Advanced permissions (all public notes are readable by anyone with the link)
- Analytics

---

## Personas

- **Idea Collector**: Used to jotting down ideas, wants simple tools, values search and sharing.
- **Receiver**: Follows share-link, only needs to view a note, no edit/auth.

---

## User Stories

- As a signed-in user, I can create, edit, delete notes.
- As a user, I can tag notes (with multiple tags).
- As a user, I can search my notes by text or tag.
- As a user, I can open a public, read-only version of any of my notes.
- As anyone, I can view a note via its share link, with no sign-in.

---

## Information Architecture

- **Home (/dashboard):**  
  - List of notes (search bar, filter by tag)  
  - "Create Note" button
- **Note Editor (/note/[id]):**  
  - Edit, tag, delete
  - Copy shareable link
- **Public Note (/share/[noteId]):**  
  - Read-only note view
- **Auth (sign in/up/reset):**  
  - Simple forms

---

## Key Screens and Flows

1. **Auth Flow**:
    - Sign Up / Sign In (email/password; optionally GitHub/Google OAuth if time permits)
2. **Note CRUD**:
    - Add/Edit/Delete Note
    - Add/Remove tags (chips or input)
3. **Search**:
    - Filter by keyword/tag
4. **Share Flow**:
    - Copy public link to clipboard
    - Access via public URL (no login)

---

## API Design

All endpoints under `/api` in Next.js App Router. All return `{ success: boolean, data?: any, error?: string }`. Authenticated routes use JWT session (NextAuth recommended).

### Endpoints

| Route                   | Method | Auth?  | Purpose                | Request                      | Response             |
|-------------------------|--------|--------|------------------------|------------------------------|----------------------|
| `/api/notes`            | GET    | Yes    | List/search notes      | `?q=&tag=`                   | `notes[]`            |
| `/api/notes`            | POST   | Yes    | Create note            | `{ content, tags[] }`        | `note`               |
| `/api/notes/:id`        | GET    | Yes    | Get own note           |                              | `note`               |
| `/api/notes/:id`        | PUT    | Yes    | Update note            | `{ content, tags[] }`        | `note`               |
| `/api/notes/:id`        | DELETE | Yes    | Delete note            |                              | `{ success }`        |
| `/api/shared/:shareId`  | GET    | No     | Get note by share link |                              | `note (read-only)`   |

---

## Data Model (Postgres)

### users
- id: UUID (PK)
- email: string (unique)
- password_hash: string (for email/password only)
- created_at: timestamp

### notes
- id: UUID (PK)
- user_id: UUID (FK: users.id)
- content: text
- created_at: timestamp
- updated_at: timestamp
- share_id: UUID (unique, for public link)

### tags
- id: UUID (PK)
- label: string (unique, lowercase)

### note_tags
- note_id: UUID (FK: notes.id)
- tag_id: UUID (FK: tags.id)
- (composite PK)

---

## Integrations

- **DB**: Neon Postgres via Drizzle ORM
- **Auth**: NextAuth (email/password, social optional)
- **Deployment**: Vercel

---

## Security/Privacy

- No sensitive data or analytics.
- Authenticated APIs check user ownership.
- Public (shared) notes are read-only, surfaced only by unguessable `share_id`.
- Passwords hashed using recommended algorithms (bcrypt or argon2).
- No 3rd-party scripts or trackers.
- Rate limiting for API if time allows.

---

## Performance

- Paginate note lists (limit 20/page)
- Use database indexes on user_id, tag, and share_id
- All public endpoints cacheable (via headers)
- Next.js SSR for public note pages

---

## Risks

- Exposing note via share link—risk if guessing not sufficiently hard (enough entropy in `share_id`).
- Potential abuse of public share endpoint (no DoS mitigation in MVP).
- Minimal validation on tags/note content (should be enforced).

---

## Acceptance Criteria (Gherkin)

```gherkin
Feature: Note CRUD
  Scenario: Create a note
    Given I am signed in
    When I create a note with "Build a rocket"
    Then I see "Build a rocket" in my note list

  Scenario: Edit a note
    Given I have a note "Old idea"
    When I update it to "New idea"
    Then I see "New idea" in my note list

  Scenario: Tag a note
    Given I have a note "Idea 1"
    When I add tag "rocket"
    Then I see "rocket" on the note

Feature: Note Sharing
  Scenario: Public share
    Given I have a note
    When I copy the share link and visit it in an incognito window
    Then I see the note content (read-only)
    And I do not see edit/delete buttons

Feature: Search/filter
  Scenario: Keyword search
    Given I have notes "A", "B"
    When I search "B"
    Then only note "B" is listed

Feature: Permissions
  Scenario: Can't access others' notes
    Given user A has note "Idea"
    When user B tries to GET /api/notes/:id
    Then a "not found" or "forbidden" error is returned
```

---

## Test Plan

- **Unit tests**: Model functions (DB operations, tag parsing, ID generation)
- **Integration**: API endpoints (CRUD, auth, permissions, input validation)
- **E2E (Playwright)**: Auth, note creation/edit/delete, tag, search, public sharing, sign-out
- **Security**: Cannot access another user's notes, shared notes are read-only

---

## Release Plan

### MVP (1–2 sprints):
- Auth
- Note CRUD (+tags, search)
- Public share URL (read-only)
- E2E coverage for above
- Deployed on Vercel

### Iteration ideas (not in this RFC):
- Social logins
- Tag management
- Archive notes
- Soft-delete/undo
- Dark mode

---
```
