const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const {checkEmployer, checkPlace, checkSalary, checkJobTitle, checkJobDescription, checkId, checkJobPostString} = require("../helper/helpers");
const {ObjectId} = require("mongodb");
const userData = data.users;



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
        res.status(200).render("post", {
          title: "Create a Job Post"
        });
      } catch (e) {
        return res.status(403).render("post", {
          title: "Create a Job Post",
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
      let params = req.body;
      try {
        if (!req.body.employer || !req.body.country || !req.body.state || !req.body.city || !req.body.salary || !req.body.jobTitle
            || !req.body.jobDescription || !req.body.isAvailable) {
          throw "You hava some information empty or invalid.";
        }

        let posterId = req.session.userId;
        let employer = params.employer;
        let country = params.country;
        let state = params.state;
        let city = params.city;
        let salary = params.salary;
        let jobTitle = params.jobTitle;
        let jobDescription = params.jobDescription;
        let isAvailable  = params.isAvailable;
        posterId = checkId(posterId);
        employer = checkJobPostString("employer", employer);
        country = checkPlace(country);
        state = checkPlace(state);
        city = checkPlace(city);
        salary = checkSalary(salary);
        jobTitle = checkJobPostString("jobTitle", jobTitle);
        jobDescription = checkJobPostString("jobDescription", jobDescription);
        if (!isAvailable) {
          throw "Error: Invalid isAvailable";
        }

        if (typeof isAvailable !== "string") {
          throw "Error: Invalid isAvailable";
        }
        if (isAvailable === "true") {
          isAvailable = true;
        } else if (isAvailable === "false") {
          isAvailable = false;
        } else {
          throw "Error: Invalid isAvailable";
        }
        if (typeof isAvailable !== "boolean") {
          throw "Error: Invalid isAvailable";
        }
        const jobPostData = data.jobposts;
        const newPostId = await jobPostData.createJobPost(posterId,employer, country, state, city, salary, jobTitle, jobDescription, isAvailable);
        if (newPostId) {
          const postCreated = await jobPostData.getJobPostById(newPostId);
          res.status(200).render("jobPost.js", {
            title: "Job Post",
            jobPost: postCreated
          });
        } else {
          return res.status(500).json({ error: "Internal Server Error" });
        }
      } catch (error) {
        return res.status(403).render("post", {
          title: "Create a Job Post",
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
    .route("/posted")
    .get(async  (req, res) => {
      if (req.session.userType === true || req.session.userType === null) {
        res.status(403).render("forbiddenAccess", {
          title: "Forbidden Access",
          error: "Error: 403, You are NOT logged in yet!",
        });
      }
      try {
        const hrData = data.hrs;
        const postsFound = await hrData.getAllPosts(req.session.userId);
        res.status(200).render("posted", {
          title: "Posted Positions",
          jobPosts: postsFound
        });
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
        const appsFound = await data.applications.getAllAppByHRId(req.session.userId);
        res.status(200).render("posted", {
          title: "Received Applications",
          applications: appsFound
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
        const HRFound = await userData.getUserById(req.session.userId);
        res.status(200).render("HRProfile", {
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
module.exports = router;
