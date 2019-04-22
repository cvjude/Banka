/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import pool from '../config/config';
import users from '../model/userdata';
import accounts from '../model/accounts';
import transactions from '../model/transaction';
import Util from '../helper/Utilities';

function insertMultiple(table, array, returning = '') {
  let insert = '';
  array.forEach((element) => {
    insert += Util.insertQuery(table, element, returning);
  });
  return insert;
}

const usersTable = `CREATE TABLE IF NOT EXISTS users(
  id serial PRIMARY KEY,
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL,
  hashpassword text NOT NULL,
  type text NOT NULL,
  isadmin text NOT NULL,
  profilepic text DEFAULT 'https://i.imgur.com/jIsCgyA.jpg'
  );
`;

const accountTable = `CREATE TABLE IF NOT EXISTS accounts(
  id serial,
  accountnumber int PRIMARY KEY,
  createdon TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  owner int NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  balance real NOT NULL
);
`;

const transactTable = `CREATE TABLE IF NOT EXISTS transactions(
  id serial PRIMARY KEY,
  createdon TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type text NOT NULL,
  cashier int NOT NULL,
  amount real NOT NULL,
  oldbalance real NOT NULL,
  newbalance real NOT NULL,
  accountnumber int NOT NULL,
  FOREIGN KEY (accountnumber) REFERENCES  accounts(accountnumber) ON DELETE CASCADE
  );
`;

async function create() {
  try {
    const createTable = `${usersTable} ${accountTable} ${transactTable}`;

    await pool.query(createTable);

    await pool.query(insertMultiple('users', users));
    await pool.query(insertMultiple('accounts', accounts));
    await pool.query(insertMultiple('transactions', transactions));
    console.log('Created all tables');
  } catch (error) {
    console.log(error);
  }
}

create();
