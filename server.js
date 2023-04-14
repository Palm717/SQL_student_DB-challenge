// assignment of npm's
const { EventEmitter } = require("events");
const mysql = require("mysql2");
const inquirer = require("inquirer");

EventEmitter.defaultMaxListeners = 100;

//connect to the database

const db = mysql.createConnection(
  {
    host: "localhost",
    database: "grassy_db",
    user: "root",
    password: "rootroot",
  },

  console.log("Server Connected")
);

//create functions to run the CRUD assignments

function viewDepartments() {
  db.query("SELECT * FROM departments;", (err, results) => {
    console.table(results);
  });
  // start();
}

function viewRoles() {
  db.query(
    `SELECT employee_role.id, employee_role.title, employee_role.salary, departments.department
    FROM employee_role
    LEFT JOIN departments 
    ON employee_role.department_id = departments.id`,
    (err, results) => {
      if (err) throw err;
      console.table(results);
    }
  );
  // start();
}

function viewEmployees() {
  db.query(
    `SELECT employees.id, employees.first_name, employees.last_name, employee_role.title, departments.department, employee_role.salary, 
    CONCAT(manager.first_name, " ", manager.last_name) 
    AS manager 
    FROM employees 
    LEFT JOIN employee_role 
    ON employees.employee_role_id = employee_role.id 
    LEFT JOIN departments 
    ON employee_role.department_id = departments.id 
    LEFT JOIN employees manager 
    ON employees.manager_id = manager.id;`,
    (err, results) => {
      if (err) throw err;
      console.table(results);
    }
  );
  // start();
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Give the department being added.",
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO departments 
      SET ?;`,
        { department: answer.name },
        (err, results) => {
          if (err) throw err;
          console.log(`${results.affectedRows} department added succesfully!`);

          inquirer
            .prompt([
              {
                name: "continue",
                type: "confirm",
                message: "Anymore additions?",
              },
            ])
            .then((answer) => {
              if (answer.continue) {
                start();
              } else {
                console.log("CLI terminated");
                process.exit();
              }
            });
        }
      );
    });
}

function addRole() {
  db.query("SELECT * FROM departments;", (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title of the role you would like to add?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for this role?",
        },
        {
          name: "department",
          type: "list",
          message: "Which department does this role belong to?",
          choices: () => {
            const departmentChoices = results.map(
              (department) => department.department
            );
            return departmentChoices;
          },
        },
      ])
      .then((answer) => {
        const department = answer.department;
        const query = "SELECT id FROM departments WHERE department = ?;";
        db.query(query, department, (err, res) => {
          if (err) throw err;

          const roleId = res[0].id;
          const newRole = {
            title: answer.title,
            salary: answer.salary,
            department_id: roleId,
          };

          db.query(
            "INSERT INTO employee_role SET ?;",
            newRole,
            (err, results) => {
              if (err) throw err;

              console.log(results.affectedRows + " role added!\n");
            }
          );
        });
      });
    // start();
  });
}

// function to add an employee
function addEmployee() {
  db.query("SELECT * FROM employee_role", (err, roles) => {
    if (err) throw err;

    db.query("SELECT * FROM employees", (err, employees) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: "input",
            message: "Enter the employee's first name:",
            name: "first_name",
          },
          {
            type: "input",
            message: "Enter the employee's last name:",
            name: "last_name",
          },
          {
            type: "list",
            message: "Select the employee's role:",
            name: "role_id",
            choices: roles.map((role) => {
              return {
                name: role.title,
                value: role.id,
              };
            }),
          },
          {
            type: "list",
            message: "Select the employee's manager:",
            name: "manager_id",
            choices: employees.map((employee) => {
              return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              };
            }),
          },
        ])
        .then((answers) => {
          db.query(
            "INSERT INTO employees SET ?;",
            {
              first_name: answers.first_name,
              last_name: answers.last_name,
              employee_role_id: answers.role_id,
              manager_id: answers.manager_id,
            },
            (err, results) => {
              if (err) throw err;
              console.log(results.affectedRows + " employee inserted!\n");
            }
          );
        });
      // start();
    });
  });
}

function updateEmployee() {
  // Get a list of employees to choose from
  db.query("SELECT * FROM employees;", (err, employees) => {
    if (err) throw err;

    // Prompt user to select an employee to update
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee would you like to update?",
          name: "employee",
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
      ])
      .then((selectedEmployee) => {
        // Get a list of roles to choose from
        db.query("SELECT * FROM employee_role", (err, roles) => {
          if (err) throw err;

          // Prompt user to select a new role for the employee
          inquirer
            .prompt([
              {
                type: "list",
                message:
                  "Which role would you like to assign to this employee?",
                name: "role",
                choices: roles.map((role) => ({
                  name: role.title,
                  value: role.id,
                })),
              },
            ])
            .then((selectedRole) => {
              // Update the employee's role in the database
              db.query(
                "UPDATE employees SET employee_role_id = ? WHERE id = ?",
                [selectedRole.role, selectedEmployee.employee],
                (err, results) => {
                  if (err) throw err;
                  console.log(results.affectedRows + " employee updated!\n");
                }
              );
            });
          // start();
        });
      });
  });
}

function updateRole() {
  // Get a list of employees to choose from
  db.query("SELECT * FROM employees;", (err, employees) => {
    if (err) throw err;

    // Prompt user to select an employee to update
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee's role would you like to update?",
          name: "employee",
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
      ])
      .then((answers) => {
        // Get a list of roles to choose from
        db.query("SELECT * FROM employee_role;", (err, roles) => {
          if (err) throw err;

          // Prompt user to select a new role for the employee
          inquirer
            .prompt([
              {
                type: "list",
                message: "Select the employee's new role:",
                name: "role_id",
                choices: roles.map((role) => ({
                  name: role.title,
                  value: role.id,
                })),
              },
            ])
            .then((answers) => {
              // Update the employee's role in the database
              db.query(
                "UPDATE employees SET employee_role_id = ? WHERE id = ?",
                [answers.role_id, answers.employee],
                (err, results) => {
                  if (err) throw err;

                  console.log(
                    `${results.affectedRows} employee role updated!\n`
                  );
                }
              );
            });
          // start();
        });
      });
  });
}

function exit() {
  db.end();
}

start();

function start() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What actions would you like to take?",
        name: "action",
        choices: [
          "View all departments",
          "View all employee roles",
          "View all employees",
          "Add a department",
          "Add an employee role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "View all departments":
          viewDepartments();
          break;

        case "View all employee roles":
          viewRoles();
          break;

        case "View all employees":
          viewEmployees();
          break;

        case "Add a department":
          addDepartment();
          break;

        case "Add an employee role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Update an employee role":
          updateRole();
          break;

        case "Exit":
          db.end();
          break;
      }
      start();
    });
}
