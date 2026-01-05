#!/bin/sh
echo "Setting env variables"
export DB_USERNAME=root
export DB_PASSWORD=root
export DB_CONNECTION_STRING=jdbc:mysql://localhost:3306/expense_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC