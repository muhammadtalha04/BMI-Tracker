~"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const trainerdashboard = require("./controllers/trainerdashboard.js");

router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);
router.get("/settings", accounts.settings);
router.post("/settings/:id", accounts.updateSettings);

router.get("/dashboard", dashboard.index);
router.post("/dashboard/addassessment", dashboard.addAssessment);
router.get("/dashboard/deleteassessment/:id", dashboard.deleteAssessment);
router.post("/dashboard/setgoal/:id", dashboard.setGoal);

router.get("/about", about.index);

router.get("/trainerdashboard", trainerdashboard.index);
router.get("/trainerdashboard/deletemember/:id", trainerdashboard.deleteMember);
router.get("/trainerassessment/:id", trainerdashboard.trainerAssessment);
router.post("/editcomment/:id", trainerdashboard.editComment);

module.exports = router;
