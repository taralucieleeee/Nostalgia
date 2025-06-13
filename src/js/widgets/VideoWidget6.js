import { Widget } from './Widget.js';

export class VideoWidget6 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.observer = null;
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full law-widget">
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

        this.setupEventListeners();
        this.setupMutationObserver();
    }

    setupEventListeners() {
        // Button clicks - IMMEDIATE navigation with visual feedback
        this.element.querySelector('#upBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateWithFeedback('up', 7); // law_1
        });

        this.element.querySelector('#downBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateWithFeedback('down', 9); // law_3
        });

        this.element.querySelector('#nextBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateWithFeedback('next', 12); // rising.mp4
        });

        // Keyboard - IMMEDIATE navigation with visual feedback
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        if (!this.element.classList.contains('widget-active')) return;
        
        const key = event.key.toLowerCase();
        
        if (key === 'w' || key === 'arrowup') {
            event.preventDefault();
            event.stopPropagation();
            this.navigateWithFeedback('up', 7);
        } else if (key === 's' || key === 'arrowdown') {
            event.preventDefault();
            event.stopPropagation();
            this.navigateWithFeedback('down', 9);
        } else if (key === 'd') {
            event.preventDefault();
            event.stopPropagation();
            this.navigateWithFeedback('next', 12);
        }
    }

    // HYBRID: Visual feedback + immediate navigation
    navigateWithFeedback(direction, targetWidget) {
        // Show visual feedback immediately
        const iconMap = {
            'up': { element: this.element.querySelector('#upIcon'), filled: '/static/icons/upfilled_brown.svg' },
            'down': { element: this.element.querySelector('#downIcon'), filled: '/static/icons/downfilled_brown.svg' },
            'next': { element: this.element.querySelector('#nextIcon'), filled: '/static/icons/nextfilled.svg' }
        };
        
        const icon = iconMap[direction];
        if (icon?.element) {
            icon.element.src = icon.filled;
        }
        
        console.log(`VideoWidget6 (law_2): ${direction.toUpperCase()} → Widget ${targetWidget}`);
        
        // Navigate immediately (no delay!)
        window.location.href = `/?widget=${targetWidget}`;
    }

    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class' &&
                    this.element.classList.contains('widget-active')) {
                    console.log("VideoWidget6 (law_2) activated");
                }
            });
        });
        this.observer.observe(this.element, { attributes: true });
    }

    deactivate() {
        if (this.observer) this.observer.disconnect();
        document.removeEventListener('keydown', this.handleKeyDown);
        console.log('VideoWidget6 (law_2) deactivated');
    }
}
