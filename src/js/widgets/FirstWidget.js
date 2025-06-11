import { Widget } from './Widget.js';

export class FirstWidget extends Widget {
    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <img src="static/images/start.png" alt="Start Image" 
                    class="absolute inset-0 w-full h-full object-contain z-0">
                <img src="static/gifs/FirstWidget_Gif.gif" alt="Overlay Animation" 
                    class="absolute inset-0 w-full h-full object-contain pointer-events-none z-10">
                
                <!-- Press to Start Button -->
                <div class="absolute inset-0 flex items-center justify-center z-20">
                    <div id="startBtn" class="inline-flex items-center gap-3 text-3xl pointer-events-none" 
                         style="font-family: 'Space Mono', monospace; color: #6461EF; font-weight: 400;">
                        <img id="startIcon" src="/static/icons/start.svg" alt="Start" class="h-7 w-7">
                        PRESS TO START
                    </div>
                </div>
            </div>
        `;

        // Get reference to start elements
        this.startBtn = this.element.querySelector('#startBtn');
        this.startIcon = this.element.querySelector('#startIcon');
        
        // Set up event listener
        this.setupKeyboardNavigation();
    }

    setupKeyboardNavigation() {
        // Set up keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        // Only handle keys when this widget is active
        if (!this.element.classList.contains('widget-active')) {
            return;
        }
        
        if (key === 'f') {
            event.preventDefault();
            event.stopPropagation();
            
            console.log("FirstWidget: F key pressed - changing icon and navigating to Widget 2");
            
            // Change icon to filled version
            if (this.startIcon) {
                this.startIcon.src = '/static/icons/filledstart.svg';
            }
            
            // Use smooth navigation instead of page reload
            setTimeout(() => {
                // Dispatch custom event to trigger smooth navigation
                const navigationEvent = new CustomEvent('navigateToWidget', {
                    detail: { targetWidget: 2 }
                });
                document.dispatchEvent(navigationEvent);
            }, 2000);
        }
    }

    setupStartButton() {
        // No longer needed - button is not clickable
    }

    deactivate() {
        // Clean up keyboard event listener
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Clean up any other resources if needed
        // FirstWidget doesn't have videos or audio, so minimal cleanup
    }
}
