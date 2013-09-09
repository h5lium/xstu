
var Client = require('../lib/Client.class');


var _ = require('underscore');
var fs = require('fs');


testMain();

function testMain() {
	var client = new Client('jwc.wyu.cn', '/student', 'gbk');
	// 进入登录页面
	client.get('/', {}, {}, function(err, res, body) {
		// 提交登录信息
		client.get('/rndnum.asp', {}, {}, function() {
			client.get('/createsession_a.asp', {}, {}, function() {
				client.get('/createsession_b.asp', {}, {}, function() {
					client.get('/rspsw.asp', {}, {}, function(err, res, body) {
						client.get('/rndnum.asp', {}, {}, function() {
							client.cookie['LogonNumber'] = '';
							client.post('/getpsw_1.asp', {
								sid: process.argv[2],
								name: process.argv[3],
								idcard: process.argv[4]
							}, {}, function(err, res, body) {
								if (res.statusCode !== 200) {
									console.log('认证信息错误'); return;
								}
								if (data.secpwd === '') {
									console.log('密码不能为空'); return;
								}
								if (data.secpwd.length > 28) {
									console.log('密码太长'); return;
								}
								if (data.secpwd2 !== data.secpwd) {
									console.log('两次密码不一致'); return;
								}
								client.post('/savepsw_1.asp', {
									secpwd: process.argv[5],
									secpwd2: process.argv[5]
								}, {}, function() {
									console.log('重置密码成功');
								});
							});
						});
					});
				});
			});
		});
	});
}


function parseScores(html) {
	html = html.replace(/\r?\n/g, '')
	var bodyHtml = html.match(/<body.+<\/body>/)[0],
		$body = $(bodyHtml),
		$tables = $body.find('table').slice(0, -1),
		$trs;
	
	// 第二课堂
	var $d2kt = $tables.eq(-1);
	var d2kt = {
		title: $d2kt.prev().text(),
		fields: [], records: []
	}
	$trs = $d2kt.find('tr');
	d2kt.fields = $trs.eq(0).find('td').map(mapRow);
	$trs.slice(1, -1).each(function(i, el) {
		d2kt.records.push($(el).find('td').map(mapRow));
	});
	// 学期课程
	var xqkc = [];
	$tables.slice(0, -1).each(function(i, el) {
		var xq = {
			title: $(el).prev().text(),
			fields: [], records: []
		}
		$trs = $(el).find('tr');
			xq.fields = $trs.eq(0).find('td').map(mapRow);
		$trs.slice(1).each(function(i, el) {
			xq.records.push($(el).find('td').map(mapRow));
		});
		
		xqkc.push(xq);
	});
	
	return {
		xqkc: xqkc,
		d2kt: d2kt
	};
	function mapRow(i, el) {
		return $(el).text().replace(/(^ +)|( +$)/g, '');
	}
}
function parseProfile(html) {
	html = html.replace(/\r?\n/g, '');
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
	html = html.replace(/\r?\n/g, '')
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