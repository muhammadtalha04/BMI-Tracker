"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const Analytics = require("../utils/analytics");
const BMI = require("../utils/bmi");
const goalStore = require("../models/goal");
const assessmentStore = require("../models/assessment");
const memberStore = require("../models/member");
const uuid = require("uuid");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    
    const loggedInUser = accounts.getCurrentUser(request);
    const assessments = assessmentStore.getMemberAssessment(loggedInUser.id);
    const memberStats = Analytics.generateMemberStats(loggedInUser);

    let goal = goalStore.getMemberGoal(loggedInUser.id);
    const today = goalStore.getTodayDate();
    let status = "No Goal Set";;
    
    assessments.reverse();
    goal.reverse();

    if (goal.length == 0) {
      goal = {
        futuredate: today,
        goalweight: '',
        goalchest: '',
        goalthigh: '',
        goalupperarm: '',
        goalwaist: '',
        goalhips: '' 
      };
    }
    else {
      goal = goal[0];
      
      const todayDate = new Date(today);
      const goalDate = new Date(goal.futuredate);

      let counter = 0;

      const goalassessment = assessmentStore.getAssessment(goal.recentassessment);
      const recentassessment = assessments[0];

      console.log("}} goal time assessment: " + goalassessment.weight + " }} goal: " + goal.goalweight + " }} recent: " + recentassessment.weight);

      // CHECKING THE WEIGHT
      if (goalassessment.weight > goal.goalweight && recentassessment.weight <= goal.goalweight) {
        console.log("weight");
        counter++;
      }
      else if (goalassessment.weight == goal.goalweight && recentassessment.weight == goal.goalweight) {
        console.log("weight");
        counter++;
      }
      else if (goalassessment.weight < goal.goalweight && recentassessment.weight >= goal.goalweight) {
        console.log("weight");
        counter++;
      }

      // CHECKING THE CHEST
      if (goalassessment.chest > goal.goalchest && recentassessment.chest <= goal.goalchest) {
        console.log("chest");
        counter++;
      }
      else if (goalassessment.chest == goal.goalchest && recentassessment.chest == goal.goalchest) {
        console.log("chest");
        counter++;
      }
      else if (goalassessment.chest < goal.goalchest && recentassessment.chest >= goal.goalchest) {
        console.log("chest");
        counter++;
      }

      // CHECKING THE THIGH
      if (goalassessment.thigh > goal.goalthigh && recentassessment.thigh <= goal.goalthigh) {
        console.log("thigh");
        counter++;
      }
      else if (goalassessment.thigh == goal.goalthigh && recentassessment.thigh == goal.goalthigh) {
        console.log("thigh");
        counter++;
      }
      else if (goalassessment.thigh < goal.goalthigh && recentassessment.thigh >= goal.goalthigh) {
        console.log("thigh");
        counter++;
      }

      // CHECKING THE UPPER ARM
      if (goalassessment.upperarm > goal.goalupperarm && recentassessment.upperarm <= goal.goalupperarm) {
        console.log("upper arm");
        counter++;
      }
      else if (goalassessment.upperarm == goal.goalupperarm && recentassessment.upperarm == goal.goalupperarm) {
        console.log("upper arm");
        counter++;
      }
      else if (goalassessment.upperarm < goal.goalupperarm && recentassessment.upperarm >= goal.goalupperarm) {
        console.log("upper arm");
        counter++;
      }

      // CHECKING THE WAIST
      if (goalassessment.waist > goal.goalwaist && recentassessment.waist <= goal.goalwaist) {
        console.log("waist");
        counter++;
      }
      else if (goalassessment.waist == goal.goalwaist && recentassessment.waist == goal.goalwaist) {
        console.log("waist");
        counter++;
      }
      else if (goalassessment.waist < goal.goalwaist && recentassessment.waist >= goal.goalwaist) {
        console.log("waist");
        counter++;
      }

      // CHECKING THE HIPS
      if (goalassessment.hips > goal.goalhips && recentassessment.hips <= goal.goalhips) {
        console.log("hips");
        counter++;
      }
      else if (goalassessment.hips == goal.goalhips && recentassessment.hips == goal.goalhips) {
        console.log("hips");
        counter++;
      }
      else if (goalassessment.hips < goal.goalhips && recentassessment.hips >= goal.goalhips) {
        console.log("hips");
        counter++;
      }

      if (todayDate < goalDate && counter < 6) {
        status = "Open";
      }
      else if ((todayDate >= goalDate || todayDate < goalDate) && counter >= 6) {
        status = "Achieved";
      }
      else {
        status = "Missed";
      }
    }

    const viewData = {
      title: "Dashboard",
      assessments: assessments,
      member: loggedInUser,
      memberStats: memberStats,
      goal: goal,
      status: status
    };
    
    logger.info("about to render", assessmentStore.getAllAssessments());
    
    response.render("dashboard", viewData);
  },

  addAssessment(request, response) {
    logger.info("Creating Assessment");

    const member = accounts.getCurrentUser(request);
    const today = new Date().toLocaleString(); 

    const assessment = {
      id: uuid(),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperarm: request.body.upperarm,
      waist: request.body.waist,
      hips: request.body.hips,
      memberid: member.id,
      date: today,
      comment: ""
    };

    const memberStats = Analytics.generateMemberStats(member);
    assessment.trend = memberStats.trend;
    
    assessmentStore.addAssessment(assessment);

    response.redirect("/dashboard");
  },

  deleteAssessment(request, response) {
    const assessmentid = request.params.id;

    assessmentStore.removeAssessment(assessmentid);

    response.redirect("/dashboard");
  },

  setGoal(request, response) {
    // const goal = goalStore.getMemberGoal(request.params.id);
    
    // goal.futuredate = request.body.futuredate;
    // goal.goalweight = request.body.goalweight;
    // goal.goalchest = request.body.goalchest;
    // goal.goalthigh = request.body.goalthigh;
    // goal.goalupperarm = request.body.goalupperarm;
    // goal.goalwaist = request.body.goalwaist;
    // goal.goalhips = request.body.goalhips; 
      
    // goalStore.saveGoal();

    const goal = request.body;
    goal.memberid = request.params.id;
    goal.id = uuid();
    
    const assessments = assessmentStore.getMemberAssessment(request.params.id);
    assessments.reverse();

    goal.recentassessment = assessments[assessments.length - 1].id;

    goalStore.addGoal(goal);

    response.redirect("/dashboard");
  }
};

module.exports = dashboard;
