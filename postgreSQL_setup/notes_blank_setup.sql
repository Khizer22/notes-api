drop database notesdb;
drop user notesuser;
create user notesuser with password 'password';
create database notesdb with template=template0 owner=notesuser;
\connect notesdb;
alter default privileges grant all on tables to notesuser;
alter default privileges grant all on sequences to notesuser;

create table users_table(
    user_id serial primary key,
    name varchar(100),
    email text unique not null,
    hash varchar not null
);

create table notes_table(
    note_id serial primary key,
    email text not null,
    title varchar(50) not null,
    text varchar not null
);

alter table notes_table add constraint cat_users_fk
foreign key (email) references users_table(email);

-- create sequence users_table_seq increment 1 start 1;
-- create sequence notes_table_seq increment 1 start 1;