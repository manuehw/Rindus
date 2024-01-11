# Rindus App

Employee Management Angular App with the following functionalities:

1. Role Selection Screen: This initial screen gives users the option to choose either ‘User’ or ‘Admin’ roles. Upon selection, the app will then navigate to the Employee List screen.

2. Employee List Screen: This section displays a comprehensive list of employees. It features a search bar that filters employees by their names or surnames. If the User role is selected from the previous screen, the employee details will be in a “view only” mode. Whereas, the Admin role has the authority to add or edit employee details. Display the Age of the employee instead of the Birthdate for enhanced readability.

3. Employee Details Screen: This is where an employee’s details can be viewed, added, or edited.

NOTE:
To mock the backend server this application uses the json-server library. Please don't forget to run the following command to simulate the server:

- `npm install`
- `npx json-server --watch server.json`

## Development server

First time: Run `npm install` to install depedencies.
Run `json-server --watch server.json` to simulate backed server.
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
