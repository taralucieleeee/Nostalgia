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
                <video id="mainVideo4" class="w-full h-full object-cover video-transition video-fade-in" preload="none" muted playsinline>
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

        // DON'T load the video immediately - wait until widget becomes active
        // The video will be loaded in the setupMutationObserver() when widget activates

        // Set up event listeners
        this.setupVideoListeners();
        this.setupFooterListeners();
        this.setupMutationObserver();
    }

    // Method to completely reload the video element when source errors occur
    reloadVideoElement() {
        console.log('VideoWidget4 - Reloading video element completely');
        
        if (this.video) {
            // Store the parent container
            const container = this.video.parentElement;
            
            // Remove the old video element
            this.video.remove();
            
            // Create a new video element
            const newVideo = document.createElement('video');
            newVideo.id = 'mainVideo4';
            newVideo.className = 'w-full h-full object-cover video-transition video-fade-in';
            newVideo.setAttribute('preload', 'metadata');
            newVideo.setAttribute('muted', '');
            newVideo.setAttribute('playsinline', '');
            
            // Add source
            const source = document.createElement('source');
            source.id = 'videoSource';
            source.src = '/static/videos/politics_1.mp4';
            source.type = 'video/mp4';
            newVideo.appendChild(source);
            
            // Insert the new video element
            container.insertBefore(newVideo, container.firstChild);
            
            // Update reference
            this.video = newVideo;
            
            // Set up listeners again
            this.setupVideoListeners();
            
            console.log('VideoWidget4 - Video element reloaded successfully');
        }
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
                console.log('Politics_1 video ended, smoothly transitioning to politics_2.mp4');
                
                // Smooth transition to politics_2.mp4 within the same widget
                setTimeout(() => {
                    this.smoothTransitionToPolitics2();
                }, 1000);
            } else if (currentSrc.includes('politics_2.mp4')) {
                console.log('Politics_2 video ended, navigating to Widget 10 (VideoWidget8 politics_3)');
                
                // Navigate to Widget 10 (VideoWidget8) to continue with politics_3
                setTimeout(() => {
                    const navigationEvent = new CustomEvent('navigateToWidget', {
                        detail: { targetWidget: 10 }
                    });
                    document.dispatchEvent(navigationEvent);
                }, 1000);
            }
        });
        
        // Add error handling for video
        this.video.addEventListener('error', (e) => {
            console.error("VideoWidget4 - Video playback error:", e);
            console.error("VideoWidget4 - Video error code:", this.video.error ? this.video.error.code : 'unknown');
            
            // If Error Code 4 (no supported source), try complete reload
            if (this.video.error?.code === 4) {
                console.log("VideoWidget4 - Source error detected (Code 4), attempting complete reload");
                this.reloadVideoElement();
                return;
            }
            
            // Try to reload the video with the correct source (other errors)
            const videoSource = this.element.querySelector('#videoSource');
            if (videoSource) {
                console.log("VideoWidget4 - Attempting to reload video due to error");
                videoSource.src = '/static/videos/politics_1.mp4';
                this.video.load();
                setTimeout(() => {
                    this.forcedStartVideo();
                }, 500);
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
        
        // Video is paused or ended - politics videos do not allow back navigation
        // Only allow 'R' (reset) and space bar (play/pause) when video is paused
        if (key === 'd') {
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
        console.log('VideoWidget4: Simple deactivation - muting video to prevent bleeding');
        
        if (this.video) {
            // Simple approach: just mute and pause
            this.video.muted = true;
            this.video.pause();
            console.log('VideoWidget4: Video muted and paused');
        }
        
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;  // Clear reference for proper cleanup
        }

        // Reset button icons to default state
        if (this.nextIcon) this.nextIcon.src = '/static/icons/next.svg';
        if (this.backIcon) this.backIcon.src = '/static/icons/back.svg';

        // Remove keyboard event listener
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Reset hasPlayed flag so video can play again when reactivated
        this.hasPlayed = false;
        
        console.log('VideoWidget4: Enhanced deactivation completed');
    }

    activate() {
        console.log('VideoWidget4 - activate() called - ensuring clean audio state');
        
        // ENHANCED: Prevent audio bleeding from other videos before loading politics
        this.preventAudioBleeding();
        
        if (!this.observer) {
            this.setupMutationObserver();
        }
        
        // Reset the hasPlayed flag when activated
        this.hasPlayed = false;
        
        // Load the video only when widget becomes active (not during render)
        if (this.video) {
            console.log('VideoWidget4 - Loading politics_1 video with clean audio state');
            
            // Ensure video source is correct for politics_1
            const videoSource = this.element.querySelector('#videoSource');
            if (videoSource && !videoSource.src.includes('politics_1.mp4')) {
                videoSource.src = '/static/videos/politics_1.mp4';
            }
            
            this.video.load();
        }
    }

    // Method to prevent audio bleeding from other videos - SIMPLIFIED
    preventAudioBleeding() {
        console.log('VideoWidget4: Simple audio bleeding prevention - muting other videos');
        
        // Simple approach: just mute all other video elements
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach((video, index) => {
            // Skip our own video
            if (video === this.video) return;
            
            if (!video.paused) {
                console.log(`VideoWidget4: Muting video ${index + 1} to prevent audio bleeding`);
            }
            video.muted = true;
        });
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
    
    // Method to smoothly transition from politics_1 to politics_2
    smoothTransitionToPolitics2() {
        console.log("Starting smooth transition from politics_1 to politics_2");
        
        // Step 1: Fade out current video
        this.video.classList.add('video-fade-out');
        
        // Step 2: After fade out completes, switch video source
        setTimeout(() => {
            // Pause current video
            this.video.pause();
            
            console.log("Switching to politics_2.mp4");
            
            // Update the video source
            const videoSource = this.element.querySelector('#videoSource');
            console.log("Current source before change:", videoSource.src);
            videoSource.src = '/static/videos/politics_2.mp4';
            console.log("New source after change:", videoSource.src);
            
            // Update the video element settings
            this.video.autoplay = true;
            this.video.controls = false;
            this.video.muted = false;
            
            // Load the new source
            console.log("Loading politics_2 video source");
            this.video.load();
            
            // Reset playback state
            this.hasPlayed = false;
            
            // Step 3: When new video is ready, fade it back in
            this.video.onloadeddata = () => {
                console.log("Politics_2 video data loaded, fading in and starting playback");
                
                // Remove fade-out and add fade-in
                this.video.classList.remove('video-fade-out');
                this.video.classList.add('video-fade-in');
                
                // Start playing the new video
                this.video.play()
                    .then(() => console.log("Politics_2 video started playing successfully with fade-in"))
                    .catch(err => console.error("Error starting politics_2 video:", err));
            };
            
            // Add error handler
            this.video.onerror = () => {
                console.error("Error loading politics_2.mp4:", this.video.error);
                // If error, still fade back in to show something
                this.video.classList.remove('video-fade-out');
                this.video.classList.add('video-fade-in');
            };
            
            // Fallback: Start video with forcedStartVideo method
            this.forcedStartVideo();
            
        }, 800); // Wait for fade-out transition to complete (matching CSS duration)
    }
}