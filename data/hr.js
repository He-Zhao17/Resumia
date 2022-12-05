const mongoCollections = require("../config/mongoCollections");
const jobpost = mongoCollections.jobpost;
const helpers = require("../helper/helpers");
const {ObjectId} = require("mongodb");


const getAllPosts = async(posterId) => {
    const JobCollection = await jobpost();
    const JobList = await JobCollection.find({"posterId": posterId}).toArray();
    if (!JobList){
        throw 'Could not get all jobs';
    }
    for (var i = 0; i < JobList.length; i++) {
        JobList[i]._id = JobList[i]._id.toString();
    }
    return JobList;
}



module.exports = {
    getAllPosts,
}