var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var app = express();

var asyncTasks = [];
var arr = [];
var result = [];
var i = 51234; //Enter Movie Index
var MAX = 1000; //Enter No of Movies to be Fetched
app.get('/',function(err,res){
	console.log("Recieved GET Request");
	var count = 0;
	while(count < MAX){
		var url = 'http://www.imdb.com/title/tt' + i + '/';
		url = String(url);
		arr.push(url);
		i++;
		count++;
	}
	console.log("Arr is",arr);
	arr.forEach(function(item){
		asyncTasks.push(function(callback){
		      var url = item;
		      request(url, function(err, response, body) {
		        // JSON body
		        if(err) { console.log(err); callback(true); return; }
		        var $ = cheerio.load(body);
		        var title, ratings, released;
		        var json = {
		          title: '',
		          ratings: '',
		          released: ''
		        };
		        $('.title_wrapper').filter(function() {
		          var data = $(this);
		          json.title = data.children().first().text().trim();
		          json.released = data.children().last().children().last().text().trim();
		        });
		        $('.ratingValue').filter(function() {
		          var data = $(this);
		          json.ratings = parseFloat(data.text().trim());
		        });
		        console.log("JSON",json);
		        callback(false, json);
		      });
		    })
		})
	async.parallel(asyncTasks,function(err,results){
		console.log("Done Everything");
    	if(err) { console.log(err); res.send(500,"Server Error"); return; }
    	res.send(results);
	})
})

app.listen(8080);
console.log('Running');