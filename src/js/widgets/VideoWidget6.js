import { Widget } from './Widget.js';

export class VideoWidget6 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.observer = null;
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <img src="static/images/law_2.png" alt="Law 2 Image" 
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
        // Up button - navigate back to VideoWidget5 (Widget 7)
        this.upBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Change icon to provide visual feedback
            this.upIcon.src = '/static/icons/upfilled_brown.svg';
            console.log("Up button clicked on VideoWidget6 - navigating back to Widget 7");
            
            // Navigate back to Widget 7
            setTimeout(() => {
                window.location.href = '/?widget=7';
            }, 200);
        });

        // Down button - navigate to VideoWidget7 (law_3)  
        this.downBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Change icon to provide visual feedback
            this.downIcon.src = '/static/icons/downfilled_brown.svg';
            console.log("Down button clicked on VideoWidget6 - navigating to VideoWidget7 (law_3)");
            
            // Navigate to VideoWidget7 (Widget 9)
            setTimeout(() => {
                window.location.href = '/?widget=9';
            }, 200);
        });

        // Next button - for future functionality
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            
            console.log("Next button clicked on VideoWidget6");
            // Add future navigation logic here
        });

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        // Only handle keys when this widget is active
        if (!this.element.classList.contains('widget-active')) {
            console.log("VideoWidget6: Not active, ignoring key press");
            return;
        }
        
        console.log("VideoWidget6: Key pressed:", key);
        
        if (key === 'w' || key === 'arrowup') {
            // UP button functionality - navigate back to Widget 7
            event.preventDefault();
            event.stopPropagation();
            
            // Change up icon to filled version
            this.upIcon.src = '/static/icons/upfilled_brown.svg';
            
            console.log("VideoWidget6: UP key pressed - navigating back to Widget 7");
            
            // Navigate back to Widget 7
            setTimeout(() => {
                window.location.href = '/?widget=7';
            }, 200);
        } else if (key === 's' || key === 'arrowdown') {
            // DOWN button functionality - navigate to VideoWidget7
            event.preventDefault();
            event.stopPropagation();
            
            // Change down icon to filled version
            this.downIcon.src = '/static/icons/downfilled_brown.svg';
            
            console.log("VideoWidget6: DOWN key pressed - navigating to VideoWidget7 (law_3)");
            
            // Navigate to VideoWidget7 (Widget 9)
            setTimeout(() => {
                window.location.href = '/?widget=9';
            }, 200);
        } else if (key === 'd') {
            // NEXT button functionality
            event.preventDefault();
            event.stopPropagation();
            
            // Change next icon to filled version  
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            
            console.log("VideoWidget6: NEXT key pressed");
            
            // Reset icon after visual feedback
            setTimeout(() => {
                this.nextIcon.src = '/static/icons/next.svg';
            }, 200);
            
            // Add future NEXT navigation logic here
        } else if (key === 'r') {
            // Allow reset functionality - let main.js handle it
            console.log("VideoWidget6: Reset key pressed - allowing main.js to handle");
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
                        
                        console.log("VideoWidget6 activated - showing law_2 image");
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
        
        console.log('VideoWidget6 deactivated');
    }
}
