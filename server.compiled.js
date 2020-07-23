"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
  var lng2 = req.params.pts[3];
  var url = "http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetCamerasInBox2?dblMinLongitude=".concat(Math.min(lng1, lng2), "&dblMaxLongitude=").concat(Math.max(lng1, lng2), "&dblMinLatitude=").concat(Math.min(lat1, lat2), "&dblMaxLatitude=").concat(Math.max(lat1, lat2), "&strRoadNames=&intOptions=0");
  fetch("".concat(url, "&strPassword=").concat(process.env.API_KEY)).then(function (response) {
    if (response.ok) {
      return response.text();
    } else throw new Error("Error fetching data");
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
        res.send("No Cameras Available");
      }
    });
  })["catch"](function (err) {
    console.log("error", err);
    res.send(err.text);
  });
}

function getCountryData(_x, _x2, _x3) {
  return _getCountryData.apply(this, arguments);
}

function _getCountryData() {
  _getCountryData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var dataSet, url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Get Country Data");
            dataSet = [];
            url = "http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetRegions?strPassword=".concat(process.env.API_KEY);
            _context.next = 5;
            return fetch("".concat(url)).then(function (response) {
              if (response.ok) {
                return response.text();
              } else throw new Error("Error fetching data");
            }).then(function (body) {
              parser.parseString(body, function (err, result) {
                if (result.DataSet['diffgr:diffgram'][0].DataSetCameras) {
                  var parsedData = result.DataSet['diffgr:diffgram'][0].DataSetCameras[0].Countries;
                  parsedData.map(function (region) {
                    var tempObject = {};
                    tempObject['CountryId'] = region.CountryID[0];
                    tempObject['name'] = region.Name[0];
                    tempObject['states'] = [];
                    dataSet.push(tempObject);
                  });
                }
              });
            });

          case 5:
            req.params.countries = dataSet;
            next();

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getCountryData.apply(this, arguments);
}

function getStateData(_x4, _x5, _x6) {
  return _getStateData.apply(this, arguments);
}

function _getStateData() {
  _getStateData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var dataSet, url;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("Get State Data");
            dataSet = [];
            url = "http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetRegions?strPassword=".concat(process.env.API_KEY);
            _context2.next = 5;
            return fetch("".concat(url)).then(function (response) {
              if (response.ok) {
                return response.text();
              } else throw new Error("Error fetching data");
            }).then(function (body) {
              parser.parseString(body, function (err, result) {
                if (result.DataSet['diffgr:diffgram'][0].DataSetCameras) {
                  var parsedData = result.DataSet['diffgr:diffgram'][0].DataSetCameras[0].States;
                  parsedData.map(function (state) {
                    var tempObject = {};
                    tempObject['StateID'] = state.StateID[0];
                    tempObject['name'] = state.Name[0];
                    tempObject['CountryID'] = state.CountryID[0];
                    tempObject['regions'] = [];
                    req.params.countries.find(function (i) {
                      return i.CountryId === state.CountryID[0];
                    }).states.push(tempObject);
                    dataSet.push(tempObject);
                  });
                }
              });
            });

          case 5:
            req.params.states = dataSet;
            next();

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getStateData.apply(this, arguments);
}

function getRegionData(_x7, _x8, _x9) {
  return _getRegionData.apply(this, arguments);
}

function _getRegionData() {
  _getRegionData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var dataSet, url;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("Get Region Data");
            dataSet = [];
            url = "http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetRegions?strPassword=".concat(process.env.API_KEY);
            _context3.next = 5;
            return fetch("".concat(url)).then(function (response) {
              if (response.ok) {
                return response.text();
              } else throw new Error("Error fetching data");
            }).then(function (body) {
              parser.parseString(body, function (err, result) {
                if (result.DataSet['diffgr:diffgram'][0].DataSetCameras) {
                  var parsedData = result.DataSet['diffgr:diffgram'][0].DataSetCameras[0].Regions;
                  parsedData.map(function (region) {
                    var findCountryID = req.params.states.find(function (state) {
                      return state.StateID === region.StateID[0];
                    }).CountryID;
                    var findCountry = req.params.countries.find(function (country) {
                      return country.CountryId === findCountryID;
                    });
                    var lat1 = parseFloat(region.MapTopLatitude[0]);
                    var lat2 = parseFloat(region.MapBottomLatitude[0]);
                    var lng1 = parseFloat(region.MapLeftLongitude[0]);
                    var lng2 = parseFloat(region.MapRightLongitude[0]);
                    var tempObject = {};
                    tempObject['RegionId'] = region.RegionID[0];
                    tempObject['name'] = region.Name[0];
                    tempObject['pt1'] = [lat1, lng1];
                    tempObject['pt2'] = [lat2, lng2];
                    tempObject['center'] = [((lat1 + lat2) / 2).toFixed(3), ((lng1 + lng2) / 2).toFixed(3)];
                    var findState = findCountry.states.find(function (state) {
                      return state.StateID === region.StateID[0];
                    });
                    findState.regions.push(tempObject);
                  });
                }
              });
            });

          case 5:
            next();

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getRegionData.apply(this, arguments);
}

app.get('/countries', getCountryData, function (req, res) {
  res.send(req.params);
});
app.get('/regions', getCountryData, getStateData, getRegionData, function (req, res) {
  console.log("return region data");
  res.send(req.params);
});
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
app.listen(PORT, function () {
  console.log("Server listening at port ".concat(PORT, "."));
});
