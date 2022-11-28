const express = require("express");
const router = express.Router();
const data = require("../data");
const helpers = require("../helper/helpers");
const userData = data.users;
const path = require("path");

router.route("/:id").get(async (req, res) => {
  if (req.session.userType === true) {
    if (req.session.basicInfo === true) {
      return res.render("jobMarket", {
        title: "Homepage",
        username: req.session.user,
        time: new Date().toUTCString(),
      });
    } else {
      res.sendFile(path.resolve("static/applicantBasicInfo.html"));
    }
  } else {
    res.status(403).sendFile(path.resolve("static/forbiddenAccess.html"));
  }
});

router.route("/addBasicInfo").post(async (req, res) => {
  if (req.session.userType === false || req.session.userType === null) {
    res.status(403).sendFile(path.resolve("static/forbiddenAccess.html"));
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
    res.status(400).sendFile(path.resolve("static/applicantBasicInfo.html"));
    // TODO: is JSON file supposed to be used here?
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

    console.log(addInfo);
    if (addInfo) {
      req.session.basicInfo = addInfo.basicInfo;
      res.redirect("/");
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    return res
      .status(500)
      .sendFile(path.resolve("static/applicantBasicInfo.html"));
  }
});

module.exports = router;
