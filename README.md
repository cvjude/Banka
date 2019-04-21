# Banka

[![Build Status](https://travis-ci.org/cvjude/Banka.svg?branch=develop)](https://travis-ci.org/cvjude/Banka)
[![Coverage Status](https://coveralls.io/repos/github/cvjude/Banka/badge.svg?branch=ch-update-readme-and-add-badges-164893909)](https://coveralls.io/github/cvjude/Banka?branch=ch-update-readme-and-add-badges-164893909)
[![Maintainability](https://api.codeclimate.com/v1/badges/8a9845ae1ad1fd4d7906/maintainability)](https://codeclimate.com/github/cvjude/Banka/maintainability)

# Project Description
Banka is a light-weight core banking application that powers banking operations like account
creation, customer deposit and withdrawals. This app is meant to support a single bank, where
users can signup and create bank accounts online, but must visit the branch to withdraw or
deposit money..

# Core Technology Stacks
>- Front-end : HTML, CSS, Javascript
>- Back-end:  Express js
>- System Depencies:  Node
>- Testing: Mocha and Chai

# Features
>- Clean and Interactive User Interface
>- User can login and sign up
>- Users can view their accounts and view all transactions on an account
>- Admin can add other Admins and also add staff
>- Staff can debit or credit an account
>- Admin and Staff can deactivate or delete an account

# Getting Started

## Prerequistes
>- [Node JS](https://nodejs.org/en/)

# Getting Setup and Installation
>- Clone this repo to local device `https://github.com/cvjude/Banka.git`
>- Navigate to the Banka folder `cd Banka`
>- Run command in terminal `npm install` to install all the neccessary dependencies
>- Create a .env file in the project folder, an set all the environmental variables used in the project
>- Done setting up, run command `npm run startdev` to run the app in development environment 

## Running Tests
>- To ensure app is perfectly set up, run command `npm test` to run test

# Contributing
This project is open for contributions. All contributions must adhere to the [Airbnb](https://github.com/airbnb/javascript) JavaScript styleguide.

### Make contributions 
>- Raise an issue [here](https://github.com/cvjude/Banka/issues)
>- Fork repository
>- Create a feature branch `git checkout -b ch-my-feature`
>- Commit changes `git commit -m "message"`
>- Push created branch `git push origin ch-my-feature`
>- Submit a Pull Request to develop branch

## Api Documentation
> Access to the API endpoints are stricted based on authorization using access tokens, which is generated when a user signs in.View API documentation for all endpoints used in this app [here](https://jbankapp.herokuapp.com/swagger)

# FAQ
> View Frequently asked questions [here](https://github.com/cvjude/Banka/wiki)

# Author(s)
>- [Jude Chinoso](https://github.com/cvjude)

# Deployment
>- This api is deployed on [https://jbankapp.herokuapp.com/api/v2/](https://jbankapp.herokuapp.com/api/v2/)
>- Ui is deployed on gh-pages view [here](http://cvjude.github.io/Banka/UI/index.html)

# Acknowledgments
This project was inspired by the Andela team
