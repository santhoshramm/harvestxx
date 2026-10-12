# HarvestX

HarvestX is a React + Vite application using Firebase Authentication and Cloud Firestore.

## Requirements

- Node.js (current LTS recommended)
- npm
- A Firebase project with the web app configured

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file by copying `.env.example` to `.env.local` and fill in the values from your Firebase project settings:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   In Command Prompt, use `copy .env.example .env.local` instead.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Check the production build:

   ```bash
   npm run build
   ```

## Firebase and security notes

- `.env.local` is intentionally excluded from Git. Never commit real environment files, service-account JSON files, private keys, or passwords.
- Values prefixed with `VITE_` are included in browser-side code when the app is built. Firebase web app configuration is not a substitute for security rules. Configure Firebase Authentication authorized domains and restrictive Firestore/Storage security rules in the Firebase console.
- If a credential was previously committed or shared publicly, remove it from the repository and rotate/revoke it where applicable. Removing it from the latest version does not remove it from Git history.

## GitHub upload

Upload the project source and configuration files, including `package.json`, `package-lock.json`, `.gitignore`, and `.env.example`. Do not upload `.env.local`, `.env`, `node_modules/`, `dist/`, or the `.git/` directory from a local copy.
