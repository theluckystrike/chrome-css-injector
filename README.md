# chrome-css-injector — CSS Injection Utilities
> **Built by [Zovo](https://zovo.one)** | `npm i chrome-css-injector`

Inject, toggle, and remove CSS via Scripting API with dark mode, font, and element hiding.

```typescript
import { CSSInjector } from 'chrome-css-injector';
const injector = new CSSInjector();
await injector.inject(tabId, 'body { background: #111; color: #eee; }', 'dark');
await injector.toggle(tabId, CSSInjector.DARK_MODE, 'dark-mode');
```
MIT License
