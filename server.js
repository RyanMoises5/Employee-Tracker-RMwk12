const inquirer = require('inquirer');

const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

const initialPrompt = {
  type: 'list',
  name: 'command',
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

// View All Employees
const viewEmployees = () => {
    const sql = 
      `SELECT 
      employee.id, 
      employee.first_name, 
      employee.last_name,
      role.title, 
      department.name AS department,
      role.salary,
      CONCAT (manager.first_name, " ", manager.last_name) AS manager
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.error("Error with request.");
      }
      console.table(rows);
      promptUser();
    });
};

// Add Employee (INCOMPLETE)
const inquireAddEmployee = [{
    type: 'input',
    name: 'firstName',
    message: "What is the employee's FIRST name?"
  },
  {
    type: 'input',
    name: 'lastName',
    message: "What is the employee's LAST name?"
  },
  {
    type: 'list',
    name: 'roleId',
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

const addEmployee = () => {
  inquirer
    .prompt(inquireAddEmployee)
    .then((res) => {
      const params = [res.firstName, res.lastName, res.roleID, res.managerID]
      const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)'

      db.query(sql, params, (err, rows) => {
        if (err) {
          console.error("Error with request.");
        }
        console.log("Added employee to database");
        viewEmployees();
      })
    });
};

// Update Employee Role (INCOMPLETE)
const updateEmployeeRole = {
  type: 'input',
  name: 'id',
  message: "Which employee role would you like to update?"
};

// View all roles (INCOMPLETE)
const viewRoles = () => {
  const sql = 
    `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name,
    role.title, 
    department.name AS department,
    role.salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error with request.");
    }
    console.table(rows);
    promptUser();
  });
};

// Add role (INCOMPLETE)
const addEmployeeRole = {
  type: 'input',
  name: 'role',
  message: "What employee role would you like to add?"
};

// View All Departments (INCOMPLETE)

// Add Department (INCOMPLETE)
const addDepartment = {
  type: 'input',
  name: 'department',
  message: 'What department would you like to add?'
};

// Quit
const quitInquirer = () => {
  process.exit();
};

const promptUser = () => {
  inquirer
    .prompt(initialPrompt)
    .then((res) => {
        if (res.command === 'View All Employees') {
          viewEmployees();
        };
        if (res.command === 'Add Employee') {
          addEmployee();
        };
        if (res.command === 'Update Employee Role') {
          console.log('PUT ROLE');
        };
        if (res.command === 'View All Roles') {
          viewRoles();
        };
        if (res.command === 'Add Role') {
          console.log('POST ROLE');
        };
        if (res.command === 'View All Departments') {
          console.log('GET DEPARTMENTS');
        };
        if (res.command === 'Add Department') {
          console.log('POST DEPARTMENT');
        };
        if (res.command === 'Quit') {
          quitInquirer();
        };
    })
};

promptUser();