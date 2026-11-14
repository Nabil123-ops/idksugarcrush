import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';

const ROOT = process.cwd();
const ANDROID_APK_DIR = path.join(ROOT, 'android', 'app', 'build', 'outputs', 'apk');
const OUT_DIR = path.join(ROOT, 'dist-android');
const APP_ID = 'com.sugarcrown.match3';
const APP_NAME = 'Sugar Crown';
const VERSION_CODE = '1';
const VERSION_NAME = '1.0.0';

function findApks(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findApks(full));
    } else if (entry.isFile() && entry.name.endsWith('.apk')) {
      results.push(full);
    }
  }
  return results;
}

function pickBestApk(apks) {
  const priority = [
    (f) => f.endsWith('app-release.apk'),
    (f) => f.endsWith('app-release-unsigned.apk'),
    (f) => f.endsWith('app-debug.apk'),
  ];
  for (const pred of priority) {
    const match = apks.find(pred);
    if (match) return match;
  }
  return apks[0] ?? null;
}

async function run() {
  const allApks = findApks(ANDROID_APK_DIR);
  const apkPath = pickBestApk(allApks);

  if (!apkPath) {
    console.error(
      `No compiled .apk found under ${ANDROID_APK_DIR}.\n` +
        `Run "npm run android:apk" on a machine with JDK 17+ and Android SDK (or push to GitHub to run .github/workflows/android-apk-xapk.yml).`
    );
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const outApkPath = path.join(OUT_DIR, `SugarCrown-v${VERSION_NAME}.apk`);
  fs.copyFileSync(apkPath, outApkPath);

  const apkBuffer = fs.readFileSync(apkPath);
  const iconPath = path.join(ROOT, 'public', 'pwa-512x512.png');

  const manifest = {
    xapk_version: 2,
    package_name: APP_ID,
    name: APP_NAME,
    version_code: VERSION_CODE,
    version_name: VERSION_NAME,
    min_sdk_version: '24',
    target_sdk_version: '36',
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
    ],
    total_size: apkBuffer.length,
    split_apks: [
      {
        file: `${APP_ID}.apk`,
        id: 'base',
      },
    ],
  };

  const zip = new JSZip();
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  zip.file(`${APP_ID}.apk`, apkBuffer);
  if (fs.existsSync(iconPath)) {
    zip.file('icon.png', fs.readFileSync(iconPath));
  }

  const xapkBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const outXapkPath = path.join(OUT_DIR, `SugarCrown-v${VERSION_NAME}.xapk`);
  fs.writeFileSync(outXapkPath, xapkBuffer);

  console.log(`APK  ready -> ${outApkPath} (${(apkBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`XAPK ready -> ${outXapkPath} (${(xapkBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
