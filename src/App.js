import React from 'react';
import logo from './logo.svg';
import './App.css';

// Components
import SpotifyPlayer from "./TrackCard";

function App() {
  return (
    <div className="App">
        <SpotifyPlayer />
    </div>
  );
}

export default App;
