const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const ini = require('ini');
const { exec } = require('child_process');
const chokidar = require('chokidar');
const url = require('url');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors()); // Enable CORS for all routes

app.use(express.static('uploads'));

// Read configuration
const config = ini.parse(fs.readFileSync('../config.ini', 'utf-8'));
const serverUrl = new URL(config.ServerIP.server_ip);
console.log('Server URL:', serverUrl);
const hostname = '0.0.0.0';
const port = serverUrl.port;

// Add a route to handle GET requests to the root URL
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Endpoint to get configuration
app.get('/config', (req, res) => {
  console.log('Config endpoint hit');
  res.json({ 
    server_ip: config.ServerIP.server_ip,
    year: config.YEAR.year
  });
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

// Watch the uploads directory for new files
const watcher = chokidar.watch(path.join(__dirname, 'uploads'), {
  persistent: true,
  ignoreInitial: true,
});

watcher.on('add', (filePath) => {
  console.log(`File added: ${filePath}`);
  const scriptPath = path.resolve(__dirname, '../csvMaker.py');
  exec(`python ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing csvMaker.py: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});

app.listen(port, hostname, () => {
  console.log(`Server is running on ${hostname}:${port}`);
});

app.get('/api-key', (req, res) => {
  res.json({ apiKey: config.TBAMain.API_KEY });
});