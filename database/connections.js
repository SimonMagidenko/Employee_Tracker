const mySQL = require('mysql2');

// Connect to the database
const db = mySQL.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employeeTracker_db'
    },
    console.log('Connected to employeeTracker database.')
);

module.exports = db