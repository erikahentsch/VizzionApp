import React, {useState, useEffect} from 'react';
import { 
    Rectangle,
    Map, 
    Marker, 
    TileLayer, 
    Popup, 
    Tooltip,
    CircleMarker,
    MapLayer
} from 'react-leaflet';
import clsx from 'clsx';
import L from 'leaflet'

import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import {
    Drawer,
    Switch,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    FormControl,
    FormGroup,
    Button,
} from '@material-ui/core'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        padding: '10px'
    },
    drawerBody: {
        padding: '0px 10px'
    },
    buttonGroup: {
        padding: '20px 0px', 
        display: 'flex', 
        alignContent: 'space-between',
        '& button' :{
            flexGrow: 1
        }
    },
    drawerToggle: {
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      right: 0,
      top: 5,
      radius: '5px',
      backgroundColor: 'white',
      zIndex: 10,
      boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2)'
    },
    content: {
      flexGrow: 1,
      position: 'relative',
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    },
    tooltip: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        '& img': {
            height: 'auto',
            maxWidth: '300px'
        }
    }
  }));
  
const polygon = [
    [43.6465, -79.389],
    [43.655, -79.377]
  ]


const prefix = process.env.NODE_ENV === 'development' ? '../': "./";


var cameraIcon = L.icon({
    iconUrl: `camera.png`,
    // iconSize: [, 32],
    iconAnchor: [16, 16],
    popupAnchor: [-3, -76],
})

var hotSpotIcon = L.icon({
    iconUrl: `hotspot_camera.png`,
    // iconSize: [50, 50],
    iconAnchor: [16, 16],
    popupAnchor: [-3, -76],
})

var circle = L.circle({
    color: "red",
    fillColor: 'red',
    opacity: 0.75,
    radius: 5000
})


const MapDiv = (props) => {
    const [position, setPosition] = useState({lat: 43.6475, long: -79.3811, zoom: 13})
    const [newRectangle, setNewRectangle] = useState([])
    const [editSwitch, toggleEditSwitch] = useState(true)
    const [open, toggleOpen] = useState(false)
    const [rectangleClicked, toggleRectangleClicked] = useState(false)
    const [popupShow, togglePopupShow] = useState(false)
    const [showImage, toggleShowImage] = useState(false)

    const classes = useStyles();

    const handleSwitch = (e) => {
        toggleEditSwitch(!editSwitch)
    }

    const handleMapClick = (e) => {
        if(editSwitch) {
            let newPt = [e.latlng.lat.toFixed(3), e.latlng.lng.toFixed(3)]
            
            console.log(newPt)

            if (newRectangle.length === 0) {
                setNewRectangle([newPt])
            } else if (newRectangle.length === 1) {
                let initPt = newRectangle[0];
                console.log(initPt, newPt)
                setNewRectangle([initPt, newPt])
            } else if ((newRectangle.length === 2 && !rectangleClicked)) {
                setNewRectangle([newPt])
            } else if (rectangleClicked) {
                toggleRectangleClicked(false)
            }
        }
    }

    const toggleDrawer = () => {
        toggleOpen(!open)
    }

    const handleClear = () => {
        setNewRectangle([])
        props.handleReset()
    }

    const handleUpdate = () => {
        if (newRectangle.length === 2) {
            props.handleNewRectangle(newRectangle);
            setNewRectangle([])
        }

    }

    const handleRectangleClick = (e) => {
        toggleRectangleClicked(true)
        console.log("click rectangle", e)
        
    }

    function downloadContent() {
        try {
            var atag = document.createElement("a");
            var cameraList = ''
            props.cameras.map(camera =>cameraList+=(camera.id + '\n'))
            var file = new Blob([cameraList], {type: 'text/plain'});
            atag.href = URL.createObjectURL(file);
            atag.download = 'cameraList';
            atag.click();
        } catch (e) {
            console.log("Error Exporting Data")
        }
      }

    const getImage = (id) => {
        console.log('getImage')
        fetch(`image/${id}`)
            .then(res=>{
                console.log("res", res)
                if (res.ok) {
                    document.getElementById(`cameraImage`+id).src = `image/592`
                }
            })
    }

    return (
        <div className={classes.root}>
            {/* {props.loading && 
                <div className="spinnerDiv">
                    <div className="spinnerText">Loading Cameras</div>
                    <div className="spinner">
                        <div className="double-bounce1"></div>
                        <div className="double-bounce2"></div>
                    </div>
                </div>
            }
            {props.error && 
                <div className="spinnerDiv">
                    <div className="spinnerText">{props.error}</div>
                </div>
            } */}
        <div
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div onClick={toggleDrawer} className={classes.drawerToggle}>
              <IconButton onClick={toggleDrawer}>
                  {!open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
            <Map  onClick={handleMapClick} height={100}  center={[position.lat, position.long]} zoom={position.zoom}>
                <TileLayer
                style={{cursor: editSwitch && "pointer !important" }}
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* {props.searchArea.length ===2 && <Rectangle color="purple" bounds={props.searchArea} />}
                {newRectangle.length === 1 && <CircleMarker color="red" opacity={1} radius={2} center={newRectangle[0]}></CircleMarker>}
                {newRectangle.length === 2 && 
                <Rectangle onClick={handleRectangleClick} color="red" bounds={newRectangle}>
                    <Popup>
                        <Button onClick={handleUpdate} >Update Search</Button>
                    </Popup>
                </Rectangle>
                }
                {props.cameras && 
                props.cameras.map(camera=>{
                    return (
                        <Marker key={camera.id} position={[camera.lat, camera.long]} icon={camera.hotspot ? hotSpotIcon: cameraIcon}>
                            <Popup >
                                <div className={classes.tooltip}>
                                    <div id="imageDiv">
                                        <img src={`/image/${camera.id}`}/>
                                    </div>
                                    <div><strong>ID: </strong>{camera.id}</div>
                                    <div><strong>Name: </strong>{camera.name}</div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })

                } */}
                
            </Map>
            </div>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                  }}
                >
                <div className={classes.drawerTitle}>Toolbar</div>
                <div className={classes.drawerBody}>
                    <FormControl margin={"normal"}>
                        <FormLabel>Change Search Area</FormLabel>
                        <FormControlLabel
                            label="Toggle Area Edit"
                            control={
                                <Switch
                                checked={editSwitch}
                                onChange={handleSwitch}
                                name="checkedA"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                            }
                        />
                        <FormHelperText>Select two points to create new search rectangle</FormHelperText>    
                        <FormGroup className={classes.buttonGroup} row>
                            <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
                            <Button onClick={handleClear} variant="contained">Clear</Button>

                        </FormGroup>                
                        <FormGroup>
                            <Button variant="contained" color="secondary" onClick={downloadContent}>Export</Button>

                        </FormGroup>
                    </FormControl>
                </div>
            </Drawer>
        </div>
    )
}

export default MapDiv;