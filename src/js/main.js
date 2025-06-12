import { FirstWidget } from './widgets/FirstWidget.js';
import { SecondWidget } from './widgets/SecondWidget.js';
import { VideoWidget } from './widgets/VideoWidget.js';
import { VideoWidget2 } from './widgets/VideoWidget2.js';
import { VideoWidget3 } from './widgets/VideoWidget3.js';
import { VideoWidget4 } from './widgets/VideoWidget4.js';
import { VideoWidget5 } from './widgets/VideoWidget5.js';
import { VideoWidget6 } from './widgets/VideoWidget6.js';
import { VideoWidget7 } from './widgets/VideoWidget7.js';
import { VideoWidget8 } from './widgets/VideoWidget8.js';
import { VideoWidget9 } from './widgets/VideoWidget9.js';
import { VideoWidget10 } from './widgets/VideoWidget10.js';

class WidgetManager {
    constructor() {
        this.widgetContainer = document.getElementById('widgetContainer');
        this.currentWidget = this.getInitialWidget();
        this.widgets = [];
        this.backgroundMusic = document.getElementById('bgMusic');
        this.backgroundMusic.loop = true; // Enable continuous looping
        this.setupAudioContext();
        this.setupCrossPageAudio();
        this.init();
    }

    getInitialWidget() {
        // Check URL parameters for starting widget
        const urlParams = new URLSearchParams(window.location.search);
        const widgetParam = urlParams.get('widget');
        if (widgetParam) {
            const widgetNum = parseInt(widgetParam);
            if (widgetNum >= 1 && widgetNum <= 12) {
                return widgetNum;
            }
        }
        return 1; // Default to first widget
    }

