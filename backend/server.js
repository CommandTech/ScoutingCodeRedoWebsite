const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors()); // Enable CORS for all routes

app.use(express.static('uploads'));

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const targetPath = path.join(__dirname, 'uploads', file.originalname);

  fs.rename(file.path, targetPath, (err) => {
    if (err) return res.sendStatus(500);
    res.sendStatus(200);
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});