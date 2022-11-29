const mongoCollections = require("../config/mongoCollections");
const jobpost = mongoCollections.jobpost;
const helpers = require("../helper/helpers");
const getAllJobPost = async () => {
    const JobCollection = await jobpost();
    const JobList = await JobCollection.find({}).toArray();
      if (!JobList){
        throw 'Could not get all movies';
      }
      return JobList;
};
const findjobs= async (string,type) => {
    const jobs = await getAllJobPost();
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
    }
  return result;
};
module.exports = {
    findjobs
};