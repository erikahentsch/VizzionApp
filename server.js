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


    // console.log(lat1,lng1,lat2,lng2)

    // console.log(process.env.API_KEY)
    const url = `http://www.vizzion.com/TrafficCamsService/TrafficCams.asmx/GetCamerasInBox2?dblMinLongitude=${Math.min(lng1,lng2)}&dblMaxLongitude=${Math.max(lng1, lng2)}&dblMinLatitude=${Math.min(lat1, lat2)}&dblMaxLatitude=${Math.max(lat1,lat2)}&strRoadNames=&intOptions=0`
    // console.log(url)
    fetch(`${url}&strPassword=ZUY%5b%5bBB%5cB3%5bWSVBBIJIQZHU%26IFEO`)
      .then(response=>response.text())
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
                res.send("no data")
            }

            
        })
      })
}


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

app.get('/flower', (req,res)=>{
    res.json({
        name: 'Dandelion',
        colour: 'Blue-ish'
    })
})

app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}.`)
})