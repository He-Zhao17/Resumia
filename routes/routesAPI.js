const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const userData = data.users;

router.route("/").get(async (req, res) => {
  /**
   * TODO: check the user stage, if it's just after registering, which is stage 0,
   * then need to route user to fill the rest information(stage 1), if user already
   * finished filling information, then it jumps to stage 3, which will route user
   * directly to its own homepage or dashboard.
   */
  if (req.session.userId) {
    if (req.session.userType === true) {
      return res.redirect("/applicant/" + req.session.userId);
    } else {
      return res.redirect("/hr/" + req.session.userId);
    }
  } else {
    res.render("userLogin", {
      title: "Login",
    });
  }
});

router
  .route("/register")
  .get(async (req, res) => {
    if (req.session.userId) {
      if (req.session.userType === true) {
        return res.redirect("/applicant" + req.session.userId);
      } else {
        return res.redirect("/hr" + req.session.userId);
      }
    } else {
      res.render("userRegister", {
        title: "Register",
      });
    }
  })
  .post(async (req, res) => {
    try {
      let email = req.body.emailInput;
      let password = req.body.passwordInput;
      let userType = req.body.userTypeInput;
      helpers.checkUserEmail(email);
      helpers.checkPassword(password);
      helpers.checkUserType(userType);
    } catch (error) {
      return res.status(400).render("userRegister", {
        title: "Register",
        error: error,
      });
    }

    try {
      let email = req.body.emailInput;
      let password = req.body.passwordInput;
      let isApplicant = req.body.userTypeInput;
      let firstanme=req.body.firstnameInput;
      let lastanme=req.body.lastnameInput;
      let state=req.body.stateInput;
      let gander=req.body.ganderInput;
      let city=req.body.cityInput;
      let country=req.body.countryInput;
      let address=req.body.addressInput;
      let website=req.body.websiteInput;
      let age=req.body.ageInput;
      let phone=req.body.phoneInput;
      const createInfo = await userData.createUser(
        email,
        password,
        isApplicant,
        firstanme,
        lastanme,
        gander,
        city,
        state,
        country,
        age,
        phone,
        address,
        website
      );
      console.log(createInfo);
      if (createInfo) {
        req.session.userId = createInfo.userId;
        req.session.userType = createInfo.userType;
        res.redirect("/");
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } catch (error) {
      return res.status(500).render("userRegister", {
        title: "Register",
        error: error,
      });
    }
  });

router.route("/login").post(async (req, res) => {
  try {
    let email = req.body.emailInput;
    let password = req.body.passwordInput;
    helpers.checkUserEmail(email);
    helpers.checkPassword(password);
  } catch (error) {
    return res.status(400).render("userLogin", {
      title: "Login",
      error: error,
    });
  }

  try {
    let email = req.body.emailInput;
    let password = req.body.passwordInput;
    /**
     * TODO: check the user stage, if it's stage
     */
    const checkResult = await userData.checkUser(email, password);
    if (checkResult) {
      req.session.userId = checkResult.userId;
      req.session.userType = checkResult.userType;
      return res.redirect("/");
    }
  } catch (error) {
    return res.status(400).render("userLogin", {
      title: "Login",
      error: error,
    });
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.render("logout", {
    title: "Logout",
    message: "Successfully logged out",
  });
});

module.exports = router;
