const mongoCollections = require("../config/mongoCollections");
const jobpost = mongoCollections.appliction;
const app = mongoCollections.appliction;
const helpers = require("../helper/helpers");
const {ObjectId} = require("mongodb");


const getAllPosts = async(posterId) => {
    const JobCollection = await jobpost();
    const JobList = await JobCollection.find({posterId: ObjectId(posterId)}).toArray();
    if (!JobList){
        throw 'Could not get all jobs';
    }
    for (var i = 0; i < JobList.length; i++) {
        JobList[i]._id = JobList[i]._id.toString();
    }
    return JobList;
}

const getAllApplications = async (posterId) => {
    const AppCollection = await app();
    const appList = await AppCollection.find({hr_id: ObjectId(posterId)}).toArray();
    if (!appList){
        throw 'Could not get all applications';
    }
    for (var i = 0; i < appList.length; i++) {
        appList[i]._id = appList[i]._id.toString();
    }
    return appList;
}

module.exports = {
    getAllPosts,
    getAllApplications
}