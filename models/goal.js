"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const goalStore = {
  store: new JsonStore("./models/goal-store.json", {
    goalCollection: []
  }),
  collection: "goalCollection",

  getAllGoals() {
    return this.store.findAll(this.collection);
  },

  getGoal(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getMemberGoal(memberid) {
    return this.store.findBy(this.collection, { memberid: memberid });
  },

  addGoal(goal) {
    this.store.add(this.collection, goal);
    this.store.save();
  },

  removeGoal(id) {
    const goal = this.getGoal(id);
    this.store.remove(this.collection, goal);
    this.store.save();
  },

  removeMemberGoal(memberid) {
    this.store.remove(this.collection, {memberid: memberid});
    this.store.save();
  },

  removeAllGoals() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

  saveGoal() {
    this.store.save();
  },

  getTodayDate() {
    let today = new Date().toLocaleDateString();
    let newToday = today.split('/');

    today = newToday[2] + "-";

    if (newToday[0].length<2) {
      today += '0';
    }
    today += newToday[0] + '-';

    if (newToday[1].length<2) {
      today += '0';
    }
    today += newToday[1];

    return today;
  }
};

module.exports = goalStore;
