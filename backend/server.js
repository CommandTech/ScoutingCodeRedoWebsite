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
const serverUrl = new URL(config.SERVER_IP.ServerIP);
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
    ServerIP: config.SERVER_IP.ServerIP,
    year: config.YEAR.year,
    baseURL: config.BASE_URL.baseURL,
    apiKey: config.API_KEY.APIkey,
    EventCode: config.EVENT_CODE.EventCode,
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const targetPath = path.join(__dirname, 'uploads', file.originalname);

  // Delete all files in the uploads directory except for the current one
  fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
    if (err) {
      console.error(`Error reading uploads directory: ${err.message}`);
      return res.sendStatus(500);
    }

    const deletePromises = files.map((existingFile) => {
      if (existingFile !== file.filename) {
        return fs.promises.unlink(path.join(__dirname, 'uploads', existingFile))
          .catch((err) => {
            console.error(`Error deleting file: ${existingFile} - ${err.message}`);
          });
      }
    });

    Promise.all(deletePromises)
      .then(() => {
        // Rename the uploaded file
        return fs.promises.rename(file.path, targetPath);
      })
      .then(() => {
        // Execute the csvMaker.py script with the original filename
        const scriptPath = path.resolve(__dirname, '../csvMaker.py');
        return execPromise(`python ${scriptPath} ${targetPath}`);
      })
      .then(({ stdout, stderr }) => {
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return res.sendStatus(500);
        }
        console.log(`stdout: ${stdout}`);
        if (stdout.includes("All CSVs have been successfully created.")) {
          res.status(200).send("Success: All CSVs have been successfully created.");
        } else {
          res.sendStatus(500);
        }
      })
      .catch((err) => {
        console.error(`Error processing upload: ${err.message}`);
        res.sendStatus(500);
      });
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

watcher.on('add', async (filePath) => {
  try {
    console.log(`File added: ${filePath}`);
    const scriptPath = path.resolve(__dirname, '../csvMaker.py');
    const { stdout, stderr } = await execPromise(`python ${scriptPath} ${filePath}`);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  } catch (error) {
    console.error(`Error executing csvMaker.py: ${error.message}`);
  }
});

// Utility function to use exec with promises
const util = require('util');
const execPromise = util.promisify(exec);

app.listen(port, hostname, () => {
  console.log(`Server is running on ${hostname}:${port}`);
});