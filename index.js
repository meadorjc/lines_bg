
var util = require('util');

var path = require('path');
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const morgan = require('morgan');

const mongoose = require('mongoose');
const db = mongoose.connection;

const Bear = require('./app/models/bear');

const htmlPath = path.join(__dirname, 'html');
const port = process.env.PORT || 8080;

const spacing = 50;
const gridWidth = 1000;
const gridHeight = 1000;
const clear = { color: { r: 0, g: 0, b: 0, a: 0 } };
lines_aa = {};


app.use(morgan('dev'));
app.use(express.static(htmlPath));

//database
mongoose.connect('mongodb://localhost/lines');

//handle connection event
db.on('error', console.error.bind(console, 'connection error:'));

//create router
//const router = express.Router();
//
//router.use(function(req, res, next) {
//	console.log('request: ' );
//	res.header("Access-Control-Allow-Origin", "*");
//	res.header("Access-Control-Allow-Headers", "X-Requested-With");
//	next();
//});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', function(socket){
	const bear = new Bear({ 
		name: "test",
		color: { r: (Math.random() * 254),
			g: (Math.random() * 254), 
			b: (Math.random() * 254),
			a: 255 
		},
		s_id : socket.id
			
	
	});
	const initLoad = {
		s_id : socket.id,
		m_id : bear._id,
		color : bear.color,
		width : gridWidth,
		height : gridHeight,
		spacing : spacing
		
	};
	//console.log(initLoad);	
	socket.emit('initialize', initLoad);
	
	//console.log( "here!" +  bear.name );

	bear.save(function(err, bear) {
		if (err) res.send("error: " +err);
		console.log('save.');
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	
	//when a line gets placed
	socket.on('placeline', function(line){
		console.log(Math.round(new Date().getTime()/1000));
		console.log(line);
		lineString = [line.x1, line.y1, line.x2, line.y2].join(",")
		//find the user
		Bear.findById(line.m_id, 'color', { lean: true }, function(err, doc) { 

			//validate the nodes and associate the color to the line
			if (validateNode(line.x1, line.y1)
			&& validateNode(line.x2, line.y2)
			&& validateLine(line.x1, line.y1, line.x2, line.y2)
			){
			//	console.log(doc);
			//	console.log(!lines_aa[lineString]);
			//	console.log(lines_aa[lineString] == clear.color);
				
				//TODO: append lines to user's db document
			//	if (!lines_aa[lineString] || lines_aa[lineString] == clear.color) lines_aa[lineString] = doc.color;
			//	else lines_aa[lineString] = clear.color;
				
				lines_aa[lineString] = doc.color;
			}	
		});
		//console.log('line: ' + JSON.stringify(line));

	});
	
	//when client is ready, start timer and begin sending existing lines
	socket.on('clientReady', function() {
		console.log('client ready');
		var timer = setInterval(function(){
			socket.emit('lines_aa', lines_aa);
		}, 100);		

	});
});

http.listen(port, function(){
	console.log('listening on *:8080');
});

function validateNode(x,y) {
	return ( x >= spacing 
		&& x <= gridWidth - spacing 
		&& y >= spacing 
		&& y <= gridHeight - spacing
		&& x % spacing == 0
		&& y % spacing == 0
	)
}
function validateLine(x1, y1, x2, y2){
	return (Math.abs(x1-x2) <= spacing && Math.abs(y1-y2) <= spacing)
}



function Grid(g_width, g_height, spacing, size){
	this.width = g_width;
	this.height = g_height;
	this.spacing = spacing;
	this.size = size;
	for(i = this.spacing; i < this.width; i+=this.spacing){
		heightNodes.append(i);
	}
	for(j = this.spacing; j < this.height; j+=this.spacing){
		widthNodes.append(j)
	}
	this.show = function() {
		fill(0);
		var count = 0;
		for(i = this.spacing; i < this.width; i+=this.spacing){
			nodes[i/this.spacing-1] = [];
			for(j = this.spacing; j < this.height; j+=this.spacing){
				fill(0);
				stroke(0);
				strokeWeight(1);
				nodes_aa[i+","+j] = (i/this.spacing-1)+","+(j/this.spacing-1);
				 
				nodes[i/this.spacing-1][j/this.spacing-1] = new Node(i, j, this.size);
				nodes[i/this.spacing-1][j/this.spacing-1].show();
				
			}
		}
	}
}