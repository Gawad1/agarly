-- Active: 1698396764187@@localhost@3308@carrentalsystem

CREATE TABLE customer (
    ssn INT PRIMARY KEY,
    f_name VARCHAR(15) NOT NULL,
    l_name VARCHAR(15) NOT NULL,
    b_d DATE NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    email VARCHAR(20) NOT NULL UNIQUE,
    pass VARCHAR(225) not null-- Assuming a reasonable length for password, you might want to adjust this
);

create table office (
    office_id int PRIMARY key,
    loc VARCHAR(20) not null, 
    n_cars int 
)

drop table class;
drop table office;
alter table car
drop CONSTRAINT fk_car_class;

-- Drop the existing check constraint on the 'category' column


-- Add the corrected check constraint on the 'category' column
ALTER TABLE car
ADD CONSTRAINT `car.category` CHECK (category IN ('SUV', 'Sedan', 'CrossOver', 'Mini_Van'));


drop table car;

create table car (
plate_id int primary key,
model VARCHAR(10) check(model in ('BMW','TOYOTA','SKODA','OPEL','NISSAN','HYNDAI','HONDA','KIA','BENZ','FORD','MG','BYD','BENTLY','SEAT')),
production_year INT NOT NULL CHECK (production_year >= 1920 ),
color varchar(10)  check (color in ('Blue','Green','Black','White','Red','Silver','Grey','Bronze')),
photo varchar(255) ,
category varchar(10) check (category in ('SUV','Sedan','CrossOver','Mini_Van')),
class_id varchar(15) check (class_id in ('Economy','Mid-Range','Luxury')),
office_id int not null,
`status` varchar(15) check (`status` in ('Rented','Pending','Out-Of-Service','Active')),
Constraint fk_car_class 
Foreign Key (class_id) REFERENCES class(class_id),
constraint fk_car_office 
Foreign Key (office_id) REFERENCES office(office_id) 
)


create table class
(
    class_id varchar(15) PRIMARY key  check (class_id in ('Economy','Mid-Range','Luxury')),
    rate double not null
)

GRANT ALL PRIVILEGES ON your_database_name.* TO 'root'@'localhost' IDENTIFIED BY '@Feezo139';
FLUSH PRIVILEGES;

REPAIR TABLE db;

USE carrentalsystem;



CREATE TABLE reservation (
    res_id INT AUTO_INCREMENT PRIMARY KEY,
    ssn INT NOT NULL,
    plate_id INT NOT NULL,
    res_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pickup_date TIMESTAMP not null DEFAULT CURRENT_TIMESTAMP ,
    return_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    price DOUBLE(10, 2) NOT NULL, -- Adjust precision and scale as needed
    CONSTRAINT fk_reservation_customer FOREIGN KEY (ssn) REFERENCES customer(ssn),
    CONSTRAINT fk_reservation_car FOREIGN KEY (plate_id) REFERENCES car(plate_id)
);


-- Creating a trigger to update n_cars in the office table after a new car is inserted
DELIMITER //

CREATE TRIGGER after_car_insert
AFTER INSERT ON car
FOR EACH ROW
BEGIN
    UPDATE office
    SET n_cars = n_cars + 1
    WHERE office_id = NEW.office_id;
END;

//

DELIMITER ;
