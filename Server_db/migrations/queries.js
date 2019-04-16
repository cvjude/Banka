const queries = {
  users: {
    byEmail: 'SELECT * FROM users WHERE email = $1',
    newUser: 'INSERT INTO users(firstname,lastname,email,hashpassword,type,isadmin)VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
  },
};

export default queries;
