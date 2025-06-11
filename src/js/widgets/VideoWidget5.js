import { Widget } from './Widget.js';

export class VideoWidget5 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.observer = null;
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <img src="static/images/law_1.png" alt="Law 1 Image" 
                    class="absolute inset-0 w-full h-full object-contain z-0">
                
                <!-- Footer Overlay with UP/DOWN buttons -->
                <div class="absolute bottom-0 left-0 right-0 flex-shrink-0 flex flex-row justify-center w-full px-8 py-12" style="background-color: #FFDCDC;">
                    <div class="flex items-center justify-between w-full max-w-6xl">
                        <!-- LEFT: DOWN button -->
                        <a href="#" id="downBtn" class="inline-flex items-center gap-2 text-4xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            <img id="downIcon" src="/static/icons/down_brown.svg" alt="Down" class="h-8 w-8">
                            DOWN
                        </a>
                        
                        <!-- CENTER: UP button -->
                        <a href="#" id="upBtn" class="inline-flex items-center gap-2 text-4xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            <img id="upIcon" src="/static/icons/up_brown.svg" alt="Up" class="h-8 w-8">
                            UP
                        </a>
                        
                        <!-- RIGHT: NEXT button -->
                        <a href="#" id="nextBtn" class="inline-flex items-center gap-2 text-4xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            NEXT
                            <img id="nextIcon" src="/static/icons/next.svg" alt="Next" class="h-8 w-8">
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Get references to elements
        this.upBtn = this.element.querySelector('#upBtn');
        this.downBtn = this.element.querySelector('#downBtn');
        this.nextBtn = this.element.querySelector('#nextBtn');
        this.upIcon = this.element.querySelector('#upIcon');
        this.downIcon = this.element.querySelector('#downIcon');
        this.nextIcon = this.element.querySelector('#nextIcon');

        // Set up event listeners
        this.setupFooterListeners();
        this.setupMutationObserver();
    }

    setupFooterListeners() {
        // Up button - navigate to VideoWidget7 (law_3) - Widget 9
        this.upBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Change icon to provide visual feedback
            this.upIcon.src = '/static/icons/upfilled_brown.svg';
            console.log("Up button clicked on VideoWidget5 - navigating to VideoWidget7 (law_3)");
            
            // Navigate to VideoWidget7 (Widget 9)
            setTimeout(() => {
                window.location.href = '/?widget=9';
            }, 200);
        });

        // Down button - navigate to VideoWidget6 (law_2)  
        this.downBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Change icon to provide visual feedback
            this.downIcon.src = '/static/icons/downfilled_brown.svg';
            console.log("Down button clicked on VideoWidget5 - navigating to VideoWidget6 (law_2)");
            
            // Navigate to VideoWidget6 (Widget 8)
            setTimeout(() => {
                window.location.href = '/?widget=8';
            }, 200);
        });

        // Next button - navigate to VideoWidget10 (rising.mp4)
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            
            console.log("Next button clicked on VideoWidget5 - navigating to VideoWidget10 (rising.mp4)");
            
            // Navigate to VideoWidget10 (Widget 12)
            setTimeout(() => {
                window.location.href = '/?widget=12';
            }, 200);
        });

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        // Only handle keys when this widget is active
        if (!this.element.classList.contains('widget-active')) {
            console.log("VideoWidget5: Not active, ignoring key press");
            return;
        }
        
        console.log("VideoWidget5: Key pressed:", key);
        
        if (key === 'w' || key === 'arrowup') {
            // UP button functionality - navigate to VideoWidget7 (law_3)
            event.preventDefault();
            event.stopPropagation();
            
            // Change up icon to filled version
            this.upIcon.src = '/static/icons/upfilled_brown.svg';
            
            console.log("VideoWidget5: UP key pressed - navigating to VideoWidget7 (law_3)");
            
            // Navigate to VideoWidget7 (Widget 9)
            setTimeout(() => {
                window.location.href = '/?widget=9';
            }, 200);
        } else if (key === 's' || key === 'arrowdown') {
            // DOWN button functionality - navigate to VideoWidget6
            event.preventDefault();
            event.stopPropagation();
            
            // Change down icon to filled version
            this.downIcon.src = '/static/icons/downfilled_brown.svg';
            
            console.log("VideoWidget5: DOWN key pressed - navigating to VideoWidget6 (law_2)");
            
            // Navigate to VideoWidget6 (Widget 8)
            setTimeout(() => {
                window.location.href = '/?widget=8';
            }, 200);
        } else if (key === 'd') {
            // NEXT button functionality - navigate to VideoWidget10
            event.preventDefault();
            event.stopPropagation();
            
            // Change next icon to filled version  
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            
            console.log("VideoWidget5: NEXT key pressed - navigating to VideoWidget10 (rising.mp4)");
            
            // Navigate to VideoWidget10 (Widget 12)
            setTimeout(() => {
                window.location.href = '/?widget=12';
            }, 200);
        } else if (key === 'r') {
            // Allow reset functionality - let main.js handle it
            console.log("VideoWidget5: Reset key pressed - allowing main.js to handle");
            return;
        }
    }

    setupMutationObserver() {
        // Watch for when this widget becomes active
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class') {
                    
                    if (this.element.classList.contains('widget-active')) {
                        // Reset all buttons to default state
                        if (this.upIcon) this.upIcon.src = '/static/icons/up_brown.svg';
                        if (this.downIcon) this.downIcon.src = '/static/icons/down_brown.svg';
                        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';
                        
                        console.log("VideoWidget5 activated - showing law_1 image");
                    }
                }
            });
        });

        this.observer.observe(this.element, { attributes: true });
    }

    deactivate() {
        if (this.observer) {
            this.observer.disconnect();
        }

        // Reset button icons to default state
        if (this.upIcon) this.upIcon.src = '/static/icons/up_brown.svg';
        if (this.downIcon) this.downIcon.src = '/static/icons/down_brown.svg';
        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';

        // Remove keyboard event listener
        document.removeEventListener('keydown', this.handleKeyDown);
        
        console.log('VideoWidget5 deactivated');
    }
}
