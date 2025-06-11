import { Widget } from './Widget.js';

export class VideoWidget4 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.observer = null;
        this.hasPlayed = false;
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <video id="mainVideo4" class="w-full h-full object-cover" preload="none" muted playsinline>
                    <source id="videoSource" src="/static/videos/politics_1.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                
                <!-- Footer Hidden for politics_1 video -->
            </div>
        `;
        
        // Force video path to be correct
        const videoSource = this.element.querySelector('#videoSource');
        videoSource.src = '/static/videos/politics_1.mp4';

        // Get references to elements
        this.video = this.element.querySelector('#mainVideo4');
        // Footer elements are hidden for politics_1 video
        this.backBtn = null;
        this.nextBtn = null;
        this.backIcon = null;
        this.nextIcon = null;

        // Set up event listeners
        this.setupVideoListeners();
        this.setupFooterListeners();
        this.setupMutationObserver();
    }

    setupVideoListeners() {
        // When video ends
        this.video.addEventListener('ended', () => {
            console.log("Politics_1 video playback completed");
            
            // Get the current source
            const videoSource = this.element.querySelector('#videoSource');
            const currentSrc = videoSource.src;
            console.log("Current video source that ended:", currentSrc);
            
            if (currentSrc.includes('politics_1.mp4')) {
                console.log('Politics_1 video ended, navigating to Widget 10 (politics_2 video)');
                
                // Navigate to Widget 10 (VideoWidget8) to play politics_2.mp4
                setTimeout(() => {
                    window.location.href = '/?widget=10';
                }, 1000);
            }
        });
        
        // Add error handling for video
        this.video.addEventListener('error', (e) => {
            console.error("Video playback error:", e);
            console.error("Video error code:", this.video.error ? this.video.error.code : 'unknown');
            
            // Try to reload the video with the correct source
            const videoSource = this.element.querySelector('#videoSource');
            if (videoSource) {
                console.log("Attempting to reload video due to error");
                videoSource.src = '/static/videos/politics_1.mp4';
                this.video.load();
                this.forcedStartVideo();
            }
        });
        
        // Add listeners for debugging video loading
        this.video.addEventListener('loadstart', () => console.log('Video4: loadstart'));
        this.video.addEventListener('durationchange', () => console.log('Video4: durationchange'));
        this.video.addEventListener('loadedmetadata', () => console.log('Video4: loadedmetadata'));
        this.video.addEventListener('loadeddata', () => console.log('Video4: loadeddata'));
        this.video.addEventListener('canplay', () => console.log('Video4: canplay'));
        this.video.addEventListener('canplaythrough', () => console.log('Video4: canplaythrough'));
        this.video.addEventListener('stalled', () => console.warn('Video4: stalled'));
        this.video.addEventListener('suspend', () => console.log('Video4: suspend'));
        this.video.addEventListener('play', () => console.log('Video4: play started'));
        this.video.addEventListener('playing', () => console.log('Video4: now playing'));
        this.video.addEventListener('waiting', () => console.warn('Video4: waiting for more data'));
    }

    setupFooterListeners() {
        // No footer buttons for politics_1 video - only keyboard navigation
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        // Only handle keys when this widget is active
        if (!this.element.classList.contains('widget-active')) {
            console.log("VideoWidget4: Not active, ignoring key press");
            return;
        }
        
        console.log("VideoWidget4: Key pressed:", key);
        
        // While politics_1 video is playing, only allow 'R' key (reset)
        if (!this.video.paused && !this.video.ended) {
            if (key === 'r') {
                // Allow reset functionality during video playback - let main.js handle it
                console.log("VideoWidget4: Reset key pressed during video playback - allowing main.js to handle");
                return;
            } else {
                // Block all other keys during video playback
                event.preventDefault();
                event.stopPropagation();
                console.log("VideoWidget4: Key blocked during video playback - only 'R' allowed");
                return;
            }
        }
        
        // Video is paused or ended - allow normal navigation
        if (key === 'a') {
            // Prevent any event propagation
            event.preventDefault();
            event.stopPropagation();
            
            console.log("VideoWidget4: Keyboard navigation - going back to Widget 5");
            
            // Prevent any other widgets from being shown
            document.body.style.pointerEvents = 'none';
            
            // Stop video playback immediately
            if (this.video) {
                this.video.pause();
                this.video.src = '';
            }
            
            // Navigate back to Widget 5
            setTimeout(() => {
                window.location.href = '/?widget=5';
            }, 500);
        } else if (key === 'd') {
            // Prevent any event propagation
            event.preventDefault();
            event.stopPropagation();
            
            console.log("VideoWidget4: D key pressed - future navigation");
            // Add future navigation logic here
        } else if (key === ' ') {
            // Space bar toggles play/pause
            event.preventDefault();
            if (this.video.paused) {
                this.video.play();
            } else {
                this.video.pause();
            }
        } else if (key === 'r') {
            // Allow reset functionality when video is paused/ended - let main.js handle it
            console.log("VideoWidget4: Reset key pressed while video paused/ended - allowing main.js to handle");
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
                        // No footer elements for politics_1 video
                        
                        // Ensure the correct video source is set
                        const videoSource = this.element.querySelector('#videoSource');
                        if (videoSource) {
                            if (!videoSource.src.includes('politics_1.mp4')) {
                                console.log('Resetting VideoWidget4 to politics_1 video on activation');
                                videoSource.src = '/static/videos/politics_1.mp4';
                                this.video.load();
                            }
                        }
                        
                        // Start video if it hasn't played yet
                        if (!this.hasPlayed) {
                            this.forcedStartVideo();
                            this.hasPlayed = true;
                        }
                    }
                }
            });
        });

        this.observer.observe(this.element, { attributes: true });
    }

    deactivate() {
        if (this.video) {
            this.video.pause();
            this.video.currentTime = 0;
            
            // Reset video source to default
            const videoSource = this.element.querySelector('#videoSource');
            if (videoSource) {
                videoSource.src = '/static/videos/politics_1.mp4';
                this.video.load();
                console.log('VideoWidget4 deactivated - reset to politics_1 video');
            }
        }
        
        if (this.observer) {
            this.observer.disconnect();
        }

        // Reset button icons to default state
        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';
        if (this.backIcon) this.backIcon.src = '/static/icons/back.svg';

        // Remove keyboard event listener
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Reset hasPlayed flag so video can play again when reactivated
        this.hasPlayed = false;
    }
    
    // Method for forcing video playback with minimal delay
    forcedStartVideo() {
        console.log("Force starting politics_1 video playback");
        
        // Make sure video element is properly configured
        this.video.muted = false;
        this.video.autoplay = true;
        this.video.controls = false;
        
        // Make sure we have the right source
        const videoSource = this.element.querySelector('#videoSource');
        console.log(`Current video source in forcedStartVideo: ${videoSource.src}`);
        
        // Try to play immediately (might be blocked by browser)
        this.video.play().then(() => {
            console.log("Politics_1 video started playing immediately");
        }).catch(e => {
            console.warn("Immediate playback failed, trying with fallback approach:", e);
            
            // Fallback: try muted first then unmute quickly
            this.video.muted = true;
            
            const playPromise = this.video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Muted politics_1 video started, unmuting after delay");
                    setTimeout(() => {
                        this.video.muted = false;
                        console.log("Politics_1 video unmuted");
                    }, 1000);
                }).catch(err => {
                    console.error("Failed to play even with muted workaround:", err);
                    
                    // Last resort: try reloading and playing again
                    console.log("Trying one last approach - reload and play");
                    this.video.load();
                    setTimeout(() => {
                        this.video.play().catch(finalErr => {
                            console.error("All playback attempts failed:", finalErr);
                        });
                    }, 500);
                });
            }
        });
        
        // Double check video is actually playing after a delay
        setTimeout(() => {
            if (this.video.paused) {
                console.log("Video still paused after 1s, trying to play again");
                this.video.play().catch(err => console.error("Final play attempt failed:", err));
            } else {
                console.log("Politics_1 video confirmed playing after 1s");
            }
        }, 1000);
    }
}