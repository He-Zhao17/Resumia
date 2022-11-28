const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const userData = data.users;
const path = require("path");

router.route("/").get(async (req, res) => {
  if (req.session.userId) {
    if (req.session.userType === true) {
      return res.redirect(`/applicant/${req.session.userId}`);
    } else {
      return res.redirect(`/hr/${req.session.userId}`);
    }
  } else {
    res.sendFile(path.resolve("static/userLogin.html"));
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
      res.sendFile(path.resolve("static/userRegister.html"));
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
      res.status(400).sendFile(path.resolve("static/userLogin.html"));
    }

    try {
      let email = req.body.emailInput;
      let password = req.body.passwordInput;
      let isApplicant = req.body.userTypeInput;
      const createInfo = await userData.createUser(
        email,
        password,
        isApplicant
      );
      console.log(createInfo);
      if (createInfo) {
        req.session.userId = createInfo.userId;
        req.session.userType = createInfo.userType;
        req.session.basicInfo = createInfo.basicInfo;
        res.redirect("/");
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } catch (error) {
      return res.status(500).sendFile(path.resolve("static/userRegister.html"));
    }
  });

router.route("/login").post(async (req, res) => {
  try {
    let email = req.body.emailInput;
    let password = req.body.passwordInput;
    helpers.checkUserEmail(email);
    helpers.checkPassword(password);
  } catch (error) {
    return res.status(400).sendFile(path.resolve("static/userLogin.html"));
  }

  try {
    let email = req.body.emailInput;
    let password = req.body.passwordInput;
    const checkResult = await userData.checkUser(email, password);
    if (checkResult) {
      req.session.userId = checkResult.userId;
      req.session.userType = checkResult.userType;
      req.session.basicInfo = checkResult.basicInfo;
      return res.redirect("/");
    }
  } catch (error) {
    return res.status(400).sendFile(path.resolve("static/userLogin.html"));
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.redirect("/");
});

module.exports = router;
