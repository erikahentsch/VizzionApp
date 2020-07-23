const express = require('express')
const path = require('path')
const fetch = require('node-fetch')
const request = require('request')
const parser = require('xml2js')
require('dotenv').config();

const PORT = process.env.HTTP_PORT || 4001;
const app = express();

app.use(express.static(path.join(__dirname, 'client', 'build')))

app.use('static', express.static(path.join(__dirname, 'public')))

app.get('/', (req,res)=>{
    res.send('flowers smell nice');
});


app.get('/api', getPoints, getData, (req, res)=> {
    console.log("api")
})

app.get('/api/:pts', getPoints, getData, (req, res) => {
    console.log("api w/ points")
});

function getPoints(req,res,next) {
    console.log("getting points", req.params.pts);
    if (!req.params.pts) {
        // console.log('no points')
        let defaultPts =  process.env.default.split(',');
        req.params.pts = defaultPts
    } else 
    req.params.pts = req.params.pts.split(',')
    // console.log("getting points", req.params.pts);

    next();
}

function getData(req,res,next) {
    console.log("getting Data", req.params);

    let lat1 = req.params.pts[0]
    let lng1 = req.params.pts[1]
    let lat2  = req.params.pts[2]
    let lng2 = req.params.pts[3]

    const url = `http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetCamerasInBox2?dblMinLongitude=${Math.min(lng1,lng2)}&dblMaxLongitude=${Math.max(lng1, lng2)}&dblMinLatitude=${Math.min(lat1, lat2)}&dblMaxLatitude=${Math.max(lat1,lat2)}&strRoadNames=&intOptions=0`
    fetch(`${url}&strPassword=${process.env.API_KEY}`)
      .then(response=>{
          if(response.ok) {
            return response.text()
          } else 
            throw new Error("Error fetching data")
        })
      .then(body=>{
        parser.parseString(body, (err, result)=>{
            console.log(err)
            console.log("data",result.DataSet['diffgr:diffgram'][0].DataSetCameras)
            if (result.DataSet['diffgr:diffgram'][0].DataSetCameras) {
                let parsedData = result.DataSet['diffgr:diffgram'][0].DataSetCameras[0].Cameras;

                let cameraData = []
                parsedData.map(camera=>{
                    let tempObject = {}
                    tempObject['id'] = camera.CameraID[0];
                    tempObject['name'] = camera.Name[0];
                    tempObject['lat'] = camera.Latitude[0];
                    tempObject['long'] = camera.Longitude[0];
                    if (camera.Hotspot) {
                        tempObject['hotspot'] = true;
                    } else {
                        tempObject['hotspot'] = false;
                    }
                    cameraData.push(tempObject)
                });
                let dataObject = {
                    "searchArea": [[lat1,lng1], [lat2,lng2]],
                    "cameraData": cameraData 
                }
                res.send(dataObject);
            } else {
                res.status(404);
                res.send("No Cameras Available")
            }

            
        })
        
      })
      .catch(err =>{ 
          console.log("error", err);
          res.send(err.text)
        
        })
}

async function getCountryData(req,res,next) {

    console.log("Get Country Data")
    var dataSet = []
    
    let url = `http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetRegions?strPassword=${process.env.API_KEY}`


    await fetch(`${url}`)
    .then(response=>{
        if(response.ok) {
          return response.text()
        } else 
          throw new Error("Error fetching data")
      })
    .then(body=>{
      parser.parseString(body, (err, result)=>{
          if (result.DataSet['diffgr:diffgram'][0].DataSetCameras) {
              let parsedData = result.DataSet['diffgr:diffgram'][0].DataSetCameras[0].Countries;
              parsedData.map(region=>{
                  let tempObject = {}
                  tempObject['CountryId'] = region.CountryID[0]
                  tempObject['name'] = region.Name[0];
                  tempObject['states'] = []

                  dataSet.push(tempObject)
              });

          }           
      });

    });
    req.params.countries = dataSet

    next();
}

async function getStateData(req,res,next) {

    console.log("Get State Data")
    var dataSet = []
    
    let url = `http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetRegions?strPassword=${process.env.API_KEY}`


    await fetch(`${url}`)
    .then(response=>{
        if(response.ok) {
          return response.text()
        } else 
          throw new Error("Error fetching data")
      })
    .then(body=>{
      parser.parseString(body, (err, result)=>{
          if (result.DataSet['diffgr:diffgram'][0].DataSetCameras) {
              let parsedData = result.DataSet['diffgr:diffgram'][0].DataSetCameras[0].States;
              parsedData.map(state=>{
                  let tempObject = {}
                  tempObject['StateID'] = state.StateID[0]
                  tempObject['name'] = state.Name[0];
                  tempObject['CountryID'] = state.CountryID[0]
                  tempObject['regions'] = []
                  req.params.countries.find(i=>i.CountryId === state.CountryID[0]).states.push(tempObject)
                  dataSet.push(tempObject)
              });
          }           
      });

    });

    req.params.states = dataSet

    next();
}

async function getRegionData(req,res,next) {

    console.log("Get Region Data")
    var dataSet = []
    
    let url = `http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetRegions?strPassword=${process.env.API_KEY}`


    await fetch(`${url}`)
    .then(response=>{
        if(response.ok) {
          return response.text()
        } else 
          throw new Error("Error fetching data")
      })
    .then(body=>{
      parser.parseString(body, (err, result)=>{
          if (result.DataSet['diffgr:diffgram'][0].DataSetCameras) {
            let parsedData = result.DataSet['diffgr:diffgram'][0].DataSetCameras[0].Regions;
              parsedData.map(region=>{

                let findCountryID = req.params.states.find(state => state.StateID === region.StateID[0]).CountryID
                
                let findCountry = req.params.countries.find(country=> country.CountryId === findCountryID);

                let lat1 = parseFloat(region.MapTopLatitude[0])
                let lat2 = parseFloat(region.MapBottomLatitude[0])
                let lng1 = parseFloat(region.MapLeftLongitude[0])
                let lng2 = parseFloat(region.MapRightLongitude[0])

                let tempObject = {}
                  tempObject['RegionId'] = region.RegionID[0]
                  tempObject['name'] = region.Name[0];
                  tempObject['pt1'] = [lat1, lng1]
                  tempObject['pt2'] = [lat2, lng2]
                  tempObject['center'] = [((lat1 + lat2)/2).toFixed(3), ((lng1 + lng2)/2).toFixed(3)]

                  let findState = findCountry.states.find(state=>state.StateID === region.StateID[0])
                  findState.regions.push(tempObject)
                  
              });
          }           
      });

    });

    next();
}

app.get('/countries', getCountryData, (req,res)=>{
    res.send(req.params)
})

app.get('/regions', getCountryData, getStateData, getRegionData, (req,res)=> {

    console.log("return region data")
    res.send(req.params)
})


app.get("/image/:id", (req, res)=> {
    let imgUrl = `http://www.vizzion.com/TrafficCamsService/TrafficCams.ashx?strRequest=GetCameraImage7&intCameraID=${req.params.id}&intDesiredWidth=720&intDesiredHeight=480&intDesiredDepth=8&intOptions=0&strPassword=${process.env.API_KEY}`
    request.get(imgUrl).pipe(res)
    
})

app.get('/apikey', (req, res)=> {
    res.send(process.env.API_KEY)
})

app.get('/NoImage', (req,res)=> {
    res.redirect('http://vizzion.com/img/operator_intervention_a.jpg')
})

app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}.`)
})