// Audio Overlap Fix Console Test Script
// Copy and paste this into the browser console when testing

console.log('🎵 Audio Overlap Test Console Script Loaded');
console.log('This script helps test the AudioConflictManager and video widget fixes');

// Test function to check if AudioConflictManager is available
function testAudioConflictManager() {
    console.log('\n=== Testing AudioConflictManager ===');
    
    if (typeof AudioConflictManager === 'undefined') {
        console.error('❌ AudioConflictManager is not available');
        return false;
    }
    
    console.log('✅ AudioConflictManager is available');
    
    // Test methods existence
    const methods = [
        'immediateVideoSilence',
        'completeVideoReset', 
        'silenceAllVideos',
        'resetAllVideos',
        'preventAudioBleeding'
    ];
    
    methods.forEach(method => {
        if (typeof AudioConflictManager[method] === 'function') {
            console.log(`✅ AudioConflictManager.${method}() exists`);
        } else {
            console.error(`❌ AudioConflictManager.${method}() missing`);
        }
    });
    
    return true;
}

// Test function to find all video elements
function findAllVideos() {
    console.log('\n=== Finding All Video Elements ===');
    const videos = document.querySelectorAll('video');
    console.log(`Found ${videos.length} video elements:`);
    
    videos.forEach((video, index) => {
        console.log(`Video ${index + 1}:`, {
            src: video.src || 'No src',
            currentTime: video.currentTime,
            paused: video.paused,
            muted: video.muted,
            volume: video.volume,
            id: video.id || 'No id',
            className: video.className || 'No class'
        });
    });
    
    return videos;
}

// Test function to silence all videos manually
function testSilenceAllVideos() {
    console.log('\n=== Testing Manual Video Silencing ===');
    const videos = document.querySelectorAll('video');
    
    videos.forEach((video, index) => {
        console.log(`Silencing video ${index + 1}...`);
        video.muted = true;
        video.pause();
        video.currentTime = 0;
        video.volume = 0;
    });
    
    console.log('✅ All videos manually silenced');
}

// Test function to check widget states
function checkWidgetStates() {
    console.log('\n=== Checking Widget States ===');
    
    // Check if widgets are available
    const widgets = [
        'VideoWidget',
        'VideoWidget2', 
        'VideoWidget3',
        'VideoWidget4',
        'VideoWidget8',
        'VideoWidget10'
    ];
    
    widgets.forEach(widgetName => {
        if (typeof window[widgetName] !== 'undefined') {
            console.log(`✅ ${widgetName} is available`);
        } else {
            console.log(`ℹ️ ${widgetName} not found in global scope`);
        }
    });
}

// Test function for specific audio bleeding scenario
function testSecondPartPoliticsScenario() {
    console.log('\n=== Testing SecondPart → Politics Scenario ===');
    console.log('This test checks for the specific audio bleeding issue');
    
    // Find videos that might be secondpart or politics
    const videos = document.querySelectorAll('video');
    const secondPartVideo = Array.from(videos).find(v => 
        v.src && v.src.includes('secondpart')
    );
    const politicsVideo = Array.from(videos).find(v => 
        v.src && v.src.includes('politics')
    );
    
    if (secondPartVideo) {
        console.log('✅ Found secondpart video:', secondPartVideo.src);
        console.log('SecondPart video state:', {
            paused: secondPartVideo.paused,
            muted: secondPartVideo.muted,
            currentTime: secondPartVideo.currentTime,
            volume: secondPartVideo.volume
        });
    } else {
        console.log('ℹ️ SecondPart video not currently loaded');
    }
    
    if (politicsVideo) {
        console.log('✅ Found politics video:', politicsVideo.src);
        console.log('Politics video state:', {
            paused: politicsVideo.paused,
            muted: politicsVideo.muted,
            currentTime: politicsVideo.currentTime,
            volume: politicsVideo.volume
        });
    } else {
        console.log('ℹ️ Politics video not currently loaded');
    }
}

// Comprehensive test runner
function runAllTests() {
    console.log('🧪 Running All Audio Overlap Tests...\n');
    
    testAudioConflictManager();
    findAllVideos();
    checkWidgetStates();
    testSecondPartPoliticsScenario();
    
    console.log('\n🎯 Testing Complete!');
    console.log('Use the individual test functions to dig deeper:');
    console.log('- testAudioConflictManager()');
    console.log('- findAllVideos()');
    console.log('- testSilenceAllVideos()');
    console.log('- checkWidgetStates()');
    console.log('- testSecondPartPoliticsScenario()');
}

// Auto-run tests when script is loaded
console.log('Use runAllTests() to run all tests, or individual test functions');
console.log('Available functions:');
console.log('- runAllTests()');
console.log('- testAudioConflictManager()');
console.log('- findAllVideos()');
console.log('- testSilenceAllVideos()');
console.log('- checkWidgetStates()');
console.log('- testSecondPartPoliticsScenario()');
