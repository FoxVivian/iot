create database iot;

use iot;

create table users (
	id INT AUTO_INCREMENT PRIMARY KEY,
    student_id varchar(10) unique not null,
    username VARCHAR(10) NOT NULL,
    password varchar(25) not null,
    name varchar(50) not null
);

CREATE TABLE sensors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_name VARCHAR(25) NOT NULL
);
CREATE TABLE data_sensors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperature FLOAT,
    humidity FLOAT,
    light INT,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(25) NOT NULL,
    status int not null
);

CREATE TABLE data_devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT,
    action int not null,
    user_id INT, 
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

insert into users (student_id, username, password, name)
value ("B21DCCN458", "khiem", "123", "Nguyễn Việt Khiêm");

insert into devices (device_name, status)
value ("LED YELLOW", 0),
("LED RED", 0),
("LED GREEN", 0);
