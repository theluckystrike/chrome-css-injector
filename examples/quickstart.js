/**
 * chrome-css-injector - Working Code Examples
 * 
 * This file demonstrates how to use the CSSInjector class to inject and manage
 * CSS styles in Chrome extension pages.
 * 
 * NOTE: This library requires the "css" permission in manifest.json:
 * { "permissions": ["css"] }
 * 
 * @author Zovo
 * @license MIT
 */

// Import the CSSInjector class from the library
import { CSSInjector } from 'chrome-css-injector';

// Create an instance of the injector
const injector = new CSSInjector();

// ============================================================================
// EXAMPLE 1: Inject CSS into the current tab
// ============================================================================
// This is the most common use case - injecting custom styles into a page
// where your extension is active.

async function injectBasicStyles() {
  // Define your custom CSS as a string
  const customCSS = `
    .my-extension-highlight {
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      padding: 10px;
      border-radius: 4px;
    }
    .my-extension-button {
      background: #007bff;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `;

  // Get the current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab.id) {
    // Inject the CSS into the tab
    // The inject() method takes: (tabId, css, optionalIdForTracking)
    await injector.inject(tab.id, customCSS, 'my-custom-styles');
    console.log('CSS injected successfully!');
  }
}

// ============================================================================
// EXAMPLE 2: Toggle CSS on/off (useful for themes or user preferences)
// ============================================================================
// The toggle method lets you easily turn styles on/off with a single call.
// It uses an ID to track whether the style is currently applied.

async function toggleDarkMode(tabId: number) {
  // Define dark mode CSS
  const darkModeCSS = `
    html { filter: invert(1) hue-rotate(180deg); }
    img, video, canvas, [style*="background-image"] { 
      filter: invert(1) hue-rotate(180deg); 
    }
  `;

  // Toggle returns true if turned ON, false if turned OFF
  const isNowOn = await injector.toggle(tabId, darkModeCSS, 'dark-mode-toggle');
  
  console.log(`Dark mode is now ${isNowOn ? 'ON' : 'OFF'}`);
  return isNowOn;
}

// ============================================================================
// EXAMPLE 3: Use built-in static helpers
// ============================================================================
// CSSInjector provides static methods and properties for common use cases

function useBuiltInHelpers() {
  // DARK_MODE - Pre-built dark mode CSS (inverts colors)
  const darkModeStyles = CSSInjector.DARK_MODE;
  // Equivalent to:
  // html { filter: invert(1) hue-rotate(180deg); }
  // img, video, canvas, [style*="background-image"] { filter: invert(1) hue-rotate(180deg); }

  // fontCSS() - Generate CSS to load a custom font
  const customFontStyles = CSSInjector.fontCSS('MyCustomFont', 'https://example.com/fonts/font.woff2');
  // Generates:
  // @font-face { font-family: 'MyCustomFont'; src: url('https://example.com/fonts/font.woff2'); }
  // body { font-family: 'MyCustomFont', sans-serif !important; }

  // hideCSS() - Generate CSS to hide elements by selectors
  const hiddenElements = CSSInjector.hideCSS([
    '.ads-container',
    '.promo-banner', 
    '.newsletter-popup',
    '[data-ad]'
  ]);
  // Generates:
  // .ads-container { display: none !important; }
  // .promo-banner { display: none !important; }
  // ...

  return { darkModeStyles, customFontStyles, hiddenElements };
}

// ============================================================================
// EXAMPLE 4: Inject CSS into all tabs matching a URL pattern
// ============================================================================
// Useful for applying styles to all pages of a certain domain

async function injectIntoAllMatchingTabs() {
  // CSS to inject into all tabs
  const globalStyles = `
    body { font-family: 'Inter', sans-serif !important; }
  `;

  // injectAll() injects into all tabs matching the URL pattern
  // Default pattern is '<all_urls>' (all pages)
  // Common patterns: 'https://*.example.com/*', 'http://localhost:*'
  const count = await injector.injectAll(globalStyles, 'https://*.github.com/*');
  
  console.log(`Injected styles into ${count} GitHub tabs`);
  return count;
}

// ============================================================================
// EXAMPLE 5: Remove injected CSS
// ============================================================================
// Remove specific styles that were previously injected

async function removeInjectedStyles(tabId: number) {
  const stylesToRemove = `
    .my-extension-highlight {
      background-color: #fff3cd;
    }
  `;

  // Remove the CSS from the tab
  await injector.remove(tabId, stylesToRemove);
  console.log('CSS removed successfully!');
}

// ============================================================================
// EXAMPLE 6: Inject a CSS file (alternative to inline styles)
// ============================================================================
// If you prefer to inject from a file rather than inline CSS

async function injectCSSFile(tabId: number) {
  // This injects a file from your extension's directory
  // The file path is relative to your extension's root
  await injector.injectFile(tabId, 'styles/content.css');
  console.log('CSS file injected!');
}

// ============================================================================
// EXAMPLE 7: Complete usage in a Chrome extension background script
// ============================================================================
// This shows how to integrate CSSInjector in a real extension context

async function backgroundScriptExample() {
  // Create injector instance (can be reused)
  const injector = new CSSInjector();

  // Listen for messages from content scripts or popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'injectStyles') {
      const { tabId, css, styleId } = message;
      
      injector.inject(tabId, css, styleId)
        .then(() => sendResponse({ success: true }))
        .catch(err => sendResponse({ success: false, error: err.message }));
      
      return true; // Keep channel open for async response
    }
    
    if (message.action === 'toggleStyles') {
      const { tabId, css, styleId } = message;
      
      injector.toggle(tabId, css, styleId)
        .then(isEnabled => sendResponse({ success: true, enabled: isEnabled }))
        .catch(err => sendResponse({ success: false, error: err.message }));
      
      return true;
    }
    
    if (message.action === 'removeStyles') {
      const { tabId, css } = message;
      
      injector.remove(tabId, css)
        .then(() => sendResponse({ success: true }))
        .catch(err => sendResponse({ success: false, error: err.message }));
      
      return true;
    }
  });
}

// ============================================================================
// EXAMPLE 8: Content script integration
// ============================================================================
// Using CSSInjector from a content script

async function contentScriptExample() {
  // In content scripts, you typically use the tab ID of the current page
  const tabId = (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id!;
  
  const injector = new CSSInjector();

  // Inject user preference styles
  const userStyles = `
    .highlight-search { background: yellow; }
    .visited-link { color: purple; }
  `;
  
  await injector.inject(tabId, userStyles, 'user-prefs');

  // Example: Toggle styles based on user action
  document.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    if (target.dataset.toggleTheme) {
      await injector.toggle(tabId, CSSInjector.DARK_MODE, 'theme-toggle');
    }
  });
}

// Export for module usage
export {
  injectBasicStyles,
  toggleDarkMode,
  useBuiltInHelpers,
  injectIntoAllMatchingTabs,
  removeInjectedStyles,
  injectCSSFile,
  backgroundScriptExample,
  contentScriptExample
};
