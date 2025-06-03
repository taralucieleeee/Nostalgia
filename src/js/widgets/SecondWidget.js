import { Widget } from './Widget.js';

export class SecondWidget extends Widget {
    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <img src="static/images/second.png" alt="Second Image" 
                    class="absolute inset-0 w-full h-full object-contain z-0">
            </div>
        `;
    }
}
