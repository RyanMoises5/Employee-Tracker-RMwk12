const express = require('express');
const app = express();

const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const initalPrompt = {
  type: 'list',
  name: 'userCommand',
  message: 'What would you like to do?',
  choices: [
    'View All Employees',
    'Add Employee',
    'Update Employee Role',
    'View All Roles',
    'Add Role',
    'View All Departments',
    'Add Department',
    'Quit'
    ]
};

const addEmployee = [{
    type: 'input',
    name: 'first_name',
    message: "What is the employee's FIRST name?"
  },
  {
    type: 'input',
    name: 'last_name',
    message: "What is the employee's LAST name?"
  },
  {
    type: 'list',
    name: 'role_id',
    message: "What is the employee's role?",
    choices: [
      'Salesperson',
      'Lead Engineer',
      'Software Engineer',
      'Account Manager',
      'Accountant',
      'Legal Team Lead',
      "Lawyer"
    ]
  }
];

const updateEmployeeRole = {
  type: 'input',
  name: 'id',
  message: "Which employee role would you like to update?"
};

const addEmployeeRole = {
  type: 'input',
  name: 'role',
  message: "What employee role would you like to add?"
};

const addDepartment = {
  type: 'input',
  name: 'department',
  message: 'What department would you like to add?'
};