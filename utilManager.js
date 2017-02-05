'use strict';

var util = require('util');

var error = (msg)=>{
  var colors = util.inspect.colors;
  util.inspect.colors = 'red';
  util.log(msg);
  util.inspect.colors = colors;
}

module.exports = {
  error:error
}
