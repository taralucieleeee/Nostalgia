import { Widget } from './Widget.js';

export class SecondWidget extends Widget {
    render() {
        this.element.innerHTML = `
            <div class="widget">
                <img src="static/images/second.png" alt="Second Image" class="max-w-full max-h-full object-contain">
            </div>
        `;
    }
}
