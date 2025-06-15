import { Widget } from './Widget.js';

export class VideoWidget9 extends Widget {
    constructor(container, id) {
        super(container, id);
        this.observer = null;
        this.autoResetTimer = null;
        this.countdownInterval = null;
        this.autoResetTimeout = 45000; // 45 seconds in milliseconds
        this.remainingTime = 45; // seconds remaining for countdown display
    }

    render() {
        this.element.innerHTML = `
            <div class="widget relative w-full h-full">
                <img src="static/images/lastframe.png" alt="Last Frame Image" 
                    class="absolute inset-0 w-full h-full object-contain z-0">
                
                <!-- Auto-reset countdown indicator -->
                <div id="autoResetCountdown" class="absolute top-8 right-8 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg font-mono text-lg" style="display: none;">
                    Auto-reset in: <span id="countdownTimer">45</span>s
                </div>
                
                <!-- Footer Overlay with RESET button -->
                <div class="absolute bottom-0 left-0 right-0 flex-shrink-0 flex flex-row justify-center w-full px-8 py-12" style="background-color: #FFDCDC;">
                    <div class="flex items-center justify-center w-full max-w-6xl">
                        <!-- CENTER: RESET button -->
                        <a href="#" id="resetBtn" class="inline-flex items-center gap-2 text-4xl transition-colors" style="font-family: 'Space Mono', monospace; color: #9A7A78;">
                            <img id="resetIcon" src="/static/icons/resetbutton.svg" alt="Reset" class="h-8 w-8">
                            RESET
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Get references to elements
        this.resetBtn = this.element.querySelector('#resetBtn');
        this.resetIcon = this.element.querySelector('#resetIcon');
        this.countdownDisplay = this.element.querySelector('#autoResetCountdown');
        this.countdownTimer = this.element.querySelector('#countdownTimer');

        // Set up event listeners
        this.setupFooterListeners();
        this.setupMutationObserver();
    }

    setupFooterListeners() {
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleReset();
            });

            // Add mouse events for visual feedback and timer reset
            this.resetBtn.addEventListener('mousedown', () => {
                // Mouse interaction resets the timer
                this.startAutoResetTimer();
                
                if (this.resetIcon) {
                    this.resetIcon.src = '/static/icons/resetbuttonfilled.svg';
                }
            });

            this.resetBtn.addEventListener('mouseup', () => {
                if (this.resetIcon) {
                    this.resetIcon.src = '/static/icons/resetbutton.svg';
                }
            });

            this.resetBtn.addEventListener('mouseleave', () => {
                if (this.resetIcon) {
                    this.resetIcon.src = '/static/icons/resetbutton.svg';
                }
            });

            // Also reset timer on mouse movement over the reset button area
            this.resetBtn.addEventListener('mouseenter', () => {
                this.startAutoResetTimer();
            });
        }

        // Set up keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        
        if (!this.element.classList.contains('widget-active')) {
            return;
        }
        
        // Any key press resets the auto-reset timer (user activity detected)
        this.startAutoResetTimer();
        
        if (key === 'r') {
            event.preventDefault();
            event.stopPropagation();
            
            // Show filled icon briefly for visual feedback
            if (this.resetIcon) {
                this.resetIcon.src = '/static/icons/resetbuttonfilled.svg';
                setTimeout(() => {
                    if (this.resetIcon) {
                        this.resetIcon.src = '/static/icons/resetbutton.svg';
                    }
                }, 150);
            }
            
            this.handleReset();
        }
        // lastframe.png only allows reset - no other navigation
    }

    // Method to ensure political background music continues playing
    ensurePoliticalMusicPlaying() {
        const politicalMusic = document.getElementById('politicalMusic');
        if (politicalMusic) {
            if (politicalMusic.paused) {
                politicalMusic.volume = 0.08;
                politicalMusic.play().then(() => {
                    console.log("VideoWidget9: Political background music resumed");
                }).catch(e => {
                    console.log("VideoWidget9: Political music playback failed:", e);
                });
            } else {
                // Ensure volume is correct even if already playing
                politicalMusic.volume = 0.08;
                console.log("VideoWidget9: Political background music confirmed playing");
            }
        }
    }

    handleReset() {
        console.log("VideoWidget9: Reset triggered - clearing auto-reset timer");
        
        // Clear the auto-reset timer since manual reset was triggered
        this.clearAutoResetTimer();
        
        console.log("VideoWidget9: Reset button clicked - triggering comprehensive reset");
        
        // Show visual feedback
        if (this.resetIcon) {
            this.resetIcon.src = '/static/icons/resetbuttonfilled.svg';
        }
        
        // Dispatch custom reset event to main.js for comprehensive reset
        const resetEvent = new CustomEvent('comprehensiveReset', {
            detail: { source: 'VideoWidget9' }
        });
        document.dispatchEvent(resetEvent);
        
        // Fallback - if main.js doesn't handle it, use direct application restart
        setTimeout(() => {
            if (this.resetIcon) {
                this.resetIcon.src = '/static/icons/resetbutton.svg';
            }
            console.log("VideoWidget9: Fallback reset - complete application restart");
            window.location.href = '/index.html';
        }, 1000);
    }

    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class') {
                    
                    if (this.element.classList.contains('widget-active')) {
                        if (this.resetIcon) this.resetIcon.src = '/static/icons/resetbutton.svg';
                        
                        console.log("VideoWidget9 activated - showing last frame with political music");
                        
                        // Ensure political background music continues playing
                        this.ensurePoliticalMusicPlaying();
                        
                        // Start 45-second auto-reset timer
                        this.startAutoResetTimer();
                    } else {
                        if (this.resetIcon) this.resetIcon.src = '/static/icons/resetbutton.svg';
                        
                        // Clear auto-reset timer when widget becomes inactive
                        this.clearAutoResetTimer();
                    }
                }
            });
        });

        this.observer.observe(this.element, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    startAutoResetTimer() {
        // Clear any existing timers first
        this.clearAutoResetTimer();
        
        console.log(`VideoWidget9: Starting 45-second auto-reset timer with visual countdown`);
        
        // Reset countdown
        this.remainingTime = 45;
        
        // Show countdown display
        if (this.countdownDisplay) {
            this.countdownDisplay.style.display = 'block';
        }
        
        // Update countdown every second
        this.countdownInterval = setInterval(() => {
            this.remainingTime--;
            
            if (this.countdownTimer) {
                this.countdownTimer.textContent = this.remainingTime;
            }
            
            // Change color to red when under 10 seconds
            if (this.countdownDisplay && this.remainingTime <= 10) {
                this.countdownDisplay.style.backgroundColor = 'rgba(220, 38, 38, 0.8)'; // red
            }
            
            // Ensure political music continues playing every 10 seconds
            if (this.remainingTime % 10 === 0) {
                this.ensurePoliticalMusicPlaying();
            }
            
            if (this.remainingTime <= 0) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
        }, 1000);
        
        // Set the main auto-reset timer
        this.autoResetTimer = setTimeout(() => {
            console.log("VideoWidget9: 45-second timeout reached - triggering automatic reset");
            this.handleAutoReset();
        }, this.autoResetTimeout);
    }

    clearAutoResetTimer() {
        if (this.autoResetTimer) {
            clearTimeout(this.autoResetTimer);
            this.autoResetTimer = null;
        }
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        // Hide countdown display
        if (this.countdownDisplay) {
            this.countdownDisplay.style.display = 'none';
            this.countdownDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; // reset to black
        }
        
        // Reset countdown timer display
        if (this.countdownTimer) {
            this.countdownTimer.textContent = '45';
        }
        
        console.log("VideoWidget9: Auto-reset timer and countdown cleared");
    }

    handleAutoReset() {
        console.log("VideoWidget9: Automatic reset after 45 seconds of inactivity");
        
        // Trigger the same reset logic as manual reset
        // Show visual feedback briefly
        if (this.resetIcon) {
            this.resetIcon.src = '/static/icons/resetbuttonfilled.svg';
            setTimeout(() => {
                if (this.resetIcon) {
                    this.resetIcon.src = '/static/icons/resetbutton.svg';
                }
            }, 500);
        }
        
        // Dispatch custom reset event to main.js for comprehensive reset
        const resetEvent = new CustomEvent('comprehensiveReset', {
            detail: { 
                source: 'VideoWidget9_AutoReset',
                automatic: true,
                timeout: this.autoResetTimeout
            }
        });
        document.dispatchEvent(resetEvent);
        
        // Fallback - if main.js doesn't handle it, use direct application restart
        setTimeout(() => {
            console.log("VideoWidget9: Auto-reset fallback - complete application restart");
            window.location.href = '/index.html';
        }, 1000);
    }

    deactivate() {
        // Clear auto-reset timer when deactivating
        this.clearAutoResetTimer();
        
        // Reset reset icon to unfilled state
        if (this.resetIcon) {
            this.resetIcon.src = '/static/icons/resetbutton.svg';
        }
        
        if (this.observer) {
            this.observer.disconnect();
        }
        
        document.removeEventListener('keydown', this.handleKeyDown);
        
        console.log('VideoWidget9 deactivated');
    }

    activate() {
        // Reinitialize the mutation observer if it was disconnected
        if (!this.observer) {
            this.setupMutationObserver();
        }
        
        // Ensure political background music continues playing
        console.log("VideoWidget9: activate() called - ensuring political music continues");
        this.ensurePoliticalMusicPlaying();
        
        // Re-attach keyboard event listener
        document.addEventListener('keydown', this.handleKeyDown);
        
        // If widget is already active, start the auto-reset timer
        if (this.element.classList.contains('widget-active')) {
            this.startAutoResetTimer();
        }
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        document.removeEventListener('keydown', this.handleKeyDown);
        
        super.destroy();
    }
}
