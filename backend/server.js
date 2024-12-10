const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors()); // Enable CORS for all routes

app.use(express.static('uploads'));

// Add a route to handle GET requests to the root URL
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const targetPath = path.join(__dirname, 'uploads', file.originalname);

  fs.rename(file.path, targetPath, (err) => {
    if (err) return res.sendStatus(500);
    res.sendStatus(200);
  });
});

app.get('/upload', (req, res) => {
  res.send('Upload endpoint');
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});