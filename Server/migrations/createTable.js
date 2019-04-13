/* eslint-disable no-console */
import pool from '../config/config';
import users from '../model/userdata';
import accountData from '../model/accounts';
import transactionData from '../model/transaction';

const usersTable = `CREATE TABLE IF NOT EXISTS users(
  id serial PRIMARY KEY,
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL,
  hashpassword text NOT NULL,
  type text NOT NULL,
  isadmin text NOT NULL
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
    let addUserData = '';
    users.forEach((user) => {
      const data = {
        text: `INSERT INTO users(firstname,lastname,email,hashpassword,type,isadmin)
        VALUES('${user.firstName}', '${user.lastName}', '${user.email}', '${user.hashPassword}', '${user.type}', '${user.isAdmin}'); `,
      };
      addUserData += data.text;
    });

    const accounts = accountData[0];
    const transactions = transactionData[0];

    const addAccountData = `INSERT INTO accounts(accountnumber,owner,type,status,balance)
    VALUES(${accounts.accountNumber}, ${accounts.owner}, '${accounts.type}', '${accounts.status}', ${accounts.balance}); `;

    const addTransactData = `INSERT INTO transactions(type,cashier,amount,oldbalance,newbalance,accountnumber)
    VALUES('${transactions.type}', ${transactions.cashier}, ${transactions.amount}, ${transactions.oldBalance}, ${transactions.newBalance}, ${transactions.accountNumber}); `;

    await pool.query(createTable);
    await pool.query(addUserData);
    await pool.query(addAccountData);
    await pool.query(addTransactData);
    console.log('Created  all tables');
  } catch (error) {
    console.log(error);
  }
}

create();
