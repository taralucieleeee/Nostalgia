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
        // Remove any existing listener first to prevent duplicates
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Set up keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown);
        console.log("FirstWidget: Keyboard navigation listener attached");
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
            
            console.log("FirstWidget: F key pressed - showing filled state for 1 second");
            
            // Change icon to filled version immediately
            if (this.startIcon) {
                this.startIcon.src = '/static/icons/filledstart.svg';
                console.log("FirstWidget: Icon changed to filled state");
            }
            
            // Wait 1 second to show the filled state, then navigate
            setTimeout(() => {
                console.log("FirstWidget: Navigating to Widget 2 after 1 second delay");
                
                // Dispatch custom event to trigger smooth navigation
                const navigationEvent = new CustomEvent('navigateToWidget', {
                    detail: { targetWidget: 2 }
                });
                document.dispatchEvent(navigationEvent);
            }, 1000); // Changed from 2000 to 1000 for 1 second delay
        }
    }

    setupStartButton() {
        // No longer needed - button is not clickable
    }

    deactivate() {
        // Reset start icon to unfilled state
        if (this.startIcon) {
            this.startIcon.src = '/static/icons/start.svg';
            console.log("FirstWidget: Icon reset to unfilled state on deactivate");
        }
        
        // Clean up keyboard event listener
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Clean up any other resources if needed
        // FirstWidget doesn't have videos or audio, so minimal cleanup
    }

    activate() {
        // Ensure start icon is in unfilled state when widget becomes active
        if (this.startIcon) {
            this.startIcon.src = '/static/icons/start.svg';
            console.log("FirstWidget: Icon ensured to be unfilled state on activate");
        }
        
        // Re-attach keyboard event listener if needed
        this.setupKeyboardNavigation();
    }
}
