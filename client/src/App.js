import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import Map from './components/Map.js'
import Menu from './components/Menu.js'

function App() {

  const [data, setData] = useState(null)
  const [loading, toggleLoading] = useState(true)
  const [searchArea, setSearchArea] = useState([])
  const [error, toggleError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [regionData, setRegionData] = useState(null)
  
  useEffect(()=> {
    console.log('useEffect');
    getData();
    getRegions();
    // fetch('/api')
    //   .then(res=>{  
    //     console.log(res)
    //     if (res.ok){
    //       return res.json()
    //     }
    //   })
    //   .then(json=>{
    //     console.log(json)
    //     setData(json.cameraData);
    //     setSearchArea(json.searchArea);
    //     toggleLoading(false);
    //   })
    //   .catch(e=>{
    //     console.log
    //     toggleError(true)
    //     toggleLoading(false)
    //     setErrorMessage("Error fetching data")
    //   })
  },[])

  const getRegions = () => {
    console.log("get regions")
    fetch('/regions')
      .then(res=>{
        if (res.ok) {
          return res.json()
        }
      })
      .then(json=>{
        setRegionData(json)
      })
  }

  const getData = (pt1='', pt2='') => {
    console.log("get Data", pt1)
    setData(null)
    setErrorMessage(null)

    var url = '/api'
    if (pt1 != '') {
      url = `/api/${pt1},${pt2}`
    }
    console.log(`/api/${pt1},${pt2}`)

    fetch(url)
      .then(res=>{  
        console.log(res)
        if (res.ok){
          return res.json()
        } else 
        throw Error(`${res.statusText}`)
      })
      .then(json=>{
        console.log(json)
        setData(json.cameraData);
        setSearchArea(json.searchArea);
        toggleLoading(false);
      })
      .catch(e=>{
        console.log(e.message)
        toggleError(true)
        toggleLoading(false)
        if (e.message === "Not Found") {
          console.log("this error")
          setErrorMessage("No Cameras Available")
        } else { 
          setErrorMessage("Error fetching data")
        }
      })
  }
  
  const updateRectangle = (rect) => {
    console.log("App", rect)
    toggleLoading(true)
    toggleError(null)
    setSearchArea(rect)
    setData(null)
    getData(rect[0], rect[1])
  }


  const handleReset = () => {
    toggleError(null)
  }

  return (
    <div className="App">
        <Map 
          handleReset={handleReset}
          handleNewRectangle={updateRectangle}
          cameras={data}
          searchArea={searchArea}
          loading={loading}
          error={error}
          errorMessage={errorMessage}
          regionData={regionData}
        />
    </div>
  );
}

export default App;
