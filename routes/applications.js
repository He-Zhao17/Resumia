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
        if (!req.session.userId) {
            return res.status(403).render("forbiddenAccess", {
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
            let hideOrNot = false;
            if (!req.session.userType && appFound.status === "Pending") {
                hideOrNot = true;
            }
            res.status(200).render("application", {
                title: "Application",
                isHomepage: true,
                application: appFound,
                isApplicant: userInfo.type,
                hideOrNot: hideOrNot
            })
        } catch (error) {
            return res.status(403).render("application", {
                title: "Application",
                isHomepage: true,
                error: error,
                isApplicant: req.session.userType
            });
        }

    })


router
    .route("/createApplication")
        .post( async (req, res) => {
            if (!req.session.userId) {
                return res.status(403).render("forbiddenAccess", {
                    title: "Forbidden Access",
                    error: "Error: 403, You are NOT logged in yet!",
                });
            }
            try {
                if (!req.body.submitResume || !req.body.jobIdToBack) {
                    throw "some argument not provided.";
                }
                let resumeId = req.body.submitResume;
                let applicantId = req.session.userId;
                let jobId = req.body.jobIdToBack;
                let jobFound = await jobPostData.getJobPostById(jobId);

                const createInfo = await appData.createApplication(jobFound.posterId, applicantId, resumeId, jobId);
                res.status(200).redirect("/applicant/applied");
            } catch (error) {
                return res.status(403).render("jobMarket",{jobs:req.session.searchArray,title: "Homepage",
                    time: new Date().toUTCString(),
                    isHomepage: true,
                    isApplicant: req.session.userType,
                    error:error});
            }
        });

router
    .route("/sendNotes/:id") // id is application id
    .post(async (req, res) => {
        if (!req.session.userId) {
            return res.status(403).render("forbiddenAccess", {
                title: "Forbidden Access",
                error: "Error: 403, You are NOT logged in yet!",
            });
        }
        let type = true;
        try {
            if (!req.params.id) {
                throw "no appId";
            }
            helpers.checkId(req.params.id);
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
            if (req.session.userType) {
                newNote.from = 'Applicant';
            } else {
                newNote.from = "HR";
                type = false;
            }

            const updateInfo = await appData.sendNote(req.params.id, newNote);
            res.status(200).redirect(`/applications/${req.params.id}`);

        } catch (error) {
            return res.status(403).render("application",{
                isHomepage: true,
                isApplicant: req.session.userType,
                error: error});
        }
    })

router.route("/updateStatus/:id")
    .post(async (req, res) => {
        if (!req.session.userId) {
            return res.status(403).render("forbiddenAccess", {
                title: "Forbidden Access",
                error: "Error: 403, You are NOT logged in yet!",
            });
        }
        try {
            if (!req.params.id) {
                throw "Application Id not provided";
            }
            const userInfo = await userData.getUserById(req.session.userId);
            if (userInfo.type) {
                throw "Applicant cannot update the status.";
            }


            helpers.checkId(req.params.id);
            if (!req.body.adOrNot) {
                throw "no decision";
            }
            let decision = req.body.adOrNot;
            if (!(decision === "true" || decision === "false")) {
                throw "invalid ad/rej"
            }
            decision = decision === "true" ? true : false;

            const updateInfo = await appData.updateStatus(req.params.id, decision);
            res.status(200).redirect(`/applications/${req.params.id}`);

        } catch (error) {
            return res.status(403).render("application",{
                isHomepage: true,
                isApplicant: req.session.userType,
                error: error});
        }

    })




module.exports = router;