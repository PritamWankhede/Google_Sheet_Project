
const createIUser = (_id, name, email, colorCode) => ({
  _id,
  name,
  email,
  colorCode
});


const createISignIn = (email, password) => ({
  email,
  password
});

const createISignUp = (name, email, password) => ({
  name,
  email,
  password
});
