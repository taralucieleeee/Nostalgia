# Comprehensive Reset System Documentation

## Overview
The comprehensive reset system ensures that the Nostalgia installation can be returned to its initial state from any point in the experience. This is crucial for multi-user exhibition contexts where the installation needs to be reliable and consistently reset between users.

## Features

### 🔄 **Robust Reset Functionality**
- **Multiple Trigger Methods**: 'R' key, Reset button (VideoWidget9), Custom events
- **Comprehensive State Cleanup**: Videos, timers, observers, widget states
- **Data Preservation**: Voting data is preserved during resets to prevent data loss
- **Fallback Mechanisms**: Multiple recovery layers if reset fails
- **Debug Monitoring**: Real-time tracking and error reporting

### 📊 **Data Persistence System**
- **Voting Data Backup**: Automatic backup before reset operations
- **Session Tracking**: Unique session IDs for data integrity
- **Interruption Recovery**: Restore voting progress after unexpected interruptions
- **Cross-Page Persistence**: Maintain state across page navigations

### 🛠 **Debug & Monitoring**
- **Real-time Debug Panel**: Press `Ctrl+Shift+D` to show/hide
- **Reset Attempt Tracking**: Monitor reset frequency and success rate
- **Error Recovery**: Automatic fallback mechanisms
- **Detailed Logging**: Comprehensive console logging for troubleshooting

## Reset Process

### Phase 1: Preparation
```
🔄 COMPREHENSIVE RESET - Phase 1: Preparation
├── Disable user interactions
├── Preserve voting data to backup
└── Initialize error handling
```

### Phase 2: Current State Cleanup
```
🧹 RESET - Phase 1: Cleaning current state
├── Stop all playing videos
├── Clear video sources
├── Clear all timers and observers
└── Clean up audio bleeding
```

### Phase 3: Widget Reset
```
🔧 RESET - Phase 2: Resetting all widgets
├── Call deactivate() on all widgets
├── Reset widget CSS classes
├── Apply widget-specific resets:
│   ├── SecondWidget: Reset countdown timer and bar
│   ├── VideoWidgets: Reset to initial video sources
│   └── LawWidgets: Reset button states
```

### Phase 4: Audio System Reset
```
🎵 RESET - Phase 3: Resetting audio system
├── Pause background music
├── Reset to beginning of track
├── Set volume to 100% (Widget 1 level)
└── Clear audio state storage
```

### Phase 5: Navigation Reset
```
🧭 RESET - Phase 4: Resetting navigation system
├── Reset navigation icons to default
├── Enable/disable appropriate buttons
└── Clear navigation state
```

### Phase 6: Navigate to Initial State
```
🏠 RESET - Phase 5: Navigating to initial state
├── Set currentWidget = 1
├── Update widget positions
├── Re-enable user interactions
└── Complete reset process
```

## Trigger Methods

### 1. Keyboard Reset ('R' Key)
- **Available**: All widgets
- **Behavior**: Triggers comprehensive reset
- **Visual Feedback**: Debug console logging
- **Fallback**: Page reload if reset fails

### 2. Reset Button (VideoWidget9)
- **Location**: Results screen (Widget 11)
- **Visual Feedback**: Icon changes to filled state
- **Event**: Dispatches 'comprehensiveReset' event
- **Fallback**: Direct URL navigation

### 3. Custom Events
- **Event Name**: 'comprehensiveReset'
- **Usage**: `document.dispatchEvent(new CustomEvent('comprehensiveReset', { detail: { source: 'WidgetName' } }))`
- **Handling**: Automatically triggers comprehensive reset

## Data Preservation

### Voting Data Backup Structure
```javascript
{
    vote1: "yes|no|null",
    vote2: "yes|no|null", 
    audioState: { isPlaying: boolean, currentTime: number },
    timestamp: 1234567890,
    resetReason: "comprehensive_reset"
}
```

### Session Tracking
```javascript
{
    sessionId: "session_1234567890_abc123def",
    step: "vote1_started|vote1_completed|vote2_started|vote2_completed",
    lastUpdate: 1234567890,
    data: { /* step-specific data */ }
}
```

## Debug Panel

### Keyboard Shortcut
- **Show/Hide**: `Ctrl+Shift+D`
- **Availability**: localhost or `?debug=true` in URL

