class ResultsDisplay {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadResults();
    }

    async loadResults() {
        try {
            const response = await fetch('/api/results');
            if (response.ok) {
                const data = await response.json();
                this.displayResults(data);
            } else {
                throw new Error('Failed to load results');
            }
        } catch (error) {
            console.error('Error loading results:', error);
            this.showError('Failed to load voting results');
        }
    }

    displayResults(data) {
        const { question, upvotes, downvotes } = data;
        const total = upvotes + downvotes;
        
        // Display question
        const questionElement = document.getElementById('questionText');
        if (questionElement) {
            questionElement.textContent = question || 'No question available';
        }

        // Display vote counts
        const upvoteElement = document.getElementById('upvoteCount');
        const downvoteElement = document.getElementById('downvoteCount');
        const totalElement = document.getElementById('totalCount');
        
        if (upvoteElement) upvoteElement.textContent = upvotes;
        if (downvoteElement) downvoteElement.textContent = downvotes;
        if (totalElement) totalElement.textContent = total;

        // Calculate percentages and update progress bars
        const upvotePercentage = total > 0 ? (upvotes / total) * 100 : 0;
        const downvotePercentage = total > 0 ? (downvotes / total) * 100 : 0;

        const upvoteBar = document.getElementById('upvoteBar');
        const downvoteBar = document.getElementById('downvoteBar');
        
        if (upvoteBar) upvoteBar.style.width = `${upvotePercentage}%`;
        if (downvoteBar) downvoteBar.style.width = `${downvotePercentage}%`;

        // Display winner message
        this.displayWinner(upvotes, downvotes, total);
    }

    displayWinner(upvotes, downvotes, total) {
        const winnerElement = document.getElementById('winnerMessage');
        if (!winnerElement) return;

        if (total === 0) {
            winnerElement.textContent = 'No votes yet!';
            winnerElement.className = 'text-xl font-bold mt-4 p-4 rounded-2xl bg-white/10 text-white/70';
        } else if (upvotes > downvotes) {
            winnerElement.textContent = '👍 "YES" is winning!';
            winnerElement.className = 'text-xl font-bold mt-4 p-4 rounded-2xl bg-green-500/20 text-green-400';
        } else if (downvotes > upvotes) {
            winnerElement.textContent = '👎 "NO" is winning!';
            winnerElement.className = 'text-xl font-bold mt-4 p-4 rounded-2xl bg-red-500/20 text-red-400';
        } else {
            winnerElement.textContent = "🤝 It's a tie!";
            winnerElement.className = 'text-xl font-bold mt-4 p-4 rounded-2xl bg-purple-500/20 text-purple-400';
        }
    }

    showError(message) {
        const questionElement = document.getElementById('questionText');
        if (questionElement) {
            questionElement.textContent = message;
            questionElement.classList.add('text-red-400');
        }
    }
}

// Initialize results display when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResultsDisplay();
});
