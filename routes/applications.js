const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const {checkEmployer, checkPlace, checkSalary, checkJobTitle, checkJobDescription, checkId, checkJobPostString} = require("../helper/helpers");
const {ObjectId} = require("mongodb");
const {user} = require("../config/mongoCollections");
const appData = data.applications;
const jobPostData = data.jobposts;
const userData = data.users;

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
            const userInfo = await userData.getUserById(req.session.userId);
            res.status(200).render("application", {
                title: "Application",
                isHomepage: true,
                application: appFound,
                isApplicant: userInfo.type
            })
        } catch (error) {
            return res.status(403).render("application", {
                title: "Application",
                isHomepage: true,
                error: error,
                isApplicant: true
            });
        }

    })


router
    .route("/createApplication")
        .post( async (req, res) => {
            if (req.session.userType != true) {
                return res.status(403).render("forbiddenAccess", {
                    title: "Forbidden Access",
                    error: "Error: 403, You are NOT logged in yet!",
                });
            }
            try {
                if (!req.body.resumeId || !req.body.applicantId || !req.body.jobId) {
                    throw "some argument not provided.";
                }
                let resumeId = req.body.resumeId;
                let applicantId = req.body.applicantId;
                let jobId = req.body.jobId;
                let jobFound = await jobPostData.getJobPostById(jobId);

                const createInfo = await appData.createApplication(jobFound.posterId, applicantId, resumeId, jobId);
                res.status(200).redirect("/applicant/applied");
            } catch (error) {
                return res.status(403).render("jobMarket",{jobs:req.session.searchArray,title: "Homepage",
                    time: new Date().toUTCString(),
                    isHomepage: true,
                    isApplicant: true,
                    error:error});
            }
        });

router
    .route("/sendNotes") // id is application id
    .post(async (req, res) => {
        if (req.session.userType != true) {
            return res.status(403).render("forbiddenAccess", {
                title: "Forbidden Access",
                error: "Error: 403, You are NOT logged in yet!",
            });
        }
        let type = true;
        try {
            if (!req.body.applicationId) {
                throw "no appId";
            }
            helpers.checkId(req.body.applicationId);
            if (!req.body.notes) {
                throw "no content of the note.";
            }
            let note = req.body.notes;
            if (typeof note !== "string") {
                throw "note is not a string.";
            }
            if (note.trim().toString().length === 0) {
                throw "note is empty";
            }


            let newNote = {
                _id: new ObjectId(),
                notes: note,
                postDate: new Date().toUTCString(),
            }
            const userInfo = await userData.getUserById(req.session.userId);
            if (userInfo.type) {
                newNote.from = 'Applicant';
            } else {
                newNote.from = "HR";
                type = false;
            }

            const updateInfo = await appData.sendNote(req.body.applicationId, newNote);
            res.status(200).refresh();

        } catch (error) {
            return res.status(403).render("application",{
                isHomepage: true,
                isApplicant: true,
                error: error});
        }
    })

router.route("/updateStatus")
    .post(async (req, res) => {
        if (req.session.userType != true) {
            return res.status(403).render("forbiddenAccess", {
                title: "Forbidden Access",
                error: "Error: 403, You are NOT logged in yet!",
            });
        }
        try {
            const userInfo = await userData.getUserById(req.session.userId);
            if (userInfo.type) {
                throw "Applicant cannot update the status.";
            }

            if (!req.body.applicationId) {
                throw "no appId";
            }
            helpers.checkId(req.body.applicationId);
            if (!req.body.adOrNot) {
                throw "no decision";
            }
            let decision = req.body.adOrNot;
            if (typeof decision !== "boolean") {
                throw "note is not a boolean";
            }

            const updateInfo = await appData.updateStatus(req.body.applicationId, req.body.adOrNot);
            res.status(200).refresh();

        } catch (error) {
            return res.status(403).render("application",{
                isHomepage: true,
                isApplicant: true,
                error: error});
        }

    })




module.exports = router;