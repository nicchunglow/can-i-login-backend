const passwordValidator = (password: string) => {
  if (password.length <= 8) {
    return false;
  }
  let numberCounter = 0;
  let lowercase = 0;
  let uppercase = 0;
  password.split("").forEach((character: any) => {
    if (isNaN(character) === false) {
      numberCounter++;
    } else if (character === character.toLowerCase()) {
      lowercase++;
    } else if (character === character.toUpperCase()) {
      uppercase++;
    }
  });
  if (numberCounter === 0 || lowercase === 0 || uppercase === 0) {
    return false;
  } else {
    return true;
  }
};

const emailValidator = (email: string) => {
  let atSymbol: number = 0;
  let punctuationSymbol: number = 0;
  let uppercase: number = 0;
  email.split("").forEach((character: any) => {
    if (character === "@") {
      atSymbol++;
    } else if (character === ".") {
      punctuationSymbol++;
    } else if (
      isNaN(character) === true &&
      character === character.toUpperCase()
    ) {
      uppercase++;
    }
  });
  return atSymbol !== 1 ||
    punctuationSymbol !== 1 ||
    uppercase !== 0 ||
    email.length <= 8
    ? false
    : true;
};

module.exports = { emailValidator, passwordValidator };
