import { Pool } from 'pg';

import dotenv from 'dotenv';

dotenv.config();

const connetionstring = {
  test: process.env.DB_TEST_URL,
  production: process.env.DB_CONNECTIONSTRING,
};

const pool = new Pool({
  connectionString: connetionstring[process.env.NODE_ENV],
});

export default pool;
