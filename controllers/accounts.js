"use strict";

const memberstore = require("../models/member");
const trainerstore = require("../models/trainer");
const logger = require("../utils/logger");
const uuid = require("uuid");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup"
    };
    response.render("index", viewData);
  },

  settings(request, response) {
    const memberEmail = request.cookies.playgym;
    const loggedInUser = memberstore.getMemberByEmail(memberEmail);

    const viewData = {
      title: "Settings",
      member: loggedInUser
    };
    
    response.render("settings", viewData);
  },

  updateSettings(request, response) {
    const member = memberstore.getMemberById(request.params.id);

    member.name = request.body.name;
    member.gender = request.body.gender;
    member.email = request.body.email;
    member.password = request.body.password;
    member.address = request.body.address;
    member.height = request.body.height;
    member.startingweight = request.body.startingweight;
    
    memberstore.saveMember();

    response.redirect('/settings');
  },

  login(request, response) {
    const viewData = {
      title: "Login"
    };
    response.render("login", viewData);
  },

  logout(request, response) {
    response.cookie("playgym", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Sign-up"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const member = request.body;
    member.id = uuid();
    memberstore.addMember(member);
    logger.info('registering ${member.email}');
    response.redirect("/");
  },

  authenticate(request, response) {
    const member = memberstore.getMemberByEmail(request.body.email);
    const trainer = trainerstore.getTrainerByEmail(request.body.email);

    if (member) {
      response.cookie("playgym", member.email);
      logger.info('logging in ${member.email}');
      response.redirect("/dashboard");
    } else if (trainer) {
      response.cookie("playgym", trainer.email);
      logger.info('logging in ${trainer.email}');
      response.redirect("/trainerdashboard");
    } 
    else {
      response.redirect("/login");
    }
  },

  getCurrentUser(request) {
    const memberEmail = request.cookies.playgym;
    return memberstore.getMemberByEmail(memberEmail);
  }
};

module.exports = accounts;
