import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import Map from './components/Map.js'

function App() {

  const [data, setData] = useState(null)
  const [loading, toggleLoading] = useState(true)
  const [searchArea, setSearchArea] = useState([])
  const [error, toggleError] = useState(false)
  
  useEffect(()=>[
    fetch('/api')
      .then(res=>{  
        if (res.ok){
          return res.json()
        } else throw new Error()
      })
      .then(json=>{
        console.log(json)
        setData(json.cameraData);
        setSearchArea(json.searchArea);
        toggleLoading(false);
      })
      .catch(e=>{
        toggleError(true)
        toggleLoading(false)
      })
  ],[])

  const getData = (pt1, pt2) => {
    console.log("get Data")
    setData(null)

    console.log(`/api/${pt1},${pt2}`)

    fetch(`/api/${pt1},${pt2}`)
      .then(res=>{  
        if (res.ok){
          return res.json()
        } else throw new Error()
      })
      .then(json=>{
        console.log(json)
        setData(json.cameraData);
        setSearchArea(json.searchArea);
        toggleLoading(false);
      })
      .catch(e=>{
        toggleError(true)
        toggleLoading(false)
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
        />
    </div>
  );
}

export default App;
