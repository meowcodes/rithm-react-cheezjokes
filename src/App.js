import React, { Component } from 'react';
import CheeZJokes from './CheeZJokes'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <CheeZJokes jokeNum={10} />
      </div>
    );
  }
}

export default App;
