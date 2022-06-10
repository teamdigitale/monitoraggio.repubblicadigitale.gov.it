// Use of the shareable commitlint config in order to enforcing conventional commits
// https://commitlint.js.org/

module.exports = {
  extends: ['@commitlint/config-conventional']
  /*
   * Any rules defined here will override rules from @commitlint/config-conventional
   */
  /*rules: {
    // manage dependabot commit message
    'header-max-length': [2, 'always', 200],
  }*/
};
