const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const userData = data.users;
const appData = data.applications;
const jobData=data.jobposts;
router.route("/:id").get(async (req, res) => {
  if (req.session.userType === true) {
    if (req.session.basicInfo === true) {
      return res.render("jobMarket", {
        title: "Homepage",
        time: new Date().toUTCString(),
        isHomepage: true,
      });
    } else {
      res.render("applicantBasicInfo", {
        title: "Applicant Basic Info",
      });
    }
  } else {
    return res.status(403).render("forbiddenAccess", {
      title: "Forbidden Access",
      error: "Error: 403, You are NOT logged in yet!",
    });
  }
})
.post(async (req, res) => {
  if(req.body.formid=="jobmarket-form"){
   let array = await jobData.findjobs(req.body.input,req.body.type);
    res.render("jobMarket",{jobs:array}) 
    console.log(array)
  }
  else if(req.body.formid=="jobpost-form"){
    console.log(req.body);
  }
})
router
  .route("/addBasicInfo")
  .get(async (req, res) => {
    if (req.session.userType === true || req.session.userType === null) {
      res.status(403).render("forbiddenAccess", {
        title: "Forbidden Access",
        error: "Error: 403, You are NOT logged in yet!",
      });
    }
    if (req.session.basicInfo === true) {
      res.redirect("/");
    }
  })
  .post(async (req, res) => {
    if (req.session.userType === false || req.session.userType === null) {
      res.status(403).render("forbiddenAccess", {
        title: "Forbidden Access",
        error: "Error: 403, You are NOT logged in yet!",
      });
    }
    if (req.session.basicInfo === true) {
      res.redirect("/");
    }
    try {
      let firstname = req.body.firstnameInput;
      let lastname = req.body.lastnameInput;
      let city = req.body.cityInput;
      let state = req.body.stateInput;
      let country = req.body.countryInput;
      let phone = req.body.phoneInput;
      helpers.checkName(firstname);
      helpers.checkName(lastname);
      helpers.checkPlace(city);
      helpers.checkPlace(state);
      helpers.checkPlace(country);
      helpers.checkPhone(phone);
    } catch (error) {
      return res.status(403).render("applicantBasicInfo", {
        title: "Applicant Basic Info",
        error: error,
      });
    }
    try {
      let firstname = req.body.firstnameInput;
      let lastname = req.body.lastnameInput;
      let gender = req.body.genderInput;
      let city = req.body.cityInput;
      let state = req.body.stateInput;
      let country = req.body.countryInput;
      let phone = req.body.phoneInput;

      const addInfo = await userData.addBasicInfo(
        req.session.userId,
        req.session.userType,
        firstname,
        lastname,
        gender,
        city,
        state,
        country,
        phone
      );

      if (addInfo) {
        req.session.basicInfo = addInfo.basicInfo;
        res.redirect("/");
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } catch (error) {
      return res.status(403).render("applicantBasicInfo", {
        title: "Applicant Basic Info",
        error: error,
      });
    }
  });

module.exports = router;
