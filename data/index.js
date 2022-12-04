const userData = require("./users");
const applicationData = require("./applications");
const jobpostData = require("./jobposts");
const resumeData = require("./resumes");
const hrData = require("./hr")

module.exports = {
  applications: applicationData,
  users: userData,
  jobposts: jobpostData,
  resumes: resumeData,
  hrs: hrData
};
