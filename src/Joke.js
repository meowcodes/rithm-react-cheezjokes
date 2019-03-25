import React, { Component } from 'react';
// import './Joke.css';

class Joke extends Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props.joke.vote !== nextProps.joke.vote
  }

  render() {
    return (
      <div className="Joke">
        <p>{ this.props.joke.joke }</p>
        <button onClick={this.props.triggerUp}><i className="far fa-thumbs-up"></i></button>
        <button onClick={this.props.triggerDown}><i className="far fa-thumbs-down"></i></button>
        <p>{this.props.joke.vote}</p>
      </div>
    );
  }
}

export default Joke;
