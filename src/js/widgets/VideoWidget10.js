import { Widget } from './Widget.js';

export class VideoWidget10 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.observer = null;
        this.hasPlayed = false;
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full bg-black">
                <video id="risingVideo" 
                       class="absolute inset-0 w-full h-full object-contain z-0"
                       preload="none"
                       muted
                       playsinline>
                    <source src="/static/videos/rising.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                
                <!-- Footer Overlay with BACK/NEXT buttons -->
                <div class="absolute bottom-0 left-0 right-0 flex-shrink-0 flex flex-row justify-center w-full px-8 py-12" style="background-color: #FFDCDC;">
                    <div class="flex items-center justify-between w-full max-w-6xl">
                        <!-- LEFT: BACK button -->
                        <a href="#" id="backBtn" class="inline-flex items-center gap-2 text-4xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            <img id="backIcon" src="/static/icons/back.svg" alt="Back" class="h-8 w-8">
                            BACK
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

        this.video = this.element.querySelector('#risingVideo');
        this.footer = this.element.querySelector('.absolute.bottom-0');
        this.backBtn = this.element.querySelector('#backBtn');
        this.nextBtn = this.element.querySelector('#nextBtn');
        this.backIcon = this.element.querySelector('#backIcon');
        this.nextIcon = this.element.querySelector('#nextIcon');

        this.setupVideoHandlers();
        this.setupFooterListeners();
        this.setupMutationObserver();
    }

    setupVideoHandlers() {
        if (this.video) {
            this.video.addEventListener('ended', () => {
                console.log('VideoWidget10: Rising video playback completed');
            });

            this.video.addEventListener('error', (e) => {
                console.error("VideoWidget10: Rising video playback error:", e);
            });
        }

        document.addEventListener('keydown', this.handleKeyDown);
    }

    setupFooterListeners() {
        if (this.backBtn) {
            this.backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateWithFeedback('back', 7);
            });

            this.backBtn.addEventListener('mousedown', () => {
                if (this.backIcon) {
                    this.backIcon.src = '/static/icons/backfilled.svg';
                }
            });

            this.backBtn.addEventListener('mouseup', () => {
                if (this.backIcon) {
                    this.backIcon.src = '/static/icons/back.svg';
                }
            });

            this.backBtn.addEventListener('mouseleave', () => {
                if (this.backIcon) {
                    this.backIcon.src = '/static/icons/back.svg';
                }
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateWithFeedback('next', 13);
            });

            this.nextBtn.addEventListener('mousedown', () => {
                if (this.nextIcon) {
                    this.nextIcon.src = '/static/icons/nextfilled.svg';
                }
            });

            this.nextBtn.addEventListener('mouseup', () => {
                if (this.nextIcon) {
                    this.nextIcon.src = '/static/icons/next.svg';
                }
            });

            this.nextBtn.addEventListener('mouseleave', () => {
                if (this.nextIcon) {
                    this.nextIcon.src = '/static/icons/next.svg';
                }
            });
        }
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        if (!this.element.classList.contains('widget-active')) {
            return;
        }
        
        const isVideoPlaying = this.video && !this.video.paused && !this.video.ended;
        
        if (isVideoPlaying && key !== 'r') {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        
        if (key === 'a' || key === 'arrowleft') {
            event.preventDefault();
            event.stopPropagation();
            this.navigateWithFeedback('back', 7);
        } else if (key === 'd' || key === 'arrowright') {
            event.preventDefault();
            event.stopPropagation();
            this.navigateWithFeedback('next', 13);
        } else if (key === ' ' && this.video) {
            event.preventDefault();
            event.stopPropagation();
            if (this.video.paused) {
                this.video.play();
            } else {
                this.video.pause();
            }
        }
    }

    navigateWithFeedback(direction, targetWidget) {
        if (direction === 'back' && this.backIcon) {
            this.backIcon.src = '/static/icons/backfilled.svg';
            setTimeout(() => {
                if (this.backIcon) {
                    this.backIcon.src = '/static/icons/back.svg';
                }
            }, 150);
        } else if (direction === 'next' && this.nextIcon) {
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            setTimeout(() => {
                if (this.nextIcon) {
                    this.nextIcon.src = '/static/icons/next.svg';
                }
            }, 150);
        }
        
        const navigationEvent = new CustomEvent('navigateToWidget', {
            detail: { targetWidget }
        });
        document.dispatchEvent(navigationEvent);
    }

    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class') {
                    
                    if (this.element.classList.contains('widget-active')) {
                        if (this.backIcon) this.backIcon.src = '/static/icons/back.svg';
                        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';
                        
                        if (this.footer) {
                            this.footer.style.display = 'flex';
                        }
                        
                        console.log("VideoWidget10 activated - starting rising.mp4");
                        
                        if (this.video && !this.hasPlayed) {
                            this.startVideo();
                        }
                    } else {
                        if (this.video) {
                            this.video.pause();
                            this.video.currentTime = 0;
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

    startVideo() {
        if (!this.video) return;
        
        this.video.muted = true;
        
        const source = this.video.querySelector('source');
        if (source) {
            source.src = '/static/videos/rising.mp4';
        }
        
        this.video.load();
        
        this.video.addEventListener('canplay', () => {
            this.video.play().then(() => {
                console.log('VideoWidget10: rising.mp4 started playing');
                this.hasPlayed = true;
            }).catch(error => {
                console.error('VideoWidget10: Error playing rising.mp4:', error);
            });
        }, { once: true });
    }

    deactivate() {
        if (this.video) {
            this.video.pause();
            this.video.currentTime = 0;
            this.video.muted = true;
        }
        
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    activate() {
        if (!this.observer) {
            this.setupMutationObserver();
        }
        
        this.hasPlayed = false;
        
        if (this.video) {
            this.video.currentTime = 0;
            this.video.muted = true;
        }
        
        if (this.footer) {
            this.footer.style.display = 'flex';
        }
        
        document.addEventListener('keydown', this.handleKeyDown);
    }

    destroy() {
        this.deactivate();
        if (super.destroy) {
            super.destroy();
        }
    }
}
