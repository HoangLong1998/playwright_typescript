module.exports = {
  default: {
    requireModule: ['ts-node/register/transpile-only'],
    require: ['features/support/**/*.js', 'features/stepsDefinition/**/*.ts']
  }
};
//npx cucumber-js features/ErrorValidation.feature --exit
//npx cucumber-js --parallel 2 --exit --format html:cucumber-report.html
//npx cucumber-js features/greeting.feature --parallel 2 --exit --format html:cucumber-report.html
