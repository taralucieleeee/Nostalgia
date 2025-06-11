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
            </div>
        `;

        this.video = this.element.querySelector('#mainVideo');

        this.setupVideoHandlers();
        this.setupMutationObserver();
    }

    setupVideoHandlers() {
        if (this.video) {
            this.video.addEventListener('ended', () => {
                console.log('Video playback completed');
                
                // Get the current source
                const videoSource = this.video.querySelector('source');
                const currentSrc = videoSource.src;
                console.log("Current video source that ended:", currentSrc);
                
                if (currentSrc.includes('politics_2.mp4')) {
                    console.log('Politics_2 video ended, switching to politics_3.mp4');
                    // Switch to politics_3.mp4
                    this.switchToPolitics3Video();
                } else if (currentSrc.includes('politics_3.mp4')) {
                    console.log('Politics_3 video ended, switching to retrolaws.mp4');
                    // Switch to retrolaws.mp4
                    this.switchToRetrolawsVideo();
                } else if (currentSrc.includes('retrolaws.mp4')) {
                    console.log('Retrolaws video ended, navigating to VideoWidget5 (law_1.png)');
                    // Navigate to VideoWidget5 (Widget 7) - law images sequence
                    setTimeout(() => {
                        window.location.href = '/?widget=7';
                    }, 1000);
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
        
        if (key === 'w' || key === 'arrowup') {
            event.preventDefault();
            event.stopPropagation();
            
            console.log("VideoWidget8: UP key pressed - navigating back to Widget 9");
            
            if (this.video && !this.video.paused) {
                this.video.pause();
            }
            
            setTimeout(() => {
                window.location.href = '/?widget=9';
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
                            // Unmute the video for audio playback
                            this.video.muted = false;
                            this.video.play().then(() => {
                                console.log("Politics_2 video started playing with audio");
                                this.hasPlayed = true;
                            }).catch(error => {
                                console.error("Error playing politics_2 video:", error);
                                // Fallback: try muted first then unmute
                                this.video.muted = true;
                                this.video.play().then(() => {
                                    console.log("Muted politics_2 video started, unmuting after delay");
                                    setTimeout(() => {
                                        this.video.muted = false;
                                        console.log("Politics_2 video unmuted");
                                    }, 1000);
                                }).catch(err => {
                                    console.error("Failed to play politics_2 even with muted workaround:", err);
                                });
                            });
                        }
                    }
                }
            });
        });

        this.observer.observe(this.element, { attributes: true });
    }

    // Method to switch from politics_2.mp4 to politics_3.mp4
    switchToPolitics3Video() {
        // Pause current video
        this.video.pause();
        
        console.log("Switching from politics_2.mp4 to politics_3.mp4");
        
        // Update the video source
        const videoSource = this.video.querySelector('source');
        console.log("Current source before change:", videoSource.src);
        videoSource.src = '/static/videos/politics_3.mp4';
        console.log("New source after change:", videoSource.src);
        
        // Update the video element to ensure autoplay
        this.video.autoplay = true;
        this.video.controls = false;
        this.video.muted = false; // Ensure it's not muted
        
        // Load the new source
        console.log("Loading politics_3 video source");
        this.video.load();
        
        // Reset playback state
        this.hasPlayed = false;
        
        // Ensure the video plays immediately after loading
        this.video.onloadeddata = () => {
            console.log("Politics_3 video data loaded, starting playback immediately");
            this.video.play()
                .then(() => console.log("Politics_3 video started playing successfully"))
                .catch(err => console.error("Error starting politics_3 video:", err));
        };
        
        // Add error handler for the new video
        this.video.onerror = () => {
            console.error("Error loading politics_3.mp4:", this.video.error);
        };
        
        // Start video with immediate play attempt
        setTimeout(() => {
            this.video.play().catch(e => {
                console.warn("Immediate politics_3 playback failed, trying fallback:", e);
                // Fallback: try muted first then unmute quickly
                this.video.muted = true;
                this.video.play().then(() => {
                    console.log("Muted politics_3 video started, unmuting after delay");
                    setTimeout(() => {
                        this.video.muted = false;
                        console.log("Politics_3 video unmuted");
                    }, 1000);
                }).catch(err => {
                    console.error("Failed to play politics_3 even with muted workaround:", err);
                });
            });
        }, 500);
    }

    // Method to switch from politics_3.mp4 to retrolaws.mp4
    switchToRetrolawsVideo() {
        // Pause current video
        this.video.pause();
        
        console.log("Switching from politics_3.mp4 to retrolaws.mp4");
        
        // Update the video source
        const videoSource = this.video.querySelector('source');
        console.log("Current source before change:", videoSource.src);
        videoSource.src = '/static/videos/retrolaws.mp4';
        console.log("New source after change:", videoSource.src);
        
        // Update the video element to ensure autoplay
        this.video.autoplay = true;
        this.video.controls = false;
        this.video.muted = false; // Ensure it's not muted
        
        // Load the new source
        console.log("Loading retrolaws video source");
        this.video.load();
        
        // Reset playback state
        this.hasPlayed = false;
        
        // Ensure the video plays immediately after loading
        this.video.onloadeddata = () => {
            console.log("Retrolaws video data loaded, starting playback immediately");
            this.video.play()
                .then(() => console.log("Retrolaws video started playing successfully"))
                .catch(err => console.error("Error starting retrolaws video:", err));
        };
        
        // Add error handler for the new video
        this.video.onerror = () => {
            console.error("Error loading retrolaws.mp4:", this.video.error);
        };
        
        // Start video with immediate play attempt
        setTimeout(() => {
            this.video.play().catch(e => {
                console.warn("Immediate retrolaws playback failed, trying fallback:", e);
                // Fallback: try muted first then unmute quickly
                this.video.muted = true;
                this.video.play().then(() => {
                    console.log("Muted retrolaws video started, unmuting after delay");
                    setTimeout(() => {
                        this.video.muted = false;
                        console.log("Retrolaws video unmuted");
                    }, 1000);
                }).catch(err => {
                    console.error("Failed to play retrolaws even with muted workaround:", err);
                });
            });
        }, 500);
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
