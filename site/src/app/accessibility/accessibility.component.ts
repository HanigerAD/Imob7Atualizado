import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

interface AccessibilitySettings {
    fontLevel: number;
    highContrast: boolean;
    grayscale: boolean;
    highlightLinks: boolean;
    readableFont: boolean;
}

@Component({
    selector: 'app-accessibility',
    templateUrl: './accessibility.component.html',
    styleUrls: ['./accessibility.component.css']
})
export class AccessibilityComponent implements OnInit {

    public panelOpen = false;

    public fontLevel = 0;
    public highContrast = false;
    public grayscale = false;
    public highlightLinks = false;
    public readableFont = false;

    private readonly storageKey = 'imob7_accessibility';

    constructor(
        @Inject(DOCUMENT) private document: Document
    ) { }

    public ngOnInit(): void {
        this.loadSettings();
        this.applySettings(false);
    }

    public togglePanel(): void {
        this.panelOpen = !this.panelOpen;
    }

    public closePanel(): void {
        this.panelOpen = false;
    }

    public increaseFont(): void {
        if (this.fontLevel < 4) {
            this.fontLevel++;
            this.applySettings();
        }
    }

    public decreaseFont(): void {
        if (this.fontLevel > -1) {
            this.fontLevel--;
            this.applySettings();
        }
    }

    public toggleHighContrast(): void {
        this.highContrast = !this.highContrast;
        this.applySettings();
    }

    public toggleGrayscale(): void {
        this.grayscale = !this.grayscale;
        this.applySettings();
    }

    public toggleHighlightLinks(): void {
        this.highlightLinks = !this.highlightLinks;
        this.applySettings();
    }

    public toggleReadableFont(): void {
        this.readableFont = !this.readableFont;
        this.applySettings();
    }

    public reset(): void {
        this.fontLevel = 0;
        this.highContrast = false;
        this.grayscale = false;
        this.highlightLinks = false;
        this.readableFont = false;

        localStorage.removeItem(this.storageKey);

        this.applySettings(false);
    }

    private applySettings(save: boolean = true): void {
        const body = this.document.body;

        body.classList.toggle('a11y-high-contrast', this.highContrast);
        body.classList.toggle('a11y-grayscale', this.grayscale);
        body.classList.toggle('a11y-highlight-links', this.highlightLinks);
        body.classList.toggle('a11y-readable-font', this.readableFont);

        this.applyFontScale();

        if (save) {
            this.saveSettings();
        }
    }

    private applyFontScale(): void {
        const scale = 1 + (this.fontLevel * 0.15);

        const elements = Array.from(
            this.document.body.querySelectorAll<HTMLElement>(
                'h1, h2, h3, h4, h5, h6, p, a, button, label, input, select, textarea, li, span'
            )
        ).filter(element => {
            return !element.closest('app-accessibility') &&
                !element.classList.contains('material-icons') &&
                !element.classList.contains('fa');
        });

        // Primeiro registra o tamanho original de cada elemento
        elements.forEach(element => {
            if (!element.dataset.a11yBaseFontSize) {
                const computedSize = parseFloat(
                    window.getComputedStyle(element).fontSize
                );

                if (!isNaN(computedSize)) {
                    element.dataset.a11yBaseFontSize = String(computedSize);
                    element.dataset.a11yOriginalInlineFontSize =
                        element.style.fontSize || '';
                }
            }
        });

        // Depois aplica a escala
        elements.forEach(element => {
            const baseSize = Number(element.dataset.a11yBaseFontSize);

            if (!baseSize) {
                return;
            }

            if (this.fontLevel === 0) {
                element.style.fontSize =
                    element.dataset.a11yOriginalInlineFontSize || '';
            } else {
                element.style.fontSize = `${baseSize * scale}px`;
            }
        });
    }

    private saveSettings(): void {
        const settings: AccessibilitySettings = {
            fontLevel: this.fontLevel,
            highContrast: this.highContrast,
            grayscale: this.grayscale,
            highlightLinks: this.highlightLinks,
            readableFont: this.readableFont
        };

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(settings)
        );
    }

    private loadSettings(): void {
        try {
            const saved = localStorage.getItem(this.storageKey);

            if (!saved) {
                return;
            }

            const settings: AccessibilitySettings = JSON.parse(saved);

            this.fontLevel = settings.fontLevel || 0;
            this.highContrast = !!settings.highContrast;
            this.grayscale = !!settings.grayscale;
            this.highlightLinks = !!settings.highlightLinks;
            this.readableFont = !!settings.readableFont;

        } catch {
            localStorage.removeItem(this.storageKey);
        }
    }
}