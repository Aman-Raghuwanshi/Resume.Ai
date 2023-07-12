function uploadDoc(event) {
    event.preventDefault(); // Prevent the default form submission
    const form = event.target;
    const formData = new FormData(form); // Create a FormData object
    const url = form.getAttribute('action'); // Get the form action URL
  
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          console.log('File uploaded successfully');
          // Handle success response if needed
        } else {
          console.error('Failed to upload file');
          // Handle error response if needed
        }
      })
      .catch(error => {
        console.error('An error occurred during file upload:', error);
        // Handle error if needed
      });
  }
  