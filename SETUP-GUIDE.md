# Money Ledger: put it online, install it, sync it

Your money data is **never** in these files. The site is just the app; your ledger lives encrypted on each device and (optionally) in a private folder of *your own* Google Drive.

## A. GitHub: host the app (about 5 minutes)
1. Sign in at github.com (or create a free account). Note your **username**.
2. Click **+ → New repository**. Name it `money-ledger`. Choose **Public** (free hosting needs it; the app holds no personal data). Create.
3. Click **uploading an existing file**. Drag in everything from this folder (index.html, sw.js, manifest.webmanifest, config.js, the icon png files, .nojekyll). Click **Commit changes**.
4. **Settings → Pages**. Under *Build and deployment* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, Save.
5. After 1–2 minutes your app is at `https://YOURUSERNAME.github.io/money-ledger/`.

## B. Google Cloud: allow Drive sync (about 10 minutes, once)
1. Go to console.cloud.google.com, signed in with the Google account whose Drive should hold your backup. Create a project called **Money Ledger**.
2. **APIs & Services → Library →** search **Google Drive API → Enable**.
3. **OAuth consent screen** (now called *Google Auth Platform*): **Get started**. App name `Money Ledger`, your email as support and contact, audience **External**. Finish.
4. **Audience → Test users → Add users**: your Gmail and your wife's Gmail.
5. **Data Access → Add or remove scopes**: add `https://www.googleapis.com/auth/drive.appdata` (the private app-folder permission). Save.
6. **Clients → Create client**: type **Web application**. Under **Authorized JavaScript origins** add `https://YOURUSERNAME.github.io` (no slash at the end, no `/money-ledger`). Create, then copy the **Client ID**.
7. Back in your GitHub repo, open **config.js**, click the pencil, paste the Client ID between the quotes, and commit. Every device now has it automatically.

## C. Move your ledger to the hosted app
Your data currently lives in the browser where you opened the HTML file; the hosted address is a different "place", so it starts empty.
1. In the **old** app: **Data & backup → Save encrypted backup**.
2. Open your new address. **Data & backup → Restore a Money Ledger backup**, pick that file, enter your passphrase.
3. **Data & backup → Google Drive sync → Connect Google Drive**. Google will say the app is "not verified" because it's in testing: **Advanced → Continue**. Allow.

## D. Phone
1. Open your address in **Safari** (iPhone). Share → **Add to Home Screen**. Open it from the new icon.
2. **Data & backup → Google Drive sync → Restore from Drive**, sign in, enter your passphrase.
Installed apps keep their data safely on iPhone; plain Safari tabs can have site data cleared after a week of non-use, which is another reason to install and sync.

## E. Your wife (her own private ledger)
Send her the address (**Data & backup → Share the app with family → Copy link**). She opens it, taps **Set up my accounts**, picks her country and currency, adds it to her home screen, creates her own passphrase and connects her own Google Drive. Her data never mixes with yours.

## Good to know
- Sync is whole-ledger, last save wins. If two devices change things before syncing, the app asks which to keep and stores the other as a dated safety copy in Drive.
- Phones need one tap to sign in to Google about once an hour; changes then upload by themselves.
- Live prices call two free public services (exchange rates, gold spot). They only see your IP address, never your data. Rates you typed yourself are kept unless you tick them; gold keeps your jeweller's premium.
- Updating the app later: upload the new index.html (and sw.js) to the repo; devices pick it up the next time they open it online.
