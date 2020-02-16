const Conversion = require("./conversion");
const BMI = require("./bmi");
const logger = require("./logger");
const assessment = require("../models/assessment");

const analytics = {
    isIdealBodyWeight(member, weight) {
        const fiveFeet = 60.0;
        var idealBodyWeight = 0;

        const inches = Conversion.convertMetresToInches(member.height, 2);

        if (inches <= fiveFeet) {
            if (member.gender == "M") {
                idealBodyWeight = 50;
            }
            else {
                idealBodyWeight = 45.5;
            }
        }
        else {
            if (member.gender == "M") {
                idealBodyWeight = 50 + ((inches - fiveFeet) * 2.3);
            }
            else {
                idealBodyWeight = 45.5 + ((inches - fiveFeet) * 2.3);
            }
        }

        logger.info("Ideal Weigfht", idealBodyWeight);
        
        return ((idealBodyWeight <= (weight + 2.0)) && (idealBodyWeight >= (weight - 2.0)));
    },

    generateMemberStats(member) {
        var weight = member.startingweight;
        const assessments = assessment.getMemberAssessment(member.id);

        if (assessments.length > 0) {
            const assessment = assessments[assessments.length - 1];
            weight = assessment.weight;
        }

        const bmi = BMI.calculateBMI(member, weight);

        const stats = {
            bmi: bmi,
            bmiCategory: BMI.determineBMICategory(bmi),
            isIdealBodyweight: this.isIdealBodyWeight(member, weight),
            trend: true
        };
        
        if (assessments.length > 1) {
            stats.trend = assessments[assessments.length - 2].weight > assessments[assessments.length - 1].weight;
        }

        return stats;
    }

};

module.exports = analytics;