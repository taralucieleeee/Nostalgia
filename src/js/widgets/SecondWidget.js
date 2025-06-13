import { Widget } from './Widget.js';

export class SecondWidget extends Widget {
    constructor(container, id) {
        super(container, id);
        this.countdownTimer = null;
        this.observer = null;
        
        // Adjustable countdown bar settings
        this.countdownHeight = 12; // Height in pixels (change this value to adjust height)
        this.countdownWidth = 240; // Width in pixels (w-60 = 240px)
        this.verticalPosition = '55%'; // Vertical position (66.666667% = top-2/3)
    }

    render() {
        // Preload the image to ensure smooth transition
        const img = new Image();
        img.src = 'static/images/second.png';

        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <img src="static/images/second.png" alt="Second Image" 
                    class="absolute inset-0 w-full h-full object-contain z-0">
                
                <!-- Countdown Timer -->
                <div id="countdownContainer" class="absolute bg-white rounded-full overflow-hidden z-10"
                     style="top: ${this.verticalPosition}; left: 50%; transform: translateX(-50%) translateY(-50%); width: ${this.countdownWidth}px; height: ${this.countdownHeight}px; opacity: 0;">
                    <div id="countdownBar" class="h-full rounded-full" 
                         style="background-color: #6461EF; width: 100%;"></div>
                </div>
                
                <!-- Put on Headphones Button -->
                <div class="absolute inset-0 flex items-center justify-center z-20">
                    <div id="headphonesBtn" class="text-3xl pointer-events-none" 
                         style="font-family: 'Space Mono', monospace; color: #6461EF; font-weight: 400;">
                        PUT ON THE HEADPHONES
                    </div>
                </div>
            </div>
        `;

        this.countdownBar = this.element.querySelector('#countdownBar');
        this.countdownContainer = this.element.querySelector('#countdownContainer');
        this.headphonesBtn = this.element.querySelector('#headphonesBtn');
        this.setupMutationObserver();
    }

    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class') {
                    
                    if (this.element.classList.contains('widget-active')) {
                        console.log("SecondWidget activated - starting countdown after 1 second delay");
                        
                        // Show countdown and start animation after 1 second
                        setTimeout(() => {
                            if (this.countdownContainer) {
                                this.countdownContainer.style.opacity = '1';
                                this.startCountdown();
                            }
                        }, 1000);
                    } else {
                        this.stopCountdown();
                        // Hide countdown when widget becomes inactive
                        if (this.countdownContainer) {
                            this.countdownContainer.style.opacity = '0';
                        }
                    }
                }
            });
        });

        this.observer.observe(this.element, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    startCountdown() {
        // Clear any existing timer
        this.stopCountdown();

        if (this.countdownBar) {
            // Use CSS animation for smooth countdown
            this.countdownBar.style.transition = 'width 5s linear';
            this.countdownBar.style.width = '0%';
        }

        // Navigate after 5 seconds
        this.countdownTimer = setTimeout(() => {
            console.log("SecondWidget countdown completed - navigating to firstpart.mp4 video");
            
            const navigationEvent = new CustomEvent('navigateToWidget', {
                detail: { targetWidget: 3 }
            });
            document.dispatchEvent(navigationEvent);
        }, 5000);
    }

    stopCountdown() {
        if (this.countdownTimer) {
            clearTimeout(this.countdownTimer);
            this.countdownTimer = null;
        }
        
        // Reset countdown bar if stopping
        if (this.countdownBar) {
            this.countdownBar.style.transition = 'none';
            this.countdownBar.style.width = '100%';
        }
    }

    deactivate() {
        // Clean up countdown timer
        this.stopCountdown();
        
        // Reset visual state completely
        if (this.countdownContainer) {
            this.countdownContainer.style.opacity = '0';
        }
        
        if (this.countdownBar) {
            this.countdownBar.style.transition = 'none';
            this.countdownBar.style.width = '100%';
        }
        
        // Ensure headphones button is visible
        if (this.headphonesBtn) {
            this.headphonesBtn.style.display = 'block';
        }
        
        // Clean up mutation observer
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    activate() {
        // Reinitialize the mutation observer if it was disconnected
        if (!this.observer) {
            this.setupMutationObserver();
        }
        
        // Check if the widget is currently active and start countdown if so
        // This handles the case where the widget is already active after reset
        if (this.element.classList.contains('widget-active')) {
            console.log("SecondWidget activate() - widget is active, starting countdown after 1 second delay");
            
            // Show countdown and start animation after 1 second
            setTimeout(() => {
                if (this.countdownContainer) {
                    this.countdownContainer.style.opacity = '1';
                    this.startCountdown();
                }
            }, 1000);
        }
    }

    destroy() {
        this.stopCountdown();
        
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        super.destroy();
    }
}
