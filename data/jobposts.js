const mongoCollections = require("../config/mongoCollections");
const jobpost = mongoCollections.jobpost;
const helpers = require("../helper/helpers");
const {checkEmployer, checkPlace, checkSalary, checkJobTitle, checkJobDescription, checkId, checkJobPostString} = require("../helper/helpers");
const {ObjectId} = require("mongodb");
const getAllJobPost = async () => {
    const JobCollection = await jobpost();
    const JobList = await JobCollection.find({}).toArray();
      if (!JobList){
        throw 'Could not get all jobs';
      }
      return JobList;
};
const findjobs= async (string,type) => {
    const jobs = await getAllJobPost();
    if(!type&&(!string||string.trim().length === 0)){
        return jobs;
    }
    if (typeof string != "string" ||string == null ||string.trim().length === 0){
        throw "Error: Invalid Input";
    }
    string=string.trim();
    let result=[];
    for(let i=0;i<jobs.length;i++){
        if(type=="salary"&&helpers.ismatched(jobs[i].salary,string)){
            result.push(jobs[i]);
        }
        else if(type=="employer"&&helpers.ismatched(jobs[i].employer,string)){
            result.push(jobs[i]);
        }
        else if(type=="country"&&helpers.ismatched(jobs[i].country,string)){
            result.push(jobs[i]);
        }
        else if(type=="state"&&helpers.ismatched(jobs[i].state,string)){
            result.push(jobs[i]);
        }
        else if(type=="city"&&helpers.ismatched(jobs[i].city,string)){
            result.push(jobs[i]);
        }
        else if(type=="jobTitle"&&helpers.ismatched(jobs[i].jobTitle,string)){
            result.push(jobs[i]);
        }
        else if(type=="employer"&&helpers.ismatched(jobs[i].employer,string)){
            result.push(jobs[i]);
        }
    }
  return result;
};
const createJobPost = async (posterId,employer, country, state, city, salary, jobTitle, jobDescription, isAvailable) => {
    posterId = checkId(posterId);
    employer = checkJobPostString("employer", employer);
    country = checkPlace(country);
    state = checkPlace(state);
    city = checkPlace(city);
    salary = checkSalary(salary);
    jobTitle = checkJobPostString("jobTitle", jobTitle);
    jobDescription = checkJobPostString("jobDescription", jobDescription);
    let date = new Date().toLocaleDateString();
    if (!isAvailable) {
        throw "Error: Invalid isAvailable";
    }
    if (typeof isAvailable !== "boolean") {
        throw "Error: Invalid isAvailable";
    }
    let postInfo = {
        "posterId": posterId,
        "employer" : employer,
        "country": country,
        "state" : state,
        "city": city,
        "salary": salary,
        "jobTitle": jobTitle,
        "jobDescription": jobDescription,
        "isAvailable": isAvailable,
        "postTime":date
    }
    const jobPostCollection = await jobpost();
    const insertInfo = await jobPostCollection.insertOne(postInfo);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw "Error: Creating User failed";
    const newId = insertInfo.insertedId.toString();
    return newId;
}

const getJobPostById = async (id) => {
    id = helpers.checkId(id)
    const jobPostCollection = await jobpost();
    let postFound = await jobPostCollection.findOne({_id: ObjectId(id)});
    if (postFound === null) {
        throw `Error: Job Post ${id} Not Found`;
    }
    postFound._id = postFound._id.toString()
    return postFound;
}

const removeJobPostById = async (id) => {
    id = helpers.checkId(id)
    const jobPostCollection = await jobpost();
    const postFound = jobPostCollection.findOne({_id: ObjectId(id)});
    if (postFound === null) {
        throw `Error: Job Post ${id} Not Found`;
    }
    const deletionInfo = await jobPostCollection.deleteOne({_id: ObjectId(id)});
    if (deletionInfo.deletedCount === 0) {
        throw `Error: Could not delete the jobPost ${id}`;
    }
    return `JobPost ${id} has been successfully deleted!`;

}
module.exports = {
    findjobs,
    createJobPost,
    getJobPostById,
    removeJobPostById
};