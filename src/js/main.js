import { FirstWidget } from './widgets/FirstWidget.js';
import { SecondWidget } from './widgets/SecondWidget.js';
import { ThirdWidget } from './widgets/ThirdWidget.js';
import { FourthWidget } from './widgets/FourthWidget.js';

class WidgetManager {
    constructor() {
        this.widgetContainer = document.getElementById('widgetContainer');
        this.currentWidget = 1;
        this.widgets = [];
        this.init();
    }

    init() {
        // Clear container
        this.widgetContainer.innerHTML = '';
        
        // Initialize widgets
        this.widgets = [
            new FirstWidget(this.widgetContainer, 1),
            new SecondWidget(this.widgetContainer, 2),
            new ThirdWidget(this.widgetContainer, 3),
            new FourthWidget(this.widgetContainer, 4)
        ];

        // Mount all widgets
        this.widgets.forEach(widget => widget.mount());
        
        // Set up navigation
        this.setupNavigation();
    }

    setupNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.addEventListener('click', () => this.navigateToWidget(-1));
        nextBtn.addEventListener('click', () => this.navigateToWidget(1));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'a') {
                this.navigateToWidget(-1);
            } else if (key === 'd') {
                this.navigateToWidget(1);
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
    }

    updateWidgetPositions() {
        this.widgets.forEach(widget => {
            const widgetNum = parseInt(widget.element.dataset.widget);
            if (widgetNum < this.currentWidget) {
                widget.element.style.transform = 'translateX(-100%)';
            } else if (widgetNum > this.currentWidget) {
                widget.element.style.transform = 'translateX(100%)';
            } else {
                widget.element.style.transform = 'translateX(0)';
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