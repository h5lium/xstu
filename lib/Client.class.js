
var http = require('http'),
	querystring = require('querystring');
var _ = require('underscore'),
	BufferHelper = require('bufferhelper'),
	iconv = require('iconv-lite');

var stdCharset = 'utf8';

function Client(host, path, charset) {
	this.host = host;
	this.path = path;
	this.charset = charset || stdCharset;
	this.cookie = {};
}
module.exports = Client;

Client.prototype.get = function(path, data, headers, callback) {
	return this.request(path, data, headers, callback, 'GET');
}
Client.prototype.post = function(path, data, headers, callback) {
	return this.request(path, data, headers, callback, 'POST');
}
Client.prototype.request = function(path, data, headers, callback, method) {
	var client = this;
	if (! _.isString(data)) {
		data = querystring.stringify(data || {});
	}
	
	var req = http.request({
	   host: client.host,
	   path: client.path + path,
	   method: method.toUpperCase(),
	   headers: _.extend({}, {
		  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		  'Accept-Encoding': 'gzip,deflate,sdch',
		  'Accept-Language': 'zh-CN,zh;q=0.8',
		  'Cache-Control': 'max-age=0',
		  'Connection': 'keep-alive',
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'Content-Length': data.length,
		  'Cookie': (function() {
			 var str = '';
			 _.each(client.cookie, function(val, key) {
				str += key + '=' + val + '; ';
			 });
			 return str;
		  })(),
		  'Host': client.host,
		  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.11 Safari/537.36'
	   }, headers)
	}, function(res) {
	   var bufhelper = new BufferHelper();
	   res.on('data', function(chunk) {
		  bufhelper.concat(chunk);
	   }).on('end', function() {
		  var buf = bufhelper.toBuffer();
		  if (client.charset !== stdCharset) {
			 buf = iconv.encode(
				iconv.decode(buf, client.charset),
			 stdCharset);
		  }
		  body = buf.toString();

		  var setCookie = res.headers['set-cookie'], cookie = {}, seg, arr;
		  if (setCookie) {
			 _.each(setCookie, function(row) {
				seg = row.split(/\s*;\s*/)[0];
				arr = seg.split(/\s*=\s*/);
				cookie[arr[0]] = arr[1];
			 });
			 _.extend(client.cookie, cookie);
		  }
			callback && callback.apply(client, [null, res, body]);
	   });
	}).on('error', function(err) {
		callback && callback.apply(client, [err]);
	});
	
	data && req.write(data);
	req.end();
	return this;
}