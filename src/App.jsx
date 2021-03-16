import React, { Component } from 'react';
import './App.css';
import Tetris from './components/Tetris';
import Hold from './components/Hold';
import Level from './components/Level';
import Score from './components/Score';

class App extends Component {
    state = {
        rows: 12,
        cols: 10,
        score: 0,
        level: 1
    }

    render() {
        return (
            <div className="App">
                <Tetris rows={this.state.rows} cols={this.state.cols} />
                <aside>
                    <Hold />
                    <Level level={this.state.level} />
                    <Score score={this.state.score} />
                </aside>
            </div>
        );
    }
}

export default App;
