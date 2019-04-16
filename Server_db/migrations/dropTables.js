/* eslint-disable no-console */
import pool from '../config/config';

const dropUsersTable = 'DROP TABLE users';
const dropAccountsTable = 'DROP TABLE accounts CASCADE';
const dropTransactionsTable = 'DROP TABLE transactions';

async function deleteUsers() {
  try {
    await pool.query(dropUsersTable);
    console.log('users successfully deleted');
  } catch (error) {
    console.log('users doesn\'t exist');
  }
}

async function deleteAccounts() {
  try {
    await pool.query(dropAccountsTable);
    console.log('accounts successfully deleted');
  } catch (error) {
    console.log('accounts doesn\'t exist');
  }
}

async function deleteTransactions() {
  try {
    await pool.query(dropTransactionsTable);
    console.log('Transactions successfully deleted');
  } catch (error) {
    console.log('transactions doesn\'t exist');
  }
}

deleteUsers();
deleteAccounts();
deleteTransactions();
