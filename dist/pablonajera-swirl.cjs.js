'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./pablonajera-swirl.cjs.prod.js");
} else {
  module.exports = require("./pablonajera-swirl.cjs.dev.js");
}
