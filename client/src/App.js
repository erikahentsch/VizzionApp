import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import Map from './components/Map.js'

function App() {

  const [data, setData] = useState(null)
  const [loading, toggleLoading] = useState(true)
  const [searchArea, setSearchArea] = useState([])

  useEffect(()=>[
    fetch('/api')
      .then(res=>res.json())
      .then(json=>{
        console.log(json)
        setData(json.cameraData);
        setSearchArea(json.searchArea);
        toggleLoading(false);
      })
  ],[])

  const getData = () => {
    
  }

  return (
    <div className="App">
        <Map 
          cameras={data}
          searchArea={searchArea}
          loading={loading}
        />
    </div>
  );
}

export default App;
