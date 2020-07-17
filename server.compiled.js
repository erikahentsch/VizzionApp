"use strict";

var express = require('express');

var path = require('path');

var fetch = require('node-fetch');

var request = require('request');

var parser = require('xml2js');

require('dotenv').config();

var PORT = process.env.HTTP_PORT || 4001;
var app = express();
app.use(express["static"](path.join(__dirname, 'client', 'build')));
app.use('static', express["static"](path.join(__dirname, 'public')));
app.get('/', function (req, res) {
  res.send('flowers smell nice');
});
app.get('/api', getPoints, getData, function (req, res) {
  console.log("api");
});
app.get('/api/:pts', getPoints, getData, function (req, res) {
  console.log("api w/ points");
});

function getPoints(req, res, next) {
  console.log("getting points", req.params.pts);

  if (!req.params.pts) {
    // console.log('no points')
    var defaultPts = process.env["default"].split(',');
    req.params.pts = defaultPts;
  } else req.params.pts = req.params.pts.split(','); // console.log("getting points", req.params.pts);


  next();
}

function getData(req, res, next) {
  console.log("getting Data", req.params);
  var lat1 = req.params.pts[0];
  var lng1 = req.params.pts[1];
  var lat2 = req.params.pts[2];
  var lng2 = req.params.pts[3]; // console.log(lat1,lng1,lat2,lng2)
  // console.log(process.env.API_KEY)

  var url = "http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetCamerasInBox2?dblMinLongitude=".concat(Math.min(lng1, lng2), "&dblMaxLongitude=").concat(Math.max(lng1, lng2), "&dblMinLatitude=").concat(Math.min(lat1, lat2), "&dblMaxLatitude=").concat(Math.max(lat1, lat2), "&strRoadNames=&intOptions=0"); // console.log(url)

  fetch("".concat(url, "&strPassword=ZUY%5b%5bBB%5cB3%5bWSVBBIJIQZHU%26IFEO")).then(function (response) {
    return response.text();
  }).then(function (body) {
    parser.parseString(body, function (err, result) {
      console.log(err);
      console.log("data", result.DataSet['diffgr:diffgram'][0].DataSetCameras);

      if (result.DataSet['diffgr:diffgram'][0].DataSetCameras) {
        var parsedData = result.DataSet['diffgr:diffgram'][0].DataSetCameras[0].Cameras;
        var cameraData = [];
        parsedData.map(function (camera) {
          var tempObject = {};
          tempObject['id'] = camera.CameraID[0];
          tempObject['name'] = camera.Name[0];
          tempObject['lat'] = camera.Latitude[0];
          tempObject['long'] = camera.Longitude[0];

          if (camera.Hotspot) {
            tempObject['hotspot'] = true;
          } else {
            tempObject['hotspot'] = false;
          }

          cameraData.push(tempObject);
        });
        var dataObject = {
          "searchArea": [[lat1, lng1], [lat2, lng2]],
          "cameraData": cameraData
        };
        res.send(dataObject);
      } else {
        res.status(404);
        res.send("no data");
      }
    });
  });
}

app.get("/image/:id", function (req, res) {
  var imgUrl = "http://www.vizzion.com/TrafficCamsService/TrafficCams.ashx?strRequest=GetCameraImage7&intCameraID=".concat(req.params.id, "&intDesiredWidth=720&intDesiredHeight=480&intDesiredDepth=8&intOptions=0&strPassword=").concat(process.env.API_KEY);
  request.get(imgUrl).pipe(res);
});
app.get('/apikey', function (req, res) {
  res.send(process.env.API_KEY);
});
app.get('/NoImage', function (req, res) {
  res.redirect('http://vizzion.com/img/operator_intervention_a.jpg');
});
app.get('/flower', function (req, res) {
  res.json({
    name: 'Dandelion',
    colour: 'Blue-ish'
  });
});
app.listen(PORT, function () {
  console.log("Server listening at port ".concat(PORT, "."));
});
