import { Widget } from './Widget.js';

export class VideoWidget10 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.video = null;
        this.hasPlayed = false;
        this.observer = null;
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
                console.log('Rising video playback completed');
                // No automatic navigation - wait for user to click NEXT
            });

            this.video.addEventListener('error', (e) => {
                console.error("Rising video playback error:", e);
                console.error("Video error code:", this.video.error ? this.video.error.code : 'unknown');
            });
        }

        // Set up keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown);
    }

    setupFooterListeners() {
        // Back button - navigate to VideoWidget5 (law_1.png)
        if (this.backBtn) {
            this.backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Change icon to provide visual feedback
                this.backIcon.src = '/static/icons/backfilled.svg';
                console.log("Back button clicked on VideoWidget10 - navigating to VideoWidget5 (law_1)");
                
                // Pause video if playing
                if (this.video && !this.video.paused) {
                    this.video.pause();
                }
                
                // Navigate to VideoWidget5 (Widget 7)
                setTimeout(() => {
                    window.location.href = '/?widget=7';
                }, 200);
            });

            // Add mouse events for visual feedback
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

        // Next button - play finalpart_4.mp4 then navigate to lastframe.png
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextIcon.src = '/static/icons/nextfilled.svg';
                
                console.log("Next button clicked on VideoWidget10 - switching to finalpart_4.mp4");
                
                this.switchToFinalVideo();
            });

            // Add mouse events for visual feedback
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
        
        if (key === 'a') {
            // BACK button functionality
            event.preventDefault();
            event.stopPropagation();
            
            // Change back icon to filled version
            this.backIcon.src = '/static/icons/backfilled.svg';
            
            console.log("VideoWidget10: BACK key pressed - navigating to VideoWidget5 (law_1)");
            
            // Pause video if playing
            if (this.video && !this.video.paused) {
                this.video.pause();
            }
            
            // Navigate to VideoWidget5 (Widget 7)
            setTimeout(() => {
                window.location.href = '/?widget=7';
            }, 200);
        } else if (key === 'd') {
            // NEXT button functionality
            event.preventDefault();
            event.stopPropagation();
            
            // Change next icon to filled version  
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            
            console.log("VideoWidget10: NEXT key pressed - switching to finalpart_4.mp4");
            
            this.switchToFinalVideo();
        } else if (key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            
            if (this.video) {
                if (this.video.paused) {
                    this.video.play();
                    console.log("VideoWidget10: Video resumed with spacebar");
                } else {
                    this.video.pause();
                    console.log("VideoWidget10: Video paused with spacebar");
                }
            }
        } else if (key === 'r') {
            console.log("VideoWidget10: Reset key pressed - allowing main.js to handle");
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
                    console.log("VideoWidget10: Political background music resumed");
                }).catch(e => {
                    console.log("VideoWidget10: Political music playback failed:", e);
                });
            } else {
                // Ensure volume is correct even if already playing
                politicalMusic.volume = 0.08;
                console.log("VideoWidget10: Political background music confirmed playing");
            }
        }
    }

    switchToFinalVideo() {
        // Pause current video
        this.video.pause();
        
        console.log("Switching from rising.mp4 to finalpart_4.mp4");
        
        // Update the video source
        const videoSource = this.video.querySelector('source');
        console.log("Current source before change:", videoSource.src);
        videoSource.src = '/static/videos/finalpart_4.mp4';
        console.log("New source after change:", videoSource.src);
        
        // Hide footer during finalpart_4 playback
        const footer = this.element.querySelector('.absolute.bottom-0');
        if (footer) {
            footer.style.display = 'none';
            console.log("Footer hidden for finalpart_4.mp4 playback");
        }
        
        // Update the video element to ensure autoplay
        this.video.autoplay = true;
        this.video.controls = false;
        this.video.muted = false;
        
        // Load the new source
        console.log("Loading finalpart_4 video source");
        this.video.load();
        
        // Reset playback state
        this.hasPlayed = false;
        
        // Set up new event handler for finalpart_4 end
        this.video.addEventListener('ended', () => {
            console.log('Finalpart_4 video ended, navigating to VideoWidget9 (lastframe.png)');
            // Navigate to VideoWidget9 (Widget 11) after finalpart_4.mp4 ends
            setTimeout(() => {
                window.location.href = '/?widget=11';
            }, 1000);
        }, { once: true }); // Use once: true to prevent multiple listeners
        
        // Ensure the video plays immediately after loading
        this.video.onloadeddata = () => {
            console.log("Finalpart_4 video data loaded, starting playback immediately");
            
            // Ensure political background music continues playing with finalpart_4
            this.ensurePoliticalMusicPlaying();
            
            this.video.play()
                .then(() => {
                    console.log("Finalpart_4 video started playing successfully");
                    // Double-check political music is still playing after video starts
                    setTimeout(() => {
                        this.ensurePoliticalMusicPlaying();
                    }, 500);
                })
                .catch(err => console.error("Error starting finalpart_4 video:", err));
        };
        
        // Add error handler for the new video
        this.video.onerror = () => {
            console.error("Error loading finalpart_4.mp4:", this.video.error);
        };
        
        // Start video with immediate play attempt
        setTimeout(() => {
            // Ensure political music is playing before starting finalpart_4
            this.ensurePoliticalMusicPlaying();
            
            this.video.play().catch(e => {
                console.warn("Immediate finalpart_4 playback failed, trying fallback:", e);
                // Fallback: try muted first then unmute quickly
                this.video.muted = true;
                this.video.play().then(() => {
                    console.log("Muted finalpart_4 video started, unmuting after delay");
                    setTimeout(() => {
                        this.video.muted = false;
                        console.log("Finalpart_4 video unmuted");
                        // Ensure political music is still playing after unmute
                        this.ensurePoliticalMusicPlaying();
                    }, 1000);
                }).catch(err => {
                    console.error("Failed to play finalpart_4 even with muted workaround:", err);
                });
            });
        }, 500);
    }

    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class') {
                    
                    if (this.element.classList.contains('widget-active')) {
                        // Reset button icons to default state
                        if (this.backIcon) this.backIcon.src = '/static/icons/back.svg';
                        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';
                        
                        // Show footer (in case it was hidden from finalpart_4 video)
                        const footer = this.element.querySelector('.absolute.bottom-0');
                        if (footer) {
                            console.log("Showing footer for rising video");
                            footer.style.display = 'flex';
                        }
                        
                        console.log("VideoWidget10 activated - starting rising video");
                        
                        if (this.video && !this.hasPlayed) {
                            // Reset video source to rising.mp4 if needed
                            const videoSource = this.video.querySelector('source');
                            if (!videoSource.src.includes('rising.mp4')) {
                                videoSource.src = '/static/videos/rising.mp4';
                                this.video.load();
                            }
                            
                            // Ensure political background music continues playing
                            this.ensurePoliticalMusicPlaying();
                            
                            // Unmute the video for audio playback
                            this.video.muted = false;
                            this.video.play().then(() => {
                                console.log("Rising video started playing with audio");
                                this.hasPlayed = true;
                                
                                // Double-check political music is still playing after video starts
                                setTimeout(() => {
                                    this.ensurePoliticalMusicPlaying();
                                }, 500);
                            }).catch(error => {
                                console.error("Error playing rising video:", error);
                                // Fallback: try muted first then unmute
                                this.video.muted = true;
                                this.video.play().then(() => {
                                    console.log("Muted rising video started, unmuting after delay");
                                    setTimeout(() => {
                                        this.video.muted = false;
                                        console.log("Rising video unmuted");
                                        // Ensure political music is still playing after unmute
                                        this.ensurePoliticalMusicPlaying();
                                    }, 1000);
                                }).catch(err => {
                                    console.error("Failed to play rising video even with muted workaround:", err);
                                });
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

        // Reset button icons to default state
        if (this.backIcon) this.backIcon.src = '/static/icons/back.svg';
        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';

        document.removeEventListener('keydown', this.handleKeyDown);
        
        console.log('VideoWidget10 deactivated');
    }
}
