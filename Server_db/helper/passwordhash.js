import bcrypt from 'bcryptjs';

const hash = password => bcrypt.hashSync(password, 10);
export default hash;
