INSERT INTO departments (department)
VALUES 
('Sales'),
('Finance'),
('Engineering'),
('Legal');

INSERT INTO employee_role (title,salary,department_id )
VALUES 
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 3),
('Software Engineer',120000, 3),
('Account Manager',160000, 2),
('Accountant',125000, 2),
('Legal Team Lead',125000, 4),
('Lawyer', 250000, 4);

INSERT INTO employees (first_name,last_name,employee_role_id,manager_id)
VALUES 
('John', 'Doe', 1, NULL),
('Mike', 'Chan', 1, NULL),
('Ashley','Rodriguez', 3, NULL),
('Kevin','Tupik', 3, NULL),
('Kunal','Singh', 2, NULL),
('Malia','Brown', 2, NULL),
('Sarah','Lourd', 4, NULL),
('Tom','Allen', 4, NULL);