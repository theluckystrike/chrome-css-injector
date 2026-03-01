/**
 * CSS Injector — Inject and manage stylesheets in pages
 */
export class CSSInjector {
    private injectedIds = new Map<string, number>();

    /** Inject CSS into a tab */
    async inject(tabId: number, css: string, id?: string): Promise<void> {
        await chrome.scripting.insertCSS({ target: { tabId }, css });
        if (id) this.injectedIds.set(id, tabId);
    }

    /** Inject CSS file */
    async injectFile(tabId: number, file: string): Promise<void> {
        await chrome.scripting.insertCSS({ target: { tabId }, files: [file] });
    }

    /** Remove injected CSS */
    async remove(tabId: number, css: string): Promise<void> {
        await chrome.scripting.removeCSS({ target: { tabId }, css });
    }

    /** Inject into all tabs matching URL pattern */
    async injectAll(css: string, urlPattern: string = '<all_urls>'): Promise<number> {
        const tabs = await chrome.tabs.query({ url: urlPattern });
        let count = 0;
        for (const tab of tabs) {
            if (tab.id) { try { await this.inject(tab.id, css); count++; } catch { } }
        }
        return count;
    }

    /** Toggle CSS on/off by id */
    async toggle(tabId: number, css: string, id: string): Promise<boolean> {
        if (this.injectedIds.has(id)) { await this.remove(tabId, css); this.injectedIds.delete(id); return false; }
        else { await this.inject(tabId, css, id); return true; }
    }

    /** Inject dark mode CSS */
    static readonly DARK_MODE = `
    html { filter: invert(1) hue-rotate(180deg); }
    img, video, canvas, [style*="background-image"] { filter: invert(1) hue-rotate(180deg); }
  `;

    /** Inject custom font */
    static fontCSS(fontFamily: string, url: string): string {
        return `@font-face { font-family: '${fontFamily}'; src: url('${url}'); } body { font-family: '${fontFamily}', sans-serif !important; }`;
    }

    /** Hide elements by selector */
    static hideCSS(selectors: string[]): string {
        return selectors.map((s) => `${s} { display: none !important; }`).join('\n');
    }
}
