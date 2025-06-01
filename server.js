const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from src directory
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve static files from static directory
const staticPath = path.join(__dirname, 'static');
console.log('Static directory path:', staticPath);
app.use('/static', express.static(staticPath, {
    setHeaders: (res, path) => {
        if (path.endsWith('.mov')) {
            res.set('Content-Type', 'video/quicktime');
        }
    }
}));

// Add logging middleware for video requests
app.use('/static/videos', (req, res, next) => {
    console.log('Video request:', req.url);
    console.log('Full path:', path.join(staticPath, 'videos', req.url));
    next();
});

// Add logging middleware for image requests
app.use('/static/images', (req, res, next) => {
    console.log('Image request:', req.url);
    console.log('Full path:', path.join(staticPath, 'images', req.url));
    next();
});
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
