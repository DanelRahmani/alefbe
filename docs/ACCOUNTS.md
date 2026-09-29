# Plan: sign in with Google and sync progress

Status: **plan only, not built.** Written 2026-09-29.

## Is it realistic?

Yes. The site is a static export, so there is no server of our own, but a hosted backend with a browser SDK does the whole job from the client:
- Google sign-in;
- a small per-user database;
- rules that let each user read and write only their own data.

Nothing in the current architecture has to change. The stores already keep everything as small versioned JSON documents, and the backup file is those documents bundled together, so "sync" means sending the same documents to a database instead of a file.

## Recommended stack: Firebase (Auth + Firestore)

| | Firebase (recommended) | Supabase | Next.js server + Auth.js |
|---|---|---|---|
| Works with the static export | yes, client SDK | yes, client SDK | no: needs route handlers, so the export is dropped |
| Google sign-in | built in | built in | built in |
| Free tier fit | Spark plan: 50k reads and 20k writes a day, no pausing | free projects **pause after a week without traffic** | Vercel functions plus a database, which is more to run |
| Offline | Firestore caches and queues writes itself | manual | manual |
| Per-user security | Firestore rules | Postgres row-level security | your own code |

Supabase's pausing is the deciding factor for a hobby-scale site: a quiet week would take sync down until the project is resumed by hand. Firebase has no such limit on the free plan.

Nihongo Path could use the same Firebase project, with its own collection. One Google account would then carry progress in both apps.

## How it works

**Local first.** localStorage stays the source of truth, and the site works exactly as now when signed out. An account only adds a copy in the cloud and merges between devices.

**Data model.** Firestore holds `users/{uid}/stores/{storeKey}`, each document `{ v, data, updatedAt, device }`. One document per store key means a practice session only writes the two or three stores it touched. The keys are those in `BACKUP_KEYS`, and later `mistakes` and `starred` too.

**Merging.** Merges go in a new pure module, `lib/sync.ts`, with a function per store and unit tests. The two sides are never simply overwritten:

| Store | Merge |
|---|---|
| progress (finished lessons) | per lesson, the newer change wins; "mark as not finished" is kept as a dated tombstone so it doesn't come back |
| srs (trainer decks) | per card, the copy with more reviews (then the later review) wins; open groups take the maximum |
| trace | per letter form and level, the higher score |
| activity | per day and kind, the larger count (not the sum, so nothing is counted twice); traced, forms and quiz counts take the maximum |
| games | best score and times played take the maximum |
| settings, path filter, practice and drill choices | the newer document wins |
| mistakes, starred (Phase 4e) | union, with dated tombstones for removals |

**When it syncs:**
- **On sign-in:** pull every store, merge it with this device's data, and write the result to both sides. A second device's first sign-in therefore combines both histories instead of replacing one with the other.
- **While signed in:** each store's `subscribe` fires on change; changed stores are pushed a few seconds after the last change (debounced), and also when the tab is hidden.
- **When the page is opened or refocused:** pull the latest copy.
- **Offline:** Firestore queues the writes and sends them when the connection returns.

**Signing in:**
- Firebase `signInWithRedirect` with the Google provider. Redirect rather than popup works in iOS home-screen apps and with popup blockers.
- Safari blocks third-party storage, so the auth handler should run on our own domain. A Vercel rewrite in `vercel.json` does this: `/__/auth/:path*` → `https://<project>.firebaseapp.com/__/auth/:path*`, with `authDomain: "alefbe.study"`. This is Firebase's documented "proxy auth requests" option, and rewrites work with a static export.
- Scopes are only `openid`, `email` and `profile`. These are non-sensitive, so Google's consent screen needs brand verification (name, logo, privacy policy, domain) but not a security review.

**Interface:**
- A "Sync across devices" card on `/progress`:
  - "Sign in with Google", following Google's button guidelines;
  - then the account's email and "Synced 2 minutes ago";
  - "Sync now";
  - "Sign out", with a choice to keep or remove the data on this device;
  - "Delete my account and synced data".
- A small avatar in the header while signed in, and nothing when signed out.
- The Firebase SDK is loaded only when the card is opened or a session exists, so signed-out visitors download nothing extra.

**Security:**
- Firestore rules: `match /users/{uid}/{doc=**} { allow read, write: if request.auth.uid == uid; }`, plus size limits on documents.
- The Firebase web API key is public by design; restrict it to alefbe.study and the preview domains in Google Cloud.
- App Check (reCAPTCHA Enterprise) is optional.

**Privacy (EU/GDPR):** a `/privacy` page must set out:
- what is stored: Google account id, email and name, and the progress documents;
- where: Firestore location `eur3` (Europe);
- the processor, Google;
- the purpose;
- how long data is kept;
- how to delete it (the in-app button deletes the Firestore documents and the auth user).

Firebase Auth uses IndexedDB, not tracking cookies, and Vercel Analytics stays cookieless, so no cookie banner is needed; the page says so. Link it in the footer and on the sign-in card.

## Build steps (about two days of work)

1. **Owner:**
   - create the Firebase project (Spark plan, Firestore in `eur3`);
   - enable Google sign-in;
   - fill in the OAuth consent screen (name, logo, privacy policy URL, `alefbe.study` as an authorised domain);
   - restrict the API key.

   These steps involve your Google account, so you do them. Claude writes the checklist.
2. **`lib/sync.ts`:** the merge functions and the push/pull scheduler, as pure functions with unit tests, including two-device merge scenarios.
3. **Firestore rules:** with tests in the Firebase Local Emulator Suite.
4. **Interface:** the sync card, a lazy-loaded Firebase client, the redirect flow and the `vercel.json` auth rewrite.
5. **Privacy:** the `/privacy` page, the footer link, and account deletion.
6. **Testing:** Claude tests against the emulator; the owner signs in with a real Google account on the preview and on two devices, because Claude does not sign in to accounts.

## Risks

- **Clock skew between devices:** use Firestore server timestamps for `updatedAt`.
- **Large stores:** activity grows by one small entry per active day, about 20 KB a year, which is far under Firestore's 1 MB document limit. Days older than two years can be compacted if needed.
- **Google's branding and verification:** allow a few days before launch.
- **Lock-in:** the backup file keeps working, so data can always leave.
