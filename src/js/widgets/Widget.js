// Base Widget class
export class Widget {
    constructor(container, id) {
        this.container = container;
        this.id = id;
        this.element = this.createWidget();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'widget-container';
        widget.dataset.widget = this.id;
        if (this.id === 1) {
            widget.classList.add('widget-active');
        } else {
            widget.classList.add('widget-inactive');
        }
        return widget;
    }

    render() {
        // To be implemented by child classes
        throw new Error('render() must be implemented');
    }

    mount() {
        this.container.appendChild(this.element);
        this.render();
    }
    
    // Helper method to reset all icon states in a widget
    resetIcons() {
        // Check for navigation icons within the widget
        const nextIcon = this.element.querySelector('#nextIcon');
        const backIcon = this.element.querySelector('#backIcon');
        
        // Reset icon states if they exist
        if (nextIcon) nextIcon.src = '/static/icons/next.svg';
        if (backIcon) backIcon.src = '/static/icons/back.svg';
    }
}
