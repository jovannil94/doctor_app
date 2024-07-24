#Doctor PDF Form App

#Overview
The Doctor PDF Form App is a React-based web application designed to allow users to select doctors from a dropdown list and generate a PDF report with their details. The app supports different formats for presenting doctor information based on state-specific requirements, such as New York (NY) and California (CA). The application integrates with a PostgreSQL backend to fetch doctor data and uses jsPDF to generate and download PDF files.

#Features

Dropdown Selection: Choose a doctor and a state from dropdown menus.

State-Specific Formatting: Formats doctor details according to state-specific requirements.

New York (NY): Displays first name, last name, gender, and date of birth in mm/dd/yyyy format.

California (CA): Displays full name, gender, and date of birth in yyyy-mm-dd format.

PDF Generation: Generate and download a PDF containing the selected doctor’s formatted information.

#Technologies Used

Frontend: React

Backend: Node.js with PostgreSQL

PDF Generation: jsPDF

HTTP Client: axios
