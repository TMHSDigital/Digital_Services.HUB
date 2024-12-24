import { BaseTool } from './base-tool.js';
import { notifications, modal } from '../utils/ui.js';
import { STORAGE_KEYS, APP_CONFIG } from '../utils/constants.js';
import utils from '../utils/helpers.js';

class About extends BaseTool {
    initializeElements() {
        return {
            themeButton: document.getElementById('theme-button'),
            notification: document.querySelector('.notification'),
            featureCards: document.querySelectorAll('.feature-card'),
            versionInfo: document.getElementById('version-info'),
            githubLink: document.getElementById('github-link')
        };
    }

    initializeState() {
        return {
            currentTheme: utils.getStorageItem(STORAGE_KEYS.THEME) || 'dark',
            version: APP_CONFIG.VERSION,
            lastUpdated: '2024-02',
            features: [
                {
                    name: 'Text to Speech',
                    description: 'Convert text to natural-sounding speech with multiple voices and languages.',
                    icon: '🗣️',
                    path: 'text-to-speech'
                },
                {
                    name: 'Image Resizer',
                    description: 'Resize and optimize images with aspect ratio preservation and format conversion.',
                    icon: '🖼️',
                    path: 'image-resizer'
                },
                {
                    name: 'Color Palette',
                    description: 'Generate and customize color palettes with harmony rules and export options.',
                    icon: '🎨',
                    path: 'color-palette'
                },
                {
                    name: 'ASCII Art',
                    description: 'Convert images into ASCII art with customizable settings and color support.',
                    icon: '🎯',
                    path: 'ascii-art'
                },
                {
                    name: 'QR Code',
                    description: 'Generate customizable QR codes with error correction and styling options.',
                    icon: '📱',
                    path: 'qr-code'
                }
            ]
        };
    }

    updateVersionInfo() {
        if (this.elements.versionInfo) {
            this.elements.versionInfo.innerHTML = `
                <p>Version: ${utils.sanitizeHTML(this.state.version)}</p>
                <p>Last Updated: ${utils.sanitizeHTML(this.state.lastUpdated)}</p>
                <p>Author: ${utils.sanitizeHTML(APP_CONFIG.AUTHOR)}</p>
            `;
        }

        if (this.elements.githubLink) {
            this.elements.githubLink.href = APP_CONFIG.GITHUB_URL;
        }
    }

    addFeatureCardEffects() {
        this.elements.featureCards.forEach(card => {
            // Mouse hover effects
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover');
            });

            // Click navigation
            card.addEventListener('click', () => {
                const feature = card.getAttribute('data-feature');
                if (feature) {
                    try {
                        const featureInfo = this.state.features.find(f => f.path === feature);
                        if (featureInfo) {
                            window.location.href = `${feature}.html`;
                            notifications.info(`Navigating to ${featureInfo.name}...`);
                        }
                    } catch (error) {
                        console.error('Error navigating to feature:', error);
                        notifications.error('Failed to navigate to feature. Please try again.');
                    }
                }
            });

            // Keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });

            // Accessibility
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            
            const feature = card.getAttribute('data-feature');
            if (feature) {
                const featureInfo = this.state.features.find(f => f.path === feature);
                if (featureInfo) {
                    card.setAttribute('aria-label', `Open ${featureInfo.name} tool`);
                }
            }
        });
    }

    showFeatureInfo(feature) {
        const featureInfo = this.state.features.find(f => f.path === feature);
        if (featureInfo) {
            modal.show({
                title: featureInfo.name,
                content: `
                    <div class="feature-info">
                        <div class="feature-icon">${featureInfo.icon}</div>
                        <p>${utils.sanitizeHTML(featureInfo.description)}</p>
                    </div>
                `,
                buttons: {
                    'Open Tool': () => window.location.href = `${feature}.html`,
                    'Close': () => {}
                }
            });
        }
    }

    bindEvents() {
        // Theme toggle
        this.elements.themeButton.addEventListener('click', () => {
            this.toggleTheme(STORAGE_KEYS.THEME);
        });

        // Feature card interactions
        this.addFeatureCardEffects();

        // Keyboard shortcuts
        this.state.features.forEach((feature, index) => {
            this.addKeyboardShortcut((index + 1).toString(), () => {
                window.location.href = `${feature.path}.html`;
            }, { alt: true });
        });
    }

    initialize() {
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);
        this.updateVersionInfo();
    }
}

// Initialize the feature when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new About();
}); 