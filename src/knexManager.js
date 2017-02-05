'use strict';

// 引用模块
var sqlConvert = require('./sqlConvert');
var utilManager = require('../utilManager');
var util = require('util');

var client = "mssql";
var defaultOptions = {
	host:'127.0.0.1',
	user: 'sa',
	password: '*****',
	database: 'master',
	port: 1433
}

// 配置knex
var knexVal = null;

var sqlArray = [];

var checkoutDatabase = function(database){
	defaultOptions.database = database;
	return connectionMssql(defaultOptions);
}

/**
 * 测试连接是否可用
 * @param  {object} k knex实体对象
 * @return {[type]}   [description]
 */
var testConnection = function(k){
	return new Promise(function(resolve,reject){
		k.raw('select 1;')
		.then(()=>{
			knexVal = k;
			console.log('Welcome to sql server');
			console.log('The host is ',defaultOptions.host);
			console.log('The Database is ',defaultOptions.database);
			utilManager.error('You can checkout database use command \'.use [databasename]\' ');
			return resolve(true);
		}).catch((err) => {
			return reject(err);
		});
	})
}

/**
 * 获取所有表
 * @return {string} sql
 */
var getAllTables = function(){
	var sql = sqlConvert.getSql(client,'tables');
	return rawSql(sql);
}

/**
 * 获取所有库
 * @return {string} [sql]
 */
var getAllDatabase = function(){
	var sql = sqlConvert.getSql(client,'databases');
	return rawSql(sql);
}

/**
 * 获取表列名的描述
 * @param  {[type]} tableName [description]
 * @return {[type]}           [description]
 */
var getDesc = function(tableName){
	var sql = sqlConvert.getSql(client,'desc');
	sql = util.format(sql,tableName);
	return rawSql(sql);
}

/**
 * 连接sqlserver终端
 * @param  {object} options 相关配置
 * @return {promise}         promise
 */
var connectionMssql = function(options){
	defaultOptions = Object.assign(defaultOptions,options);
	var knex = require('knex')({
		client: client,
		connection:defaultOptions
	});
	return testConnection(knex);
}

/**
 * 执行sql
 * @param  {[type]} cmd [description]
 * @return {[type]}     [description]
 */
var rawSql = function(cmd){
	if (cmd.indexOf(';')>=0){
		sqlArray.push(cmd);
		cmd = sqlArray.join(' ');
		sqlArray.length = 0;
		return new Promise(function(resolve,reject){
			knexVal.raw(cmd)
			.then(function(data){
				if (data){
					if(Array.isArray(data)){
						// 解析结果集
						if (data.length > 0){
							var colKeys = [];
							for (var k in data[0]) {
								colKeys.push(k);
							}
							console.log(colKeys.join(' | '));
						}
						var datas = [];
						data.map((item) => {
							datas.length = 0;
							for (k of colKeys) {
								datas.push(item[k]);
							}
							console.log(datas.join('|'));
						})
						return resolve(true);
					}else{
						return resolve(JSON.stringify(data));
					}
				}
				return Promise.resolve();
			})
			.catch(function(err){
				return reject(err);
			})
		});
	}else{
		sqlArray.push(cmd);
		return Promise.resolve();
	}
}

module.exports = {
	connectionMssql:connectionMssql,
	rawSql:rawSql,
	checkoutDatabase: checkoutDatabase,
	getAllTables: getAllTables,
	getDesc: getDesc,
	getAllDatabase: getAllDatabase
}
