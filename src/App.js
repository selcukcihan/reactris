import React, { Component } from "react";
import { useMediaQuery } from 'react-responsive';

import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

import Board from "./game/Board";
import { TICK_INTERVAL_SECONDS, WIDTH, HEIGHT } from './game/Constants';

import './App.css';


class App extends Component {
    state = {
        board: new Board(),
    };

    intervalId = null;

    handleTouchMain = (event) => this.handleTouchEnd(event, "rotate");
    handleTouchLeft = (event) => this.handleTouchEnd(event, "left");
    handleTouchRight = (event) => this.handleTouchEnd(event, "right");
    handleTouchControl = (event) => this.handleTouchEnd(event, "down");

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
        }, TICK_INTERVAL_SECONDS * 1000);
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

    handleTouchEnd = (event, command) => {
        event.preventDefault();

        let action = null;
        switch (command) {
            case "rotate":
                action = (board) => board.rotate();
                break;
            case "left":
                action = (board) => board.moveLeft();
                break;
            case "right":
                action = (board) => board.moveRight();
                break;
            case "down":
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
        document.addEventListener("keydown", this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);

        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
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
        const Mobile = ({ children }) => {
            const isMobile = useMediaQuery({ maxWidth: "1224px" });
            return isMobile ? children : null;
        };
        return (
            <div className="full-height">
                <div className="game-height main-grid-container">
                    <div className="center-control-container" onTouchEnd={this.handleTouchLeft}>
                        <Mobile>
                            <FaCaretLeft className="center-control"/>
                        </Mobile>
                    </div>
                    <div className="game-grid-container" onTouchEnd={this.handleTouchMain}>
                        {this.getDivs()}
                    </div>
                    <div className="center-control-container" onTouchEnd={this.handleTouchRight}>
                        <Mobile>
                            <FaCaretRight className="center-control"/>
                        </Mobile>
                    </div>
                </div>
                {this.renderControlArea()}
                <a className="center-link" target="_blank"
                   href="https://github.com/selcukcihan/selcukcihan.github.io">source code</a>
            </div>
        );
    }

    renderControlArea = () => {
        if (this.state.board.gameOver()) {
            return (
                <div className="game-width control-height margin-auto secondary-color center-text digital">
                    {"Your score is " + this.state.board.getScore()}
                </div>
            );            
        } else {
            return (
                <div className="game-width control-height margin-auto secondary-color digital"
                     onTouchEnd={this.handleTouchControl}>
                    <div className="preview-grid-container margin-auto control-height center-text">
                        
                        {this.getDivsForPreview()}
                    </div>
                    <div className="margin-auto control-height center-text">
                        {this.state.board.getScore()}
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
