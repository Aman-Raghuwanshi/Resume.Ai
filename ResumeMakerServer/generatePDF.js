const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');

function generatePDF(jsonFilePath, myNumber) {
  const OUTPUT = './generatedResume.pdf';

  // If our output already exists, remove it so we can run the application again.
  if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);

  const INPUT = `./ResumeTemplates/Template${myNumber}.docx`;

  const JSON_INPUT = require('./data.json');


  // Set up our credentials object.
  const credentials = PDFServicesSdk.Credentials
    .servicePrincipalCredentialsBuilder()
    .withClientId("")
    .withClientSecret("")
    .build();

  // Create an ExecutionContext using credentials
  const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

  // This creates an instance of the Export operation we're using, as well as specifying output type (DOCX)
  const documentMerge = PDFServicesSdk.DocumentMerge,
    documentMergeOptions = documentMerge.options,
    options = new documentMergeOptions.DocumentMergeOptions(JSON_INPUT, documentMergeOptions.OutputFormat.PDF);

  // Create a new operation instance using the options instance.
  const documentMergeOperation = documentMerge.Operation.createNew(options);

  // Set operation input document template from a source file.
  const input = PDFServicesSdk.FileRef.createFromLocalFile(INPUT);
  documentMergeOperation.setInput(input);


  // Execute the operation and Save the result to the specified location.
  return documentMergeOperation.execute(executionContext)
    .then(result => {
      return result.saveAsFile(OUTPUT);
    })
    .catch(err => {
      if (err instanceof PDFServicesSdk.Error.ServiceApiError || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
        console.log('Exception encountered while executing operation', err);
        throw err;
      } else {
        console.log('Exception encountered while executing operation', err);
        throw err;
      }
    });

}

module.exports = { generatePDF };
