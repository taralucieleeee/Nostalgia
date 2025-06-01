import { Widget } from './Widget.js';

export class ThirdWidget extends Widget {
    constructor(container, id) {
        super(container, id);
        this.hasPlayedSubtitles = false;
        this.audio = null;
    }

    activate() {
        super.activate();
        // Create and load audio when activating
        this.audio = new Audio('static/sounds/SubtitlesFirstWidget.mp3');
        this.audio.load(); // Ensure audio is loaded

        // Wait 1 second after transition before playing audio
        setTimeout(() => {
            if (!this.hasPlayedSubtitles && this.audio) {
                const playPromise = this.audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            this.hasPlayedSubtitles = true;
                        })
                        .catch(error => {
                            console.error('Audio playback failed:', error);
                        });

                    // Set up the ended event listener after successful play
                    this.audio.addEventListener('ended', () => {
                        if (this.onTransitionRequest) {
                            this.onTransitionRequest('next');
                        }
                    });
                }
            }
        }, 1000);
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <img src="static/images/third.png" alt="Third Image" 
                    class="absolute inset-0 w-full h-full object-contain z-0">
                <img src="static/gifs/ThirdWidget.gif" alt="Overlay Animation" 
                    class="absolute inset-0 w-full h-full object-contain pointer-events-none z-10">
                <img src="static/gifs/SubtitlesThirdWidget.gif" 
                    alt="Subtitles Animation" 
                    class="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 gif-play-once">
            </div>
        `;
    }

    cleanup() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio = null;
        }
    }

    deactivate() {
        super.deactivate();
        this.cleanup();
    }
}
