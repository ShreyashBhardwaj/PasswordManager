create database passwordmanager;
use passwordmanager;

create table passwords (id int primary key auto_increment, password varchar(255) not null, website varchar(255) not null);

desc passwords;
select * from passwords;