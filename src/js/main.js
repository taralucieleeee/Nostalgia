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
import { VideoWidget11 } from './widgets/VideoWidget11.js';

class WidgetManager {
    constructor() {
        this.widgetContainer = document.getElementById('widgetContainer');
        this.currentWidget = this.getInitialWidget();
        this.widgets = [];
        this.backgroundMusic = document.getElementById('bgMusic');
        this.politicalMusic = document.getElementById('politicalMusic');
        this.backgroundMusic.loop = true; // Enable continuous looping
        this.politicalMusic.loop = true; // Enable continuous looping
        this.currentAudioTrack = 'lavender'; // Track which audio is currently active
        this.setupAudioContext();
        this.setupCrossPageAudio();
        this.init();
        this.initializeResetMonitoring();
    }

    // Method to switch between audio tracks
    switchAudioTrack(trackName, volume = 0.08) {
        console.log(`🎵 Switching audio track to: ${trackName} at ${Math.round(volume * 100)}% volume`);
        
        if (trackName === 'political' && this.currentAudioTrack !== 'political') {
            // Switch from lavender to political
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            
            this.politicalMusic.volume = volume;
            this.politicalMusic.currentTime = 0;
            this.politicalMusic.play().catch(e => console.log('Political music playback failed:', e));
            
            this.currentAudioTrack = 'political';
            console.log('✅ Switched to political party music');
            
        } else if (trackName === 'lavender' && this.currentAudioTrack !== 'lavender') {
            // Switch from political to lavender
            this.politicalMusic.pause();
            this.politicalMusic.currentTime = 0;
            
            this.backgroundMusic.volume = volume;
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.play().catch(e => console.log('Lavender music playback failed:', e));
            
            this.currentAudioTrack = 'lavender';
            console.log('✅ Switched to lavender soundtrack');
            
        } else if (trackName === this.currentAudioTrack) {
            // Just update volume for current track
            if (this.currentAudioTrack === 'political') {
                this.politicalMusic.volume = volume;
                if (this.politicalMusic.paused) {
                    this.politicalMusic.play().catch(e => console.log('Political music playback failed:', e));
                }
            } else {
                this.backgroundMusic.volume = volume;
                if (this.backgroundMusic.paused) {
                    this.backgroundMusic.play().catch(e => console.log('Lavender music playback failed:', e));
                }
            }
        }
    }

