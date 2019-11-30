import React, { Component } from "react";
import { useMediaQuery } from 'react-responsive';

import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

import Board from "./game/Board";
import { WIDTH, HEIGHT } from './game/Constants';

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

    hidden = null;
    visibilityChange = null;
    paused = false;

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);

        this.initVisibilityChange();
        document.addEventListener(this.visibilityChange, this.handleVisibilityChange, false);

        this.processTick();
        this.resumeGame();
    }

    pauseGame = () => {
        this.paused = true;     
    };

    processTick = () => {
        if (!this.paused) {
            this.setState(prevState => {
                let board = Object.assign({}, prevState.board);
                if (!this.checkGameOver(board)) {
                    this.handleCollapse(board.moveDown());
                }
                return { board };
            });

            setTimeout(this.processTick, this.state.board.getIntervalSeconds() * 1000);
        }
    }

    resumeGame = () => {
        this.paused = false;
        setTimeout(this.processTick, this.state.board.getIntervalSeconds() * 1000);
    };

    initVisibilityChange = () => {
        // FROM https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
        // Set the name of the hidden property and the change event for visibility
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
            this.hidden = "hidden";
            this.visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            this.hidden = "msHidden";
            this.visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            this.hidden = "webkitHidden";
            this.visibilityChange = "webkitvisibilitychange";
        }
    };

    handleVisibilityChange = () => {
        if (document[this.hidden]) {
            this.pauseGame();
        } else {
            this.resumeGame();
        }
    };

    checkGameOver = (board) => {
        if (board.gameOver()) {
            this.pauseGame();
            return true;
        }
        return false;
    };

    handleKeyPress = (event) => {
        let action = null;
        switch (event.keyCode) {
            case 32:
            case 38:
                action = (board) => board.rotate();
                break;
            case 37:
                action = (board) => board.moveLeft();
                break;
            case 39:
                action = (board) => board.moveRight();
                break;
            case 40:
                action = (board) => this.handleCollapse(board.moveDown());
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

    handleCollapse = (collapsed) => {

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
                action = (board) => this.handleCollapse(board.moveDown());
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

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
        this.pauseGame();
    }

    getDivs = () => {
        let divs = [];
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                let className = "tile ";
                className += this.state.board.getCSSClassName(x, y);
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
                <a className="center-link" target="_blank" rel="noopener noreferrer"
                   href="https://github.com/selcukcihan/reactris">source code</a>
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
                <div className="game-width control-height margin-auto secondary-color"
                     onTouchEnd={this.handleTouchControl}>
                    <div className="preview-grid-container margin-auto control-height center-text">
                        {this.getDivsForPreview()}
                    </div>
                    <div className="margin-auto control-height">
                        <span>Score:&nbsp;</span>
                        <span className="digital">{this.state.board.getScore()}</span>
                        <br/>
                        <span>Level:&nbsp;</span>
                        <span className="digital">{this.state.board.getLevel()}</span>
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
                let className = "preview-tile ";
                if (tiles[y][x]) {
                    className += "occupied " + tiles[y][x].getCSSClassName();
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
