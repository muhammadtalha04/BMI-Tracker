"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment");
const memberStore = require("../models/member");
const Analytics = require("../utils/analytics");
const uuid = require("uuid");

const trainerdashboard = {
  index(request, response) {
    logger.info("trainer dashboard rendering");
    
    const members = memberStore.getAllMembers();

    for (let i=0; i<members.length; i++) {
      members[i].assessments = assessmentStore.getMemberAssessment(members[i].id);
    }

    const viewData = {
      title: "Trainer Dashboard",
      members: members
    };
    
    logger.info("about to render", memberStore.getAllMembers());
    
    response.render("trainerdashboard", viewData);
  },

  trainerAssessment(request, response) {
    logger.info("trainer assessment rendering");
    
    const member = memberStore.getMemberById(request.params.id);
    const memberAssessments = assessmentStore.getMemberAssessment(member.id);
    const stats = Analytics.generateMemberStats(member);
    
    memberAssessments.reverse();
    
    const viewData = {
      title: "Trainer Dashboard",
      member: member,
      assessments: memberAssessments,
      memberStats: stats
    };
    
    logger.info("about to render", memberStore.getAllMembers());
    
    response.render("trainerassessment", viewData);
  },

  deleteMember(request, response) {
    const memberId = request.params.id;

    const member = memberStore.getMemberById(memberId);

    logger.debug('Deleting ${memberId}');

    if (member != null) {
      memberStore.deleteMember(member);
    }

    response.redirect("/trainerdashboard");
  },

  editComment(request, response) {
    logger.info("Comment editing");

    const assessment = assessmentStore.getAssessment(request.params.id);

    assessment.comment = request.body.comment;
    assessmentStore.saveAssessment();

    response.redirect("/trainerdashboard/");
  }
};

module.exports = trainerdashboard;
