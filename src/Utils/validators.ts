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

module.exports = passwordValidator;
