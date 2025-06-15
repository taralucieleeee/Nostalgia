import { Widget } from './Widget.js';

export class VideoWidget extends Widget {
    constructor(container, id) {
        super(container, id);
        this.video = null;
        this.hasPlayed = false;
    }

    // Method to completely reload the video element when source errors occur
    reloadVideoElement() {
        console.log('VideoWidget - Reloading video element completely');
        
        if (this.video) {
            // Store the parent container
            const container = this.video.parentElement;
            
            // Remove the old video element
            this.video.remove();
            
            // Create a new video element
            const newVideo = document.createElement('video');
            newVideo.id = 'mainVideo';
            newVideo.className = 'absolute inset-0 w-full h-full object-contain z-0';
            newVideo.setAttribute('preload', 'metadata');
            newVideo.setAttribute('muted', '');
            newVideo.setAttribute('playsinline', '');
            
            // Add source
            const source = document.createElement('source');
            source.src = '/static/videos/firstpart.mp4';
            source.type = 'video/mp4';
            newVideo.appendChild(source);
            
            console.log('VideoWidget - New video element source:', source.src);
            
            // Insert the new video element
            container.appendChild(newVideo);
            
            // Update reference
            this.video = newVideo;
            
            // Set up video end handler again
            this.setupVideoListeners();
            
            console.log('VideoWidget - Video element reloaded successfully');
        }
    }

    // Set up video event listeners
    setupVideoListeners() {
        if (!this.video) return;
        
        // Video end handler
        this.video.addEventListener('ended', () => {
            console.log('Video playback completed, navigating to vote.html after 1 second');
            
            // Re-enable keyboard navigation
            this.enableKeyboardNavigation();
            
            // Prevent any other widgets from being shown during transition
            document.body.style.pointerEvents = 'none';
            
            // Stop video playback immediately
            this.video.pause();
            this.video.src = ''; // Clear source to prevent any further loading
            
            // Wait 1 second then navigate
            setTimeout(() => {
                window.location.href = '/vote.html';
            }, 1000);
        });
        
        // Add error handling for video
        this.video.addEventListener('error', (e) => {
            console.error("VideoWidget - Video playback error:", e);
            console.error("VideoWidget - Video error code:", this.video.error ? this.video.error.code : 'unknown');
            console.error("VideoWidget - Video error message:", this.video.error ? this.video.error.message : 'unknown');
            console.error("VideoWidget - Video src:", this.video.src);
            console.error("VideoWidget - Video readyState:", this.video.readyState);
            console.error("VideoWidget - Video networkState:", this.video.networkState);
            
            // If Error Code 4 (no supported source), try complete reload
            if (this.video.error?.code === 4) {
                console.log("VideoWidget - Source error detected (Code 4), attempting complete reload");
                this.reloadVideoElement();
                return;
            }
            
            // Try standard reload for other errors
            console.log("VideoWidget - Attempting standard video reload due to error");
            this.video.load();
            setTimeout(() => {
                this.startVideoWithDelay();
            }, 500);
        });
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full bg-black">
                <video id="mainVideo" 
                       class="absolute inset-0 w-full h-full object-contain z-0"
                       preload="metadata"
                       muted
                       playsinline>
                    <source src="/static/videos/firstpart.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;
        
        this.video = this.element.querySelector('#mainVideo');
        
        console.log("VideoWidget - Video element created:", this.video);
        console.log("VideoWidget - Video src:", this.video?.src);
        console.log("VideoWidget - Video source elements:", this.video?.querySelectorAll('source'));
        
        // DON'T load the video immediately - wait until widget becomes active
        // The video will be loaded in the activate() method or setupActiveWatcher()
        
        // Set up video event listeners (including error handling)
        this.setupVideoListeners();
        
        // Watch for when this widget becomes active
        this.setupActiveWatcher();
    }

    setupActiveWatcher() {
        // Use MutationObserver to detect when widget becomes active
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (this.element.classList.contains('widget-active') && !this.hasPlayed) {
                        this.startVideoWithDelay();
                        this.hasPlayed = true;
                    }
                }
            });
        });

        observer.observe(this.element, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Store observer for cleanup
        this.observer = observer;
    }

    deactivate() {
        console.log('VideoWidget: Simple deactivation - muting video to prevent bleeding');
        
        // SIMPLE: Just mute and pause the video
        if (this.video) {
            this.video.muted = true;
            this.video.pause();
            console.log('VideoWidget: Video muted and paused');
        }
        
        // Re-enable keyboard navigation
        this.enableKeyboardNavigation();
        
        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        // Reset hasPlayed flag so video can play again when reactivated
        this.hasPlayed = false;
        
        console.log('VideoWidget: Enhanced deactivation completed');
    }

    activate() {
        // Reinitialize the mutation observer if it was disconnected
        if (!this.observer) {
            this.setupActiveWatcher();
        }
        
        // Reset hasPlayed flag to ensure video can play again after reset
        this.hasPlayed = false;
        
        // Reset video source to ensure it's correct
        if (this.video) {
            const source = this.video.querySelector('source');
            if (source) {
                source.src = '/static/videos/firstpart.mp4';
                this.video.load();
                console.log('VideoWidget activate() - Reset to firstpart.mp4');
            }
        }
        
        // Check if the widget is currently active and start video if so
        // This handles the case where the widget is already active after reset
        if (this.element.classList.contains('widget-active') && !this.hasPlayed) {
            console.log("VideoWidget activate() - widget is active, starting video");
            this.startVideoWithDelay();
            this.hasPlayed = true;
        }
    }

    startVideoWithDelay() {
        if (this.video) {
            console.log('VideoWidget - Starting firstpart.mp4 video');
            
            // Disable keyboard navigation during video playback
            this.disableKeyboardNavigation();
            
            // Start with muted autoplay to avoid browser restrictions
            this.video.muted = true;
            // Don't call load() again here - it was already called in activate()
            
            this.video.play().then(() => {
                console.log("VideoWidget - Muted firstpart video started, unmuting after delay");
                // Unmute after a short delay
                setTimeout(() => {
                    this.video.muted = false;
                    console.log("VideoWidget - FirstPart video unmuted");
                }, 1000);
            }).catch(e => {
                console.error('VideoWidget - Video autoplay failed:', e);
                // Try reloading the video element as last resort
                console.log('VideoWidget - Attempting video element reload as last resort');
                this.reloadVideoElement();
            });
        }
    }

    disableKeyboardNavigation() {
        // Prevent keyboard navigation during video playback, except for reset key
        this.keyboardHandler = (e) => {
            const key = e.key.toLowerCase();
            // Allow 'r' key for reset functionality
            if (key === 'r') {
                console.log("VideoWidget: Allowing reset key during video playback");
                return; // Let the key pass through to main.js
            }
            // Block all other keys
            e.preventDefault();
            e.stopPropagation();
        };
        document.addEventListener('keydown', this.keyboardHandler, true);
    }

    enableKeyboardNavigation() {
        // Re-enable keyboard navigation
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler, true);
            this.keyboardHandler = null;
        }
    }
}
