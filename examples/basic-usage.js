/**
 * chrome-css-injector - Basic Usage Example
 * 
 * This example demonstrates how to use the CSSInjector class to inject,
 * manage, and remove CSS styles in Chrome extension pages.
 * 
 * Usage:
 *   Import this in your Chrome extension's content script or background script.
 *   Requires "css" permission in manifest.json:
 *   { "permissions": ["css"] }
 */

import { CSSInjector } from '../src/index.js';

// Create a new CSSInjector instance
const injector = new CSSInjector();

// Example 1: Inject basic CSS into the current tab
// This shows how to inject custom styles into a web page
async function injectBasicStyles() {
  const tabId = 123; // Replace with actual tab ID
  
  const css = `
    .my-extension-highlight {
      background-color: yellow;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .my-extension-tooltip {
      position: absolute;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
    }
  `;
  
  // Inject the CSS into the specified tab
  await injector.inject(tabId, css, 'my-styles');
  console.log('Basic styles injected!');
}

// Example 2: Inject CSS from a file
// Useful for larger CSS files that you want to keep separate
async function injectFromFile() {
  const tabId = 123;
  
  // Inject a CSS file from your extension's directory
  // The file path is relative to the extension root
  await injector.injectFile(tabId, 'styles/content.css');
  console.log('CSS file injected!');
}

// Example 3: Remove injected CSS
// Clean up styles when they're no longer needed
async function removeStyles() {
  const tabId = 123;
  
  const css = `
    .my-extension-highlight {
      background-color: yellow;
    }
  `;
  
  await injector.remove(tabId, css);
  console.log('Styles removed!');
}

// Example 4: Toggle CSS on/off
// Useful for user preferences like dark mode toggles
async function toggleDarkMode(tabId) {
  // Define the dark mode CSS
  const darkModeCSS = `
    html {
      filter: invert(1) hue-rotate(180deg);
    }
    img, video, canvas, [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg);
    }
  `;
  
  // Toggle returns true if injected, false if removed
  const isEnabled = await injector.toggle(tabId, darkModeCSS, 'dark-mode');
  console.log(`Dark mode ${isEnabled ? 'enabled' : 'disabled'}`);
}

// Example 5: Use static helper methods
// CSSInjector provides static methods for common patterns
function useStaticHelpers() {
  // Hide specific elements (useful for ad blocking or hiding distractions)
  const hideSelectors = [
    '.ads-container',
    '.social-share-buttons',
    '.newsletter-popup',
    '#cookie-banner'
  ];
  const hideCSS = CSSInjector.hideCSS(hideSelectors);
  console.log('Generated hide CSS:', hideCSS);
  // Output: ".ads-container { display: none !important; }\n.social-share-buttons { display: none !important; }..."
  
  // Inject custom fonts
  const fontCSS = CSSInjector.fontCSS('MyCustomFont', 'fonts/myfont.woff2');
  console.log('Generated font CSS:', fontCSS);
  // Output: "@font-face { font-family: 'MyCustomFont'; src: url('fonts/myfont.woff2'); } body { font-family: 'MyCustomFont', sans-serif !important; }"
  
  // Use pre-defined dark mode styles
  console.log('Dark mode CSS:', CSSInjector.DARK_MODE);
}

// Example 6: Inject into multiple tabs at once
// Apply styles to all tabs matching a URL pattern
async function injectToAllMatchingTabs() {
  // Inject CSS into all HTTP/HTTPS pages
  const css = `
    .extension-debug-info {
      border: 2px solid red !important;
    }
  `;
  
  // Count how many tabs were updated
  const count = await injector.injectAll(css, 'http://*/*');
  console.log(`Injected into ${count} tabs`);
}

// Example 7: Real-world content script usage
// This is how you'd typically use it in a content script
async function contentScriptExample() {
  // In a content script, you can get the current tab ID from chrome.runtime
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tab.id;
  
  // Inject user preference styles
  const userStyles = `
    /* Highlight important elements for readability */
    .highlight-important {
      background: linear-gradient(120deg, #fff3cd 0%, #ffeeba 100%);
      border-left: 4px solid #ffc107;
      padding: 2px 6px;
    }
    
    /* Make links more visible */
    a[href] {
      text-decoration: underline !important;
    }
  `;
  
  await injector.inject(tabId!, userStyles, 'user-prefs');
}

// Example 8: Background script with tab management
// Manage styles from the background script
async function backgroundScriptExample() {
  // Query all tabs
  const tabs = await chrome.tabs.query({});
  
  for (const tab of tabs) {
    if (tab.id && tab.url?.startsWith('http')) {
      // Inject development styles into all web pages
      const devStyles = `
        /* Outline all elements for debugging */
        * { outline: 1px solid rgba(255,0,0,0.3) !important; }
      `;
      
      try {
        await injector.inject(tab.id, devStyles, 'dev-outline');
      } catch (e) {
        // Handle permission errors gracefully
        console.log('Could not inject into tab:', tab.id);
      }
    }
  }
}

// Run examples (in real usage, you'd call these as needed)
// Note: These require a valid Chrome extension environment with tab IDs

console.log('CSSInjector Examples Loaded');
console.log('Available methods:', Object.getOwnPropertyNames(CSSInjector.prototype));
console.log('Static properties:', ['DARK_MODE', 'fontCSS', 'hideCSS']);
