/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "db31379ee3d2d57c1d406d97983f9e7f"
  }, {
    "url": "pwa-maskable-192x192.png",
    "revision": "8ba0518e35f48013217c4525e70007b5"
  }, {
    "url": "pwa-512x512.png",
    "revision": "517b1a736eac187180e7197bca042752"
  }, {
    "url": "pwa-192x192.png",
    "revision": "168882292b2da72d8dad6f21f8326060"
  }, {
    "url": "manifest.webmanifest",
    "revision": "3126ade1c9a7b53dd10a24eb963882fb"
  }, {
    "url": "index.html",
    "revision": "0cfc67f9b0e8ae32b2485e8538f7b32e"
  }, {
    "url": "icon.svg",
    "revision": "a67ee45852b597183c34f23e9fad5025"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "5ce26698931c43a85485c220c72e77c5"
  }, {
    "url": "icons/icon-96x96.png",
    "revision": "e47bf2a5066b0a81002c5699ff52abb7"
  }, {
    "url": "icons/icon-72x72.png",
    "revision": "24b4758877554f997077472dda372951"
  }, {
    "url": "icons/icon-48x48.png",
    "revision": "d891cc53a5a943a7ef82c72f53af837d"
  }, {
    "url": "icons/icon-384x384.png",
    "revision": "0de326304b2fc22d67fb814521ddb097"
  }, {
    "url": "icons/icon-256x256.png",
    "revision": "c3af3667bb7e6ee07061b06adb7cd5bf"
  }, {
    "url": "icons/icon-180x180.png",
    "revision": "c0a17993e814a0f745f556d101ff871c"
  }, {
    "url": "icons/icon-167x167.png",
    "revision": "ac50c2bea42bfed6d5a0f1855472816a"
  }, {
    "url": "icons/icon-152x152.png",
    "revision": "3765c7b063ee7f1cd749a1167eb8e2d7"
  }, {
    "url": "icons/icon-144x144.png",
    "revision": "c32a5c39f886f0a68968725e440c6402"
  }, {
    "url": "icons/icon-128x128.png",
    "revision": "ba5d1ad4d16f7860f72c835890e1f8ad"
  }, {
    "url": "assets/zone_sugar_meadow_1794672214659-KNdqcrqr.jpg",
    "revision": null
  }, {
    "url": "assets/zone_crystal_glacier_1794672211427-BQ6h5qXp.jpg",
    "revision": null
  }, {
    "url": "assets/zone_caramel_canyon_1794672211955-B8C9huGA.jpg",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/web-BSD336tT.js",
    "revision": null
  }, {
    "url": "assets/title_kingdom_backdrop_1794672213905-D9iqz6ds.jpg",
    "revision": null
  }, {
    "url": "assets/index-mr3ROmNM.js",
    "revision": null
  }, {
    "url": "assets/index-CeK6mRoO.css",
    "revision": null
  }, {
    "url": "assets/aistudio/image_63feba16_1ba24426.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/image_5d562d25_42a2915f.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/image_349be151_7dcd139e.jpg",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "5ce26698931c43a85485c220c72e77c5"
  }, {
    "url": "icon.svg",
    "revision": "a67ee45852b597183c34f23e9fad5025"
  }, {
    "url": "pwa-192x192.png",
    "revision": "168882292b2da72d8dad6f21f8326060"
  }, {
    "url": "pwa-512x512.png",
    "revision": "517b1a736eac187180e7197bca042752"
  }, {
    "url": "pwa-maskable-192x192.png",
    "revision": "8ba0518e35f48013217c4525e70007b5"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "db31379ee3d2d57c1d406d97983f9e7f"
  }, {
    "url": "icons/icon-128x128.png",
    "revision": "ba5d1ad4d16f7860f72c835890e1f8ad"
  }, {
    "url": "icons/icon-144x144.png",
    "revision": "c32a5c39f886f0a68968725e440c6402"
  }, {
    "url": "icons/icon-152x152.png",
    "revision": "3765c7b063ee7f1cd749a1167eb8e2d7"
  }, {
    "url": "icons/icon-167x167.png",
    "revision": "ac50c2bea42bfed6d5a0f1855472816a"
  }, {
    "url": "icons/icon-180x180.png",
    "revision": "c0a17993e814a0f745f556d101ff871c"
  }, {
    "url": "icons/icon-256x256.png",
    "revision": "c3af3667bb7e6ee07061b06adb7cd5bf"
  }, {
    "url": "icons/icon-384x384.png",
    "revision": "0de326304b2fc22d67fb814521ddb097"
  }, {
    "url": "icons/icon-48x48.png",
    "revision": "d891cc53a5a943a7ef82c72f53af837d"
  }, {
    "url": "icons/icon-72x72.png",
    "revision": "24b4758877554f997077472dda372951"
  }, {
    "url": "icons/icon-96x96.png",
    "revision": "e47bf2a5066b0a81002c5699ff52abb7"
  }, {
    "url": "manifest.webmanifest",
    "revision": "3126ade1c9a7b53dd10a24eb963882fb"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("/index.html"), {
    denylist: [/^\/__/, /^\/api\//]
  }));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
