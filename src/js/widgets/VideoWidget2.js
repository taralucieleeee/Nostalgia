import { Widget } from './Widget.js';

export class VideoWidget2 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.observer = null;
        this.hasPlayed = false;
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <img id="mainImage" src="/static/images/results_1.png" alt="Results 1" class="w-full h-full object-contain">
                <video id="mainVideo" class="w-full h-full object-cover" preload="metadata" muted playsinline autoplay style="display: none;">
                    <source id="videoSource" src="/static/videos/transititonvote2.mp4" type="video/mp4">
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

        // Get references to elements
        this.image = this.element.querySelector('#mainImage');
        this.video = this.element.querySelector('#mainVideo');
        this.footer = this.element.querySelector('.absolute.bottom-0');
        this.backBtn = this.element.querySelector('#backBtn');
        this.nextBtn = this.element.querySelector('#nextBtn');
        this.backIcon = this.element.querySelector('#backIcon');
        this.nextIcon = this.element.querySelector('#nextIcon');
        this.isShowingImage = true; // Track whether we're showing image or video

        // Set up event listeners
        this.setupVideoListeners();
        this.setupFooterListeners();
        this.setupMutationObserver();
    }

    setupVideoListeners() {
        // Add an 'ended' event listener for when the transition video finishes
        this.video.addEventListener('ended', () => {
            console.log('Video playback completed');
            
            // Always show footer when video ends
            if (this.footer) {
                this.footer.style.display = 'block';
                console.log('VideoWidget2: Video ended, showing footer');
            }
            
            // Get the current source
            const videoSource = this.element.querySelector('#videoSource');
            const currentSrc = videoSource.src;
            console.log("Current video source:", currentSrc);
            
            if (currentSrc.includes('transititonvote2.mp4')) {
                console.log('Transition video ended, redirecting to vote2.html');
                // Redirect to vote2.html after the transititonvote2.mp4 video ends
                setTimeout(() => {
                    window.location.href = '/vote2.html';
                }, 1000);
            }
        });
        
        // Add listeners for debugging video loading (only needed for transition video)
        this.video.addEventListener('loadstart', () => console.log('Video: loadstart'));
        this.video.addEventListener('durationchange', () => console.log('Video: durationchange'));
        this.video.addEventListener('loadedmetadata', () => console.log('Video: loadedmetadata'));
        this.video.addEventListener('loadeddata', () => console.log('Video: loadeddata'));
        this.video.addEventListener('canplay', () => console.log('Video: canplay'));
        this.video.addEventListener('canplaythrough', () => console.log('Video: canplaythrough'));
        this.video.addEventListener('stalled', () => console.warn('Video: stalled'));
        this.video.addEventListener('suspend', () => console.log('Video: suspend'));
        this.video.addEventListener('play', () => {
            console.log('Video: play started');
            // Hide footer during transition video playback
            if (this.video.src.includes('transititonvote2.mp4')) {
                console.log('VideoWidget2: Transition video detected, hiding footer');
                if (this.footer) {
                    this.footer.style.display = 'none';
                }
            }
        });
        this.video.addEventListener('playing', () => console.log('Video: now playing'));
        this.video.addEventListener('waiting', () => console.warn('Video: waiting for more data'));
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            console.error('Video error code:', this.video.error ? this.video.error.code : 'unknown');
        });
    }

    setupFooterListeners() {
        // Back button - restart from vote.html with 1 second delay for visual feedback
        this.backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Change icon to provide visual feedback
            this.backIcon.src = '/static/icons/backfilled.svg';
            console.log("Navigating back to vote.html with 1 second visual feedback");
            
            // Prevent any other widgets from being shown during transition
            document.body.style.pointerEvents = 'none'; // Prevent further clicks
            
            // Stop video playback immediately
            if (this.video) {
                this.video.pause();
                this.video.src = ''; // Clear source to prevent any further loading
            }
            
            // Wait 1 second showing the filled icon, then navigate
            setTimeout(() => {
                window.location.href = '/vote.html';
            }, 1000);
        });

        // Next button - switch to transititonvote2.mp4
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            
            // Switch to transititonvote2.mp4 video
            this.switchToSecondVideo();
        });

        // Keyboard navigation - use capture mode to handle before main.js
        document.addEventListener('keydown', this.handleKeyDown, true);
    }

    // Method to switch from image to transition video
    switchToSecondVideo() {
        console.log("Switching from results_1.png image to transititonvote2.mp4 video");
        
        // Hide the image
        this.image.style.display = 'none';
        
        // Show the video element
        this.video.style.display = 'block';
        
        // Update the video element to ensure autoplay
        this.video.autoplay = true;
        this.video.controls = false;
        this.video.muted = false; // Ensure it's not muted
        
        // Load the video source (already set to transititonvote2.mp4 in render)
        console.log("Loading transition video source");
        this.video.load();
        
        // Reset playback state
        this.hasPlayed = false;
        this.isShowingImage = false;
        
        // Ensure the video plays immediately after loading
        this.video.onloadeddata = () => {
            console.log("Video data loaded, starting playback immediately");
            // Hide footer when transition video is about to start
            if (this.footer) {
                this.footer.style.display = 'none';
                console.log('VideoWidget2: Hiding footer for transition video');
            }
            
            this.video.play()
                .then(() => console.log("Video started playing successfully"))
                .catch(err => console.error("Error starting video:", err));
        };
        
        // Start the video with a more direct approach
        this.forcedStartVideo();
        
        // Double-check video source was applied correctly
        setTimeout(() => {
            console.log("Current video source after 500ms:", this.element.querySelector('#videoSource').src);
        }, 500);
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        // Only handle keys when this widget is active
        if (!this.element.classList.contains('widget-active')) {
            return;
        }
        
        if (key === 'a' && this.backIcon) {
            // Prevent main.js navigation from handling this
            event.preventDefault();
            event.stopPropagation();
            
            // Change back icon to filled version
            this.backIcon.src = '/static/icons/backfilled.svg';
            
            console.log("VideoWidget2: Keyboard navigation - going back to vote.html with 1 second visual feedback");
            
            // Prevent any other widgets from being shown
            document.body.style.pointerEvents = 'none';
            
            // Stop any current video playback
            if (this.video && !this.video.paused) {
                this.video.pause();
                this.video.src = ''; // Clear source to prevent any further loading
            }
            
            // Wait 1 second showing the filled icon, then navigate
            setTimeout(() => {
                window.location.href = '/vote.html';
            }, 1000);
        } else if (key === 'd' && this.nextIcon) {
            // Prevent main.js navigation from handling this
            event.preventDefault();
            event.stopPropagation();
            
            // Change next icon to filled version  
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            
            if (this.isShowingImage) {
                console.log("VideoWidget2: Switching from image to transititonvote2.mp4 video");
                // Switch from image to transition video
                this.switchToSecondVideo();
            } else {
                console.log("VideoWidget2: Already showing video");
            }
        } else if (key === ' ') {
            // Space bar toggles play/pause (only works when video is visible)
            event.preventDefault();
            if (!this.isShowingImage && this.video) {
                if (this.video.paused) {
                    this.video.play();
                } else {
                    this.video.pause();
                }
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
                        
                        // Show footer when widget becomes active (unless transition video is playing)
                        if (this.footer && this.isShowingImage) {
                            this.footer.style.display = 'block';
                        }
                        
                        // Ensure we're showing the image initially
                        if (this.isShowingImage) {
                            this.image.style.display = 'block';
                            this.video.style.display = 'none';
                            console.log("VideoWidget2: Showing results_1.png image");
                        }
                    }
                }
            });
        });

        this.observer.observe(this.element, { attributes: true });
    }

    deactivate() {
        // Stop any video that might be playing
        if (this.video) {
            this.video.pause();
            this.video.currentTime = 0;
        }
        
        // Reset to image state
        this.isShowingImage = true;
        if (this.image) this.image.style.display = 'block';
        if (this.video) this.video.style.display = 'none';
        
        if (this.observer) {
            this.observer.disconnect();
        }

        // Reset button icons to default state
        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';
        if (this.backIcon) this.backIcon.src = '/static/icons/back.svg';

        // Remove keyboard event listener
        document.removeEventListener('keydown', this.handleKeyDown, true);
    }
    
    // New method for forcing video playback with minimal delay
    forcedStartVideo() {
        console.log("Force starting video playback with audio");
        
        // Make sure video element is properly configured for audio playback
        this.video.muted = false;  // Start with audio enabled
        this.video.autoplay = true;
        this.video.controls = false;
        
        // Make sure we have the right source
        const videoSource = this.element.querySelector('#videoSource');
        console.log(`Current video source in forcedStartVideo: ${videoSource.src}`);
        
        // Try to play immediately with audio (might be blocked by browser)
        this.video.play().then(() => {
            console.log("Video with audio started playing immediately");
        }).catch(e => {
            console.warn("Immediate playback with audio failed, trying fallback approach:", e);
            
            // Fallback: try muted first then unmute quickly
            this.video.muted = true;
            
            // Create a promise that resolves when the video starts playing
            const playPromise = this.video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Muted video started, unmuting immediately");
                    // Video is playing muted, unmute very quickly
                    setTimeout(() => {
                        this.video.muted = false;
                        console.log("Video unmuted - now playing with audio");
                    }, 100);  // Reduced from 1000ms to 100ms
                }).catch(err => {
                    console.error("Failed to play even with muted workaround:", err);
                    
                    // Last resort: try reloading and playing again
                    console.log("Trying one last approach - reload and play");
                    this.video.load();
                    setTimeout(() => {
                        this.video.muted = false;  // Try with audio again
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
                console.log("Video still paused after 1s, trying to play again with audio");
                this.video.muted = false;
                this.video.play().catch(err => console.error("Final play attempt failed:", err));
            } else {
                console.log("Video confirmed playing after 1s with audio:", !this.video.muted);
            }
        }, 1000);
    }
}
