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

// Add Employee
const addEmployee = () => {

  // Gather employee roles
  const sql1 = 'SELECT * FROM role';
  db.query(sql1, (err, roleRows) => {
    if (err) {
      console.error("Error: Cannot retrieve role array.");
    }
    const roleArray = roleRows.map((x) => x.title);

    // Gather managers
    const sql2 = `SELECT 
      id,
      CONCAT (first_name, " ", last_name) AS manager
      FROM employee where manager_id IS NULL`
    db.query(sql2, (err, managerRows) => {
      if (err) {
        console.error("Error: Cannot retrieve manager array.");
      }
      const managerArray = managerRows.map((x) => x.manager);
      managerArray.push("None");

      inquirer
        .prompt([
          {
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
            name: 'role',
            message: "What is the employee's role?",
            choices: roleArray
          },
          {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: managerArray
          }
        ])
        .then((res) => {
          const sql3 = `SELECT id
            FROM role
            WHERE title = ?`;
          const params3 = res.role;
  
          db.query(sql3, params3, (err, role) => {
            if (err) {
              console.error("Error with retrieving role ID.");
            };
            const roleID = role[0].id;
  
            if (res.manager === "None") {
              const sql5 = `INSERT
                INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, NULL)`;
              const params5 = [res.firstName, res.lastName, roleID];
              db.query(sql5, params5, (err, rows) => {
                if (err) {
                  console.error("Error with employee insert.");
                }
                console.log("Added employee to database");
                viewEmployees();
              });

            } else {
              const managerName = res.manager.split(' ');
              const firstName = managerName[0];
              const lastName = managerName[1];
              const sql4 = `SELECT 
                id
                FROM employee 
                WHERE first_name = ? AND last_name = ?`;
              const params4 = [firstName, lastName];
  
              db.query(sql4, params4, (err, manager) => {
                if (err) {
                  console.error("Error with retrieving ID for manager.");
                };
                const managerID = manager[0].id;
    
                const sql5 = `INSERT
                  INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES (?, ?, ?, ?)`;
                const params5 = [res.firstName, res.lastName, roleID, managerID];
                db.query(sql5, params5, (err, rows) => {
                  if (err) {
                    console.error("Error with employee insert.");
                  }
                  console.log("Added employee to database");
                  viewEmployees();
                })
              })
            }
          })
        })
    })
  })
};

// Update Employee Role
const updateEmployeeRole = () => {
  const sql1 = `SELECT CONCAT (first_name, " ", last_name) AS name FROM employee`;
  db.query(sql1, (err, employees) => {
    if (err) {
      console.error("Error: Cannot retrieve employees.");
    }
    const employeesArray = employees.map((x) => x.name);

    const sql2 = `SELECT title FROM role`;
    db.query(sql2, (err, roles) => {
      if (err) {
        console.error("Error: Cannot retrieve roles.");
      }
      const rolesArray = roles.map((x) => x.title);

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee',
            message: 'Whose role would you like to update?',
            choices: employeesArray
          },
          {
            type: 'list',
            name: 'role',
            message: 'Which role do you want to assign the selected employee?',
            choices: rolesArray
          }
        ])
        .then((res) => {
          const employeeName = res.employee.split(' ');
          const firstName = employeeName[0];
          const lastName = employeeName[1];

          const sql3 = `SELECT 
            id
            FROM employee 
            WHERE first_name = ? AND last_name = ?`;
          const params3 = [firstName, lastName];

          db.query(sql3, params3, (err, employee) => {
            if (err) {
              console.error("Error with retrieving ID for employee.");
            };

            const employeeID = employee[0].id;
            const sql4 = `SELECT
              id
              FROM role
              WHERE title = ?`;
            const params4 = res.role;

            db.query(sql4, params4, (err, role) => {
              if (err) {
                console.error("Error with retrieving ID for role.");
              };

              const roleID = role[0].id;
              const sql5 = `UPDATE employee
                SET role_id = ?
                WHERE id = ?`;
              const params5 = [roleID, employeeID]

              db.query(sql5, params5, (err, row) => {
                if (err) {
                  console.error("Error with updating employee role.");
                };
                console.log("Updated employee role");
                viewEmployees();
              })
            })
          })
        })
    })
  })
}

// View all roles
const viewRoles = () => {
  const sql = 
    `SELECT 
    role.id,
    role.title,
    department.name,
    role.salary
    FROM role
    JOIN department on role.department_id = department.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error with request.");
    }
    console.table(rows);
    promptUser();
  });
};

// Add role
const addRole = () => {
  const sql = 'SELECT * FROM department';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error: Cannot retrieve department array.");
    }
    const deptArray = rows.map((x) => x.name);

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: "What employee role would you like to add?"
        }, 
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary of the role?'
        }, 
        {
          type: 'list',
          name: 'departmentName',
          message: 'Which department does the role belong to?',
          choices: deptArray
        }
      ])
      .then((res) => {
        const sql1 = `SELECT id 
          FROM department
          WHERE department.name = ?`;
        const params1 = res.departmentName;
        
        db.query(sql1, params1, (err, rows) => {
          if (err) {
            console.error("Error with request.");
          };

          const sql2 = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)'
          const params2 = [res.title, res.salary, rows[0].id]
          db.query(sql2, params2, (err, rows) => {
            if (err) {
              console.error("Error with request.");
            }
            console.log("Added role to database");
            viewRoles();
          })
        });
      });
  });
};

// View All Departments
const viewDepartment = () => {
  const sql = 
    `SELECT 
    *
    FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error with request.");
    }
    console.table(rows);
    promptUser();
  });
};

// Add Department
const inquireAddDepartment = {
  type: 'input',
  name: 'department',
  message: 'What department would you like to add?'
};

const addDepartment = () => {
  inquirer
    .prompt(inquireAddDepartment)
    .then((res) => {
      const params = [res.department]
      const sql = 'INSERT INTO department (name) VALUES (?)'

      db.query(sql, params, (err, rows) => {
        if (err) {
          console.error("Error with request.");
        }
        console.log("Added department to database");
        viewDepartment();
      })
    });
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
          updateEmployeeRole();
        };
        if (res.command === 'View All Roles') {
          viewRoles();
        };
        if (res.command === 'Add Role') {
          addRole();
        };
        if (res.command === 'View All Departments') {
          viewDepartment();
        };
        if (res.command === 'Add Department') {
          addDepartment();
        };
        if (res.command === 'Quit') {
          quitInquirer();
        };
    })
};

promptUser();