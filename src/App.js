import React, { Component } from "react";

import Board from "./game/Board";
import { WIDTH, HEIGHT } from './game/Constants';

import './App.css';


class App extends Component {
    state = {
        board: new Board(),
    }

    componentDidMount() {
        setInterval(() => {
            this.setState(prevState => {
                let board = Object.assign({}, prevState.board);
                let explosion = board.moveDown();
                if (explosion) {
                    ;
                }
                return { board };
            })
        }, 1000);
    }

    handleKeyPress = (event) => {
        let action = null;
        switch (event.keyCode) {
            case 32:
                action = (board) => board.rotate();
                break;
            case 37:
                action = (board) => board.moveLeft();
                break;
            case 39:
                action = (board) => board.moveRight();
                break;
            case 40:
                action = (board) => board.moveDown();
                break;
            default:
                break;
        }
        if (action) {
            this.setState(prevState => {
                let board = Object.assign({}, prevState.board);
                action(board);
                return { board };
            });
        }
    }

    componentWillMount() {
        document.addEventListener("keydown", this.handleKeyPress.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress.bind(this));
    }   

    getDivs = () => {
        let divs = [];
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                let className = "tile ";
                if (this.state.board.isOccupied(x, y)) {
                    className += "occupied";
                } else {
                    className += "empty";
                }
                divs.push(
                    <div key={x + "," + y} className={className}></div>
                );
            }
        }
        return divs;
    }
    render() {
        return (
            <div className="full-height">
                <div style={{backgroundColor: "orange"}}
                     className="game-height game-width center grid-container margin-auto">
                     {this.getDivs()}
                </div>
                <div className="game-width control-height margin-auto " style={{backgroundColor: "black"}}>
                </div>
            </div>
        );
    }
}

export default App;
