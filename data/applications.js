const mongoCollections = require("../config/mongoCollections");
const app = mongoCollections.application;
const job = mongoCollections.jobpost;
const helpers = require("../helper/helpers");
const jobposts = require("./jobposts");
const {ObjectId} = require("mongodb");
const {user} = require("../config/mongoCollections");
const users = require("./users");
const resumes = require("./resumes");

const createApplication = async (hr_id, user_id,resume_id,job_id) => {
    if(!hr_id||!user_id||!job_id||!resume_id){
      throw `Some of the input is empty`;
    }
    const appCollection = await app();
    let date = new Date().toLocaleDateString();
    let newApp = {
      user_id: user_id,
      hr_id: hr_id,
      resume_id: resume_id,
      job_id:job_id,
      status:0,
      notes:[
   
      ],
      createTime:date
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
    appFound.jobPost = await jobposts.getJobPostById(appFound.job_id);
    appFound.applicant = await users.getUserById(appFound.user_id);
    appFound.hr = await users.getUserById(appFound.hr_id);
    appFound.resume = await resumes.getResumeById(appFound.resume_id);
    appFound.status = appFound.status == 0 ? "Pending" : appFound.status == 1 ? "Admitted" : "Rejected";
    return appFound;
}

const getAllAppByHRId = async (HRId) => {
    HRId = helpers.checkId(HRId);
    const appCollection = await app();
    const appList = await appCollection.find({hr_id: HRId}).toArray();
    if (!appList) throw "Error: Getting all appList failed";
    for (let app of appList) {
        app._id = app._id.toString();
        app.applicant_id = app.user_id.toString();
        if (app.hr_id === HRId) {
            let getJob = await jobposts.getJobPostById(app.job_id);
            let getApplicant = await users.getUserById(app.user_id);
            let getHr = await users.getUserById(app.hr_id);
            let getResume = await resumes.getResumeById(app.resume_id);
            app.applicant = getApplicant;
            app.hr = getHr;
            app.resume = getResume;
            app.job = getJob
            app.status = app.status == 0 ? "Pending" : app.status == 1 ? "Admitted" : "Rejected";
        }
    }
    return appList;

}

const getAllAppByJobId = async (JobId) => {
    HRId = helpers.checkId(JobId);
    const appCollection = await app();
    const appList = await appCollection.find({job_id: JobId}).toArray();
    if (!appList) throw "Error: Getting all appList failed";
    for (let app of appList) {
        app._id = app._id.toString();
        app.applicant_id = app.user_id.toString();
        let getJob = await jobposts.getJobPostById(app.job_id);
        let getApplicant = await users.getUserById(app.user_id);
        let getHr = await users.getUserById(app.hr_id);
        let getResume = await resumes.getResumeById(app.resume_id);
        app.applicant = getApplicant;
        app.hr = getHr;
        app.resume = getResume;
        app.job = getJob
        app.status = app.status == 0 ? "Pending" : app.status == 1 ? "Admitted" : "Rejected";
    }
    return appList;

}

const getAllApplied = async (applicantId) => {
  helpers.checkId(applicantId);
  const appCollection = await app();
  let appList = await appCollection.find({user_id: applicantId}).toArray();
  if (!appList) throw "Error: Getting all appList failed";

  for (let app of appList) {
    app._id = app._id.toString();
    app.applicant_id = app.user_id.toString();
    if (app.applicant_id === applicantId) {
      let getJob = await jobposts.getJobPostById(app.job_id);
      let getApplicant = await users.getUserById(app.user_id);
      let getHr = await users.getUserById(app.hr_id);
      let getResume = await resumes.getResumeById(app.resume_id);
      app.applicant = getApplicant;
      app.hr = getHr;
      app.resume = getResume;
      app.job = getJob;
      app.status = app.status == 0 ? "Pending" : app.status == 1 ? "Admitted" : "Rejected";
    }
  }
  return appList;
}

const sendNote = async (appId, noteObj) => {
    helpers.checkId(appId);
    const appCollection = await app();
    const updateInfo = await appCollection.updateOne(
        {_id: ObjectId(appId)},
        {$addToSet: {notes: noteObj}
    });
    if (!updateInfo.acknowledged || !updateInfo.modifiedCount) throw `Could not send the note.`;
    return true;
}

const deleteApp = async (appId) => {
    helpers.checkId(appId);
    const appCollection = await app();
    const updateInfo = await appCollection.deleteOne({_id: ObjectId(appId)});
    if (updateInfo.deletedCount === 0) throw `Could not delete the application.`;
    return true;
}

const updateStatus = async (appId, adOrNot) => {
    helpers.checkId(appId);
    const appCollection = await app();
    adOrNot = adOrNot ? 1 : 2;
    const updateInfo = await appCollection.updateOne(
        {_id: ObjectId(appId)},
        {$set: {status: adOrNot}}
    );
    if (!updateInfo.acknowledged || !updateInfo.modifiedCount) throw `Could not update the status`;
    return true;
}
  module.exports = {
    createApplication,
    getAllApplied,
    getAppById,
    getAllAppByHRId, sendNote, updateStatus, getAllAppByJobId, deleteApp
};