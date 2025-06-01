import { Widget } from './Widget.js';

export class FourthWidget extends Widget {
    render() {
        this.element.innerHTML = `
            <div class="widget">
                <img src="static/images/fourth.png" alt="Fourth Image" class="max-w-full max-h-full object-contain">
            </div>
        `;
    }
}
