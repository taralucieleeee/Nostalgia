import { Widget } from './Widget.js';

export class ThirdWidget extends Widget {
    render() {
        this.element.innerHTML = `
            <div class="widget">
                <img src="static/images/third.png" alt="Third Image" class="max-w-full max-h-full object-contain">
            </div>
        `;
    }
}
