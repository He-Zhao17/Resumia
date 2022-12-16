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
          title: "Create a Job Post",
          isHomepage: true
        });
      } catch (e) {
        return res.status(403).render("post", {
          title: "Create a Job Post",
          isHomepage: true,
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
          res.status(200).render("jobPost", {
            title: "Job Post",
            isHomepage: true,
            jobPost: postCreated
          });
        } else {
          return res.status(500).json({ error: "Internal Server Error" });
        }
      } catch (error) {
        return res.status(403).render("post", {
          title: "Create a Job Post",
          isHomepage: true,
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
      const params = req.body;
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
          isHomepage: true,
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
          isHomepage: true,
          jobPosts: postsFound
        });
      } catch (error) {
        return res.status(403).render("posted", {
          title: "Posted Positions",
          isHomepage: true,
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
      let age = req.body.ageInput;
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
        isHomepage: true,
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
      let age = req.body.ageInput;
      let phone = req.body.phoneInput;

      const addInfo = await userData.addBasicInfo(
        req.session.userId,
        req.session.userType,
        firstname,
        lastname,
        gender,
        age,
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
        isHomepage: true,
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
        const appsFound = await applicationsData.getAllAppByHRId(req.session.userId);
        res.status(200).render("receivedApplications", {
          title: "Received Applications",
          isHomepage: true,
          isApplicant: false,
          applications: appsFound
        });
      } catch (error) {
        return res.status(403).render("receivedApplications", {
          title: "Received Applications",
          isHomepage: true,
          isApplicant: false,
          error: error
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
        let HRFound = await userData.getUserById(req.session.userId);
        if (HRFound.type === false) {
          HRFound.Type = 'HR';
        }
        res.status(200).render("HRProfile", {
          title: "HR Profile",
          isHomepage: true,
          HRProfile: HRFound
        });
      } catch (error) {
        return res.status(403).render("HRProfile", {
          title: "HR Profile",
          isHomepage: true,
          error: error,
        });
      }
    })



router.route("/updateInfo").get(async (req, res) => {
  if (req.session.userType === false) {
    if (req.session.basicInfo === true) {
      let user = await userData.getUserById(req.session.userId);
      return res.render("HRUpdateInfo", {
        title: "Update Info",
        isHomepage: true,
        isApplicant: false,
        user: user
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

router.route("/readResume/:id").get(async (req, res) => {
  if (req.session.userType === true) {
    return res.status(403).render("forbiddenAccess", {
      title: "Forbidden Access",
      error: "Error: 403, You are NOT logged in yet!",
    });
  }
  try {
    let resume = await resumeData.getResumeById(req.params.id);
    if (!resume) { return res.status(500).json({ error: "Internal Server Error" }); }
    console.log(resume);
    res.render("reviewOneResume", {
      title: "Review Resumes",
      isHomepage: true,
      isApplicant: false,
      resume: resume,
    });
  } catch (error) {
    res.render("reviewResumes", { error: error });
  }
});

router.route("/:id").get(async (req, res) => {
  if (req.session.userType === false) {
    if (req.session.basicInfo === true) {
      return res.status(200).redirect("/hr/received");
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
})
.post(async (req, res) => {
  if (req.session.userType === false) {
    if (req.session.basicInfo === true) {
      try {
      let firstname = req.body.firstnameInput;
      let lastname = req.body.lastnameInput;
      let gender = req.body.genderInput;
      let age = req.body.genderInput;
      let city = req.body.cityInput;
      let state = req.body.stateInput;
      let country = req.body.countryInput;
      let phone = req.body.phoneInput;

      let addInfo = await userData.addBasicInfo(
        req.session.userId,
        firstname,
        lastname,
        gender,
        age,
        city,
        state,
        country,
        phone
      );
      
      if (addInfo) {
        if (addInfo.gender === 0) {
          addInfo.gender = 'Male'
        }
        else if (addInfo.gender === 1){
          addInfo.gender = 'Female'
        }
        else {
          addInfo.gender = 'Not to tell'
        }

        req.session.basicInfo = addInfo.basicInfo;
        res.redirect("/hr/profile");
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }catch(e){
      let user = await userData.getUserById(req.session.userId);
      res.render("updateInfo",{error:e,HRProfile:user});
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


module.exports = router;
