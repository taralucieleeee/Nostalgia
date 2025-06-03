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
                       preload="auto"
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
    }

    startVideoWithDelay() {
        if (this.video) {
            // Wait 2 seconds before starting video with audio
            setTimeout(() => {
                this.video.muted = false; // Enable audio
                this.video.play().catch(e => {
                    console.log('Video autoplay with audio failed:', e);
                    // Fallback: try playing muted if audio fails
                    this.video.muted = true;
                    this.video.play().catch(e2 => console.log('Video autoplay failed completely:', e2));
                });
            }, 2000);
        }
    }
}
