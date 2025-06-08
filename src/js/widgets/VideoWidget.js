import { Widget } from './Widget.js';

export class VideoWidget extends Widget {
    constructor(container, id) {
        super(container, id);
        this.video = null;
        this.hasPlayed = false;
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full bg-black">
                <video id="mainVideo" 
                       class="absolute inset-0 w-full h-full object-contain z-0"
                       preload="none"
                       muted
                       playsinline>
                    <source src="/static/videos/firstpart.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;
        
        this.video = this.element.querySelector('#mainVideo');
        
        // Set up video end handler
        if (this.video) {
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
        }
        
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
        // Clean up video to prevent audio bleeding
        if (this.video) {
            this.video.pause();
            this.video.currentTime = 0;
            this.video.src = '';
            this.video.load();
        }
        
        // Re-enable keyboard navigation
        this.enableKeyboardNavigation();
        
        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    startVideoWithDelay() {
        if (this.video) {
            // Set up buffering and playback
            this.video.muted = false; // Enable audio from the start
            
            // Start loading the video data
            this.video.load();
            
            // Disable keyboard navigation during video playback
            this.disableKeyboardNavigation();
            
            // Check if video has enough data to start playing
            const checkBuffer = () => {
                // Wait until video has enough data buffered (readyState 3 = HAVE_FUTURE_DATA or 4 = HAVE_ENOUGH_DATA)
                if (this.video.readyState >= 3) {
                    // Start video and audio simultaneously after buffer period
                    setTimeout(() => {
                        this.video.play().catch(e => {
                            console.log('Video autoplay with audio failed:', e);
                            // Fallback: try playing muted if audio fails
                            this.video.muted = true;
                            this.video.play().catch(e2 => console.log('Video autoplay failed completely:', e2));
                        });
                    }, 2000);
                } else {
                    // Check again in 100ms
                    setTimeout(checkBuffer, 100);
                }
            };
            
            // Start buffer check
            checkBuffer();
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
