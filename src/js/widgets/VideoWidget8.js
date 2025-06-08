import { Widget } from './Widget.js';

export class VideoWidget8 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.video = null;
        this.hasPlayed = false;
        this.observer = null;
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full bg-black">
                <video id="mainVideo" 
                       class="absolute inset-0 w-full h-full object-contain z-0"
                       preload="none"
                       muted
                       playsinline>
                    <source src="/static/videos/politics_2.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                
                <div class="absolute bottom-0 left-0 right-0 flex-shrink-0 flex flex-row justify-center w-full px-8 py-12" style="background-color: #FFDCDC;">
                    <div class="flex items-center justify-between w-full max-w-6xl">
                        <a href="#" id="downBtn" class="inline-flex items-center gap-2 text-4xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            <img id="downIcon" src="/static/icons/down_brown.svg" alt="Down" class="h-8 w-8">
                            DOWN
                        </a>
                        
                        <a href="#" id="upBtn" class="inline-flex items-center gap-2 text-4xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            <img id="upIcon" src="/static/icons/up_brown.svg" alt="Up" class="h-8 w-8">
                            UP
                        </a>
                        
                        <a href="#" id="nextBtn" class="inline-flex items-center gap-2 text-4xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            NEXT
                            <img id="nextIcon" src="/static/icons/next.svg" alt="Next" class="h-8 w-8">
                        </a>
                    </div>
                </div>
            </div>
        `;

        this.video = this.element.querySelector('#mainVideo');
        this.upBtn = this.element.querySelector('#upBtn');
        this.downBtn = this.element.querySelector('#downBtn');
        this.nextBtn = this.element.querySelector('#nextBtn');
        this.upIcon = this.element.querySelector('#upIcon');
        this.downIcon = this.element.querySelector('#downIcon');
        this.nextIcon = this.element.querySelector('#nextIcon');

        this.setupFooterListeners();
        this.setupVideoHandlers();
        this.setupMutationObserver();
    }

    setupVideoHandlers() {
        if (this.video) {
            this.video.addEventListener('ended', () => {
                console.log('Politics_2 video playback completed');
                this.video.pause();
                this.video.currentTime = 0;
            });
        }
    }

    setupFooterListeners() {
        this.upBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.upIcon.src = '/static/icons/upfilled_brown.svg';
            console.log("Up button clicked on VideoWidget8 - navigating back to Widget 9");
            
            if (this.video && !this.video.paused) {
                this.video.pause();
            }
            
            setTimeout(() => {
                window.location.href = '/?widget=9';
            }, 200);
        });

        this.downBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.downIcon.src = '/static/icons/downfilled_brown.svg';
            console.log("Down button clicked on VideoWidget8");
        });

        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            console.log("Next button clicked on VideoWidget8");
        });

        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        if (!this.element.classList.contains('widget-active')) {
            return;
        }
        
        if (key === 'w' || key === 'arrowup') {
            event.preventDefault();
            event.stopPropagation();
            
            this.upIcon.src = '/static/icons/upfilled_brown.svg';
            console.log("VideoWidget8: UP key pressed - navigating back to Widget 9");
            
            if (this.video && !this.video.paused) {
                this.video.pause();
            }
            
            setTimeout(() => {
                window.location.href = '/?widget=9';
            }, 200);
        } else if (key === 's' || key === 'arrowdown') {
            event.preventDefault();
            event.stopPropagation();
            
            this.downIcon.src = '/static/icons/downfilled_brown.svg';
            console.log("VideoWidget8: DOWN key pressed");
            
            setTimeout(() => {
                this.downIcon.src = '/static/icons/down_brown.svg';
            }, 200);
        } else if (key === 'd') {
            event.preventDefault();
            event.stopPropagation();
            
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            console.log("VideoWidget8: NEXT key pressed");
            
            setTimeout(() => {
                this.nextIcon.src = '/static/icons/next.svg';
            }, 200);
        } else if (key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            
            if (this.video) {
                if (this.video.paused) {
                    this.video.play();
                    console.log("VideoWidget8: Video resumed with spacebar");
                } else {
                    this.video.pause();
                    console.log("VideoWidget8: Video paused with spacebar");
                }
            }
        } else if (key === 'r') {
            console.log("VideoWidget8: Reset key pressed - allowing main.js to handle");
            return;
        }
    }

    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class') {
                    
                    if (this.element.classList.contains('widget-active')) {
                        if (this.upIcon) this.upIcon.src = '/static/icons/up_brown.svg';
                        if (this.downIcon) this.downIcon.src = '/static/icons/down_brown.svg';
                        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';
                        
                        console.log("VideoWidget8 activated - starting politics_2 video");
                        
                        if (this.video && !this.hasPlayed) {
                            this.video.play().then(() => {
                                console.log("Politics_2 video started playing");
                                this.hasPlayed = true;
                            }).catch(error => {
                                console.error("Error playing politics_2 video:", error);
                            });
                        }
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

        if (this.video && !this.video.paused) {
            this.video.pause();
            this.video.currentTime = 0;
        }

        if (this.upIcon) this.upIcon.src = '/static/icons/up_brown.svg';
        if (this.downIcon) this.downIcon.src = '/static/icons/down_brown.svg';
        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';

        document.removeEventListener('keydown', this.handleKeyDown);
        
        console.log('VideoWidget8 deactivated');
    }
}
