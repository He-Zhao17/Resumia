const express = require("express");
const router = express.Router();
const path = require("path");
const data = require("../data");

router.route("/:id").get(async (req, res) => {
  /**
   * TODO: need to route the user to different page depending on stages!
   */
  if (req.session.userType === true) {
    return res.render("applicantHomepage", {
      title: "Homepage",
      time: new Date().toUTCString(),
    });
  } else {
    res.status(403).render("forbiddenAccess", {
      title: "forbiddenAccess",
      error: "Error: 403, You are NOT logged in yet!",
    });
  }
});

module.exports = router;
