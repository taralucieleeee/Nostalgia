import { Widget } from './Widget.js';

export class SixthWidget extends Widget {
    render() {
        this.element.innerHTML = `
            <div class="widget">
                <img src="static/images/sixth.png" alt="Sixth Image" class="max-w-full max-h-full object-contain">
            </div>
        `;
    }
}
