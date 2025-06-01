import { Widget } from './Widget.js';

export class SeventhWidget extends Widget {
    render() {
        this.element.innerHTML = `
            <div class="widget">
                <img src="static/images/seventh.png" alt="Seventh Image" class="max-w-full max-h-full object-contain">
            </div>
        `;
    }
}
