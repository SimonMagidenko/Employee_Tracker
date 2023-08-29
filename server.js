const express = require('express');
const inquirer = require('inquirer');
const mySQL = require('mysql2/promise');
const db = require('./database/connection');
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Response for any unspecified response
app.use((req, res) => {
    res.status(404).end();
});

// Start server after Database connects
db.connect(err => {
    if (err) throw err;
    app.listen(PORT, () => { });
});

const startPrompt = async () => {
    const mainMenuOptions = await inquirer.prompt({
        type: 'list',
        name: 'Main Menu',
        message: 'Please choose an option provided below.',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', ' Add A Department', 'Add A Role', 'Update an Employee Role', 'Update an Employee Manager', 'Delete Department', 'Delete Role', 'Delete Employee'],
    });
    const selectedOption = mainMenuOptions['Main Menu'];

    switch (selectedOption) {
        case 'View All Departments':
            break;
        case 'View All Roles':
            break;
        case 'View All Employees':
            break;
        case 'Add A Department':
            break;
        case 'Add A Role':
            break;
        case 'Update an Employee Role':
            break;
        case 'Update an Employee Manager':
            break;
        case 'Delete Department':
            break;
        case 'Delete Role':
            break;
        case 'Delete Employee':
            break;
        default:
            console.log('Invalid option');
            break;
    }
};

startPrompt();









