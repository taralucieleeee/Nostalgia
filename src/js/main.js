import { FirstWidget } from './widgets/FirstWidget.js';
import { SecondWidget } from './widgets/SecondWidget.js';
import { ThirdWidget } from './widgets/ThirdWidget.js';
import { FourthWidget } from './widgets/FourthWidget.js';
import { FifthWidget } from './widgets/FifthWidget.js';
import { SixthWidget } from './widgets/SixthWidget.js';
import { SeventhWidget } from './widgets/SeventhWidget.js';

class WidgetManager {
    constructor() {
        this.widgetContainer = document.getElementById('widgetContainer');
        this.currentWidget = 1;
        this.widgets = [];
        this.backgroundMusic = document.getElementById('bgMusic');
        this.backgroundMusic.loop = true;
        this.setupAudioContext();
        this.init();
    }

    setupAudioContext() {
        // Create audio context on user interaction
        const handleFirstInteraction = () => {
            if (this.currentWidget <= 2) {
                this.backgroundMusic.play().catch(e => console.log('Audio playback failed:', e));
            }
            // Remove the event listeners once audio is playing
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };

        // Add event listeners for first interaction
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);
    }

    init() {
        // Clear container
        this.widgetContainer.innerHTML = '';
        
        // Initialize widgets
        this.widgets = [
            new FirstWidget(this.widgetContainer, 1),
            new SecondWidget(this.widgetContainer, 2),
            new ThirdWidget(this.widgetContainer, 3),
            new FourthWidget(this.widgetContainer, 4),
            new FifthWidget(this.widgetContainer, 5),
            new SixthWidget(this.widgetContainer, 6),
            new SeventhWidget(this.widgetContainer, 7)
        ];

        // Mount all widgets
        this.widgets.forEach(widget => widget.mount());
        
        // Set up navigation
        this.setupNavigation();

        // Music will start playing on first user interaction
    }

    setupNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.addEventListener('click', () => this.navigateToWidget(-1));
        nextBtn.addEventListener('click', () => this.navigateToWidget(1));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'f') {
                // Toggle between first and second widget
                if (this.currentWidget === 1) {
                    this.currentWidget = 2;
                    this.updateWidgetPositions();
                    this.updateNavigationButtons();
                } else if (this.currentWidget === 2) {
                    this.currentWidget = 1;
                    this.updateWidgetPositions();
                    this.updateNavigationButtons();
                }
            } else if (key === 'a') {
                this.navigateToWidget(-1);
            } else if (key === 'd') {
                this.navigateToWidget(1);
            } else if (key === 'r') {
                // Reset to first widget
                this.currentWidget = 1;
                this.updateWidgetPositions();
                this.updateNavigationButtons();
            }
        });

        this.updateNavigationButtons();
    }

    navigateToWidget(direction) {
        const newWidget = this.currentWidget + direction;
        if (newWidget < 1 || newWidget > this.widgets.length) return;
        
        this.currentWidget = newWidget;
        this.updateWidgetPositions();
        this.updateNavigationButtons();
        
        // Handle background music based on current widget
        if (this.currentWidget <= 2) {
            if (this.backgroundMusic.paused) {
                this.backgroundMusic.play().catch(e => console.log('Audio playback failed:', e));
            }
        } else {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    updateWidgetPositions() {
        this.widgets.forEach(widget => {
            const widgetNum = parseInt(widget.element.dataset.widget);
            if (widgetNum === this.currentWidget) {
                widget.element.classList.add('widget-active');
                widget.element.classList.remove('widget-inactive');
            } else {
                widget.element.classList.remove('widget-active');
                widget.element.classList.add('widget-inactive');
            }
        });
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        prevBtn.disabled = this.currentWidget === 1;
        nextBtn.disabled = this.currentWidget === this.widgets.length;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WidgetManager();
});