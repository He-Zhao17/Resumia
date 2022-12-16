const mongoCollections = require("../config/mongoCollections");
const user = mongoCollections.user;
const bcrypt = require("bcryptjs");
const saltRounds = 16;
const helpers = require("../helper/helpers");
const { ObjectId } = require("mongodb");

const createUser = async (email, password, isApplicant) => {
  email = helpers.checkUserEmail(email);
  helpers.checkPassword(password);
  isApplicant = helpers.checkUserType(isApplicant);

  const userCollection = await user();
  const getUser = await userCollection.findOne({ email: email });
  if (getUser != null) {
    throw `Error: User already existed`;
  }
  const hash = await bcrypt.hash(password, saltRounds);

  let newUser = {
    email: email,
    hashedPassword: hash,
    type: isApplicant,
    basicInfo: false, // this is for checking if user has filled basic info
    firstname: "",
    lastname: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    age: "",
    phone: "",
    address: "",
    website: "",
  };
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: Creating User failed";
  const newId = insertInfo.insertedId.toString();
  return {
    userId: newId,
    userType: isApplicant,
    basicInfo: newUser.basicInfo,
  };
};

const checkUser = async (email, password) => {
  email = helpers.checkUserEmail(email);
  helpers.checkPassword(password);

  const userCollection = await user();
  const getUser = await userCollection.findOne({ email: email });
  if (getUser === null) {
    throw "Error: Either email or password is invalid";
  }

  comparePassword = await bcrypt.compare(password, getUser.hashedPassword);
  if (comparePassword) {
    return {
      userId: getUser._id.toString(),
      userType: getUser.type,
      basicInfo: getUser.basicInfo,
    };
  } else {
    throw "Error: Either email or password is invalid";
  }
};

const getUserById = async (userId) => {
  userId = helpers.checkId(userId);
  const userCollection = await user();
  const getUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (getUser === null) {
    throw `Error: User ${userId} Not Found`;
  }
  getUser._id = getUser._id.toString();
  return getUser;
};

const addBasicInfo = async (
  userId,
  userType,
  firstname,
  lastname,
  gender,
  age,
  city,
  state,
  country,
  phone
) => {
  helpers.checkName(firstname);
  helpers.checkName(lastname);
  helpers.checkPlace(city);
  helpers.checkPlace(state);
  helpers.checkPlace(country);
  helpers.checkPhone(phone);

  let getUser = await getUserById(userId);
  getUser._id = ObjectId(getUser._id);
  getUser.basicInfo = true;
  getUser.firstname = firstname;
  getUser.lastname = lastname;
  getUser.gender = gender;
  getUser.age = age;
  getUser.city = city;
  getUser.state = state;
  getUser.country = country;
  getUser.phone = phone;

  const userCollection = await user();
  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: getUser }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Error: Updating movie failed";
  }

  return {
    basicInfo: getUser.basicInfo,
  };
};
const UpdatePassword = async (passwordone,passwordtwo,newpassword,userid)=>{
if(passwordone!=passwordtwo){
throw"your old passwrod are not matched";
}
const userCollection = await user();
helpers.checkPassword(newpassword)
const getuser = await userCollection.findOne({ _id: ObjectId(userid) });
comparePassword = await bcrypt.compare(passwordone, getuser.hashedPassword);
if(!comparePassword){
  throw"your old password is incorrect"
}
const hash = await bcrypt.hash(newpassword, saltRounds);
getuser.hashedPassword=hash;
const updatedInfo = await userCollection.updateOne(
  { _id: ObjectId(userid) },
  { $set: getuser }
);
if (updatedInfo.modifiedCount === 0) {
  throw "Error: Updating movie failed";
}
return "your password has changed successfully";

};
module.exports = { createUser, checkUser, getUserById, addBasicInfo,UpdatePassword };
