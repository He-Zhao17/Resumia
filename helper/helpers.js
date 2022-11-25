const checkUserEmail = function (email) {
  if (typeof email != "string" || email == null || email.trim().length === 0)
    throw "Error: Invalid Email";
  let reg =
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (!reg.test(email)) {
    throw "Error: Invalid Email";
  }
  return email.toLowerCase();
};

const checkPassword = function (password) {
  if (
    typeof password != "string" ||
    password == null ||
    password.trim().length === 0
  )
    throw "Error: Invalid password";

  let reg = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!reg.test(password)) {
    throw "Error: Invalid password";
  }
  return password;
};

const checkUserType = function (userType) {
  if (
    typeof userType != "string" ||
    userType == null ||
    userType.trim().length === 0
  )
    throw "Error: Invalid user type";
  if (userType === "true") {
    return true;
  } else if (userType === "false") {
    return false;
  } else {
    throw "Error: Invalid user type";
  }
};
module.exports = {
  checkUserEmail,
  checkPassword,
  checkUserType,
};
