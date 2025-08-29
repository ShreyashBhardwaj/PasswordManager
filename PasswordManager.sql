create database passwordmanager;
use passwordmanager;

create table passwords (id int primary key auto_increment, password varchar(255) not null, website varchar(255) not null);

desc passwords;
select * from passwords;

select * from passwords where id = 6;

delete from passwords where id = 6;

drop table passwords;

alter table passwords add column iv varchar(255) not null after website;