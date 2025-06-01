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
        if (this.id !== 1) {
            widget.classList.add('translate-x-full');
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
}
