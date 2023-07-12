const express = require('express');
const path = require('path');
const { DataToJson } = require('./DataToJson');
const fs = require('fs');
const { generatePDF } = require('./generatePDF');
const multer = require('multer');

const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../ResumeMakerApp')));
app.use('/uploads', express.static(path.join(__dirname, 'ResumeTemplates')));
app.use(express.static(__dirname));

// Dynamic template routes
const templateRoutes = ['template1', 'template2', 'template3'];
let myNumber = 1;
let newNumber = templateRoutes.length + 1;
const newTemplateName = `template${newNumber}`;
const insertIndex = newNumber - 1;
templateRoutes.splice(insertIndex, 0, newTemplateName);

// Function to handle file upload
const uploadDocHandler = (req, res) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'ResumeTemplates')); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, newTemplateName); // Set the file name as "Template1"
    },
  });

  const upload = multer({ storage: storage });

  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      res.sendStatus(500);
    } else {
      res.send('File uploaded successfully');
    }
  });
};

// Template route handler
const templateRouteHandler = (templateNumber) => (req, res) => {
  myNumber = templateNumber;
  res.sendFile(path.join(__dirname, '..', 'resumemakerapp', 'Resume.html'));
};

// Create routes dynamically for templates
templateRoutes.forEach((template, index) => {
  app.get(`/${template}`, templateRouteHandler(index + 1));
});

// File upload route
app.post('/uploadDoc', uploadDocHandler);

// File download route
app.get('/download', (req, res) => {
  const resumePath = path.join(__dirname, 'generatedResume.pdf');

  if (fs.existsSync(resumePath)) {
    res.download(resumePath, 'resume.pdf', (err) => {
      if (err) {
        console.error('Error downloading the resume PDF:', err);
        res.sendStatus(500);
      }
    });
  } else {
    res.sendStatus(404);
  }
});

// Start route
app.get('/Start', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'resumemakerapp', 'Start.html'));
});

// Resume route
app.get('/Resume', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'resumemakerapp', 'Resume.html'));
});

// Form route
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'resumemakerapp', 'Resume.html'));
});

// Form submission route
app.post('/form', (req, res) => {
  const formData = req.body;
  console.log(formData);
  const jsonData = DataToJson(formData);

  // Write JSON data to a file
  fs.writeFile('data.json', jsonData, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log('Data saved to data.json');

      generatePDF('./data.json', myNumber)
        .then(() => {
          console.log('PDF generated successfully');
          res.sendFile(path.join(__dirname, '..', 'resumemakerapp', 'output.html'));
        })
        .catch(error => {
          console.error('Error generating PDF:', error);
          res.sendStatus(500);
        });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Resume Maker listening on http://localhost:${port}/Start`);
});
