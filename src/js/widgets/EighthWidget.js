import { Widget } from './Widget.js';

export class EighthWidget extends Widget {
    render() {
        this.element.innerHTML = `
            <div class="widget">
                <img src="static/images/surveyresults_1.png" alt="Survey Results" class="max-w-full max-h-full object-contain">
            </div>
        `;
    }
    
    handleKeyPress(event) {
        const key = event.key.toLowerCase();
        
        if (key === 'd') {
            event.preventDefault();
            // Navigate to second voting question
            window.location.href = '/vote2.html';
        }
        
        // Call parent class method for other key handling
        super.handleKeyPress(event);
    }
}
