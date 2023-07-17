const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const {checkPlace, checkSalary,  checkId, checkJobPostString} = require("../helper/helpers");
const {ObjectId} = require("mongodb");
const { route } = require("./applicants");
const userData = data.users;
const applicationsData = data.applications;
const resumeData = data.resumes;


router
    .route("/")
    .get( async  (req, res) => {
        try {
            if (req.session.userId) {
                if (req.session.userType === true) {
                    return res.redirect(`/applicant/jobmarket`);
                    // pass




                } else {
                    res.render("user lo")
                }
            } else {
                return res.status(400).render("userLogin", {
                    title: "Login",
                    error: "Error: You have to log in."
                });
            }

        } catch (error) {
            return res.status(400).render("userLogin", {
                title: "Login",
                error: error,
            });
        }

    });