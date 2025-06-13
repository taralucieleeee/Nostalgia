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
        this.initializeResetMonitoring();
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
                // 50% volume for FirstWidget and SecondWidget
                this.backgroundMusic.volume = 0.5;
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
                // For Widget 1 (FirstWidget), let it handle its own navigation
                if (this.currentWidget === 1) {
                    // FirstWidget handles this itself - do nothing here
                    return;
                } else if (this.currentWidget === 2) {
                    // Toggle back to first widget with visual feedback
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
                // Enhanced reset functionality with debugging and fallbacks
                console.log('🔄 RESET TRIGGERED - Starting comprehensive reset process');
                this.performComprehensiveReset();
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
                // 50% volume for FirstWidget and SecondWidget
                this.backgroundMusic.volume = 0.5;
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

        // Listen for comprehensive reset events from widgets
        document.addEventListener('comprehensiveReset', (event) => {
            console.log(`🔄 Comprehensive reset triggered by: ${event.detail.source}`);
            this.performComprehensiveReset();
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
        // Set navigation icons to filled state during transition
        const nextIcon = document.getElementById('nextIcon');
        const backIcon = document.getElementById('backIcon');
        
        // Change icons to filled state and keep them filled during navigation
        if (nextIcon && nextIcon.src.includes('next.svg')) {
            nextIcon.src = '/static/icons/nextfilled.svg';
        }
        
        if (backIcon && backIcon.src.includes('back.svg')) {
            backIcon.src = '/static/icons/backfilled.svg';
        }
        
        // Icons will be reset when updateWidgetPositions() is called after navigation
    }

    navigateToWidget(direction) {
        const newWidget = this.currentWidget + direction;
        if (newWidget < 1 || newWidget > this.widgets.length) return;
        
        // Clean up current widget before navigation
        this.cleanupCurrentWidget();
        
        this.currentWidget = newWidget;
        this.updateWidgetPositions();
        this.updateNavigationButtons();
        
        // Handle background music based on current widget
        if (this.currentWidget <= 2) {
            // 50% volume for FirstWidget and SecondWidget
            this.backgroundMusic.volume = 0.5;
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
                // VideoWidget3 now shows an image by default, so we reset to secondpart.mp4 but keep it hidden
                source.src = '/static/videos/secondpart.mp4';
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
                // VideoWidget3 now shows an image by default, so we reset to secondpart.mp4 but keep it hidden
                source.src = '/static/videos/secondpart.mp4';
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
                
                // Call activate method if widget has one (for reset functionality)
                if (typeof widget.activate === 'function') {
                    widget.activate();
                }
            } else {
                widget.element.classList.remove('widget-active');
                widget.element.classList.add('widget-inactive');
            }
        });
        
        // Reset navigation button icons when changing widgets (after navigation is complete)
        setTimeout(() => {
            this.resetNavigationIcons();
        }, 50); // Small delay to ensure navigation is complete
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

    performComprehensiveReset() {
        this.resetAttempts++;
        this.lastResetTime = Date.now();
        this.updateDebugPanel('Starting Reset...');
        
        console.log(`🔄 COMPREHENSIVE RESET #${this.resetAttempts} - Phase 1: Preparation`);
        
        try {
            // Prevent interactions during reset
            document.body.style.pointerEvents = 'none';
            
            // Preserve voting data before reset
            this.preserveVotingData();
            
            // Phase 1: Clean up current state
            this.resetCurrentState();
            
            // Phase 2: Reset all widgets to initial state
            this.resetAllWidgets();
            
            // Phase 3: Reset audio system
            this.resetAudioSystem();
            
            // Phase 4: Reset navigation and UI
            this.resetNavigationSystem();
            
            // Phase 5: Navigate to initial widget
            this.navigateToInitialState();
            
            this.updateDebugPanel('Reset Complete');
            console.log(`✅ COMPREHENSIVE RESET #${this.resetAttempts} - All phases completed successfully`);
            
        } catch (error) {
            console.error(`❌ RESET ERROR #${this.resetAttempts} - Attempting fallback reset:`, error);
            this.updateDebugPanel('Reset Failed - Using Fallback');
            this.fallbackReset();
        }
    }

    preserveVotingData() {
        console.log('💾 RESET - Preserving voting data');
        
        try {
            // Preserve existing voting data
            const existingVote1 = localStorage.getItem('userVote');
            const existingVote2 = localStorage.getItem('userVote2');
            const audioState = localStorage.getItem('nostalgiaAudioState');
            
            // Create backup of important data
            const backupData = {
                vote1: existingVote1,
                vote2: existingVote2,
                audioState: audioState,
                timestamp: Date.now(),
                resetReason: 'comprehensive_reset'
            };
            
            localStorage.setItem('nostalgiaDataBackup', JSON.stringify(backupData));
            console.log('💾 RESET - Voting data preserved successfully');
            
        } catch (error) {
            console.error('❌ RESET - Failed to preserve voting data:', error);
        }
    }

    resetCurrentState() {
        console.log('🧹 RESET - Phase 1: Cleaning current state');
        
        try {
            // Stop and clean up all videos
            const allVideos = document.querySelectorAll('video');
            allVideos.forEach((video, index) => {
                try {
                    if (!video.paused) {
                        console.log(`🎬 RESET - Stopping video ${index + 1}`);
                        video.pause();
                        video.currentTime = 0;
                    }
                    video.src = '';
                    video.load();
                } catch (videoError) {
                    console.warn(`⚠️ RESET - Could not reset video ${index + 1}:`, videoError);
                }
            });
            
            // Clear any running timers/intervals
            this.clearAllTimers();
            
            console.log('✅ RESET - Current state cleaned');
            
        } catch (error) {
            console.error('❌ RESET - Failed to clean current state:', error);
        }
    }

    resetAllWidgets() {
        console.log('🔧 RESET - Phase 2: Resetting all widgets');
        
        try {
            this.widgets.forEach((widget, index) => {
                try {
                    const widgetNum = index + 1;
                    console.log(`🔧 RESET - Resetting Widget ${widgetNum}`);
                    
                    // Call deactivate method if available
                    if (typeof widget.deactivate === 'function') {
                        widget.deactivate();
                    }
                    
                    // Reset widget classes
                    if (widget.element) {
                        widget.element.classList.remove('widget-active');
                        widget.element.classList.add('widget-inactive');
                    }
                    
                    // Special reset logic for specific widgets
                    this.resetSpecificWidget(widget, widgetNum);
                    
                } catch (widgetError) {
                    console.warn(`⚠️ RESET - Could not reset widget ${index + 1}:`, widgetError);
                }
            });
            
            console.log('✅ RESET - All widgets reset');
            
        } catch (error) {
            console.error('❌ RESET - Failed to reset widgets:', error);
        }
    }

    resetSpecificWidget(widget, widgetNum) {
        try {
            // Reset specific widget states
            switch (widgetNum) {
                case 2: // SecondWidget
                    if (widget.countdownTimer) {
                        clearTimeout(widget.countdownTimer);
                        widget.countdownTimer = null;
                    }
                    if (widget.countdownContainer) {
                        widget.countdownContainer.style.opacity = '0';
                    }
                    if (widget.countdownBar) {
                        widget.countdownBar.style.transition = 'none';
                        widget.countdownBar.style.width = '100%';
                    }
                    break;
                    
                case 3: // VideoWidget
                case 4: // VideoWidget2
                case 5: // VideoWidget3
                case 6: // VideoWidget4
                case 10: // VideoWidget8
                case 12: // VideoWidget10
                    // Reset video widgets to their initial video sources
                    const videoElement = widget.element?.querySelector('video');
                    if (videoElement) {
                        videoElement.pause();
                        videoElement.currentTime = 0;
                        
                        // Reset to initial video source
                        const source = videoElement.querySelector('source');
                        if (source) {
                            switch (widgetNum) {
                                case 5: // VideoWidget3 - now shows image, reset video source but keep hidden
                                    source.src = '/static/videos/secondpart.mp4';
                                    break;
                                case 6: // VideoWidget4
                                    source.src = '/static/videos/politics_1.mp4';
                                    break;
                                case 10: // VideoWidget8
                                    source.src = '/static/videos/politics_3.mp4';
                                    break;
                                case 12: // VideoWidget10
                                    source.src = '/static/videos/rising.mp4';
                                    break;
                            }
                            videoElement.load();
                        }
                    }
                    break;
                    
                case 7: // VideoWidget5
                case 8: // VideoWidget6
                case 9: // VideoWidget7
                    // Reset law widgets - ensure all buttons are in default state
                    const buttons = widget.element?.querySelectorAll('.law-button');
                    buttons?.forEach(button => {
                        const img = button.querySelector('img');
                        if (img) {
                            img.src = img.src.replace('filled', '').replace('chosen', '');
                        }
                    });
                    break;
            }
        } catch (error) {
            console.warn(`⚠️ RESET - Could not apply specific reset for widget ${widgetNum}:`, error);
        }
    }

    resetAudioSystem() {
        console.log('🎵 RESET - Phase 3: Resetting audio system');
        
        try {
            // Reset background music
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
                this.backgroundMusic.volume = 0.5; // Reset to 50% volume for widget 1
            }
            
            // Clear any audio-related localStorage except voting data
            const audioState = localStorage.getItem('nostalgiaAudioState');
            if (audioState) {
                localStorage.removeItem('nostalgiaAudioState');
            }
            
            console.log('✅ RESET - Audio system reset');
            
        } catch (error) {
            console.error('❌ RESET - Failed to reset audio system:', error);
        }
    }

    resetNavigationSystem() {
        console.log('🧭 RESET - Phase 4: Resetting navigation system');
        
        try {
            // Reset navigation icons
            this.resetNavigationIcons();
            
            // Reset navigation buttons
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            if (prevBtn) prevBtn.disabled = true; // Will be at widget 1
            if (nextBtn) nextBtn.disabled = false;
            
            console.log('✅ RESET - Navigation system reset');
            
        } catch (error) {
            console.error('❌ RESET - Failed to reset navigation system:', error);
        }
    }

    navigateToInitialState() {
        console.log('🏠 RESET - Phase 5: Navigating to initial state');
        
        try {
            // Set current widget to 1
            this.currentWidget = 1;
            
            // Update widget positions
            this.updateWidgetPositions();
            this.updateNavigationButtons();
            
            // Re-enable interactions after a delay
            setTimeout(() => {
                document.body.style.pointerEvents = 'auto';
                console.log('✅ RESET - Navigation to initial state completed');
            }, 500);
            
        } catch (error) {
            console.error('❌ RESET - Failed to navigate to initial state:', error);
            this.fallbackReset();
        }
    }

    clearAllTimers() {
        console.log('⏰ RESET - Clearing all timers');
        
        try {
            // Clear any widget-specific timers
            this.widgets.forEach((widget, index) => {
                try {
                    if (widget.countdownTimer) {
                        clearTimeout(widget.countdownTimer);
                        widget.countdownTimer = null;
                    }
                    if (widget.observer) {
                        widget.observer.disconnect();
                    }
                } catch (timerError) {
                    console.warn(`⚠️ RESET - Could not clear timer for widget ${index + 1}:`, timerError);
                }
            });
            
        } catch (error) {
            console.error('❌ RESET - Failed to clear timers:', error);
        }
    }

    fallbackReset() {
        console.log('🚨 FALLBACK RESET - Attempting simple page reload');
        
        try {
            // Preserve voting data one more time
            this.preserveVotingData();
            
            // Simple fallback - reload page to widget 1
            setTimeout(() => {
                window.location.href = '/?widget=1';
            }, 1000);
            
        } catch (error) {
            console.error('💥 CRITICAL RESET FAILURE - Manual intervention required:', error);
            alert('Reset failed. Please refresh the page manually.');
        }
    }

    // Debug and monitoring functionality
    initializeResetMonitoring() {
        // Add debug panel if in development mode
        if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
            this.createDebugPanel();
        }
        
        // Monitor reset attempts
        this.resetAttempts = 0;
        this.lastResetTime = null;
        
        // Add global error handler for reset failures
        window.addEventListener('error', (event) => {
            if (event.message.includes('RESET') || event.message.includes('reset')) {
                console.error('🚨 RESET ERROR DETECTED:', event.error);
                this.handleResetError(event.error);
            }
        });
    }

    createDebugPanel() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'resetDebugPanel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            display: none;
        `;
        
        debugPanel.innerHTML = `
            <div><strong>🔄 Reset Debug Panel</strong></div>
            <div>Current Widget: <span id="debugCurrentWidget">${this.currentWidget}</span></div>
            <div>Reset Attempts: <span id="debugResetAttempts">0</span></div>
            <div>Last Reset: <span id="debugLastReset">Never</span></div>
            <div>Status: <span id="debugStatus">Ready</span></div>
            <button onclick="this.parentElement.style.display='none'" style="margin-top:5px;padding:2px 5px;">Hide</button>
        `;
        
        document.body.appendChild(debugPanel);
        
        // Show debug panel with Ctrl+Shift+D
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    updateDebugPanel(status = 'Ready') {
        const panel = document.getElementById('resetDebugPanel');
        if (panel) {
            const currentWidgetSpan = document.getElementById('debugCurrentWidget');
            const resetAttemptsSpan = document.getElementById('debugResetAttempts');
            const lastResetSpan = document.getElementById('debugLastReset');
            const statusSpan = document.getElementById('debugStatus');
            
            if (currentWidgetSpan) currentWidgetSpan.textContent = this.currentWidget;
            if (resetAttemptsSpan) resetAttemptsSpan.textContent = this.resetAttempts;
            if (lastResetSpan) lastResetSpan.textContent = this.lastResetTime ? new Date(this.lastResetTime).toLocaleTimeString() : 'Never';
            if (statusSpan) statusSpan.textContent = status;
        }
    }

    handleResetError(error) {
        console.error('🚨 RESET ERROR HANDLER:', error);
        this.updateDebugPanel('Error: ' + error.message);
        
        // Attempt recovery
        setTimeout(() => {
            console.log('🔧 ATTEMPTING RESET RECOVERY');
            this.fallbackReset();
        }, 2000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WidgetManager();
});