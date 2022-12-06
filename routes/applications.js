const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const {checkEmployer, checkPlace, checkSalary, checkJobTitle, checkJobDescription, checkId, checkJobPostString} = require("../helper/helpers");
const {ObjectId} = require("mongodb");
const appData = data.applications;

router
    .route("/:id")
    .get(async (req, res) => {
        if (req.session.userType === true || req.session.userType === null) {
            res.status(403).render("forbiddenAccess", {
                title: "Forbidden Access",
                error: "Error: 403, You are NOT logged in yet!",
            });
        }
        try {
            if (!req.params.id) {
                throw "Error: Invalid Application Id";
            }
            if (typeof req.params.id !== "string") {
                throw "Error: Invalid Application Id";
            }
            let id = checkId(req.params.id);
            let appFound = await appData.getAppById(id);
            res.status(200).render("application", {
                title: "Application",
                isHomepage: true,
                application: appFound
            })
        } catch (error) {
            return res.status(403).render("application", {
                title: "Application",
                isHomepage: true,
                error: error,
            });
        }

    })

module.exports = router;