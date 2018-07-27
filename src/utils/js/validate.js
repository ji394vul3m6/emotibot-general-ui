function isValidPassword(input) {
  const validRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9~@!#$%^&*()[\]{}:;"',./?<>+\-=|_ ]{6,16}$/g;
  return validRegex.test(input);
}

function isValidEmail(input) {
  const validRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g;
  return validRegex.test(input);
}

function isValidUserName(input) {
  const validRegex = /^[\w\d@._-]{4,64}$/g;
  return validRegex.test(input);
}

function isValidPhone(input) {
  const validRegex = /^(?!-)[0-9-]+[0-9]+$/g;
  return validRegex.test(input);
}

function isValidDisplayName(input) {
  const minlength = 2;
  const maxlength = 50;
  return input.length >= minlength && input.length <= maxlength;
}

export default {
  isValidPassword,
  isValidEmail,
  isValidUserName,
  isValidPhone,
  isValidDisplayName,
};
