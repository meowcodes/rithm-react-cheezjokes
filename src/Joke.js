import React, { Component } from 'react';
// import './Joke.css';

class Joke extends Component {
  render() {
    return (
      <div className="Joke">
        <p>{ this.props.joke.joke }</p>
        <button onClick={this.props.triggerUp}>^</button>
        <button onClick={this.props.triggerDown}>v</button>
        <p>{this.props.joke.vote}</p>
      </div>
    );
  }
}

export default Joke;
