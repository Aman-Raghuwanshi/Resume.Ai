const express = require('express');
const { constants } = require('fs/promises');
const fs = require('fs');
const port = process.env.PORT || 5000;
const { generatePDF } = require('./generatePDF');
const path = require('path');
const { DataToJson } = require('./DataToJson');
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const templateRoutes = ['template1', 'template2', 'template3'];
let myNumber = 1;

console.log(process.cwd())
console.log(path.join(__dirname, '../ResumeMakerApp/Images'))

app.use(express.static(path.join(__dirname, '../ResumeMakerApp')));

const templateRouteHandler = (templateNumber) => (req, res) => {
  myNumber = templateNumber;
  res.sendFile(path.join(__dirname, '..', 'resumemakerapp', 'Resume.html'));
};

// Create routes dynamically
templateRoutes.forEach((template, index) => {
  app.get(`/${template}`, templateRouteHandler(index + 1));
});





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

app.get('/Start', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'resumemakerapp', 'Start.html'))
})

app.get('/Resume', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'resumemakerapp', 'Resume.html'))
})

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'resumemakerapp', 'Resume.html'));
})

const num = 1;



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

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/Start`)
})

//Set the names 
//Error Handling Template not Found
//Api didn't work
//Input mein kuch missing ya galat
//