const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const {checkEmployer, checkPlace, checkSalary, checkJobTitle, checkJobDescription, checkId, checkJobPostString} = require("../helper/helpers");
const {ObjectId} = require("mongodb");
const jobPostsData = data.jobposts;
const appData = data.applications;
router
    .route("/:id")
    .get(async (req, res) => {
        if ((!req.session.userType == false)) {
            res.status(403).render("forbiddenAccess", {
                title: "Forbidden Access",
                error: "Error: 403, You are NOT logged in yet!",
            });
        }
        try {
            if (!req.params.id) {
                throw "Error: Invalid jobPost Id";
            }
            if (typeof req.params.id !== "string") {
                throw "Error: Invalid jobPost Id";
            }
            let id = checkId(req.params.id);
            let postFound = await jobPostsData.getJobPostById(id);
            if (postFound.posterId !== req.session.userId) {
                res.status(403).render("forbiddenAccess", {
                    title: "Forbidden Access",
                    error: "Error: 403, You are NOT logged in yet!",
                });
            }
            let application = await appData.getAllAppByJobId((req.params.id));
            res.status(200).render("jobPost", {
                title: "Job Post",
                isHomepage: true,
                jobPost: postFound,
                //这里是这个job收到的所有application！
                applications: application
            })
        } catch (error) {
            return res.status(403).render("jobPost", {
                title: "Job Post",
                isHomepage: true,
                error: error,
            });
        }

    })

module.exports = router;