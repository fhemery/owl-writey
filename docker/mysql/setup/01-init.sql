# create databases
CREATE DATABASE IF NOT EXISTS `owlwritey_app`;

CREATE USER 'owlwritey_app'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON owlwritey_app.* TO 'owlwritey_app'@'%';

FLUSH PRIVILEGES;
