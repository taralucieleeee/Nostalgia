import { Widget } from './Widget.js';

export class FirstWidget extends Widget {
    render() {
        this.element.innerHTML = `
            <div class="widget">
                <img src="static/images/start.png" alt="Start Image" class="max-w-full max-h-full object-contain">
            </div>
        `;
    }
}
