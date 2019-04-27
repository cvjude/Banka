const queries = {
  users: {
    byEmail: 'SELECT * FROM users WHERE email = $1',
    byId: 'SELECT * FROM users WHERE id = $1',
    newUser: 'INSERT INTO users(firstname,lastname,email,hashpassword,type,isadmin)VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
  },
  accounts: {
    getAll: 'SELECT * FROM accounts',
    getAccount: 'SELECT * FROM accounts WHERE accountnumber = $1',
    updateStatus: 'UPDATE accounts set status = $1 Where accountnumber = $2',
    newAccount: 'INSERT INTO accounts(accountnumber,owner,type,status,balance)VALUES($1, $2, $3, $4, $5)',
    delete: 'DELETE FROM accounts WHERE accountnumber = $1',
    updateBalance: 'UPDATE accounts set balance = $1 Where accountnumber = $2',
    getUSerAccounts: 'SELECT * FROM accounts WHERE owner = $1',
    lastAccountNumber: 'SELECT accountnumber FROM accounts ORDER BY accountnumber DESC LIMIT 1',
  },
  transactions: {
    getTransaction: 'SELECT * FROM transactions WHERE accountnumber = $1',
    newTransaction: 'INSERT INTO transactions(type,cashier,amount,oldbalance,newbalance,accountnumber)VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
    getAllTransactions: 'SELECT * FROM transactions WHERE accountnumber = $1',
    getbyId: 'SELECT * FROM transactions WHERE id = $1',
  },
  join: {
    accountOnEmail: 'SELECT email, accounts.* FROM users INNER JOIN accounts on users.id = accounts.OWNER WHERE accounts.accountnumber = $1',
    accountsAndEmail: 'SELECT email, accounts.* FROM users INNER JOIN accounts on users.id = accounts.OWNER',
    accountsAndEmailOnId: 'SELECT email, accounts.* FROM users INNER JOIN accounts on users.id = accounts.OWNER where users.id = $1 AND accounts.accountnumber = $2',
    getAllDormant: 'SELECT email, accounts.* FROM users INNER JOIN accounts on users.id = accounts.OWNER WHERE accounts.status = \'dormant\'',
    getAllActive: 'SELECT email, accounts.* FROM users INNER JOIN accounts on users.id = accounts.OWNER WHERE accounts.status = \'active\'',
    getTransactionById: 'SELECT OWNER, transactions.* FROM accounts INNER JOIN transactions ON accounts.accountnumber = transactions.accountnumber WHERE accounts.OWNER = $1 AND transactions.id = $2',
  },
  conditional: {
    accountAndId: 'SELECT * FROM accounts WHERE accountnumber = $1 AND owner = $2',
  },
};

export default queries;
