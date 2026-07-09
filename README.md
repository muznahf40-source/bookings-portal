# Model Bookings

A call-sheet style tracker for model bookings, reminders, and content ideas —
with real login, so each client only sees their own booking.

## What changed: login

- **You (the admin)** have a full account that sees and manages everything, same as before.
- **Clients** create their own account (just email + password, right on the site) using
  the same email you put on their booking. Once logged in, they see *only* their own
  booking and any content ideas linked to it — nothing else.

## If you already deployed the old version (no login)

You just need to re-run the SQL and push this updated code — nothing about your
Render or Supabase account setup changes.

### 1. Re-run the schema in Supabase

1. Go to your Supabase project → **SQL Editor** → **New query**.
2. Paste in everything from `supabase/schema.sql` in this folder and click **Run**.
   It's safe to run even though you ran the old version before — it upgrades things
   without losing your existing bookings.

### 2. Turn off "Confirm email" (so clients can log in right after signing up)

1. In Supabase, go to **Authentication** → **Providers** (or **Sign In / Providers**,
   depending on the dashboard version) → **Email**.
2. Find **Confirm email** and turn it **off**.
3. Save.

(If you'd rather keep email confirmation on, that's fine too — clients will just need
to click a confirmation link in their email before their first login.)

### 3. Create your own admin account

1. Open your live site (or run it locally — see below).
2. Click **Create account**, sign up with your own real email and a password you'll remember.
3. Back in Supabase, go to **SQL Editor** → **New query** and run:
   ```sql
   insert into admins (email) values ('your-real-email@example.com');
   ```
   (use the exact email you just signed up with)
4. Refresh your site and sign in — you should now see the full booking dashboard.

### 4. Push the updated code to GitHub

From this project folder:
```bash
git add .
git commit -m "Add client login"
git push
```
Render will automatically pick up the change and redeploy.

### 5. Tell your clients how to log in

When you add a booking, put the client's real email in the **Email** field. Then
just tell them: "Go to [your site link], click Create account, and sign up using
the email I have on file for you." That's it — no invite links needed.

---

## Starting completely fresh? Full setup:

### 1. Supabase (the database)

1. Go to https://supabase.com, sign in, and create a new project.
2. **SQL Editor** → **New query** → paste in `supabase/schema.sql` → **Run**.
3. **Authentication** → **Providers** → **Email** → turn off **Confirm email**.
4. **Project Settings → API** — copy the **Project URL** and **anon public** key.

### 2. Push this code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/model-bookings.git
git push -u origin main
```

### 3. Deploy on Render

1. https://render.com → **New +** → **Static Site** → connect the repo.
2. **Build Command:** `npm install && npm run build`
3. **Publish Directory:** `dist`
4. **Environment Variables:**
   - `VITE_SUPABASE_URL` → your Project URL
   - `VITE_SUPABASE_ANON_KEY` → your anon public key
5. **Create Static Site**.

### 4. Make your own account an admin

Sign up on the live site with your own email, then in Supabase SQL Editor run:
```sql
insert into admins (email) values ('your-real-email@example.com');
```

## Local development

```bash
npm install
cp .env.example .env   # fill in your Supabase URL + anon key
npm run dev
```