    setupAudioContext() {
        // Create audio context on user interaction
        const handleFirstInteraction = () => {
            if (this.currentWidget <= 2) {
                // Full volume for FirstWidget and SecondWidget
                this.backgroundMusic.volume = 1.0;
                this.backgroundMusic.play().catch(e => console.log('Audio playback failed:', e));
            } else if (this.currentWidget <= 5) {
                // Subtle volume for VideoWidget, VideoWidget2, VideoWidget3 (until politics_1 video)
                this.backgroundMusic.volume = 0.15;
                this.backgroundMusic.play().catch(e => console.log('Audio playback failed:', e));
            }
            // Remove the event listeners once audio is playing
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };

        // Add event listeners for first interaction
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);
    }

    setupCrossPageAudio() {
        // Save audio state when leaving page (for vote.html/results.html navigation)
        window.addEventListener('beforeunload', () => {
            const audioState = {
                isPlaying: !this.backgroundMusic.paused,
                currentTime: this.backgroundMusic.currentTime
            };
            localStorage.setItem('nostalgiaAudioState', JSON.stringify(audioState));
        });
        
        // Try to restore audio state from previous page (if returning from vote/results)
        const audioState = localStorage.getItem('nostalgiaAudioState');
        if (audioState) {
            const state = JSON.parse(audioState);
            if (state.isPlaying && state.currentTime !== undefined) {
                // Set the time but don't auto-play yet (will start on user interaction)
                this.backgroundMusic.currentTime = state.currentTime;
            }
            // Clear the stored state since we've restored it
            localStorage.removeItem('nostalgiaAudioState');
        }
    }

    init() {
        // Clear container
        this.widgetContainer.innerHTML = '';
        
        // Initialize widgets
        this.widgets = [
            new FirstWidget(this.widgetContainer, 1),
            new SecondWidget(this.widgetContainer, 2),
            new VideoWidget(this.widgetContainer, 3),
            new VideoWidget2(this.widgetContainer, 4),
            new VideoWidget3(this.widgetContainer, 5),
            new VideoWidget4(this.widgetContainer, 6),
            new VideoWidget5(this.widgetContainer, 7),
            new VideoWidget6(this.widgetContainer, 8),
            new VideoWidget7(this.widgetContainer, 9),
            new VideoWidget8(this.widgetContainer, 10),
            new VideoWidget9(this.widgetContainer, 11),
            new VideoWidget10(this.widgetContainer, 12)
        ];

        // Mount all widgets
        this.widgets.forEach(widget => widget.mount());
        
        // Set initial widget positions based on currentWidget
        this.updateWidgetPositions();
        this.updateNavigationButtons();
        
        // Set up navigation
        this.setupNavigation();

        // Music will start playing on first user interaction
    }

    setupNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.addEventListener('click', () => {
            this.applyVisualFeedbackAndNavigate(() => {
                this.navigateToWidget(-1);
            });
        });
        nextBtn.addEventListener('click', () => {
            // If on VideoWidget (widget 3), redirect to vote.html immediately
            if (this.currentWidget === 3) {
                this.applyVisualFeedbackAndRedirect('/vote.html');
            } else {
                this.applyVisualFeedbackAndNavigate(() => {
                    this.navigateToWidget(1);
                });
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'f') {
                // Toggle between first and second widget with visual feedback
                if (this.currentWidget === 1) {
                    this.applyVisualFeedbackAndNavigate(() => {
                        this.navigateToWidget(1);
                    });
                } else if (this.currentWidget === 2) {
                    this.applyVisualFeedbackAndNavigate(() => {
                        this.navigateToWidget(-1);
                    });
                }
            } else if (key === 'a') {
                // Special case: if on widget 4 (VideoWidget2), let it handle its own navigation
                if (this.currentWidget === 4) {
                    // VideoWidget2 handles this itself - do nothing here
                    return;
                } else if (this.currentWidget === 5) {
                    // VideoWidget3 handles this itself - do nothing here
                    return;
                } else if (this.currentWidget === 6) {
                    // VideoWidget4 handles this itself - do nothing here
                    return;
                } else if (this.currentWidget === 7) {
                    // VideoWidget5 handles this itself - do nothing here
                    return;
                }
                this.applyVisualFeedbackAndNavigate(() => {
                    this.navigateToWidget(-1);
                });
            } else if (key === 'd') {
                // Special case: if on widget 3 (VideoWidget), redirect to vote.html immediately
                if (this.currentWidget === 3) {
                    this.applyVisualFeedbackAndRedirect('/vote.html');
                } else if (this.currentWidget === 4) {
                    // VideoWidget2 handles this itself - do nothing here
                    return;
                } else if (this.currentWidget === 5) {
                    // VideoWidget3 handles this itself - do nothing here
                    return;
                } else if (this.currentWidget === 6) {
                    // VideoWidget4 handles this itself - do nothing here
                    return;
                } else if (this.currentWidget === 7) {
                    // VideoWidget5 handles this itself - do nothing here
                    return;
                } else {
                    // Navigate to next widget (e.g., SecondWidget -> VideoWidget)
                    this.applyVisualFeedbackAndNavigate(() => {
                        this.navigateToWidget(1);
                    });
                }
            } else if (key === 'r') {
                // Reset to first widget - works for all widgets
                this.applyVisualFeedbackAndNavigate(() => {
                    this.navigateToWidget(1 - this.currentWidget);
                });
            }
        });

        // Listen for custom navigation events from widgets
        document.addEventListener('navigateToWidget', (event) => {
            const targetWidget = event.detail.targetWidget;
            console.log(`Custom navigation event: moving to widget ${targetWidget}`);
            
            // Clean up current widget before navigation
            this.cleanupCurrentWidget();
            
            this.currentWidget = targetWidget;
            this.updateWidgetPositions();
            this.updateNavigationButtons();
            
            // Handle background music based on current widget
            if (this.currentWidget <= 2) {
                // Full volume for FirstWidget and SecondWidget
                this.backgroundMusic.volume = 1.0;
                if (this.backgroundMusic.paused) {
                    this.backgroundMusic.play().catch(e => console.log('Audio playback failed:', e));
                }
            } else if (this.currentWidget <= 5) {
                // Subtle volume for VideoWidget, VideoWidget2, VideoWidget3 (until politics_1 video)
                this.backgroundMusic.volume = 0.15;
                if (this.backgroundMusic.paused) {
                    this.backgroundMusic.play().catch(e => console.log('Audio playback failed:', e));
                }
            } else {
                // Stop completely from VideoWidget4 (politics_1 video) onwards
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
            }
        });

        this.updateNavigationButtons();
    }

    applyVisualFeedbackAndNavigate(navigationFunction) {
        // Prevent interactions during transition
        document.body.style.pointerEvents = 'none';
        
        // Clean up any potential audio bleeding first
        this.cleanupCurrentWidget();
        
        // Apply visual feedback (could be icon changes, etc.)
        this.showNavigationFeedback();
        
        // Execute navigation after 1 second
        setTimeout(() => {
            navigationFunction();
            // Re-enable interactions
            document.body.style.pointerEvents = 'auto';
        }, 1000);
    }

    applyVisualFeedbackAndRedirect(url) {
        // Prevent interactions during transition
        document.body.style.pointerEvents = 'none';
        
        // Save audio state before redirect
        const audioState = {
            isPlaying: !this.backgroundMusic.paused,
            currentTime: this.backgroundMusic.currentTime
        };
        localStorage.setItem('nostalgiaAudioState', JSON.stringify(audioState));
        
        // Clean up current widget
        this.cleanupCurrentWidget();
        
        // Apply visual feedback
        this.showNavigationFeedback();
        
        // Redirect after 1 second
        setTimeout(() => {
            window.location.href = url;
        }, 1000);
    }

    showNavigationFeedback() {
        // Visual feedback could include icon changes, flash effects, etc.
        // For now, we'll just ensure any navigation icons show feedback
        const nextIcon = document.getElementById('nextIcon');
        const backIcon = document.getElementById('backIcon');
        
        // Temporarily change icons to show interaction
        if (nextIcon && nextIcon.src.includes('next.svg')) {
            nextIcon.src = '/static/icons/nextfilled.svg';
            setTimeout(() => {
                nextIcon.src = '/static/icons/next.svg';
            }, 1000);
        }
        
        if (backIcon && backIcon.src.includes('back.svg')) {
            backIcon.src = '/static/icons/backfilled.svg';
            setTimeout(() => {
                backIcon.src = '/static/icons/back.svg';
            }, 1000);
        }
    }

    navigateToWidget(direction) {
        const newWidget = this.currentWidget + direction;
        if (newWidget < 1 || newWidget > this.widgets.length) return;
        
        // Clean up current widget before navigation
        this.cleanupCurrentWidget();
        
        // Reset icon states before changing widget
        this.resetNavigationIcons();
        
        this.currentWidget = newWidget;
        this.updateWidgetPositions();
        this.updateNavigationButtons();
        
        // Handle background music based on current widget
        if (this.currentWidget <= 2) {
            // Full volume for FirstWidget and SecondWidget
            this.backgroundMusic.volume = 1.0;
            if (this.backgroundMusic.paused) {
                this.backgroundMusic.play().catch(e => console.log('Audio playbook failed:', e));
            }
        } else if (this.currentWidget <= 5) {
            // Subtle volume for VideoWidget, VideoWidget2, VideoWidget3 (until politics_1 video)
            this.backgroundMusic.volume = 0.15;
            if (this.backgroundMusic.paused) {
                this.backgroundMusic.play().catch(e => console.log('Audio playback failed:', e));
            }
        } else {
            // Stop completely from VideoWidget4 (politics_1 video) onwards
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
        
        // Extra safety: ensure video cleanup when not on VideoWidget3
        if (this.currentWidget !== 5) {
            this.preventVideoAudioBleeding();
        }
    }

    preventVideoAudioBleeding() {
        // Find VideoWidget3's video element and ensure it's not playing any videos
        const videoWidget3Element = document.querySelector('[data-widget="5"] video');
        if (videoWidget3Element) {
            const source = videoWidget3Element.querySelector('source');
            if (source && (source.src.includes('secondpart.mp4') || source.src.includes('presentmoods.mp4'))) {
                console.log('Preventing video audio bleeding - resetting VideoWidget3');
                videoWidget3Element.pause();
                videoWidget3Element.currentTime = 0;
                source.src = '/static/videos/archbridge_agree.mp4';
                videoWidget3Element.load();
            }
        }
    }

    cleanupCurrentWidget() {
        console.log('Cleaning up current widget to prevent audio bleeding');
        
        // Stop any playing videos and clear their sources to prevent audio bleeding
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach((video, index) => {
            if (!video.paused) {
                console.log(`Stopping video ${index + 1}: ${video.src}`);
                video.pause();
                video.currentTime = 0;
            }
            // Clear source and reload to stop any background loading
            const currentSrc = video.src;
            if (currentSrc) {
                video.src = '';
                video.load();
            }
        });
        
        // Specifically target any videos that might be preloading
        const videoWidget3 = document.getElementById('mainVideo3');
        if (videoWidget3) {
            const source = videoWidget3.querySelector('source');
            if (source && (source.src.includes('secondpart.mp4') || source.src.includes('presentmoods.mp4'))) {
                console.log('⚠️ FOUND PLAYING VIDEO - Cleaning up to prevent audio bleeding');
                videoWidget3.pause();
                videoWidget3.currentTime = 0;
                source.src = '/static/videos/archbridge_agree.mp4'; // Reset to default
                videoWidget3.load();
            }
        }
        
        // Call deactivate on current widget if it has the method
        const currentWidgetObj = this.widgets[this.currentWidget - 1];
        if (currentWidgetObj && typeof currentWidgetObj.deactivate === 'function') {
            currentWidgetObj.deactivate();
        }
    }

    updateWidgetPositions() {
        this.widgets.forEach(widget => {
            const widgetNum = parseInt(widget.element.dataset.widget);
            if (widgetNum === this.currentWidget) {
                widget.element.classList.add('widget-active');
                widget.element.classList.remove('widget-inactive');
            } else {
                widget.element.classList.remove('widget-active');
                widget.element.classList.add('widget-inactive');
            }
        });
        
        // Reset navigation button icons when changing widgets
        this.resetNavigationIcons();
    }
    
    resetNavigationIcons() {
        // Reset navigation button icons to default state
        const backIcon = document.getElementById('backIcon');
        const nextIcon = document.getElementById('nextIcon');
        if (backIcon) backIcon.src = '/static/icons/back.svg';
        if (nextIcon) nextIcon.src = '/static/icons/next.svg';
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        prevBtn.disabled = this.currentWidget === 1;
        nextBtn.disabled = this.currentWidget === this.widgets.length;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WidgetManager();
});