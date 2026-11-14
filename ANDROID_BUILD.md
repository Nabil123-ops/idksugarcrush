# Building Sugar Crown APK & XAPK

This project includes a native Android Capacitor project (`/android`), automated XAPK v2 packager (`/scripts/package-xapk.mjs`), and a GitHub Actions cloud build pipeline (`/.github/workflows/android-apk-xapk.yml`).

## Option 1: Cloud Build via GitHub Actions (No Local Android Studio Needed)
1. Push this repository to GitHub (`main` or `master`).
2. Open the **Actions** tab in GitHub and select **Build Android APK & XAPK** (or click **Run workflow**).
3. Download the **SugarCrown-Android-Packages** artifact containing both:
   - `SugarCrown-v1.0.0.apk`
   - `SugarCrown-v1.0.0.xapk`

## Option 2: Build Locally (Requires JDK 21+ & Android SDK 36)
```bash
npm install
npm run android:package
```
Generated packages will be written to `dist-android/`:
- `dist-android/SugarCrown-v1.0.0.apk`
- `dist-android/SugarCrown-v1.0.0.xapk`

### Optional Signed Release Build
Export these environment variables before running `npm run android:package`:
- `KEYSTORE_PATH`
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`
