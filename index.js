var express = require('express');
var app = express();

var cheerio = require('cheerio');
var request = require('request');

app.listen(8080);
console.log('Running');

app.get('/',function(req,res){
	var url = 'http://www.imdb.com/title/tt1229340/';  //example
	request(url,function(error,response,html){
		if(!error){
			var $ = cheerio.load(html);
			test = String(html);
			var title, ratings, released;
			var json = {title:'',ratings:'',released:''};
			$('.title_wrapper').filter(function(){
				var data = $(this);
				json.title = data.children().first().text().trim();
				json.released = data.children().last().children().last().text().trim();
			});
			$('.ratingValue').filter(function(){
        		var data = $(this);
       		json.ratings = data.text().trim();
      	});
			res.send(json);
		};
	});
});