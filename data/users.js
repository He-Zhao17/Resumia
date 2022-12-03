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
/*const updateUser = async (
  userId,
  firstname,
  lastname,
  gender,
  city,
  state,
  country,
  phone
) => {
  if (!ObjectId.isValid(userId)){
    throw 'invalid object ID';
  }
  if(!firstname||!lastname ||!gender ||!city||!state||!country||!phone){
    throw"some of the inputs are empty";
  }
  if(typeof firstname !== "string"||typeof lastname !== "string"||typeof gender !== "string"||typeof city !== "string"||typeof country !== "string"||typeof state !== "string"){
    throw"some of the inputs are not string";
  }
  if(firstname.trim().length === 0||lastname.trim().length ==0||gender.trim().length ==0||city.trim().length ==0||country.trim().length ==0||phone.trim().length ==0||state.trim().length ==0){
    throw"some of the inputs are empty string";
  }
  firstname=firstname.trim();
  lastname=lastname.trim();
  gender=gender.trim();
  city=city.trim();
  state=state.trim();
  country=country.trim();
  phone=phone.trim();
  const MovieCollection = await movies();
  let updateUser = {
    firstname:firstname,
    lastname:lastname,
    gender:gender,
    city:city,
    state:state,
    country:country,
    phone:phone
  };
  const updatedInfo = await updateUser.updateOne(
    {_id: ObjectId(movieId)},
    {$set: updateMovie}
  );
  if (updatedInfo.modifiedCount === 0) {
    throw 'could not update movie successfully';
  }
  return await getMovieById(movieId);
};
*/
module.exports = { createUser, checkUser, getUserById, addBasicInfo };
