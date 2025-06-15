import { Widget } from './Widget.js';

export class VideoWidget3 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.observer = null;
        this.hasPlayed = false;
        this.transitionTriggered = false;
        this.lastLoggedProgress = -1; // For progress logging
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <img id="mainImage" src="/static/images/results_2.png" alt="Results 2" class="w-full h-full object-contain">
                <video id="mainVideo3" class="w-full h-full object-cover video-transition video-fade-in" preload="none" muted playsinline style="display: none;">
                    <source id="videoSource" src="/static/videos/secondpart.mp4" type="video/mp4">
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
        this.video = this.element.querySelector('#mainVideo3');
        this.backBtn = this.element.querySelector('#backBtn');
        this.nextBtn = this.element.querySelector('#nextBtn');
        this.backIcon = this.element.querySelector('#backIcon');
        this.nextIcon = this.element.querySelector('#nextIcon');
        this.isShowingImage = true; // Track whether we're showing image or video

        // DON'T load the video immediately - wait until widget becomes active
        // The video will be loaded in the activate() method or setupMutationObserver()

        // Set up event listeners
        this.setupVideoListeners();
        this.setupFooterListeners();
        this.setupMutationObserver();
    }

    // Method to completely reload the video element when source errors occur
    reloadVideoElement() {
        console.log('VideoWidget3 - Reloading video element completely');
        
        if (this.video) {
            // Store the parent container
            const container = this.video.parentElement;
            
            // Remove the old video element
            this.video.remove();
            
            // Create a new video element
            const newVideo = document.createElement('video');
            newVideo.id = 'mainVideo3';
            newVideo.className = 'w-full h-full object-cover video-transition video-fade-in';
            newVideo.setAttribute('preload', 'metadata');
            newVideo.setAttribute('muted', '');
            newVideo.setAttribute('playsinline', '');
            newVideo.style.display = 'none';
            
            // Add source
            const source = document.createElement('source');
            source.id = 'videoSource';
            source.src = '/static/videos/secondpart.mp4';
            source.type = 'video/mp4';
            newVideo.appendChild(source);
            
            // Insert the new video element (after the image)
            const image = container.querySelector('#mainImage');
            container.insertBefore(newVideo, image.nextSibling);
            
            // Update reference
            this.video = newVideo;
            
            // Set up listeners again
            this.setupVideoListeners();
            
            console.log('VideoWidget3 - Video element reloaded successfully');
        }
    }

    setupVideoListeners() {
        // When video ends, mute it and handle transitions
        this.video.addEventListener('ended', () => {
            console.log("Video playback completed - muting to prevent audio interference");
            
            // SIMPLE: Just mute the video after it ends
            this.video.muted = true;
            
            // Get the current source
            const videoSource = this.element.querySelector('#videoSource');
            const currentSrc = videoSource.src || this.video.src;
            console.log("Current video source that ended:", currentSrc);
            
            if (currentSrc.includes('secondpart.mp4')) {
                console.log('Secondpart video ended, transitioning to politics_1 (VideoWidget4)');
                
                // Set transition flag to prevent deactivate from showing image
                this.transitionTriggered = true;
                
                setTimeout(() => {
                    this.smoothTransitionToNextWidget();
                }, 1000);
            }
        });
        
        // Add error handling for video
        this.video.addEventListener('error', (e) => {
            console.error("VideoWidget3 - Video playback error:", e);
            console.error("VideoWidget3 - Video error code:", this.video.error ? this.video.error.code : 'unknown');
            
            // If Error Code 4 (no supported source), try complete reload
            if (this.video.error?.code === 4) {
                console.log("VideoWidget3 - Source error detected (Code 4), attempting complete reload");
                this.reloadVideoElement();
                return;
            }
            
            // Try to reload the video with the correct source (other errors)
            const videoSource = this.element.querySelector('#videoSource');
            if (videoSource) {
                console.log("VideoWidget3 - Attempting to reload video due to error");
                videoSource.src = '/static/videos/secondpart.mp4';
                this.video.load();
                setTimeout(() => {
                    this.forcedStartVideo();
                }, 500);
            }
        });
        
        // Add listeners for debugging video loading (only needed for secondpart video)
        this.video.addEventListener('loadstart', () => console.log('Video3: loadstart'));
        this.video.addEventListener('durationchange', () => {
            console.log('Video3: durationchange - Duration:', this.video.duration);
            // When we get duration, also log expected end time
            if (this.video.duration) {
                console.log(`Video3: Video will end at ${this.video.duration}s`);
            }
        });
        this.video.addEventListener('loadedmetadata', () => console.log('Video3: loadedmetadata'));
        this.video.addEventListener('loadeddata', () => console.log('Video3: loadeddata'));
        this.video.addEventListener('canplay', () => console.log('Video3: canplay'));
        this.video.addEventListener('canplaythrough', () => console.log('Video3: canplaythrough'));
        this.video.addEventListener('stalled', () => console.warn('Video3: stalled'));
        this.video.addEventListener('suspend', () => console.log('Video3: suspend'));
        this.video.addEventListener('play', () => {
            console.log('Video3: play started');
            console.log(`Video3: Current time: ${this.video.currentTime}, Duration: ${this.video.duration}`);
        });
        this.video.addEventListener('playing', () => {
            console.log('Video3: now playing');
            console.log(`Video3: Playing at ${this.video.currentTime}s of ${this.video.duration}s`);
        });
        this.video.addEventListener('waiting', () => console.warn('Video3: waiting for more data'));
        
        // Add progress monitoring for debugging
        this.video.addEventListener('timeupdate', () => {
            if (this.video.duration) {
                const progress = (this.video.currentTime / this.video.duration * 100).toFixed(1);
                // Only log every 10% to avoid spam
                if (Math.floor(progress) % 10 === 0 && progress !== this.lastLoggedProgress) {
                    console.log(`Video3: Progress ${progress}% (${this.video.currentTime.toFixed(1)}s / ${this.video.duration.toFixed(1)}s)`);
                    this.lastLoggedProgress = Math.floor(progress);
                }
            }
        });
    }

    setupFooterListeners() {
        // Back button - navigate back to results2.html with 1 second visual feedback
        this.backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Change icon to provide visual feedback
            this.backIcon.src = '/static/icons/backfilled.svg';
            console.log("Navigating back to results2.html with 1 second visual feedback");
            
            // Prevent any other widgets from being shown during transition
            document.body.style.pointerEvents = 'none'; // Prevent further clicks
            
            // Stop video playback immediately
            if (this.video) {
                this.video.pause();
                this.video.src = ''; // Clear source to prevent any further loading
            }
            
            // Wait 1 second showing the filled icon, then navigate
            setTimeout(() => {
                window.location.href = '/results2.html';
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
    
    // Method to switch from image to secondpart video with smooth transition
    switchToSecondVideo() {
        console.log("Starting smooth transition from results_2.png image to secondpart.mp4");
        
        // Reset transition flag
        this.transitionTriggered = false;
        
        // Step 1: Fade out the image
        this.image.style.transition = 'opacity 0.8s ease-in-out';
        this.image.style.opacity = '0';
        
        // Step 2: After fade out completes, switch to video
        setTimeout(() => {
            // Hide the image and show the video
            this.image.style.display = 'none';
            this.video.style.display = 'block';
            this.isShowingImage = false;
            
            console.log("Switching to secondpart.mp4");
            
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
            
            // Load the video source (already set to secondpart.mp4 in render)
            console.log("Loading secondpart video source");
            this.video.load();
            
            // Reset playback state
            this.hasPlayed = false;
            
            // Step 3: When new video is ready, fade it in
            this.video.onloadeddata = () => {
                console.log("Secondpart video data loaded, fading in and starting playback");
                
                // Add fade-in class
                this.video.classList.add('video-fade-in');
                
                // Start playing the new video
                this.video.play()
                    .then(() => console.log("Secondpart video started playing successfully with fade-in"))
                    .catch(err => console.error("Error starting secondpart video:", err));
            };
            
            // Add error handler
            this.video.onerror = () => {
                console.error("Error loading secondpart.mp4:", this.video.error);
                // If error, still fade in to show something
                this.video.classList.add('video-fade-in');
            };
            
            // Fallback: Start video with forcedStartVideo method
            this.forcedStartVideo();
            
        }, 800); // Wait for fade-out transition to complete (matching CSS duration)
    }

    // Method to smoothly transition to VideoWidget4 (politics_1.mp4)
    smoothTransitionToNextWidget() {
        console.log("Starting immediate transition from secondpart to VideoWidget4 (politics_1)");
        
        // SIMPLE: Mute the current video to prevent audio bleeding
        this.video.muted = true;
        
        // Pause current video immediately
        this.video.pause();
        this.video.currentTime = 0;
        
        console.log("Navigating immediately to VideoWidget4 (politics_1.mp4)");
        
        // Dispatch custom navigation event to VideoWidget4 (Widget 6) immediately
        const navigationEvent = new CustomEvent('navigateToWidget', {
            detail: { targetWidget: 6 }
        });
        document.dispatchEvent(navigationEvent);
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        // Only handle keys when this widget is active
        if (!this.element.classList.contains('widget-active')) {
            console.log("VideoWidget3: Not active, ignoring key press");
            return;
        }
        
        console.log("VideoWidget3: Key pressed:", key);
        
        // Check if secondpart video is playing (when footer is hidden)
        const isSecondPartVideoPlaying = !this.isShowingImage && this.video.src.includes('secondpart.mp4') && !this.video.paused && !this.video.ended;
        
        if (isSecondPartVideoPlaying) {
            // During secondpart video playback, only allow 'R' key (reset)
            if (key === 'r') {
                console.log("VideoWidget3: Reset key pressed during secondpart video playback - allowing main.js to handle");
                return;
            } else {
                // Block all other keys during secondpart video playback
                event.preventDefault();
                event.stopPropagation();
                console.log("VideoWidget3: Key blocked during secondpart video playback - only 'R' allowed");
                return;
            }
        }
        
        if (key === 'a' && this.backIcon) {
            // Change back icon to filled version
            this.backIcon.src = '/static/icons/backfilled.svg';
            
            console.log("Keyboard navigation: going back to results2.html with 1 second visual feedback");
            
            // Prevent any other widgets from being shown
            document.body.style.pointerEvents = 'none';
            
            // Stop any current video playback
            if (this.video && !this.video.paused) {
                this.video.pause();
                this.video.src = ''; // Clear source to prevent any further loading
            }
            
            // Wait 1 second showing the filled icon, then navigate
            setTimeout(() => {
                window.location.href = '/results2.html';
            }, 1000);
        } else if (key === 'd' && this.nextIcon) {
            // Prevent any event propagation
            event.preventDefault();
            event.stopPropagation();
            
            // Change next icon to filled version  
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            
            if (this.isShowingImage) {
                console.log("VideoWidget3: D key pressed, switching from image to secondpart video");
                // Switch from image to secondpart video
                this.switchToSecondVideo();
            } else {
                console.log("VideoWidget3: Already showing video");
            }
        } else if (key === ' ') {
            // Space bar toggles play/pause (only works when video is visible)
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
                        
                        // Show the footer when widget becomes active (unless secondpart video is playing)
                        const footer = this.element.querySelector('.absolute.bottom-0');
                        if (footer && this.isShowingImage) {
                            console.log("Showing footer for results_2.png image");
                            footer.style.display = 'flex';
                        }
                        
                        // Ensure we're showing the image initially
                        if (this.isShowingImage) {
                            this.image.style.display = 'block';
                            this.image.style.opacity = '1';
                            this.video.style.display = 'none';
                            console.log("VideoWidget3: Showing results_2.png image");
                        }
                    }
                }
            });
        });

        this.observer.observe(this.element, { attributes: true });
    }

    deactivate() {
        console.log('VideoWidget3: Simple deactivation - muting video to prevent bleeding');
        
        // SIMPLE: Just mute and pause the video
        if (this.video) {
            this.video.muted = true;
            this.video.pause();
            console.log('VideoWidget3: Video muted and paused');
        }
        
        // Only reset to image state if we're not in the middle of a transition
        if (!this.transitionTriggered) {
            // Reset to image state
            this.isShowingImage = true;
            if (this.image) {
                this.image.style.display = 'block';
                this.image.style.opacity = '1';
            }
            if (this.video) this.video.style.display = 'none';
            
            // Show footer (in case it was hidden)
            const footer = this.element.querySelector('.absolute.bottom-0');
            if (footer) {
                footer.style.display = 'flex';
            }
        } else {
            console.log('VideoWidget3: Skipping image reset during transition');
        }
        
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        // Reset button icons to default state
        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';
        if (this.backIcon) this.backIcon.src = '/static/icons/back.svg';

        // Remove keyboard event listener
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Reset hasPlayed flag so video can play again when reactivated
        this.hasPlayed = false;
        
        console.log('VideoWidget3: Enhanced deactivation completed - all audio sources cleared');
    }

    activate() {
        // Reinitialize the mutation observer if it was disconnected
        if (!this.observer) {
            this.setupMutationObserver();
        }
        
        // Reset hasPlayed flag to ensure functionality can work again after reset
        this.hasPlayed = false;
        
        // Reset transition flag
        this.transitionTriggered = false;
        
        // Reset video source to ensure it's correct but don't load yet
        if (this.video) {
            const source = this.video.querySelector('source');
            if (source) {
                source.src = '/static/videos/secondpart.mp4';
                // DON'T load here - this widget shows an image by default
                console.log('VideoWidget3 activate() - Reset to secondpart.mp4 (but showing image)');
            }
        }
        
        // Ensure we're in the correct initial state (showing image)
        this.isShowingImage = true;
        if (this.image) {
            this.image.style.display = 'block';
            this.image.style.opacity = '1';
        }
        if (this.video) {
            this.video.style.display = 'none';
        }
        
        // Show footer for image state
        const footer = this.element.querySelector('.absolute.bottom-0');
        if (footer) {
            footer.style.display = 'flex';
        }
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
