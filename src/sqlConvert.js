'use strict';

// 引用
var sqlconfig = require('../config/sqlConfig.json');

/**
 * 获取简易sql
 * @param  {string} cli 终端类型
 * @param  {string} cmd 命令
 * @return {string}     sql语句
 */
var getSql = (cli, cmd) => {
  var client = sqlconfig[cli];
  if (!client){
    return '';
  }
  return client[cmd]||'';
}


module.exports = {
  getSql: getSql
}
