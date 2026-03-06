# chrome-css-injector

CSS injection utilities for Chrome extensions built on Manifest V3. Inject inline styles or CSS files into tabs, toggle them on and off by ID, broadcast styles to all matching tabs, and generate common CSS patterns like dark mode, custom fonts, and element hiding.

Written in TypeScript. Ships type definitions.


INSTALL

```
npm install chrome-css-injector
```


MANIFEST PERMISSIONS

Your extension manifest needs the `scripting` permission and appropriate host permissions.

```json
{
  "permissions": ["scripting"],
  "host_permissions": ["<all_urls>"]
}
```


API

The library exports a single class, `CSSInjector`.

```js
import { CSSInjector } from 'chrome-css-injector';

const injector = new CSSInjector();
```

INSTANCE METHODS

`inject(tabId, css, id?)` injects a CSS string into the given tab. If you pass an optional `id`, the injector tracks it internally so you can toggle it later. Returns a promise.

```js
await injector.inject(tab.id, 'body { background: #1a1a1a; color: #eee; }', 'dark-bg');
```

`injectFile(tabId, file)` injects a CSS file from your extension directory into the given tab. The path is relative to the extension root.

```js
await injector.injectFile(tab.id, 'styles/content.css');
```

`remove(tabId, css)` removes previously injected CSS from the given tab. You must pass the exact same CSS string that was injected.

```js
await injector.remove(tab.id, 'body { background: #1a1a1a; color: #eee; }');
```

`injectAll(css, urlPattern?)` injects CSS into every open tab matching the URL pattern. Defaults to `<all_urls>`. Returns the number of tabs that received the injection.

```js
const count = await injector.injectAll('a { text-decoration: underline; }', 'https://*.github.com/*');
```

`toggle(tabId, css, id)` flips a style on or off. If the `id` is currently tracked as injected, the style is removed and the method returns `false`. Otherwise the style is injected and it returns `true`.

```js
const isOn = await injector.toggle(tab.id, CSSInjector.DARK_MODE, 'dark-mode');
```


STATIC HELPERS

`CSSInjector.DARK_MODE` is a ready-made CSS string that inverts page colors while preserving images and video.

```js
await injector.inject(tab.id, CSSInjector.DARK_MODE, 'dark');
```

`CSSInjector.fontCSS(fontFamily, url)` returns a CSS string that loads a custom font via `@font-face` and applies it to the body.

```js
const css = CSSInjector.fontCSS('Inter', 'https://example.com/inter.woff2');
await injector.inject(tab.id, css);
```

`CSSInjector.hideCSS(selectors)` takes an array of CSS selectors and returns a CSS string that sets `display: none !important` on each one.

```js
const css = CSSInjector.hideCSS(['.ads-container', '#cookie-banner', '.promo-popup']);
await injector.inject(tab.id, css);
```


USAGE IN A BACKGROUND SCRIPT

```js
import { CSSInjector } from 'chrome-css-injector';

const injector = new CSSInjector();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggle-dark') {
    injector.toggle(message.tabId, CSSInjector.DARK_MODE, 'dark-mode')
      .then(enabled => sendResponse({ enabled }))
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});
```


DEVELOPMENT

```
git clone https://github.com/theluckystrike/chrome-css-injector.git
cd chrome-css-injector
npm install
npm run build
```

The build step runs `tsc` and outputs to `dist/`.


LICENSE

MIT. See LICENSE file.

---

Part of the Zovo family of Chrome extension tools. Visit zovo.one for more.
