const { ObjectId } = require("mongodb");

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
    throw "Error: Invalid Password";

  let reg = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!reg.test(password)) {
    throw "Error: Invalid Password";
  }
  return password;
};

const checkUserType = function (userType) {
  if (
    typeof userType != "string" ||
    userType == null ||
    userType.trim().length === 0
  )
    throw "Error: Invalid User Type";
  if (userType === "true") {
    return true;
  } else if (userType === "false") {
    return false;
  } else {
    throw "Error: Invalid User Type";
  }
};
function ismatched(fullString, substring) {
  if(typeof fullString !='string'){
    fullString=fullString.toString();
}
  fullString=fullString.toLowerCase();
  substring=substring.toLowerCase();
  let array = Array.from(fullString);
  let sub = Array.from(substring);
  for(let i=0;i<=array.length-sub.length;i++){
      let j=0;
      if(array[i]==sub[j]){
        while(j<sub.length&& array[i+j]==sub[j]){
          j++;
        }
        if(j==sub.length){
          return true;
        }
      }
  }
  return false;
};

const checkName = function (name) {
  if (typeof name != "string" || name == null || name.trim().length === 0)
    throw "Error: Name can not be empty";
  name = name.trim();
  let reg = /^[a-z']+$/i;
  let regWrong = /^.*(''+).*$/; // if there is a consecutive ''''', even more than 2, it's wrong
  if (!reg.test(name)) {
    throw "Error: Invalid Name";
  } else {
    if (regWrong.test(name)) {
      throw "Error: Invalid Name";
    }
  }
  return name;
};

const checkPlace = function (place) {
  if (typeof place != "string" || place == null || place.trim().length === 0)
    throw "Error: Place Name can not be empty";
  place = place.trim();
  return place;
};

const checkPhone = function (phone) {
  if (typeof phone != "string" || phone == null || phone.trim().length === 0)
    throw "Error: Invalid Phone Number";
  phone = phone.trim();
  return phone;
};

const checkId = function (id) {
  if (typeof id != "string" || id == null || id.trim().length === 0)
    throw "Error: Invalid Object ID";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "Error: Invalid Object ID";
  return id;
};

const sortedbysalrayformlowtohigh = function (array) {
  if (array === undefined) throw "Error: You have to enter the salary first."
for(let i=0;i<array.length;i++){
  let index=i;
  for(let j=i+1;j<array.length;j++){
    if(array[index].salary>array[j].salary){
      index=j;
    }
  }
  let temp = array[index];
  array[index]=array[i];
  array[i]=temp;
}
return array;
};

const sortedbysalrayformhightolow = function (array) {
  for(let i=0;i<array.length;i++){
    let index=i;
    for(let j=i+1;j<array.length;j++){
      if(array[index].salary<array[j].salary){
        index=j;
      }
    }
    let temp = array[index];
    array[index]=array[i];
    array[i]=temp;
  }
  return array;
  };

function checkJobPostString (name, param){
  if (!param) {
    throw `Error: Invalid ${name}`;
  }
  if (typeof param !== "string") {
    throw `Error: Invalid ${name}`;
  }
  if (param.trim().length === 0) {
    throw `Error: ${name} should not be empty.`;
  }
  return param.trim();
}

function checkSalary(s) {
  if (!s) {
    throw "Error: Invalid salary";
  }
  let salary = Number(s);
  if (isNaN(salary)) {
    throw "Error: Invalid salary";
  }
  s = salary;
  if (typeof s !== "number") {
    throw "Error: Invalid salary";
  }
  if (s < 0) {
    throw "Error: Invalid salary";
  }
  return s;
}

const checkGender = function (gender) {
  if (typeof gender != "string") throw "Error: Invalid Gender";
  // if the input is null, it means user doesnt want to tell
  if (gender == null || gender.trim().length === 0) return null;
  if (gender != '0' && gender != '1' && gender != '2') throw "Error: Invalid Gender";
  return Number(gender);
};

const checkAge = function (age) {
  if (typeof age != "string") throw "Error: Invalid Age";
  // if the input is null, it means user doesnt want to tell
  if (age == null || age.trim().length === 0) return null;
  let reg = /^[1-8][0-9]$/;
if (!reg.test(age)) {
  throw "Error: Invalid Age";
}
  return Number(age);
};

const checkEmpty = function (input) {
  if (typeof input == "undefined" || input == null || input.trim().length === 0)
  throw "Error: Input can not be empty";
}
module.exports = {
  checkUserEmail,
  checkPassword,
  checkUserType,
  checkName,
  checkPlace,
  checkPhone,
  checkId,
  ismatched,
  sortedbysalrayformlowtohigh,
  sortedbysalrayformhightolow,
  checkJobPostString,
  checkSalary,
  sortedbysalrayformhightolow,
  checkGender,
  checkAge,
  checkEmpty,
};
