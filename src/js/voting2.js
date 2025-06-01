
class VotingSystem2 {
    constructor() {
        this.currentQuestion = "Nostalgic memories bring me comfort.";
        this.init();
    }

    init() {
        this.bindEvents();
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
            vote: choice
        };

        try {
            // Send vote to server
            const response = await fetch('/api/vote2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(voteData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Vote saved:', result);
                
                // Store the user's choice in localStorage
                localStorage.setItem('userVote2', choice);
                
                this.selectButton(choice);
                this.showVoteResult(choice, result.upvotes, result.downvotes);
                this.disableVotingButtons();
                
                // Redirect to results page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/results2.html';
                }, 2000);
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
        
        if (choice === 'yes' && yesBtn) {
            yesBtn.classList.add('selected');
        } else if (choice === 'no' && noBtn) {
            noBtn.classList.add('selected');
        }
    }
}

// Initialize voting system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VotingSystem2();
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