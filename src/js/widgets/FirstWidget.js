import { Widget } from './Widget.js';

export class FirstWidget extends Widget {
    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <img src="static/images/start.png" alt="Start Image" 
                    class="absolute inset-0 w-full h-full object-contain z-0">
                <img src="static/gifs/FirstWidget_Gif.gif" alt="Overlay Animation" 
                    class="absolute inset-0 w-full h-full object-contain pointer-events-none z-10">
            </div>
        `;
    }
}
