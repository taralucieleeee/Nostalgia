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
                <video id="mainVideo" class="w-full h-full object-cover" preload="auto" muted playsinline>
                    <source id="videoSource" src="static/videos/bertelmannstiftung_agree.mp4" type="video/mp4">
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
        this.video = this.element.querySelector('#mainVideo');
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
        // Add an 'ended' event listener for tracking when the video finishes
        this.video.addEventListener('ended', () => {
            console.log('Video playback completed');
            // No automatic transition to vote2.html anymore
        });
    }

    setupFooterListeners() {
        // Back button - restart from vote.html
        this.backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.backIcon.src = '/static/icons/backfilled.svg';
            setTimeout(() => {
                window.location.href = '/vote.html';
            }, 2000);
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

    // Method to switch to the second video
    switchToSecondVideo() {
        // Pause current video
        this.video.pause();
        
        // Update the video source
        const videoSource = this.element.querySelector('#videoSource');
        videoSource.src = 'static/videos/secondpart.mp4';
        
        // Load the new source
        this.video.load();
        
        // Reset playback state
        this.hasPlayed = false;
        
        // Start the new video with delay (same buffering logic)
        this.startVideoWithDelay();
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        if (key === 'a' && this.backIcon) {
            // Change back icon to filled version
            this.backIcon.src = '/static/icons/backfilled.svg';
            
            // Wait 2 seconds then redirect to vote.html
            setTimeout(() => {
                window.location.href = '/vote.html';
            }, 2000);
        } else if (key === 'd' && this.nextIcon) {
            // Change next icon to filled version  
            this.nextIcon.src = '/static/icons/nextfilled.svg';
            
            // Switch to the second video
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
                    mutation.attributeName === 'class' &&
                    this.element.classList.contains('widget-active') && 
                    !this.hasPlayed) {
                    this.startVideoWithDelay();
                    this.hasPlayed = true;
                }
            });
        });

        this.observer.observe(this.element, { attributes: true });
    }

    startVideoWithDelay() {
        // Reset video
        this.video.currentTime = 0;
        this.video.muted = true;
        
        // Check if video has buffered enough data
        const checkBuffer = () => {
            if (this.video.readyState >= 3) {  // HAVE_FUTURE_DATA or higher
                // Buffer for 2 seconds, then play with audio
                setTimeout(() => {
                    this.video.muted = false;
                    this.video.play().catch(e => {
                        console.error('Video playback failed:', e);
                        // Fallback to muted playback if audio fails
                        this.video.muted = true;
                        this.video.play().catch(e => console.error('Muted playback also failed:', e));
                    });
                }, 2000);
            } else {
                // Check again in 200ms
                setTimeout(checkBuffer, 200);
            }
        };
        
        checkBuffer();
    }

    deactivate() {
        if (this.video) {
            this.video.pause();
        }
        
        if (this.observer) {
            this.observer.disconnect();
        }

        // Remove keyboard event listener
        document.removeEventListener('keydown', this.handleKeyDown);
    }
}
