const express = require("express");
const router = express.Router();
const path = require("path");
const data = require("../data");

router.route("/:id").get(async (req, res) => {
  if (req.session.userType === false) {
    if (req.session.basicInfo === true) {
      return res.render("receivedApplications", {
        title: "Homepage",
        username: req.session.user,
        time: new Date().toUTCString(),
      });
    } else {
      res.sendFile(path.resolve("static/HRBasicInfo.html"));
    }
  } else {
    res.status(403).sendFile(path.resolve("static/forbiddenAccess.html"));
  }
});

module.exports = router;
