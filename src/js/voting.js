class VotingSystem {
    constructor() {
        this.currentQuestion = "The world used to be a much better place.";
        this.sessionId = this.generateSessionId();
        this.init();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        this.restoreVotingData();
        this.bindEvents();
        this.saveSessionData();
        // Removed loadQuestion() - question text comes from HTML only
    }

    bindEvents() {
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');

        if (yesBtn && noBtn) {
            yesBtn.addEventListener('click', () => this.vote('yes'));
            noBtn.addEventListener('click', () => this.vote('no'));
        }
    }

    // Removed loadQuestion() method - question text stays in HTML

    async vote(choice) {
        const voteData = {
            question: this.currentQuestion,
            vote: choice,
            sessionId: this.sessionId,
            timestamp: Date.now()
        };

        try {
            // Store immediately in localStorage for persistence
            localStorage.setItem('userVote', choice);
            localStorage.setItem('userVoteData', JSON.stringify(voteData));
            
            // Send vote to server
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(voteData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('📊 VOTING - Vote saved successfully:', result);
                
                this.selectButton(choice);
                this.showVoteResult(choice, result.upvotes, result.downvotes);
                this.disableVotingButtons();
                
                // Update session data
                this.updateSessionData('vote1_completed', { vote: choice, result: result });
                
                // Redirect to results page after 1 second of visual feedback
                console.log('Vote registered, navigating to results.html after 1 second');
                
                // Prevent any other interactions during navigation
                document.body.style.pointerEvents = 'none';
                
                // Wait 1 second then navigate
                setTimeout(() => {
                    window.location.href = '/results.html';
                }, 1000);
            } else {
                throw new Error('Failed to save vote');
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
            this.showError('Failed to submit vote. Please try again.');
        }
    }

    showVoteResult(choice, upvotes, downvotes) {
        const resultElement = document.getElementById('voteResult');
        if (resultElement) {
            resultElement.innerHTML = `
                <div class="text-green-400 mb-2">Thank you for voting "${choice.toUpperCase()}"!</div>
                <div class="text-white/80 text-sm">
                    Current Results:<br>
                    👍 Yes: ${upvotes} votes<br>
                    👎 No: ${downvotes} votes
                </div>
            `;
            resultElement.classList.remove('hidden');
        }
    }

    showError(message) {
        const resultElement = document.getElementById('voteResult');
        if (resultElement) {
            resultElement.textContent = message;
            resultElement.classList.remove('hidden');
            resultElement.classList.add('text-red-400');
        }
    }

    disableVotingButtons() {
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');
        
        if (yesBtn && noBtn) {
            yesBtn.disabled = true;
            noBtn.disabled = true;
            yesBtn.classList.add('opacity-50', 'cursor-not-allowed');
            noBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    selectButton(choice) {
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');
        
        // Remove selected class from both buttons first
        yesBtn.classList.remove('selected');
        noBtn.classList.remove('selected');
        
        // Add selected class only to the chosen button for 100% white background
        if (choice === 'yes' && yesBtn) {
            yesBtn.classList.add('selected');
        } else if (choice === 'no' && noBtn) {
            noBtn.classList.add('selected');
        }
    }

    restoreVotingData() {
        try {
            // Check for backed up data from reset
            const backupData = localStorage.getItem('nostalgiaDataBackup');
            if (backupData) {
                const backup = JSON.parse(backupData);
                if (backup.vote1) {
                    localStorage.setItem('userVote', backup.vote1);
                    console.log('📊 VOTING - Restored vote1 from backup');
                }
            }
            
            // Check if user already voted but DON'T auto-select the button
            // Let the user re-vote if they want
            const existingVote = localStorage.getItem('userVote');
            if (existingVote) {
                console.log('📊 VOTING - Found existing vote:', existingVote);
                // Don't auto-select or disable - allow re-voting
            }
        } catch (error) {
            console.error('❌ VOTING - Failed to restore voting data:', error);
        }
    }

    saveSessionData() {
        try {
            const sessionData = {
                sessionId: this.sessionId,
                question: this.currentQuestion,
                timestamp: Date.now(),
                step: 'vote1'
            };
            localStorage.setItem('nostalgiaSession', JSON.stringify(sessionData));
        } catch (error) {
            console.error('❌ VOTING - Failed to save session data:', error);
        }
    }

    updateSessionData(step, data) {
        try {
            const sessionData = JSON.parse(localStorage.getItem('nostalgiaSession') || '{}');
            sessionData.step = step;
            sessionData.lastUpdate = Date.now();
            sessionData.data = { ...sessionData.data, ...data };
            localStorage.setItem('nostalgiaSession', JSON.stringify(sessionData));
        } catch (error) {
            console.error('❌ VOTING - Failed to update session data:', error);
        }
    }
}

// Initialize voting system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VotingSystem();
});

// Add CSS for voting buttons
const style = document.createElement('style');
style.textContent = `
    .voting-btn {
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .voting-btn:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 25px rgba(255,255,255,0.2);
    }
    
    .voting-btn:disabled {
        transform: none !important;
        box-shadow: none !important;
        cursor: not-allowed;
    }
    
    .voting-btn.selected {
        background-color: white !important;
        color: black !important;
        border-color: white !important;
    }
`;
document.head.appendChild(style);
