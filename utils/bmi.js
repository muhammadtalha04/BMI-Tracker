const Conversion = require("./conversion");

const bmi = {
    calculateBMI(member, weight) {
        if (member.height <= 0) {
            return 0;
        }
        else {
            return Conversion.round((weight / (member.height * member.height)), 2);
        }
    },

    determineBMICategory(bmiValue) {
        if (bmiValue >= 0.0 && bmiValue < 15.0) {
            return "Very Severely Underweight";
        }
        if (bmiValue >= 15.0 && bmiValue < 16.0) {
            return "Severely Underweight";
        }
        if (bmiValue >= 16.0 && bmiValue < 18.5) {
            return "Underweight";
        }
        if (bmiValue >= 18.5 && bmiValue < 25.0) {
            return "Normal";
        }
        if (bmiValue >= 25.0 && bmiValue < 30.0) {
            return "Overweight";
        }
        if (bmiValue >= 30.0 && bmiValue < 35.0) {
            return "Moderately Obese";
        }
        if (bmiValue >= 35.0 && bmiValue < 40.0) {
            return "Severely Obese";
        }
        if (bmiValue >= 40.0 && bmiValue < 1000.0) {
            return "Very Severely Obese";
        }

        return "No category available.";
    }
};

module.exports = bmi;