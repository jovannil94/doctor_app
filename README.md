Doctor PDF Form App

Welcome!
The Doctor PDF Form App is here to simplify how you manage doctor information! With our user-friendly React-based application, you can easily select doctors from a dropdown list and generate a neatly formatted PDF report with their details. Whether you need information formatted for New York or California, we’ve got you covered!

What It Does

Dropdown Selection: Pick a doctor and state from our easy-to-use dropdown menus.

State-Specific Formatting: Get doctor details in the format you need:

New York (NY): Shows first name, last name, gender, and date of birth in mm/dd/yyyy format.

California (CA): Provides full name, gender, and date of birth in yyyy-mm-dd format.

PDF Generation: Click the button to download a PDF with the formatted information of your selected doctor.

Technologies Used

Frontend: Built with React for a smooth user experience.

Backend: Powered by Node.js and PostgreSQL to handle data efficiently.

PDF Generation: Uses jsPDF to create and download PDFs.

To start the app locally:

BACKEND:

1) CD into backend folder
2) npm install
3) Make sure postgresql services are running with `brew services start postgresql@15`
4) Create the data base or create a new one `psql -d postgres -f db/schema.sql`
5) Seed the database `psql -d doctor_app -f db/seeds.sql`
6) nodemon App.js

FRONTEND: 
1) CD into frontend folder
2) npm install
3) npm start
