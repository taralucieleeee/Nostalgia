import { Widget } from './Widget.js';

export class VideoWidget3 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.observer = null;
        this.hasPlayed = false;
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <video id="mainVideo3" class="w-full h-full object-cover video-transition video-fade-in" preload="none" muted playsinline>
                    <source id="videoSource" src="/static/videos/archbridge_agree.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                
                <!-- Footer Overlay - Smaller Height -->
                <div class="absolute bottom-0 left-0 right-0 flex-shrink-0 flex flex-row justify-center w-full px-8 py-6" style="background-color: #FFDCDC;">
                    <div class="flex items-center justify-between w-full max-w-6xl">
                        <a href="#" id="backBtn" class="inline-flex items-center gap-2 text-3xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            <img id="backIcon" src="/static/icons/back.svg" alt="Back" class="h-6 w-6">
                            BACK
                        </a>
                        <a href="#" id="nextBtn" class="inline-flex items-center gap-2 text-3xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            NEXT
                            <img id="nextIcon" src="/static/icons/next.svg" alt="Next" class="h-6 w-6">
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Force video path to be correct
        const videoSource = this.element.querySelector('#videoSource');
        videoSource.src = '/static/videos/archbridge_agree.mp4';  // Added leading slash

        // Get references to elements
        this.video = this.element.querySelector('#mainVideo3');
        this.backBtn = this.element.querySelector('#backBtn');
        this.nextBtn = this.element.querySelector('#nextBtn');
        this.backIcon = this.element.querySelector('#backIcon');
        this.nextIcon = this.element.querySelector('#nextIcon');

        // Set up event listeners
        this.setupVideoListeners();
        this.setupFooterListeners();
        this.setupMutationObserver();
    }

    setupVideoListeners() {
        // When video ends, no automatic redirect
        this.video.addEventListener('ended', () => {
            console.log("Video playback completed");
            
            // Get the current source
            const videoSource = this.element.querySelector('#videoSource');
            const currentSrc = videoSource.src;
            console.log("Current video source that ended:", currentSrc);
            
            if (currentSrc.includes('archbridge_agree.mp4')) {
                console.log('Archbridge video ended, no automatic action');
            } else if (currentSrc.includes('secondpart.mp4')) {
                console.log('Secondpart video ended, smoothly transitioning to politics_1 (VideoWidget4)');
                // Directly transition to VideoWidget4 (politics_1.mp4) after secondpart.mp4 ends
                setTimeout(() => {
                    this.smoothTransitionToNextWidget();
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
                videoSource.src = '/static/videos/archbridge_agree.mp4';  // Added leading slash
                this.video.load();
                this.forcedStartVideo();
            }
        });
        
        // Add listeners for debugging video loading
        this.video.addEventListener('loadstart', () => console.log('Video3: loadstart'));
        this.video.addEventListener('durationchange', () => console.log('Video3: durationchange'));
        this.video.addEventListener('loadedmetadata', () => console.log('Video3: loadedmetadata'));
        this.video.addEventListener('loadeddata', () => console.log('Video3: loadeddata'));
        this.video.addEventListener('canplay', () => console.log('Video3: canplay'));
        this.video.addEventListener('canplaythrough', () => console.log('Video3: canplaythrough'));
        this.video.addEventListener('stalled', () => console.warn('Video3: stalled'));
        this.video.addEventListener('suspend', () => console.log('Video3: suspend'));
        this.video.addEventListener('play', () => console.log('Video3: play started'));
        this.video.addEventListener('playing', () => console.log('Video3: now playing'));
        this.video.addEventListener('waiting', () => console.warn('Video3: waiting for more data'));
    }

    setupFooterListeners() {
        // Back button - redirect to vote2.html with 1 second visual feedback
        this.backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Change icon to provide visual feedback
            this.backIcon.src = '/static/icons/backfilled.svg';
            console.log("Navigating back to vote2.html with 1 second visual feedback");
            
            // Prevent any other widgets from being shown during transition
            document.body.style.pointerEvents = 'none'; // Prevent further clicks
            
            // Stop video playback immediately
            if (this.video) {
                this.video.pause();
                this.video.src = ''; // Clear source to prevent any further loading
            }
            
            // Wait 1 second showing the filled icon, then navigate
            setTimeout(() => {
                window.location.href = '/vote2.html';
            }, 1000);
        });

        // Next button - switch to secondpart.mp4
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            
            // Switch to secondpart.mp4 video
            this.switchToSecondVideo();
        });

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown);
    }
    
    // Method to switch to the second video with smooth transition
    switchToSecondVideo() {
        console.log("Starting smooth transition to secondpart.mp4");
        
        // Step 1: Fade out current video
        this.video.classList.add('video-fade-out');
        
        // Step 2: After fade out completes, switch video source
        setTimeout(() => {
            // Pause current video
            this.video.pause();
            
            console.log("Switching to secondpart.mp4");
            
            // Update the video source
            const videoSource = this.element.querySelector('#videoSource');
            console.log("Current source before change:", videoSource.src);
            videoSource.src = '/static/videos/secondpart.mp4';
            console.log("New source after change:", videoSource.src);
            
            // Hide the footer for secondpart video
            const footer = this.element.querySelector('.absolute.bottom-0');
            if (footer) {
                console.log("Hiding footer for secondpart video");
                footer.style.display = 'none';
            }
            
            // Update the video element settings
            this.video.autoplay = true;
            this.video.controls = false;
            this.video.muted = false;
            
            // Load the new source
            console.log("Loading new video source");
            this.video.load();
            
            // Reset playback state
            this.hasPlayed = false;
            
            // Step 3: When new video is ready, fade it back in
            this.video.onloadeddata = () => {
                console.log("Secondpart video data loaded, fading in and starting playback");
                
                // Remove fade-out and add fade-in
                this.video.classList.remove('video-fade-out');
                this.video.classList.add('video-fade-in');
                
                // Start playing the new video
                this.video.play()
                    .then(() => console.log("Secondpart video started playing successfully with fade-in"))
                    .catch(err => console.error("Error starting secondpart video:", err));
            };
            
            // Add error handler
            this.video.onerror = () => {
                console.error("Error loading secondpart.mp4:", this.video.error);
                // If error, still fade back in to show something
                this.video.classList.remove('video-fade-out');
                this.video.classList.add('video-fade-in');
            };
            
            // Fallback: Start video with forcedStartVideo method
            this.forcedStartVideo();
            
        }, 800); // Wait for fade-out transition to complete (matching CSS duration)
    }

    // Method to smoothly transition to VideoWidget4 (politics_1.mp4)
    smoothTransitionToNextWidget() {
        console.log("Starting smooth transition from secondpart to VideoWidget4 (politics_1)");
        
        // Step 1: Fade out current video
        this.video.classList.add('video-fade-out');
        
        // Step 2: After fade out completes, navigate to VideoWidget4
        setTimeout(() => {
            // Pause current video
            this.video.pause();
            this.video.currentTime = 0;
            
            console.log("Navigating to VideoWidget4 (politics_1.mp4)");
            
            // Dispatch custom navigation event to VideoWidget4 (Widget 6)
            const navigationEvent = new CustomEvent('navigateToWidget', {
                detail: { targetWidget: 6 }
            });
            document.dispatchEvent(navigationEvent);
            
        }, 800); // Wait for fade-out transition to complete
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        // Only handle keys when this widget is active
        if (!this.element.classList.contains('widget-active')) {
            console.log("VideoWidget3: Not active, ignoring key press");
            return;
        }
        
        console.log("VideoWidget3: Key pressed:", key);
        
        if (key === 'a' && this.backIcon) {
            // Change back icon to filled version
            this.backIcon.src = '/static/icons/backfilled.svg';
            
            console.log("Keyboard navigation: going back to vote2.html with 1 second visual feedback");
            
            // Prevent any other widgets from being shown
            document.body.style.pointerEvents = 'none';
            
            // Stop video playback immediately
            if (this.video) {
                this.video.pause();
                this.video.src = ''; // Clear source to prevent any further loading
            }
            
            // Wait 1 second showing the filled icon, then navigate
            setTimeout(() => {
                window.location.href = '/vote2.html';
            }, 1000);
        } else if (key === 'd' && this.nextIcon) {
            // Prevent any event propagation
            event.preventDefault();
            event.stopPropagation();
            
            console.log("VideoWidget3: D key pressed, switching to secondpart video");
            
            // Change next icon to filled version  
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            
            // Switch to the secondpart.mp4 video
            this.switchToSecondVideo();
        } else if (key === ' ') {
            // Space bar toggles play/pause
            if (this.video.paused) {
                this.video.play();
            } else {
                this.video.pause();
            }
        }
    }

    setupMutationObserver() {
        // Watch for when this widget becomes active
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class') {
                    
                    if (this.element.classList.contains('widget-active')) {
                        // Reset next/back buttons to default state
                        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';
                        if (this.backIcon) this.backIcon.src = '/static/icons/back.svg';
                        
                        // Show the footer (in case it was hidden from secondpart video)
                        const footer = this.element.querySelector('.absolute.bottom-0');
                        if (footer) {
                            console.log("Showing footer for archbridge video");
                            footer.style.display = 'flex';
                        }
                        
                        // Ensure the correct video source is set
                        const videoSource = this.element.querySelector('#videoSource');
                        if (videoSource) {
                            // Always start with archbridge video, never presentmoods on activation
                            if (!videoSource.src.includes('archbridge_agree.mp4')) {
                                console.log('Resetting VideoWidget3 to archbridge video on activation');
                                videoSource.src = '/static/videos/archbridge_agree.mp4';
                                this.video.load();
                            }
                        }
                        
                        // Start video if it hasn't played yet
                        if (!this.hasPlayed) {
                            this.forcedStartVideo(); // Use forcedStartVideo instead
                            this.hasPlayed = true;
                        }
                    }
                }
            });
        });

        this.observer.observe(this.element, { attributes: true });
    }

    startVideoWithDelay() {
        // Reset video
        this.video.currentTime = 0;
        this.video.muted = true;
        
        console.log(`Starting video with delay: ${this.video.querySelector('source').src}`);
        console.log(`Initial readyState: ${this.video.readyState}`);
        
        // Check if video has buffered enough data
        const checkBuffer = () => {
            console.log(`Checking buffer, readyState: ${this.video.readyState}`);
            
            if (this.video.readyState >= 3) {  // HAVE_FUTURE_DATA or higher
                console.log("Video has enough data buffered, starting playback in 2 seconds");
                
                // Buffer for 2 seconds, then play with audio
                setTimeout(() => {
                    this.video.muted = false;
                    console.log("Starting video playback with audio");
                    
                    this.video.play().catch(e => {
                        console.error('Video playback failed:', e);
                        // Fallback to muted playback if audio fails
                        this.video.muted = true;
                        this.video.play().catch(e => console.error('Muted playback also failed:', e));
                    });
                }, 2000);
            } else {
                // Check again in 200ms
                console.log("Not enough data buffered yet, checking again in 200ms");
                setTimeout(checkBuffer, 200);
            }
        };
        
        checkBuffer();
    }

    deactivate() {
        if (this.video) {
            this.video.pause();
            this.video.currentTime = 0;
            
            // Reset video source to default archbridge video to prevent secondpart from bleeding
            const videoSource = this.element.querySelector('#videoSource');
            if (videoSource) {
                videoSource.src = '/static/videos/archbridge_agree.mp4';
                this.video.load();
                console.log('VideoWidget3 deactivated - reset to archbridge video');
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
    
    // New method for forcing video playback with minimal delay
    forcedStartVideo() {
        console.log("Force starting video playback");
        
        // Make sure video element is properly configured
        this.video.muted = false;
        this.video.autoplay = true;
        this.video.controls = false;
        
        // Make sure we have the right source
        const videoSource = this.element.querySelector('#videoSource');
        console.log(`Current video source in forcedStartVideo: ${videoSource.src}`);
        
        // Try to play immediately (might be blocked by browser)
        this.video.play().then(() => {
            console.log("Video started playing immediately");
        }).catch(e => {
            console.warn("Immediate playback failed, trying with user interaction simulation:", e);
            
            // Try a different approach - play muted first then unmute
            this.video.muted = true;
            
            // Create a promise that resolves when the video starts playing
            const playPromise = this.video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Muted video started, unmuting after delay");
                    // Video is playing muted, wait a moment then unmute
                    setTimeout(() => {
                        this.video.muted = false;
                        console.log("Video unmuted");
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
                console.log("Video confirmed playing after 1s");
            }
        }, 1000);
    }
}
