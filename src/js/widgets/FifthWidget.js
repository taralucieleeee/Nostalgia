import { Widget } from './Widget.js';

export class FifthWidget extends Widget {
    render() {
        this.element.innerHTML = `
            <div class="widget">
                <img src="static/images/fifth.png" alt="Fifth Image" class="max-w-full max-h-full object-contain">
            </div>
        `;
    }
}
