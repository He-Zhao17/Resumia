const mongoCollections = require("../config/mongoCollections");
const app = mongoCollections.appliction;
const helpers = require("../helper/helpers");
const createApplication = async (hr_id, user_id,resume_id,job_id) => {
    if(!hr_id||!user_id||!job_id){
      throw `Some of the input is empty`;
    }
    const appCollection = await app();
    let newApp = {
      user_id: user_id,
      hr_id: hr_id,
      resume_id: resume_id,
      job_id:job_id,
      status:0,
      notes:[]
    };
  
    const insertInfo = await appCollection.insertOne(newApp);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Error: Creating User failed";
    const newId = insertInfo.insertedId.toString();
    return newId;
  };
  module.exports = {
    createApplication
};