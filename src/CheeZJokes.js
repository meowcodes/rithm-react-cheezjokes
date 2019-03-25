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
            jokes: JSON.parse(localStorage.getItem('savedJokes')) || [],
            error: null,
        }
        this.triggerFetchNewJokes = this.triggerFetchNewJokes.bind(this);
    }

    async componentDidMount() {
        if(this.state.jokes.length === 0){
            let jokes = await this.fetchNewJokes(this.props.jokeNum)
            this.setState({
                jokes: jokes,
                loading: false,
            }, this.saveToLocalStorage)
        }else {
            this.setState({
                loading: false,
            })
        }
    }

    async fetchNewJokes(numJokes) {
        localStorage.clear();
        let promises = [];
        // make requests and get promises
        for(let i = 0; i < numJokes; i++){
            try{
                promises.push(axios.get(BASE_URL, CONFIG));
            } catch(err) {
                this.setState({
                    error: "joke unavailable"
                })
            }
        }

        let resps = [];
        let ids = new Set();
        //resolve promises
        for(let i = 0; i < promises.length; i++){
            let res = await promises[i];
            while(ids.has(res.data.id)){
                res = await axios.get(BASE_URL, CONFIG);
                console.log('duplicate!')
            }
            ids.add(res.data.id);
            const joke = {
                joke: res.data.joke,
                id: uuid(),
                vote: 0,
            }
            resps.push(joke);
        }

        return resps;
    }
    
    async triggerFetchNewJokes() {
        let newJokes = await this.fetchNewJokes(this.props.jokeNum)
        this.setState({
            jokes: newJokes,
        }, this.saveToLocalStorage)
    }

    voteUp(id) {
        const newJokes = this.state.jokes.map((joke) =>(
            joke.id === id? {...joke, vote: joke.vote + 1}: {...joke}
        ));
        console.log('before sort', newJokes)
        newJokes.sort(this.sortJokesByVote);
        console.log('after sort', newJokes)
        this.setState({jokes: newJokes});
    }

    voteDown(id) {
        const newJokes = this.state.jokes.map((joke) =>(
            joke.id === id? {...joke, vote: joke.vote - 1}: {...joke}
        ));

        newJokes.sort(this.sortJokesByVote);

        this.setState({jokes: newJokes});
    }

    sortJokesByVote(curr, next){
        return next.vote - curr.vote;
    }

    componentDidUpdate() {
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.setItem('savedJokes', JSON.stringify(this.state.jokes));
    }

    renderJokes() {
        return (this.state.jokes.map((jokeObj) =>
            <Joke key={jokeObj.id} joke={jokeObj} triggerUp={() => this.voteUp(jokeObj.id)} triggerDown={() => this.voteDown(jokeObj.id)}/>
            )
        )
    }


    render() {
        let jokes = this.renderJokes()
        return (
            <div className="App">
                <h1>CheeZJokes</h1>
                <button onClick={ this.triggerFetchNewJokes }>Get New Jokes</button>
                { this.state.loading && <p>loading jokes...</p>}
                { jokes }
            </div>
        );
    }
}

export default CheeZJokes;