### Information Displayed
- Current Widget Number
- Reset Attempt Count
- Last Reset Timestamp
- Current Status
- Hide Button

### Status Messages
- `Ready`: System ready for reset
- `Starting Reset...`: Reset in progress
- `Reset Complete`: Successful reset
- `Reset Failed - Using Fallback`: Error occurred, using fallback
- `Error: [message]`: Specific error details

## Error Handling

### Recovery Layers
1. **Primary**: Comprehensive reset with full cleanup
2. **Secondary**: Fallback reset with page reload
3. **Tertiary**: Manual intervention prompt

### Error Detection
- Global error event listener
- Try-catch blocks around all reset phases
- Timeout protection for async operations

### Fallback Mechanisms
```javascript
// Level 1: Retry current reset
this.performComprehensiveReset();

// Level 2: Simple page reload
window.location.href = '/?widget=1';

// Level 3: Manual intervention
alert('Reset failed. Please refresh the page manually.');
```

## Widget-Specific Reset Logic

### SecondWidget (Widget 2)
- Clear countdown timer
- Hide countdown container
- Reset countdown bar to 100%
- Ensure headphones button visible

### VideoWidget3 (Widget 5) 
- Reset to `archbridge_agree.mp4`
- Clear any secondary video sources
- Reset playback state

### VideoWidget4 (Widget 6)
- Reset to `politics_1.mp4`
- Clear politics_2 state
- Reset navigation controls

### VideoWidget8 (Widget 10)
- Reset to `politics_3.mp4`
- Clear any other video states

### VideoWidget10 (Widget 12)
- Reset to `rising.mp4`
- Reset video controls

### Law Widgets (Widgets 7, 8, 9)
- Reset all button icons to unfilled state
- Clear any 'chosen' or 'filled' states
- Reset interaction states

## Best Practices

### For Developers
1. Always test reset from every widget
2. Monitor console for reset-related errors
3. Use debug panel during development
4. Test voting data preservation
5. Verify audio state restoration

### For Exhibition Setup
1. Add `?debug=true` to URL during testing
2. Monitor reset frequency and success rate
3. Test reset under various load conditions
4. Ensure network connectivity for voting persistence
5. Have manual reset procedure ready

## Testing Checklist

### Basic Reset Functionality
- [ ] Reset works from every widget
- [ ] All videos stop and reset to initial state
- [ ] All animations reset to beginning
- [ ] All buttons return to default state
- [ ] Navigation icons reset properly
- [ ] Audio resets to Widget 1 settings

### Data Persistence
- [ ] Voting data preserved during reset
- [ ] Session tracking continues across resets
- [ ] Data recovery works after interruption
- [ ] Backup data created correctly

### Error Handling
- [ ] Fallback reset works when primary fails
- [ ] Manual intervention prompt appears on critical failure
- [ ] Debug panel shows accurate information
- [ ] Error recovery mechanisms activate

### Multi-User Scenarios
- [ ] Rapid consecutive resets work properly
- [ ] Data doesn't leak between sessions
- [ ] Performance remains stable under load
- [ ] Reset timing is appropriate for exhibition use

## Troubleshooting

### Common Issues
1. **Reset doesn't trigger**: Check for JavaScript errors, ensure event listeners are attached
2. **Voting data lost**: Check localStorage backup, verify preservation logic
3. **Videos don't reset**: Check video source reset logic, verify element selectors
4. **Audio doesn't reset**: Check audio element state, verify volume settings

### Debug Steps
1. Open browser console
2. Press `Ctrl+Shift+D` to show debug panel
3. Monitor reset attempts and status
4. Check localStorage for preserved data
5. Verify widget states after reset

## Technical Details

### Dependencies
- Modern browser with localStorage support
- JavaScript ES6+ support
- DOM manipulation capabilities
- Audio/Video element support

### Performance Considerations
- Reset operation takes ~500ms
- Voting data backup is lightweight (<1KB)
- Video reset may take additional time for loading
- Audio reset is nearly instantaneous

### Browser Compatibility
- Chrome: Full support
- Firefox: Full support  
- Safari: Full support
- Edge: Full support

## Maintenance

### Regular Checks
- Monitor reset success rate
- Check for console errors
- Verify data persistence integrity
- Test fallback mechanisms

### Updates Required When
- Adding new widgets
- Changing video sources
- Modifying audio behavior
- Adding new interactive elements
