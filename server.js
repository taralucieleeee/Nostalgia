const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Get current voting results
app.get('/api/results', (req, res) => {
    const csvPath = path.join(__dirname, 'data', 'voting.csv');
    
    fs.readFile(csvPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading CSV:', err);
            return res.status(500).json({ error: 'Failed to read vote data' });
        }
        
        const lines = data.trim().split('\n');
        if (lines.length < 2) {
            return res.json({ question: '', upvotes: 0, downvotes: 0 });
        }
        
        const dataLine = lines[1];
        const matches = dataLine.match(/"([^"]+)",(\d+),(\d+)/);
        
        if (!matches) {
            return res.status(500).json({ error: 'Invalid CSV format' });
        }
        
        const question = matches[1];
        const upvotes = parseInt(matches[2]);
        const downvotes = parseInt(matches[3]);
        
        res.json({ question, upvotes, downvotes });
    });
});

// Vote submission endpoint for first question
app.post('/api/vote', (req, res) => {
    const { question, vote } = req.body;
    
    if (!question || !vote) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const csvPath = path.join(__dirname, 'data', 'voting.csv');
    
    // Read the current CSV file
    fs.readFile(csvPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading CSV:', err);
            return res.status(500).json({ error: 'Failed to read vote data' });
        }
        
        const lines = data.trim().split('\n');
        const header = lines[0];
        let dataLine = lines[1] || `"${question}",0,0`;
        
        // Parse the current vote counts
        const matches = dataLine.match(/"([^"]+)",(\d+),(\d+)/);
        if (!matches) {
            return res.status(500).json({ error: 'Invalid CSV format' });
        }
        
        const currentQuestion = matches[1];
        let upvotes = parseInt(matches[2]);
        let downvotes = parseInt(matches[3]);
        
        // Update the vote count
        if (vote === 'yes') {
            upvotes++;
        } else if (vote === 'no') {
            downvotes++;
        } else {
            return res.status(400).json({ error: 'Invalid vote value' });
        }
        
        // Create the updated CSV content
        const updatedDataLine = `"${currentQuestion}",${upvotes},${downvotes}`;
        const csvContent = `${header}\n${updatedDataLine}\n`;
        
        // Write the updated data back to the file
        fs.writeFile(csvPath, csvContent, (writeErr) => {
            if (writeErr) {
                console.error('Error writing to CSV:', writeErr);
                return res.status(500).json({ error: 'Failed to save vote' });
            }
            
            console.log('Vote saved:', { question, vote, upvotes, downvotes });
            res.json({ 
                success: true, 
                message: 'Vote saved successfully',
                upvotes,
                downvotes
            });
        });
    });
});

// Get voting results for second question
app.get('/api/results2', (req, res) => {
    const csvPath = path.join(__dirname, 'data', 'voting2.csv');
    
    fs.readFile(csvPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading CSV:', err);
            return res.status(500).json({ error: 'Failed to read vote data' });
        }
        
        const lines = data.trim().split('\n');
        if (lines.length < 2) {
            return res.json({ question: '', upvotes: 0, downvotes: 0 });
        }
        
        const dataLine = lines[1];
        const matches = dataLine.match(/"([^"]+)",(\d+),(\d+)/);
        
        if (!matches) {
            return res.status(500).json({ error: 'Invalid CSV format' });
        }
        
        const question = matches[1];
        const upvotes = parseInt(matches[2]);
        const downvotes = parseInt(matches[3]);
        
        res.json({ question, upvotes, downvotes });
    });
});

// Vote submission endpoint for second question
app.post('/api/vote2', (req, res) => {
    const { question, vote } = req.body;
    
    if (!question || !vote) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const csvPath = path.join(__dirname, 'data', 'voting2.csv');
    
    // Ensure the CSV file exists
    if (!fs.existsSync(csvPath)) {
        const header = 'Question,Upvotes,Downvotes';
        const initialData = `"${question}",0,0`;
        fs.writeFileSync(csvPath, `${header}\n${initialData}\n`);
    }
    
    // Read the current CSV file
    fs.readFile(csvPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading CSV:', err);
            return res.status(500).json({ error: 'Failed to read vote data' });
        }
        
        const lines = data.trim().split('\n');
        const header = lines[0];
        let dataLine = lines[1] || `"${question}",0,0`;
        
        // Parse the current vote counts
        const matches = dataLine.match(/"([^"]+)",(\d+),(\d+)/);
        if (!matches) {
            return res.status(500).json({ error: 'Invalid CSV format' });
        }
        
        const currentQuestion = matches[1];
        let upvotes = parseInt(matches[2]);
        let downvotes = parseInt(matches[3]);
        
        // Update the vote count
        if (vote === 'yes') {
            upvotes++;
        } else if (vote === 'no') {
            downvotes++;
        } else {
            return res.status(400).json({ error: 'Invalid vote value' });
        }
        
        // Create the updated CSV content
        const updatedDataLine = `"${currentQuestion}",${upvotes},${downvotes}`;
        const csvContent = `${header}\n${updatedDataLine}\n`;
        
        // Write the updated data back to the file
        fs.writeFile(csvPath, csvContent, (writeErr) => {
            if (writeErr) {
                console.error('Error writing to CSV:', writeErr);
                return res.status(500).json({ error: 'Failed to save vote' });
            }
            
            console.log('Vote 2 saved:', { question, vote, upvotes, downvotes });
            res.json({ 
                success: true, 
                message: 'Vote saved successfully',
                upvotes,
                downvotes
            });
        });
    });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from src directory
app.use('/src', express.static(path.join(__dirname, 'src')));

// Add logging middleware for video requests BEFORE static serving
app.use('/static/videos', (req, res, next) => {
    console.log('Video request:', req.url);
    console.log('Full path:', path.join(staticPath, 'videos', req.url));
    next();
});

// Add logging middleware for image requests BEFORE static serving
app.use('/static/images', (req, res, next) => {
    console.log('Image request:', req.url);
    console.log('Full path:', path.join(staticPath, 'images', req.url));
    next();
});

// Serve static files from static directory
const staticPath = path.join(__dirname, 'static');
console.log('Static directory path:', staticPath);
app.use('/static', express.static(staticPath, {
    setHeaders: (res, path) => {
        if (path.endsWith('.mov')) {
            res.set('Content-Type', 'video/quicktime');
        }
        if (path.endsWith('.mp4')) {
            res.set('Content-Type', 'video/mp4');
            res.set('Accept-Ranges', 'bytes');
        }
    }
}));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Serving static files from: ${path.join(__dirname, 'static')}`);
    console.log('Available routes:');
    console.log('- /static/images/*');
    console.log('- /dist/style.css');
    console.log('- /src/*');
});
