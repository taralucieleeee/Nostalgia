import { Widget } from './Widget.js';

export class VideoWidget11 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.observer = null;
        this.hasPlayed = false;
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full bg-black">
                <video id="finalPartVideo" 
                       class="absolute inset-0 w-full h-full object-contain z-0"
                       preload="none"
                       playsinline>
                    <source src="/static/videos/finalpart_4.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                
                <!-- Footer Overlay with BACK button only (hidden during video playback) -->
                <div class="absolute bottom-0 left-0 right-0 flex-shrink-0 flex flex-row justify-center w-full px-8 py-12" style="background-color: #FFDCDC;">
                    <div class="flex items-center justify-center w-full max-w-6xl">
                        <!-- CENTER: BACK button -->
                        <a href="#" id="backBtn" class="inline-flex items-center gap-2 text-4xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            <img id="backIcon" src="/static/icons/back.svg" alt="Back" class="h-8 w-8">
                            BACK
                        </a>
                    </div>
                </div>
            </div>
        `;

        this.video = this.element.querySelector('#finalPartVideo');
        this.footer = this.element.querySelector('.absolute.bottom-0');
        this.backBtn = this.element.querySelector('#backBtn');
        this.backIcon = this.element.querySelector('#backIcon');

        this.setupVideoHandlers();
        this.setupFooterListeners();
        this.setupMutationObserver();
    }

    ensurePoliticalMusicPlaying() {
        const politicalMusic = document.getElementById('politicalMusic');
        if (politicalMusic) {
            if (politicalMusic.paused) {
                politicalMusic.volume = 0.08;
                politicalMusic.play().then(() => {
                    console.log("VideoWidget11: Political background music resumed");
                }).catch(e => {
                    console.log("VideoWidget11: Political music playback failed:", e);
                });
            } else {
                politicalMusic.volume = 0.08;
                console.log("VideoWidget11: Political background music confirmed playing");
            }
        }
    }

    setupVideoHandlers() {
        if (this.video) {
            this.video.addEventListener('loadedmetadata', () => {
                console.log('VideoWidget11: finalpart_4.mp4 metadata loaded');
                this.video.currentTime = 0;
            });

            this.video.addEventListener('canplaythrough', () => {
                console.log('VideoWidget11: finalpart_4.mp4 can play through');
            });

            this.video.addEventListener('ended', () => {
                console.log('VideoWidget11: finalpart_4.mp4 playback completed - navigating to lastframe.png');
                
                if (this.footer) {
                    this.footer.style.display = 'flex';
                }
                
                setTimeout(() => {
                    const navigationEvent = new CustomEvent('navigateToWidget', {
                        detail: { targetWidget: 11 }
                    });
                    document.dispatchEvent(navigationEvent);
                }, 500);
            });

            this.video.addEventListener('error', (e) => {
                console.error("VideoWidget11: finalpart_4.mp4 playback error:", e);
                console.error("Video error code:", this.video.error ? this.video.error.code : 'unknown');
            });

            this.video.addEventListener('play', () => {
                console.log('VideoWidget11: finalpart_4.mp4 started playing');
                if (this.footer) {
                    this.footer.style.display = 'none';
                }
            });

            this.video.addEventListener('pause', () => {
                console.log('VideoWidget11: finalpart_4.mp4 paused');
                if (this.footer) {
                    this.footer.style.display = 'flex';
                }
            });
        }

        document.addEventListener('keydown', this.handleKeyDown);
    }

    setupFooterListeners() {
        if (this.backBtn) {
            this.backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateWithFeedback('back', 12);
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
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        if (!this.element.classList.contains('widget-active')) {
            return;
        }
        
        const isVideoPlaying = this.video && !this.video.paused && !this.video.ended;
        
        if (isVideoPlaying) {
            if (key === 'r') {
                console.log("VideoWidget11: Reset key pressed during finalpart_4 playback - allowing main.js to handle");
                return;
            } else {
                console.log(`VideoWidget11: Key ${key} ignored during finalpart_4 playback`);
                event.preventDefault();
                event.stopPropagation();
                return;
            }
        }
        
        if (key === 'a' || key === 'arrowleft') {
            event.preventDefault();
            event.stopPropagation();
            this.navigateWithFeedback('back', 12);
        } else if (key === 'r') {
            console.log("VideoWidget11: Reset key pressed while video paused/ended - allowing main.js to handle");
            return;
        }
    }

    navigateWithFeedback(direction, targetWidget) {
        console.log(`VideoWidget11: Navigating ${direction} to widget ${targetWidget}`);
        
        if (direction === 'back' && this.backIcon) {
            this.backIcon.src = '/static/icons/backfilled.svg';
            setTimeout(() => {
                if (this.backIcon) {
                    this.backIcon.src = '/static/icons/back.svg';
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
                        
                        if (this.footer) {
                            this.footer.style.display = 'flex';
                        }
                        
                        console.log("VideoWidget11 activated - starting finalpart_4.mp4 with political music");
                        
                        this.ensurePoliticalMusicPlaying();
                        
                        if (this.video && !this.hasPlayed) {
                            this.startVideo();
                        }
                    } else {
                        if (this.video) {
                            this.video.pause();
                            this.video.currentTime = 0;
                        }
                        console.log("VideoWidget11 deactivated");
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
        
        console.log('VideoWidget11: Starting finalpart_4.mp4 video with political background music');
        
        this.ensurePoliticalMusicPlaying();
        
        this.video.muted = false;
        this.video.volume = 0.8;
        
        const source = this.video.querySelector('source');
        if (source) {
            source.src = '/static/videos/finalpart_4.mp4';
        }
        
        this.video.load();
        
        this.video.addEventListener('canplay', () => {
            this.video.play().then(() => {
                console.log('VideoWidget11: finalpart_4.mp4 started playing successfully with audio and political music');
                this.hasPlayed = true;
                
                setTimeout(() => {
                    this.ensurePoliticalMusicPlaying();
                }, 1000);
            }).catch(error => {
                console.error('VideoWidget11: Error playing finalpart_4.mp4:', error);
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
        
        console.log("VideoWidget11 deactivated and cleaned up");
    }

    activate() {
        if (!this.observer) {
            this.setupMutationObserver();
        }
        
        this.hasPlayed = false;
        
        if (this.video) {
            this.video.currentTime = 0;
            this.video.muted = true;
            console.log('VideoWidget11 activate() - Reset finalpart_4.mp4 to initial state');
        }
        
        if (this.footer) {
            this.footer.style.display = 'flex';
        }
        
        this.ensurePoliticalMusicPlaying();
        
        document.addEventListener('keydown', this.handleKeyDown);
    }

    destroy() {
        this.deactivate();
        if (super.destroy) {
            super.destroy();
        }
    }
}
