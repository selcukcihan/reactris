import { WIDTH, HEIGHT } from './Constants';
import Shape from './Shape';


class Board {
    // Board'un en ust sol kutucugu (x, y) = (0, 0) koordinati.
    //          en alt sag kutucugu (x, y) = (WIDTH - 1, HEIGHT - 1) koordinati.

    constructor(updateCallback) {
        this.updateCallback = updateCallback;
        this.board = Array(HEIGHT)
            .fill()
            .map(() =>
                Array(WIDTH).fill(0));

        this.current = null;
        this.nextShape = Shape.random();
        this.score = 0;
        this.finished = false;
    }

    isOccupied = (x, y) => {
        let isolatedBoard = null;
        if (this.current) {
            isolatedBoard = this.current.getIsolatedBoard();
        }
        return this.board[y][x] === 1 || (isolatedBoard && isolatedBoard[y][x] === 1);
    };

    hasCollision = (isolatedBoard) => {
        for (let i = 0; i < HEIGHT; i++) {
            for (let j = 0; j < WIDTH; j++) {
                if (this.board[i][j] && isolatedBoard[i][j]) {
                    return true;
                }
            }
        }
        return false;
    };

    rotate = () => {
        if (!this.current) {
            return;
        }
        let { isolatedBoard, } = this.current.rotate(true);
        if (this.hasCollision(isolatedBoard)) {
            this.current.rotate(false); // undo the move
        }      
    };

    moveRight = () => {
        if (!this.current) {
            return;
        }
        const { isolatedBoard, } = this.current.move(1, 0);
        if (this.hasCollision(isolatedBoard)) {
            this.current.move(-1, 0); // undo the move
        }
    };

    moveLeft = () => {
        if (!this.current) {
            return;
        }
        const { isolatedBoard, } = this.current.move(-1, 0);
        if (this.hasCollision(isolatedBoard)) {
            this.current.move(1, 0); // undo the move
        }
    };

    moveDown = () => {
        if (this.current) {
            // once asagi kaydir
            var { isolatedBoard, changed } = this.current.move(0,  1);

            // sonra bak bakalim bu yeni pozisyon mumkun mu degil mi (cakisma var mi)
            if (this.checkCollision(isolatedBoard, changed)) {
                // cakisma var, hamleyi geri aliyoruz (eger hamle olduysa tabi)
                if (changed) {
                    // artik bu parcanin nihai yeri burasi olacak.
                    isolatedBoard = this.current.move(0, -1).isolatedBoard;
                }

                // nihai yerini aldigi icin, simdi board'u guncelleyelim
                for (let _y = 0; _y < HEIGHT; _y++) {
                    for (let _x = 0; _x < WIDTH; _x++) {
                        if (isolatedBoard[_y][_x] !== 0) {
                            this.board[_y][_x] = 1;
                        }
                    }
                }

                // simdi de patlama var mi kontrol edelim
                for (let y = HEIGHT - 1; y >= 0;) {
                    if (this.checkLineCollapse(y)) {
                        this.collapseLine(y);
                    } else {
                        y--;
                    }
                }
                this.newShape();
            }
        } else {
            this.newShape();
        }

        return null; // TODO patlamayı hallet
    };

    newShape = () => {
        this.current = this.nextShape;
        this.nextShape = Shape.random();
        let { isolatedBoard, changed } = this.current.move(0,  0);
        if (this.checkCollision(isolatedBoard, changed)) {
            this.finished = true; 
        }
    };

    gameOver = () => {
        return this.finished;
    };

    checkCollision = (isolatedBoard, changed) => {
        if (!changed) {
            for (let _x = 0; _x < isolatedBoard[HEIGHT - 1].length; _x++) {
                if (isolatedBoard[HEIGHT - 1][_x] === 1) {
                    return true;
                }
            }
        }
        for (let _y = 0; _y < isolatedBoard.length; _y++) {
            for (let _x = 0; _x < isolatedBoard[_y].length; _x++) {
                if (this.board[_y][_x] === 1 && isolatedBoard[_y][_x] === 1) {
                    return true;
                }
            }
        }
        return false;
    };

    collapseLine = (y) => {
        for (let _y = y; _y > 0; _y--) {
            this.board[_y] = this.board[_y - 1];
        }
        this.board[0] = Array(WIDTH).fill(0);
        this.score++;
    };

    checkLineCollapse = (y) => {
        for (let x = 0; x < WIDTH; x++) {
            if (this.board[y][x] === 0) {
                return false;
            }
        }
        return true;
    };

    getScore = () => {
        return this.score;
    }

    getNextShape = () => {
        return this.nextShape;
    };
}

export default Board;
