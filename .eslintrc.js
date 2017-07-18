// http://eslint.org/docs/user-guide/configuring
var OFF = 0, WARN = 1, ERROR = 2;
module.exports = {
  "parser": "esprima",
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  },
  "plugins": [
    "html"
  ]
}
