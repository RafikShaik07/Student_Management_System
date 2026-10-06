# Student Management System

A web application to manage student records efficiently, built for the Auspify Technologies internship (Task 1, Easy).

**Live demo:** _add your Vercel link here_

## Features
- **Add** student records with validation (name, roll number, email, course, age) and duplicate roll-number detection
- **Update** details through an edit form
- **Delete** records with a confirmation dialog
- **View** all students in a searchable, filterable, sortable table
- **Course selection** with an "Other" option for any custom course name
- Dashboard with total students, courses in use, average age and a chart of students per course
- Export records to CSV, dark mode, fully responsive layout

## Tech stack
- **Frontend:** HTML, CSS and vanilla JavaScript (single `index.html`)
- **Backend:** Vercel serverless function (`api/students.js`)
- **Database:** Supabase (PostgreSQL), accessed through its REST API
- **Hosting:** GitHub + Vercel (auto-deploys on every push)
- **Fallback:** if the API is not configured, the app stores data in the browser's IndexedDB so it still works

## Project structure
```
index.html        UI and client logic
api/students.js   REST API (GET, POST for create/update, DELETE)
supabase.sql      Table schema and sample data
package.json
```

## API
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/students` | List all students |
| POST | `/api/students` | Create or update a student (upsert by `id`) |
| DELETE | `/api/students?id=<id>` | Delete a student |

## Setup
1. Create a project at [supabase.com](https://supabase.com), open **SQL Editor**, and run `supabase.sql`.
2. In Supabase go to **Project Settings -> API** and copy the **Project URL** and the **service_role** key.
3. Push this repository to GitHub and import it in Vercel.
4. In Vercel go to **Settings -> Environment Variables** and add:
   - `SUPABASE_URL` = your Project URL
   - `SUPABASE_SERVICE_KEY` = your service_role key
5. Redeploy. The page header will read "Connected to the shared cloud database."

The service key is only used on the server and is never sent to the browser.

## Testing checklist
- Add a student, then refresh: it persists
- Edit a student and save
- Delete a student and confirm
- Try a duplicate roll number: an error is shown
- Choose **Other** as the course and enter a custom name
- Search, filter and sort; export CSV
