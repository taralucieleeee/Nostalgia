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
                       class="absolute inset-0 w-full h-full object-contain z-0 video-transition video-fade-in"
                       preload="none"
                       muted
                       playsinline>
                    <source src="/static/videos/politics_3.mp4" type="video/mp4">
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
                
                if (currentSrc.includes('politics_3.mp4')) {
                    console.log('Politics_3 video ended, smoothly transitioning to VideoWidget5 (law_1.png)');
                    // Directly transition to VideoWidget5 (Widget 7) with smooth fade
                    setTimeout(() => {
                        this.smoothTransitionToLawWidgets();
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
        
        console.log("VideoWidget8: Key pressed:", key);
        
        // While politics_3 video is playing, only allow 'R' key (reset)
        if (!this.video.paused && !this.video.ended) {
            if (key === 'r') {
                // Allow reset functionality during video playback - let main.js handle it
                console.log("VideoWidget8: Reset key pressed during video playback - allowing main.js to handle");
                return;
            } else {
                // Block all other keys during video playback
                event.preventDefault();
                event.stopPropagation();
                console.log("VideoWidget8: Key blocked during video playback - only 'R' allowed");
                return;
            }
        }
        
        // Video is paused or ended - politics_3 video does not allow back navigation
        // The video automatically transitions to law carousel when it ends
        // Only allow space bar (play/pause) and 'R' (reset) when video is paused
        if (key === ' ') {
            // Space bar toggles play/pause (only when video is paused)
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
            // Allow reset functionality when video is paused/ended - let main.js handle it
            console.log("VideoWidget8: Reset key pressed while video paused/ended - allowing main.js to handle");
            return;
        }
    }

    // Method to ensure political background music continues playing
    ensurePoliticalMusicPlaying() {
        const politicalMusic = document.getElementById('politicalMusic');
        if (politicalMusic) {
            if (politicalMusic.paused) {
                politicalMusic.volume = 0.08;
                politicalMusic.play().then(() => {
                    console.log("VideoWidget8: Political background music resumed");
                }).catch(e => {
                    console.log("VideoWidget8: Political music playback failed:", e);
                });
            } else {
                // Ensure volume is correct even if already playing
                politicalMusic.volume = 0.08;
                console.log("VideoWidget8: Political background music confirmed playing");
            }
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
                            // Ensure political background music continues playing
                            this.ensurePoliticalMusicPlaying();
                            
                            // Unmute the video for audio playback
                            this.video.muted = false;
                            this.video.play().then(() => {
                                console.log("Politics_2 video started playing with audio");
                                this.hasPlayed = true;
                                
                                // Double-check political music is still playing after video starts
                                setTimeout(() => {
                                    this.ensurePoliticalMusicPlaying();
                                }, 500);
                            }).catch(error => {
                                console.error("Error playing politics_2 video:", error);
                                // Fallback: try muted first then unmute
                                this.video.muted = true;
                                this.video.play().then(() => {
                                    console.log("Muted politics_2 video started, unmuting after delay");
                                    setTimeout(() => {
                                        this.video.muted = false;
                                        console.log("Politics_2 video unmuted");
                                        // Ensure political music is still playing after unmute
                                        this.ensurePoliticalMusicPlaying();
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

    // Method to smoothly transition to VideoWidget5 (law_1.png)
    smoothTransitionToLawWidgets() {
        console.log("Starting smooth transition from politics_3 to VideoWidget5 (law_1.png)");
        
        // Step 1: Fade out current video
        this.video.classList.add('video-fade-out');
        
        // Step 2: After fade out completes, navigate to VideoWidget5
        setTimeout(() => {
            // Pause current video
            this.video.pause();
            this.video.currentTime = 0;
            
            console.log("Navigating to VideoWidget5 (law_1.png)");
            
            // Dispatch custom navigation event to VideoWidget5 (Widget 7)
            const navigationEvent = new CustomEvent('navigateToWidget', {
                detail: { targetWidget: 7 }
            });
            document.dispatchEvent(navigationEvent);
            
        }, 800); // Wait for fade-out transition to complete
    }

    deactivate() {
        console.log('VideoWidget8: Simple deactivation - muting video to prevent bleeding');
        
        if (this.observer) {
            this.observer.disconnect();
        }

        if (this.video) {
            // Simple approach: just mute and pause
            this.video.muted = true;
            this.video.pause();
            console.log('VideoWidget8: Video muted and paused');
        }

        // VideoWidget8 doesn't have footer buttons/icons to reset

        document.removeEventListener('keydown', this.handleKeyDown);
        
        console.log('VideoWidget8: Enhanced deactivation completed');
    }
}
