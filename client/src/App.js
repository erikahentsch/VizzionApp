import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import Map from './components/Map.js'

function App() {

  const [data, setData] = useState(null)
  const [loading, toggleLoading] = useState(true)

  useEffect(()=>[
    fetch('/api')
      .then(res=>res.json())
      .then(json=>{
        setData(json);
        toggleLoading(false)
      })
  ],[])

  const getData = () => {
    
  }
  const position = [51.505, -0.09]


  return (
    <div className="App">
      {loading ? "Loading..." :
        <Map />
      }
    </div>
  );
}

export default App;
