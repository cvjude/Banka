import bcrypt from 'bcryptjs';

const hash = password => bcrypt.hashSync(password, 6);
const checkPassword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);
export { hash, checkPassword };
