import { hash } from '../helper/passwordHash';

const Users = [
  {
    firstName: 'Jude',
    lastName: 'violet',
    email: 'jjviolet@gmail.com',
    hashPassword: hash('bankapp'),
    type: 'staff',
    isAdmin: true,
  },
  {
    firstName: 'Amos',
    lastName: 'Oruroghene',
    email: 'amoslv@gmail.com',
    hashPassword: hash('bankapp'),
    type: 'client',
    isAdmin: false,
  },
  {
    firstName: 'Staff',
    lastName: 'Staffiene',
    email: 'staff@gmail.com',
    hashPassword: hash('bankapp'),
    type: 'staff',
    isAdmin: false,
  },
  {
    firstName: 'Jonah',
    lastName: 'Jonas',
    email: 'jonah@gmail.com',
    hashPassword: hash('bankapp'),
    type: 'client',
    isAdmin: false,
  },
  {
    firstName: 'Kelvin',
    lastName: 'Kelv',
    email: 'kelv@gmail.com',
    hashPassword: hash('bankapp'),
    type: 'client',
    isAdmin: false,
  },
  {
    firstName: 'Bill',
    lastName: 'witheds',
    email: 'bill@gmail.com',
    hashPassword: hash('bankapp'),
    type: 'client',
    isAdmin: false,
  },
];

export default Users;
