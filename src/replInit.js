'use strict';

var utilManager = require('../utilManager');

var _manager = null;
var config = {
  "use":{
    "help":"check out database",
    action(dataname){
      var _that = this;
      _manager.checkoutDatabase(dataname)
      .then(() => {
        console.log('The database is ',dataname);
        _that.displayPrompt();
      })
      .catch((err)=> {
        utilManager.error(err);
        _that.displayPrompt();
      });
    }
  },
  "databases":{
    "help": "show all database",
    action(){
      var _that = this;
      _manager.getAllDatabase()
      .then(() => {
        _that.displayPrompt();
      })
      .catch((err) => {
        utilManager.error(err);
        _that.displayPrompt();
      })
    }
  },
  "tables":{
    "help":"show all tables",
    action(){
      var _that = this;
      _manager.getAllTables()
      .then(() => {
        _that.displayPrompt();
      })
      .catch((err)=> {
        utilManager.error(err);
        _that.displayPrompt();
      });
    }
  },
  "desc":{
    "help": "show all columns describe",
    action(tableName){
      var _that = this;
      _manager.getDesc(tableName)
      .then(()=>{
        _that.displayPrompt();
      })
      .catch((err) => {
        utilManager.error(err);
        _that.displayPrompt();
      })
    }
  }
}

var init = (replServer,manager) => {
  _manager = manager;
  for (var key in config) {
    replServer.defineCommand(key,config[key]);
  }
}

module.exports = init;
