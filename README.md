# chrome-css-injector

[![npm version](https://img.shields.io/npm/v/chrome-css-injector)](https://npmjs.com/package/chrome-css-injector)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![CI Status](https://github.com/theluckystrike/chrome-css-injector/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/chrome-css-injector/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/chrome-css-injector?style=social)](https://github.com/theluckystrike/chrome-css-injector)

> Inject and manage CSS styles in Chrome extension pages.

**chrome-css-injector** provides utilities to inject CSS into web pages or extension popups, with support for dynamic updates and removal. Part of the Zovo Chrome extension utilities.

Part of the [Zovo](https://zovo.one) developer tools family.

## Overview

chrome-css-injector provides utilities to inject CSS into web pages or extension popups, with support for dynamic updates and removal.

## Features

- ✅ **CSS Injection** - Inject styles into pages
- ✅ **Frame Support** - Inject into specific frames
- ✅ **Style Management** - List, remove, clear styles
- ✅ **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install chrome-css-injector
```

## Usage

### Inject into Page

```javascript
import { CssInjector } from 'chrome-css-injector';

const injector = new CssInjector();

// Inject CSS into page
await injector.inject(`
  .my-extension-class {
    background: blue;
    color: white;
  }
`, { runAt: 'document_end' });
```

### Inject into Frame

```javascript
await injector.injectIntoFrame(frameId, tabId, `
  .highlight {
    background: yellow;
  }
`);
```

### Manage Injected Styles

```javascript
// List all injected styles
const styles = await injector.list();

// Remove specific style
await injector.remove(styleId);

// Remove all styles
await injector.clear();
```

## API

### Methods

- `inject(css, options)` - Inject CSS into page
- `injectIntoFrame(frameId, tabId, css)` - Inject into frame
- `list()` - List injected styles
- `remove(id)` - Remove style by ID
- `clear()` - Remove all styles

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| runAt | string | document_idle | When to inject |
| matchAboutBlank | boolean | false | Inject into about:blank |
| frameId | number | null | Specific frame |

## Manifest

```json
{
  "permissions": ["css"]
}
```

## Browser Support

- Chrome 90+

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/css-improvement`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/css-improvement`
7. **Submit** a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/theluckystrike/chrome-css-injector.git
cd chrome-css-injector

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## Built by Zovo

Part of the [Zovo](https://zovo.one) developer tools family — privacy-first Chrome extensions built by developers, for developers.

## See Also

### Related Zovo Repositories

- [zovo-extension-template](https://github.com/theluckystrike/zovo-extension-template) - Boilerplate for building privacy-first Chrome extensions
- [zovo-types-webext](https://github.com/theluckystrike/zovo-types-webext) - Comprehensive TypeScript type definitions for browser extensions

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT - [Zovo](https://zovo.one)

---

Built by [Zovo](https://zovo.one)
