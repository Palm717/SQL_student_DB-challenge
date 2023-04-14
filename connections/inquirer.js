// const inquirer = require("inquirer");

// const sqlPromptStart = inquirer
//   .prompt([
//     {
//       type: "list",
//       message: "What actions would you like to take?",
//       name: "action",
//       choices: [
//         "View all departments",
//         "View all employee roles",
//         "View all employees",
//         "Add a department",
//         "Add an employee role",
//         "Add an employee",
//         "Update an employee role",
//         "Exit",
//       ],
//     },
//   ])
//   .then((answers) => {
//     switch (answers.action) {
//       case "View all departments":
//         viewDepartments();
//         break;

//       case "View all employee roles":
//         viewRoles();
//         break;

//       case "View all employees":
//         viewEmployees();

//       case "Add a department":
//         addDepartment();
//         break;

//       case "Add an employee role":
//         addRole();
//         break;

//       case "Add an employee":
//         addEmployee();
//         break;

//       case "Update an employee role":
//         updateRole();
//         break;

//       case "Exit":
//         process.exit(0);
//         break;
//     }
//   });

// module.exports = sqlPromptStart;
