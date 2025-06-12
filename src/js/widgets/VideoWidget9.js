import { Widget } from './Widget.js';

export class VideoWidget9 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.observer = null;
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <img src="static/images/lastframe.png" alt="Last Frame Image" 
                    class="absolute inset-0 w-full h-full object-contain z-0">
                
                <!-- Footer Overlay with RESET button -->
                <div class="absolute bottom-0 left-0 right-0 flex-shrink-0 flex flex-row justify-center w-full px-8 py-12" style="background-color: #FFDCDC;">
                    <div class="flex items-center justify-center w-full max-w-6xl">
                        <!-- CENTER: RESET button -->
                        <a href="#" id="resetBtn" class="inline-flex items-center gap-2 text-4xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            <img id="resetIcon" src="/static/icons/resetbutton.svg" alt="Reset" class="h-8 w-8">
                            RESET
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Get references to elements
        this.resetBtn = this.element.querySelector('#resetBtn');
        this.resetIcon = this.element.querySelector('#resetIcon');

        // Set up event listeners
        this.setupFooterListeners();
        this.setupMutationObserver();
    }

    setupFooterListeners() {
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleReset();
            });

            // Add mouse events for visual feedback
            this.resetBtn.addEventListener('mousedown', () => {
                if (this.resetIcon) {
                    this.resetIcon.src = '/static/icons/resetbuttonfilled.svg';
                }
            });

            this.resetBtn.addEventListener('mouseup', () => {
                if (this.resetIcon) {
                    this.resetIcon.src = '/static/icons/resetbutton.svg';
                }
            });

            this.resetBtn.addEventListener('mouseleave', () => {
                if (this.resetIcon) {
                    this.resetIcon.src = '/static/icons/resetbutton.svg';
                }
            });
        }

        // Set up keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        if (!this.element.classList.contains('widget-active')) {
            return;
        }
        
        if (key === 'r') {
            event.preventDefault();
            event.stopPropagation();
            
            // Show filled icon briefly for visual feedback
            if (this.resetIcon) {
                this.resetIcon.src = '/static/icons/resetbuttonfilled.svg';
                setTimeout(() => {
                    if (this.resetIcon) {
                        this.resetIcon.src = '/static/icons/resetbutton.svg';
                    }
                }, 150);
            }
            
            this.handleReset();
        } else if (key === 'w' || key === 'arrowup') {
            event.preventDefault();
            event.stopPropagation();
            
            console.log("VideoWidget9: UP key pressed - navigating back to Widget 12");
            
            setTimeout(() => {
                window.location.href = '/?widget=12';
            }, 200);
        }
    }

    handleReset() {
        console.log("VideoWidget9: Reset button clicked - navigating to Widget 1");
        
        setTimeout(() => {
            window.location.href = '/?widget=1';
        }, 200);
    }

    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class') {
                    
                    if (this.element.classList.contains('widget-active')) {
                        if (this.resetIcon) this.resetIcon.src = '/static/icons/resetbutton.svg';
                        
                        console.log("VideoWidget9 activated - showing last frame");
                    } else {
                        if (this.resetIcon) this.resetIcon.src = '/static/icons/resetbutton.svg';
                    }
                }
            });
        });

        this.observer.observe(this.element, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    deactivate() {
        // Reset reset icon to unfilled state
        if (this.resetIcon) {
            this.resetIcon.src = '/static/icons/resetbutton.svg';
        }
        
        if (this.observer) {
            this.observer.disconnect();
        }
        
        document.removeEventListener('keydown', this.handleKeyDown);
        
        console.log('VideoWidget9 deactivated');
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        document.removeEventListener('keydown', this.handleKeyDown);
        
        super.destroy();
    }
}
