#!/bin/sh

sequelize db:migrate
nodemon app.js