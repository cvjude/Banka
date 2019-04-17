const queries = {
  users: {
    byEmail: 'SELECT * FROM users WHERE email = $1',
    byId: 'SELECT * FROM users WHERE id = $1',
    newUser: 'INSERT INTO users(firstname,lastname,email,hashpassword,type,isadmin)VALUES($1, $2, $3, $4, $5, $6)',
  },
  accounts: {
    getAll: 'SELECT * FROM accounts',
    getAccount: 'SELECT * FROM accounts WHERE accountnumber = $1',
    updateStatus: 'UPDATE accounts set status = $1 Where accountnumber = $2',
    newAccount: 'INSERT INTO accounts(accountnumber,owner,type,status,balance)VALUES($1, $2, $3, $4, $5)',
    delete: 'DELETE FROM accounts WHERE accountnumber = $1',
  },
};

export default queries;
