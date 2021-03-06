﻿
var Client = require('../lib/Client.class');
var domino = require('domino'),
	Zepto = require('zepto-node'),
	$ = Zepto(domino.createWindow());


var fs = require('fs');


testMain();

function testMain() {
	var client = new Client('jwc.wyu.cn', '/xks', 'gbk');
	// 进入登录页面
	client.get('/', {}, {}, function(err, res, body) {
		// 提交登录信息
		client.cookie['LogonNumber'] = '';
		client.post('/ec_logon.asp', {
			'sid': process.argv[2],
			'pwd': process.argv[3]
		}, {}, function(err, res, body) {
			//var success = /welcome/.test(body);
			//console.log(success ? '登录成功' : '登录失败');
			
			console.log(res.headers)
			console.log(body)
		});
	});
}


function parseScores(html) {
	return html;
}
function parseProfile(html) {
	html = html.replace(/\r\n/g, '');
	var tableHtml = html.match(/<table.+<\/table>/)[0],
		$table = $(tableHtml),
		$trs = $table.find('tr');

	return {
		code: $trs.eq(0).find('td').eq(1).text(),
		name: $trs.eq(0).find('td').eq(3).text(),
		avatar: $trs.eq(0).find('td').eq(6).find('img').attr('src'),
		politics: $trs.eq(2).find('td').eq(3).text(),
		sex: $trs.eq(1).find('td').eq(1).text(),
		birth: $trs.eq(1).find('td').eq(3).text(),
		nation: $trs.eq(1).find('td').eq(5).text(),
		major: $trs.eq(3).find('td').eq(1).text(),
		class: $trs.eq(3).find('td').eq(3).text(),
		college: $trs.eq(4).find('td').eq(1).text(),
		entrance: $trs.eq(5).find('td').eq(3).text(),
		dormitory: $trs.eq(8).find('td').eq(5).text()
	}
}
function parseCourses(html) {
	html = html.replace(/\r\n/g, '')
		.replace(/&nbsp;/g, ' ');
	var tableHtml = html.match(/<TABLE cellSpacing=0 borderColorDark=#eeeeee cellPadding=2 width="99%".+<\/TABLE>/)[0],
		$table = $(tableHtml),
		$trs = $table.find('tr');

	var courses = [];
	var periods = 5,
		days = $trs.eq(0).find('td').length - 1;
	for (var i=0, j, $tds; i<periods; i++) {
		courses[i] = [];
		$tds = $trs.eq(i + 1).find('td');
		for (j=0; j<days; j++) {
			courses[i][j] = $tds.eq(j + 1).html()
				.replace(/<br>/g, '\n')
				.replace(/&nbsp;/g, ' ');
		}
	}
	return courses;
}