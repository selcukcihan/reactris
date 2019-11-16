import React, { Component } from "react";

import Board from "./game/Board";
import { WIDTH, HEIGHT } from './game/Constants';

import './App.css';


class App extends Component {
    state = {
        board: new Board(),
    }

    intervalId = null;

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState(prevState => {
                let board = Object.assign({}, prevState.board);
                if (!this.checkGameOver(board)) {
                    let explosion = board.moveDown();
                    if (explosion) {
                        ;
                    }
                }
                return { board };
            })
        }, 1000);
    }

    checkGameOver = (board) => {
        if (board.gameOver()) {
            clearInterval(this.intervalId);
            return true;
        }
        return false;
    };

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
                if (!this.checkGameOver(board)) {
                    action(board);
                }
                return { board };
            });
        }
    };

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
    };

    render() {
        return (
            <div className="full-height">
                <div className="game-height game-width grid-container margin-auto">
                     {this.getDivs()}
                </div>
                {this.renderControlArea()}
            </div>
        );
    }

    renderControlArea = () => {
        if (this.state.board.gameOver()) {
            return (
                <div className="game-width control-height margin-auto secondary-color center-text">
                    {"Game Over! Your final score is " + this.state.board.getScore()}
                </div>
            );            
        } else {
            return (
                <div className="game-width control-height margin-auto secondary-color">
                    {"Score: " + this.state.board.getScore()}
                    <div className="preview-grid-container margin-auto control-height center-text">
                        {this.getDivsForPreview()}
                    </div>
                </div>
            );               
        }
    };

    getDivsForPreview = () => {
        let divs = [];
        let tiles = this.state.board.getNextShape().peek();
        for (let y = 0; y < tiles.length; y++) {
            for (let x = 0; x < tiles[y].length; x++) {
                let className = "tile preview ";
                if (tiles[y][x]) {
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
    };
}

export default App;
