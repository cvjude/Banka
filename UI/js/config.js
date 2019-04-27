const devUrl = 'http://localhost:5001/';
// const devUrl = 'https://jbankapp.herokuapp.com/';
const api = 'api/v2/';

const baseApiRoute = devUrl + api;

//api
let loginURL = baseApiRoute + 'auth/signin';
let signUpURL = baseApiRoute + 'auth/signup';
let getUser = baseApiRoute + 'user'