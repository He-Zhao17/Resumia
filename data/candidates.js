const helpers = require("../helper/helpers");
const jobposts = require("./jobposts");
const {ObjectId} = require("mongodb");
const {user} = require("../config/mongoCollections");
const users = require("./users");
const resumes = require("./resumes");


const getFirstNCandidates = async (firstPageNumber) => {




}

const createOneCandidate = async (
    name,
    phone,
    email,
    githubLink,
    techSkills

) => {
    helpers.checkName(name);
    helpers.checkPhone(phone);
    helpers.checkUserEmail(email);




}