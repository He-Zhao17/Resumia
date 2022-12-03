const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const userData = data.users;
const appData = data.applications;
const jobData = data.jobposts;
router
  .route("/jobmarket")
  .get(async (req, res) => {
    if (req.session.userType === true) {
      if (req.session.basicInfo === true) {
        return res.render("jobMarket", {
          title: "Homepage",
          isHomepage: true,
          isApplicant: true,
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
    if (req.session.userType === true) {
      if (req.session.basicInfo === true) {
        if (req.body.formid == "jobmarket-form") {
          let array = await jobData.findjobs(req.body.input, req.body.type);
          res.render("jobMarket", { jobs: array });
          console.log(array);
        } else if (req.body.formid == "jobpost-form") {
          let array = await appData.createApplication(
            "hr_id",
            req.session.userId,
            "no",
            req.body.jobid
          );
          res.redirect("/applicant/jobmarket");
          console.log(req.body);
        }
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
  });
router
  .route("/addBasicInfo")
  .get(async (req, res) => {
    if (req.session.userType == true || req.session.userType == null) {
      res.status(403).render("forbiddenAccess", {
        title: "Forbidden Access",
        error: "Error: 403, You are NOT logged in yet!",
      });
    }
    if (req.session.basicInfo == true) {
      res.redirect("/");
    }
  })
  .post(async (req, res) => {
    if (req.session.userType == false || req.session.userType == null) {
      res.status(403).render("forbiddenAccess", {
        title: "Forbidden Access",
        error: "Error: 403, You are NOT logged in yet!",
      });
    }
    if (req.session.basicInfo == true) {
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

router.route("/profile").get(async (req, res) => {
  if (req.session.userType === true) {
    if (req.session.basicInfo === true) {
      let array = [];
      let user = await userData.getUserById(req.session.userId);
      array.push(user);
      console.log(user);
      res.render("applicantProfile", {
        user: array,
        title: "Profile",
        isHomepage: true,
        isApplicant: true,
      });
    } else {
      res.render("applicantBasicInfo", {
        title: "Applicant Basic Info",
      });
    }
  }
});

router
  .route("/updateInfo")
  .get(async (req, res) => {
    if (req.session.userType === true) {
      if (req.session.basicInfo === true) {
        let array = [];
        let user = await userData.getUserById(req.session.userId);
        array.push(user);
        console.log(user);
        res.render("updateInfo", { user: array });
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
    if (req.session.userType === true) {
      if (req.session.basicInfo === true) {
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
            res.redirect("/applicant/profile");
          } else {
            return res.status(500).json({ error: "Internal Server Error" });
          }
        } catch (e) {
          let array = [];
          let user = await userData.getUserById(req.session.userId);
          array.push(user);
          console.log(user);
          res.render("updateInfo", { error: e, user: array });
        }
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
    if (req.session.userType === true) {
      if (req.session.basicInfo === true) {
        try {
          let resumeName = req.body.resumeNameInput;
          let firstname = req.body.firstnameInput;
          let lastname = req.body.lastnameInput;
          let email = req.body.emailInput;
          let gender = req.body.genderInput;
          let city = req.body.cityInput;
          let state = req.body.stateInput;
          let country = req.body.countryInput;
          let age = req.body.ageInput;
          let phone = req.body.phoneInput;
          let address = req.body.addrInput;
          let website = req.body.websiteInput;
          let skills = req.body.skills;
          // TODO: Haven't finished this part yet.

          const createInfo = await resumeData.createResume(
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

          if (createInfo) {
            res.redirect("/applicant/reviewResumes");
          } else {
            return res.status(500).json({ error: "Internal Server Error" });
          }
        } catch (e) {
          res.render("createResume", { error: e });
        }
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
  });

router.route("/createResume").get(async (req, res) => {
  if (req.session.userType === true) {
    if (req.session.basicInfo === true) {
      res.render("createResume", {
        title: "Create Resume",
        isHomepage: true,
        isApplicant: true,
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
});

router.route("/applied").get(async (req, res) => {
  if (req.session.userType === true) {
    if (req.session.basicInfo === true) {
      res.render("applied", {
        title: "Applied Jobs",
        isHomepage: true,
        isApplicant: true,
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
});

router.route("/reviewResumes").get(async (req, res) => {
  if (req.session.userType === true) {
    if (req.session.basicInfo === true) {
      res.render("reviewResumes", {
        title: "Review Resumes",
        isHomepage: true,
        isApplicant: true,
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
});
module.exports = router;
