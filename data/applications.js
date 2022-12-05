const mongoCollections = require("../config/mongoCollections");
const app = mongoCollections.appliction;
const job = mongoCollections.jobpost;
const helpers = require("../helper/helpers");
const jobposts = require("./jobposts");
const {ObjectId} = require("mongodb");
const {user} = require("../config/mongoCollections");
const users = require("./users");
const resumes = require("./resumes");

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

const getAppById = async (appId) => {
    appId = helpers.checkId(appId);
    const appCollection = await app();
    let appFound = await appCollection.findOne({_id: ObjectId(appId)});
    if (appFound === null) {
        throw `Error: Application ${appId} Not Found`;
    }
    appFound._id = appFound._id.toString();
    appFound.jobPost = jobposts.getJobPostById(appFound.job_id);
    appFound.applicant = users.getUserById(appFound.user_id);
    appFound.hr = users.getUserById(appFound.hr_id);
    appFound.resume = resumes.getResumeById(appFound.resume_id);
    return appFound;
}

const getAllAppByHRId = async (HRId) => {
    HRId = helpers.checkId(HRId);
    const appCollection = await app();
    const appList = await appCollection.find({hr_id: HRId}).toArray();
    if (!appList) throw "Error: Getting all appList failed";
    let output = [];
    for (var i = 0; i < appList.length; i++) {
        var temp = {};
        temp.jobPost = jobposts.getJobPostById(appList[i].job_id);
        temp.applicant = users.getUserById(appList[i].user_id);
        temp.hr = users.getUserById(appList[i].hr_id);
        temp.status = appList[i].status;
        temp.resume = resumes.getResumeById(appList[i].resume_id);
        temp.notes = appList[i].notes;
        temp._id = appList[i]._id.toString();
        output.push(temp);
    }
    return output;

}

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
      getAppById,
      getAllAppByHRId
};