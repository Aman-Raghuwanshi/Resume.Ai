function DataToJson(formData) {
  // Extract and process skills array
  const skillsArray = formData.skills.map(skill => skill.skills.trim()).filter(skill => skill !== '');

  // Initialize education array
  const education = [];

  // Process education data
  const educationData = formData['group-c'];
  for (let i = 0; i < educationData.length; i++) {
    const entry = educationData[i];
    if (entry.schoolname.trim() !== '' && entry.School_Years.trim() !== '' && entry.schooldescription.trim() !== '') {
      const educationEntry = {
        SchoolName: entry.schoolname.trim(),
        Year: entry.School_Years.trim(),
        Description: entry.schooldescription.trim()
      };
      education.push(educationEntry);
    }
  }

  // Process experience data
  const experience = formData.Experience.map(entry => ({
    CompanyName: entry.companyname.trim(),
    Year: entry.exp_year.trim(),
    Description: entry.exp_description.trim()
  })).filter(entry => entry.CompanyName !== '' && entry.Year !== '' && entry.Description !== '');

  // Process achievements data
  const achievements = formData.Achievements.map(entry => ({
    Type: entry.achievmenttype.trim(),
    Description: entry.achievmentdescription.trim()
  })).filter(entry => entry.Type !== '' && entry.Description !== '');

  // Convert to JSON string
  const jsonData = JSON.stringify({
    Name: formData.firstName || "",
    LastName: formData.lastName || "",
    EmailAddress: formData.Email || "",
    PhoneNumber: formData.phoneNumber || "",
    LinkedIn: `<a href="https://www.linkedin.com">${formData.linkedin}</a>` || "",
    JobTitle: formData.jobtitle || "",
    Summary: formData.summary || "",
    Skills: skillsArray,
    Education: education.length > 0 ? education : [],
    Experience: experience.length > 0 ? experience : [],
    Achievements: achievements.length > 0 ? achievements : []
  });

  return jsonData;
}

// Export the function
module.exports = { DataToJson };
