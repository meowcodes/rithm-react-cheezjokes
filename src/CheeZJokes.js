import React, { Component } from 'react';
import axios from 'axios';
import uuid from 'uuid/v4';
import Joke from './Joke';
// import './CheeZJokes.css';

const BASE_URL = "https://icanhazdadjoke.com/";
const CONFIG = {
    headers: {
        Accept: "application/json"
    }
}

class CheeZJokes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            jokes: [],
            error: null,
        }
    }

    async componentDidMount() {
        let promises = [];
        // make requests and get promises
        for(let i = 0; i < this.props.jokeNum; i++){
            try{
                promises.push(axios.get(BASE_URL, CONFIG));
            } catch(err) {
                this.setState({
                    error: "joke unavailable"
                })
            }
        }
        console.log(promises);

        let resps = [];
        //resolve promises
        for(let i = 0; i < promises.length; i++){
            const res = await promises[i]
            const joke = {
                joke: res.data.joke,
                id: uuid(),
            }
            resps.push(joke);
        }

        // update jokes state
        this.setState({
            jokes: resps,
            loading: false,
        })
    }

    renderJokes() {
        return (this.state.jokes.map((jokeObj) => 
            <Joke key={jokeObj.id} joke={jokeObj.joke} />
            )
        )
    }

    render() {
        let jokes = this.renderJokes()
        return (
            <div className="App">
                <h1>CheeZJokes</h1>
                { this.state.loading && <p>loading jokes</p>}
                { jokes }
            </div>
        );
    }
}

export default CheeZJokes;
