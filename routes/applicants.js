const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const userData = data.users;
const appData = data.applications;
const jobData=data.jobposts;
const resumeData = data.resumes;

router.route("/jobmarket").get(async (req, res) => {
  if (req.session.userType === true) {
    if (req.session.basicInfo === true) {
      return res.render("jobMarket", {
        title: "Homepage",
        time: new Date().toUTCString(),
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
      if(req.body.formid=="jobmarket-form"){
        req.session.searchinput=req.body.input;
        req.session.searchtype=req.body.type;
        let array = await jobData.findjobs(req.session.searchinput,req.session.searchtype);
        req.session.searchArray=array;
         res.render("jobMarket",{jobs:req.session.searchArray,title: "Homepage",
         time: new Date().toUTCString(),
         isHomepage: true,
         isApplicant: true}) 
         console.log(req.session.searchArray)
       }
       else if(req.body.formid=="jobpost-form"){
         let array = await appData.createApplication("hr_id",req.session.userId,"no",req.body.jobid);
         res.redirect("/applicant/jobmarket")
         console.log(req.body);
       }
       else if(req.body.formid=="sort-form"){
        console.log(req.body.sortby)
        if(req.body.sortby=="LowHigh"){
        req.session.searchArray=helpers.sortedbysalrayformlowtohigh(req.session.searchArray);
        console.log(req.session.searchArray)
        res.render("jobMarket",{jobs:req.session.searchArray,title: "Homepage",
        time: new Date().toUTCString(),
        isHomepage: true,
        isApplicant: true});
        }
        else if(req.body.sortby=="HighLow"){
        req.session.searchArray=helpers.sortedbysalrayformhightolow(req.session.searchArray);
        console.log(req.session.searchArray)
        res.render("jobMarket",{jobs:req.session.searchArray,title: "Homepage",
        time: new Date().toUTCString(),
        isHomepage: true,
        isApplicant: true});
        }
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
router
  .route("/addBasicInfo")
  .get(async (req, res) => {
    if (req.session.userType == true || req.session.userType == null) {
      res.status(403).render("forbiddenAccess", {
        title: "Forbidden Access",
        error: "Error: 403, You are NOT logged in yet!",
      });
    }
    if (req.session.basicInfo ==true) {
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
        let array=[];
        let user = await userData.getUserById(req.session.userId);
        array.push(user);
        console.log(user)
        res.render("applicantProfile",{
          isHomepage: true,
          isApplicant: true,
          user:array
        }) 
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
  router.route("/updateInfo").get(async (req, res) => {
    if (req.session.userType === true) {
      if (req.session.basicInfo === true) {
        let array=[];
        let user = await userData.getUserById(req.session.userId);
        array.push(user);
        console.log(user)
        res.render("updateInfo",{
          isHomepage: true,
          isApplicant: true,
          user:array,
        }) 
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
      }catch(e){
        let array=[];
        let user = await userData.getUserById(req.session.userId);
        array.push(user);
        console.log(user)
        res.render("updateInfo",{error:e,user:array});
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

router.route("/createResume").get(async (req, res) => {
  if (req.session.userType != true) {
    return res.status(403).render("forbiddenAccess", {
      title: "Forbidden Access",
      error: "Error: 403, You are NOT logged in yet!",
    });
  }
  if (req.session.basicInfo != true) {
    res.render("applicantBasicInfo", {
      title: "Applicant Basic Info",
    });
  }
  res.render("createResume", {
    title: "Create Resume",
    isHomepage: true,
    isApplicant: true,
  });
})
.post(async (req, res) => {
  if (req.session.userType != true) {
    return res.status(403).render("forbiddenAccess", {
      title: "Forbidden Access",
      error: "Error: 403, You are NOT logged in yet!",
    });
  }
  if (req.session.basicInfo != true) {
    res.render("applicantBasicInfo", {
      title: "Applicant Basic Info",
    });
  }
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

    // These 3 are arrays of objects
    let edu = req.body.edu;
    let emp = req.body.emp;
    let pro = req.body.pro;

    const createInfo = await resumeData.createResume(
      req.session.userId,
      resumeName,
      firstname,
      lastname,
      email,
      gender,
      city,
      state,
      country,
      age,
      phone,
      address,
      website,
      skills,
      edu,
      emp,
      pro
    );

    if (createInfo) {
      res.redirect("/applicant/reviewResumes");
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (e) {
    res.render("createResume", { error: e });
  }
});

router.route("/applied").get(async (req, res) => {
  if (req.session.userType != true) {
    return res.status(403).render("forbiddenAccess", {
      title: "Forbidden Access",
      error: "Error: 403, You are NOT logged in yet!",
    });
  }
  if (req.session.basicInfo != true) {
    res.render("applicantBasicInfo", {
      title: "Applicant Basic Info",
    });
  }
  try {
    let applied = appData.getAllApplied(req.session.userId);
    if (!applied) { return res.status(500).json({ error: "Internal Server Error" }); }
    res.render("applied", {
      title: "Applied Jobs",
      isHomepage: true,
      isApplicant: true,
      applied: applied,
    });
  } catch (error) {
    res.render("applied", { error: e });
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
