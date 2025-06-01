
// Get DOM elements
const questionTitle = document.getElementById('questionTitle');
const agreeCount = document.getElementById('agreeCount');
const disagreeCount = document.getElementById('disagreeCount');
const agreeProgress = document.getElementById('agreeProgress');
const disagreeProgress = document.getElementById('disagreeProgress');
const agreePercentage = document.getElementById('agreePercentage');
const disagreePercentage = document.getElementById('disagreePercentage');
const totalCount = document.getElementById('totalCount');
const leftIcon = document.getElementById('leftIcon');
const rightIcon = document.getElementById('rightIcon');

// Load results when page loads
async function loadResults() {
    try {
        const response = await fetch('/api/results2');
        
        if (response.ok) {
            const data = await response.json();
            displayResults(data);
        } else {
            console.error('Failed to load results');
        }
    } catch (error) {
        console.error('Error loading results:', error);
    }
}

// Display results with animation
function displayResults(data) {
    const { question, upvotes, downvotes } = data;
    const total = upvotes + downvotes;
    
    // Update question title
    if (question) {
        questionTitle.textContent = question;
    }
    
    // Update counts
    agreeCount.textContent = upvotes;
    disagreeCount.textContent = downvotes;
    totalCount.textContent = total;
    
    // Calculate percentages
    const agreePercent = total > 0 ? Math.round((upvotes / total) * 100) : 0;
    const disagreePercent = total > 0 ? Math.round((downvotes / total) * 100) : 0;
    
    // Animate progress bars after a short delay
    setTimeout(() => {
        agreeProgress.style.width = `${agreePercent}%`;
        disagreeProgress.style.width = `${disagreePercent}%`;
        agreePercentage.textContent = `${agreePercent}%`;
        disagreePercentage.textContent = `${disagreePercent}%`;
    }, 500);
}

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    
    if (key === 'a') {
        event.preventDefault();
        // Highlight A key
        leftIcon.style.backgroundColor = '#A06C45';
        
        // Reset after brief highlight
        setTimeout(() => {
            leftIcon.style.backgroundColor = '#666';
            // Navigate back to vote page
            window.location.href = '/vote2.html';
        }, 200);
        
    } else if (key === 'd') {
        event.preventDefault();
        // Highlight D key
        rightIcon.style.backgroundColor = '#A06C45';
        
        // Reset after brief highlight and redirect to next widget with delay
        setTimeout(() => {
            rightIcon.style.backgroundColor = '#666';
        }, 200);
        
        // Add 2-second delay before redirecting
        setTimeout(() => {
            // Navigate back to main widgets (or end of flow)
            window.location.href = '/index.html?widget=1';
        }, 2000);
    }
});

// Load results when page loads
document.addEventListener('DOMContentLoaded', loadResults);