DROP DATABASE IF EXISTS grassy_db;
CREATE DATABASE grassy_db;

USE grassy_db;

CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department VARCHAR(30) NOT NULL
);

CREATE TABLE employee_role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INT NOT NULL, 
    FOREIGN KEY (department_id) REFERENCES departments (id)
);

CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    employee_role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (employee_role_id) REFERENCES employee_role(id),
    FOREIGN KEY (manager_id) REFERENCES employees (id)
);





