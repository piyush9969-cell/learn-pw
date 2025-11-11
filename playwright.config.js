// playwright.config.js
module.exports = {
  timeout: 120000, // test timeout
  expect: {
    timeout: 20000, // expect timeout
  },
  retries: process.env.CI ? 2 : 0,
};