    // Method to stop all audio
    stopAllAudio() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
        this.politicalMusic.pause();
        this.politicalMusic.currentTime = 0;
        console.log('🔇 All audio stopped');
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
            if (this.currentWidget === 1) {
                // 50% volume for FirstWidget only - lavender soundtrack
                this.switchAudioTrack('lavender', 0.5);
            } else if (this.currentWidget <= 5) {
                // 8% volume from SecondWidget onwards (until politics_1 video) - lavender soundtrack
                this.switchAudioTrack('lavender', 0.08);
            } else {
                // From VideoWidget4 (politics_1) onwards - political party music at 8%
                this.switchAudioTrack('political', 0.08);
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
                currentTrack: this.currentAudioTrack,
                lavenderIsPlaying: !this.backgroundMusic.paused,
                lavenderCurrentTime: this.backgroundMusic.currentTime,
                politicalIsPlaying: !this.politicalMusic.paused,
                politicalCurrentTime: this.politicalMusic.currentTime
            };
            localStorage.setItem('nostalgiaAudioState', JSON.stringify(audioState));
        });
        
        // Try to restore audio state from previous page (if returning from vote/results)
        const audioState = localStorage.getItem('nostalgiaAudioState');
        if (audioState) {
            const state = JSON.parse(audioState);
            if (state.currentTrack) {
                this.currentAudioTrack = state.currentTrack;
                
                if (state.currentTrack === 'lavender' && state.lavenderIsPlaying && state.lavenderCurrentTime !== undefined) {
                    // Set the time but don't auto-play yet (will start on user interaction)
                    this.backgroundMusic.currentTime = state.lavenderCurrentTime;
                } else if (state.currentTrack === 'political' && state.politicalIsPlaying && state.politicalCurrentTime !== undefined) {
                    // Set the time but don't auto-play yet (will start on user interaction)
                    this.politicalMusic.currentTime = state.politicalCurrentTime;
                }
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
            new VideoWidget10(this.widgetContainer, 12),
            new VideoWidget11(this.widgetContainer, 13)
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
            
            // CRITICAL: Extra safeguard for FirstWidget - ensure NO videos are playing
            if (targetWidget === 1) {
                console.log('🚨 NAVIGATING TO FIRSTWIDGET - Extra video cleanup to prevent transititonvote2 audio bleeding');
                const allVideos = document.querySelectorAll('video');
                allVideos.forEach((video, index) => {
                    if (!video.paused) {
                        console.log(`🛑 FIRST WIDGET SAFEGUARD: Stopping video ${index + 1}: ${video.src}`);
                    }
                    video.pause();
                    video.muted = true;
                    video.currentTime = 0;
                    video.autoplay = false;
                });
            }
            
            this.currentWidget = targetWidget;
            this.updateWidgetPositions();
            this.updateNavigationButtons();
            
            // Handle background music based on current widget
            if (this.currentWidget === 1) {
                // 50% volume for FirstWidget only - lavender soundtrack
                this.switchAudioTrack('lavender', 0.5);
            } else if (this.currentWidget <= 5) {
                // 8% volume from SecondWidget onwards (until politics_1 video) - lavender soundtrack
                this.switchAudioTrack('lavender', 0.08);
            } else {
                // From VideoWidget4 (politics_1) onwards - political party music at 8%
                this.switchAudioTrack('political', 0.08);
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
            currentTrack: this.currentAudioTrack,
            lavenderIsPlaying: !this.backgroundMusic.paused,
            lavenderCurrentTime: this.backgroundMusic.currentTime,
            politicalIsPlaying: !this.politicalMusic.paused,
            politicalCurrentTime: this.politicalMusic.currentTime
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

    navigateToWidget(direction = 1) {
        const newWidget = this.currentWidget + direction;
        if (newWidget < 1 || newWidget > this.widgets.length) return;
        
        // Clean up current widget before navigation
        this.cleanupCurrentWidget();
        
        this.currentWidget = newWidget;
        this.updateWidgetPositions();
        this.updateNavigationButtons();
        
        // Handle background music based on current widget
        if (this.currentWidget === 1) {
            // 50% volume for FirstWidget only - lavender soundtrack
            this.switchAudioTrack('lavender', 0.5);
        } else if (this.currentWidget <= 5) {
            // 8% volume from SecondWidget onwards (until politics_1 video) - lavender soundtrack
            this.switchAudioTrack('lavender', 0.08);
        } else {
            // From VideoWidget4 (politics_1) onwards - political party music at 8%
            this.switchAudioTrack('political', 0.08);
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
            if (source && source.src.includes('secondpart.mp4')) {
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
        console.log('Simple cleanup to prevent audio bleeding - just mute videos');
        
        // Use SimpleVideoManager for basic video muting
        SimpleVideoManager.muteAllVideos();
        
        // Call deactivate on current widget if it has the method
        const currentWidgetObj = this.widgets[this.currentWidget - 1];
        if (currentWidgetObj && typeof currentWidgetObj.deactivate === 'function') {
            currentWidgetObj.deactivate();
        }
        
        console.log('Simple cleanup completed - videos muted to prevent bleeding');
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
        // Generate unique reset ID for tracking
        const resetId = `RESET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const resetStartTime = performance.now();
        
        this.resetAttempts++;
        this.lastResetTime = Date.now();
        this.updateDebugPanel('Starting Reset...');
        
        // CRITICAL: Set global reset flag to prevent widget activations during reset
        window.resetInProgress = true;
        console.log(`🚨 [${resetId}] GLOBAL RESET FLAG SET - Blocking all widget activations`);
        
        console.log(`🔄 COMPREHENSIVE RESET #${this.resetAttempts} [${resetId}] - Starting complete application restart`);
        console.log(`📊 Reset Context: From Widget ${this.currentWidget}, Audio: ${this.currentAudioTrack}`);
        
        try {
            // Minimal preparation - just preserve data and redirect
            console.log(`💾 [${resetId}] Preserving voting data before restart`);
            this.preserveVotingData();
            
            // Disable interactions during redirect
            document.body.style.pointerEvents = 'none';
            
            // Clear global reset flag before redirect
            window.resetInProgress = false;
            console.log(`🚨 [${resetId}] Clearing global reset flag before redirect`);
            
            // Complete application restart - redirect to index.html immediately
            console.log(`🚀 [${resetId}] Redirecting to index.html for complete restart...`);
            window.location.href = '/index.html';
            
        } catch (error) {
            const totalResetTime = performance.now() - resetStartTime;
            console.error(`❌ RESET ERROR #${this.resetAttempts} [${resetId}] - Error after ${totalResetTime.toFixed(2)}ms:`, error);
            this.logResetError(resetId, error, totalResetTime);
            this.updateDebugPanel('Reset Failed - Using Fallback');
            // CRITICAL: Clear global reset flag even on error
            window.resetInProgress = false;
            console.log(`🚨 [${resetId}] Reset failed - clearing global reset flag`);
            this.fallbackReset(resetId);
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

    // ================================================================
    // SIMPLIFIED RESET SYSTEM - All complex reset methods removed
    // since we now do complete application restart via /index.html
    // ================================================================

    fallbackReset(resetId = 'FALLBACK') {
        console.log(`🚨 [${resetId}] FALLBACK RESET - Complete Application Restart`);
        
        try {
            // CRITICAL: Clear global reset flag
            window.resetInProgress = false;
            console.log(`🚨 [${resetId}] Fallback reset - clearing global reset flag`);
            
            // Log fallback attempt
            console.log(`🆘 [${resetId}] Primary reset failed, initiating fallback application restart`);
            
            // Preserve voting data one more time
            this.preserveVotingData();
            console.log(`💾 [${resetId}] Voting data preserved during fallback restart`);
            
            // Log current system state for debugging
            console.log(`📊 [${resetId}] Fallback state - Widget: ${this.currentWidget}, Videos playing: ${document.querySelectorAll('video:not([paused])').length}`);
            
            // Complete application restart - redirect to index.html
            console.log(`🔄 [${resetId}] Fallback redirecting to index.html for complete restart...`);
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1000);
            
        } catch (error) {
            console.error(`💥 [${resetId}] CRITICAL RESET FAILURE - Manual intervention required:`, error);
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
        this.resetHistory = []; // Track reset history for analysis
        this.successfulResets = 0;
        this.failedResets = 0;
        
        // Add global error handler for reset failures
        window.addEventListener('error', (event) => {
            if (event.message.includes('RESET') || event.message.includes('reset')) {
                console.error('🚨 RESET ERROR DETECTED:', event.error);
                this.handleResetError(event.error);
            }
        });
        
        // Log initialization
        console.log('🔧 Reset monitoring system initialized');
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
            <div><strong>🔄 Enhanced Reset Debug Panel</strong></div>
            <div>Current Widget: <span id="debugCurrentWidget">${this.currentWidget}</span></div>
            <div>Reset Attempts: <span id="debugResetAttempts">0</span></div>
            <div>Successful: <span id="debugSuccessfulResets">0</span></div>
            <div>Failed: <span id="debugFailedResets">0</span></div>
            <div>Success Rate: <span id="debugSuccessRate">0%</span></div>
            <div>Last Reset: <span id="debugLastReset">Never</span></div>
            <div>Status: <span id="debugStatus">Ready</span></div>
            <div style="margin-top:5px;">
                <button onclick="console.log('Reset History:', window.widgetManager?.resetHistory)" style="padding:2px 5px;margin-right:3px;">History</button>
                <button onclick="this.parentElement.parentElement.style.display='none'" style="padding:2px 5px;">Hide</button>
            </div>
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
            const successfulResetsSpan = document.getElementById('debugSuccessfulResets');
            const failedResetsSpan = document.getElementById('debugFailedResets');
            const successRateSpan = document.getElementById('debugSuccessRate');
            const lastResetSpan = document.getElementById('debugLastReset');
            const statusSpan = document.getElementById('debugStatus');
            
            if (currentWidgetSpan) currentWidgetSpan.textContent = this.currentWidget;
            if (resetAttemptsSpan) resetAttemptsSpan.textContent = this.resetAttempts || 0;
            if (successfulResetsSpan) successfulResetsSpan.textContent = this.successfulResets || 0;
            if (failedResetsSpan) failedResetsSpan.textContent = this.failedResets || 0;
            if (successRateSpan) {
                const rate = this.resetAttempts > 0 ? ((this.successfulResets || 0) / this.resetAttempts * 100).toFixed(1) : '0';
                successRateSpan.textContent = rate + '%';
            }
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

    logSystemStateBeforeReset(resetId) {
        const systemState = {
            resetId,
            timestamp: new Date().toISOString(),
            currentWidget: this.currentWidget,
            currentAudioTrack: this.currentAudioTrack,
            videosLoaded: document.querySelectorAll('video:not([src=""])').length,
            videosPlaying: document.querySelectorAll('video:not([paused])').length,
            activeWidgets: document.querySelectorAll('.widget-active').length,
            userInteractionEnabled: document.body.style.pointerEvents !== 'none',
            localStorage: {
                voteData: !!localStorage.getItem('userVote'),
                vote2Data: !!localStorage.getItem('userVote2'),
                audioState: !!localStorage.getItem('nostalgiaAudioState')
            }
        };
        
        console.log(`📊 [${resetId}] System State Before Reset:`, systemState);
        
        // Store in reset history
        this.resetHistory.push({
            ...systemState,
            phase: 'BEFORE_RESET'
        });
    }

    logCurrentWidgetState(resetId) {
        const currentWidgetObj = this.widgets[this.currentWidget - 1];
        const widgetState = {
            resetId,
            widgetNumber: this.currentWidget,
            widgetType: currentWidgetObj ? currentWidgetObj.constructor.name : 'Unknown',
            hasDeactivateMethod: !!(currentWidgetObj && typeof currentWidgetObj.deactivate === 'function'),
            hasActivateMethod: !!(currentWidgetObj && typeof currentWidgetObj.activate === 'function'),
            element: {
                exists: !!currentWidgetObj?.element,
                isActive: currentWidgetObj?.element?.classList.contains('widget-active'),
                hasVideos: (currentWidgetObj?.element?.querySelectorAll('video') || []).length > 0,
                hasTimers: !!(currentWidgetObj?.countdownTimer || currentWidgetObj?.observer)
            }
        };
        
        console.log(`🎯 [${resetId}] Current Widget State:`, widgetState);
    }

    logResetSuccess(resetId, totalTime) {
        this.successfulResets++;
        
        const successData = {
            resetId,
            timestamp: new Date().toISOString(),
            totalTime: totalTime.toFixed(2) + 'ms',
            resetAttempts: this.resetAttempts,
            successRate: ((this.successfulResets / this.resetAttempts) * 100).toFixed(1) + '%',
            finalState: {
                currentWidget: this.currentWidget,
                audioTrack: this.currentAudioTrack,
                interactionsEnabled: document.body.style.pointerEvents !== 'none'
            }
        };
        
        console.log(`🎉 [${resetId}] Reset Success Data:`, successData);
        
        // Store in reset history
        this.resetHistory.push({
            ...successData,
            phase: 'SUCCESS'
        });
        
        // Limit history to last 50 resets
        if (this.resetHistory.length > 100) {
            this.resetHistory = this.resetHistory.slice(-50);
        }
    }

    logResetError(resetId, error, totalTime) {
        this.failedResets++;
        
        const errorData = {
            resetId,
            timestamp: new Date().toISOString(),
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            totalTime: totalTime.toFixed(2) + 'ms',
            resetAttempts: this.resetAttempts,
            failureRate: ((this.failedResets / this.resetAttempts) * 100).toFixed(1) + '%',
            systemState: {
                currentWidget: this.currentWidget,
                videosStillPlaying: document.querySelectorAll('video:not([paused])').length,
                interactionsEnabled: document.body.style.pointerEvents !== 'none'
            }
        };
        
        console.error(`💥 [${resetId}] Reset Error Data:`, errorData);
        
        // Store in reset history
        this.resetHistory.push({
            ...errorData,
            phase: 'ERROR'
        });
    }
}

// Simple Video Management - just mute videos to prevent bleeding
class SimpleVideoManager {
    static muteAllVideos() {
        const allVideos = document.querySelectorAll('video');
        console.log(`SimpleVideoManager: Muting ${allVideos.length} video elements to prevent bleeding`);
        allVideos.forEach((video, index) => {
            if (!video.paused) {
                console.log(`SimpleVideoManager: Muting active video ${index + 1}`);
            }
            video.muted = true;
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.widgetManager = new WidgetManager();
});