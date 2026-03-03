# chrome-css-injector

Inject and manage CSS styles in Chrome extension pages.

## Overview

chrome-css-injector provides utilities to inject CSS into web pages or extension popups, with support for dynamic updates and removal.

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

## License

MIT
