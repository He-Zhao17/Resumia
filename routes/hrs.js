const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const {checkEmployer, checkPlace, checkSalary, checkJobTitle, checkJobDescription, checkId} = require("../helper/helpers");
const {ObjectId} = require("mongodb");
const userData = data.users;

router.route("/:id").get(async (req, res) => {
  if (req.session.userType === false) {
    if (req.session.basicInfo === true) {
      return res.render("receivedApplications", {
        title: "Homepage",
        time: new Date().toUTCString(),
        isHomepage: true,
        isApplicant: false,
      });
    } else {
      return res.status(403).render("HRBasicInfo", {
        title: "HR Basic Info",
      });
    }
  } else {
    res.status(403).render("forbiddenAccess", {
      title: "Forbidden Access",
      error: "Error: 403, You are NOT logged in yet!",
    });
  }
});

router
    .route("/post")
    .get( async  (req, res) => {
      if (req.session.userType === true || req.session.userType === null) {
        res.status(403).render("forbiddenAccess", {
          title: "Forbidden Access",
          error: "Error: 403, You are NOT logged in yet!",
        });
      }
      try {
        const hrData = data.hrs;
        const postsFound = await hrData.getAllPosts(this.session.userId);
        req.status(200).render("posted", {
          title: "Posted Positions",
          JobPosts: postsFound
        });
      } catch (error) {
        return res.status(403).render("posted", {
          title: "Posted Positions",
          error: error,
        });
      }
    })
    .post( async (req, res) => {
      if (req.session.userType === true || req.session.userType === null) {
        res.status(403).render("forbiddenAccess", {
          title: "Forbidden Access",
          error: "Error: 403, You are NOT logged in yet!",
        });
      }
      let params = req.body.params;
      try {
        if (!params.posterId ||!params.employer || !params.country || !params.state || !params.city || !params.salary || !params.jobTitle
            || !params.jobDescription || !params.isAvailable) {
          throw "You hava some information empty or invalid.";
        }

        let posterId = params.posterId;
        let employer = params.employer;
        let country = params.country;
        let state = params.state;
        let city = params.city;
        let salary = params.salary;
        let jobTitle = params.jobTitle;
        let jobDescription = params.jobDescription;
        let isAvailable  = params.isAvailable;
        posterId = checkId(posterId);
        employer = checkEmployer(employer);
        country = checkPlace(country);
        state = checkPlace(state);
        city = checkPlace(city);
        salary = checkSalary(salary);
        jobTitle = checkJobTitle(jobTitle);
        jobDescription = checkJobDescription(jobDescription);
        if (!isAvailable) {
          throw "Error: Invalid isAvailable";
        }
        if (typeof isAvailable !== "boolean") {
          throw "Error: Invalid isAvailable";
        }
        const jobPostData = data.jobposts;
        const newPostId = await jobPostData.createJobPost(posterId,employer, country, state, city, salary, jobTitle, jobDescription, isAvailable);
        if (newPostId) {
          const postCreated = await jobPostData.getJobPostById(newPostId);
          res.status(200).render("post", postCreated);
        } else {
          return res.status(500).json({ error: "Internal Server Error" });
        }
      } catch (error) {
        return res.status(403).render("HRBasicInfo", {
          title: "HR Basic Info",
          error: error,
        });
      }

    })
    .delete(async (req, res) => {
      if (req.session.userType === true || req.session.userType === null) {
        res.status(403).render("forbiddenAccess", {
          title: "Forbidden Access",
          error: "Error: 403, You are NOT logged in yet!",
        });
      }
      const params = req.body.params;
      let postId;
      try {
        if (!params.postId) {
          throw "Error: Invalid postId";
        }
        postId = params.postId;
        if (typeof postId !== "string") {
          throw "Error: Invalid postId";
        }
        if (!ObjectId.isValid(postId)) {
          throw "Error: Invalid postId";
        }
        const jobPostData = data.jobposts;
        await jobPostData.removeJobPostById(postId);
        res.status(200).redirect("/posted")
      } catch (error) {
        return res.status(403).render("posted", {
          title: "Posted Positions",
          error: error,
        });
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
    if (req.session.userType === true || req.session.userType === null) {
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
      return res.status(403).render("HRBasicInfo", {
        title: "HR Basic Info",
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
      return res.status(403).render("HRBasicInfo", {
        title: "HR Basic Info",
        error: error,
      });
    }
  });


router
    .route("/received")
    .get(async (req, res) => {
      if (req.session.userType === true || req.session.userType === null) {
        res.status(403).render("forbiddenAccess", {
          title: "Forbidden Access",
          error: "Error: 403, You are NOT logged in yet!",
        });
      }
      try {
        const hrData = data.hrs;
        const appsFound = await hrData.getAllApplications(this.session.userId);
        req.status(200).render("posted", {
          title: "Received Applications",
          JobPosts: appsFound
        });
      } catch (error) {
        return res.status(403).render("receivedApplications", {
          title: "Received Applications",
          error: error,
        });
      }
    })

router
    .route("/profile")
    .get(async  (req, res) => {
      if (req.session.userType === true || req.session.userType === null) {
        res.status(403).render("forbiddenAccess", {
          title: "Forbidden Access",
          error: "Error: 403, You are NOT logged in yet!",
        });
      }
      try {
        const userData = data.users
        const HRFound = await userData.getUserById(this.session.userId);
        req.status(200).render("HRProfile", {
          title: "HR Profile",
          HRProfile: HRFound
        });
      } catch (error) {
        return res.status(403).render("HRProfile", {
          title: "HR Profile",
          error: error,
        });
      }
    })
module.exports = router;
