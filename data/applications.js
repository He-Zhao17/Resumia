const mongoCollections = require("../config/mongoCollections");
const app = mongoCollections.appliction;
const job = mongoCollections.jobpost;
const helpers = require("../helper/helpers");
const jobposts = require("./jobposts");
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

const getAllApplied = async (applicantId) => {
  helpers.checkId(applicantId);
  const appCollection = await app();
  const appList = await appCollection.find({}).toArray();
  if (!appList) throw "Error: Getting all appList failed";

  let output = [];
  for (const app of appList) {
    app._id = app._id.toString();
    app.applicant = app.applicant.toString();
    if (app.applicant === applicantId) {
        let getJob = jobposts.getJobPostById(app.job);
        appObj = {
          _id: app._id,
          jobName: getJob.employer,
      };
      output.push(appObj);
    }
  }
  return output;
}


  module.exports = {
    createApplication,
    getAllApplied,
};