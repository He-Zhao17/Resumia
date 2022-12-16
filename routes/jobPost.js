const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const {checkEmployer, checkPlace, checkSalary, checkJobTitle, checkJobDescription, checkId, checkJobPostString} = require("../helper/helpers");
const {ObjectId} = require("mongodb");
const jobPostsData = data.jobposts;

router
    .route("/:id")
    .get(async (req, res) => {
        if (!req.session.userId) {
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
            res.status(200).render("jobPost", {
                title: "Job Post",
                isHomepage: true,
                jobPost: postFound
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