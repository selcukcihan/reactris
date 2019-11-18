import { WIDTH, HEIGHT } from './Constants';
import Shape from './Shape';


class Board {
    // Board'un en ust sol kutucugunun koordinati (x, y) = (0, 0)
    //          en alt sag kutucugunun koordinati (x, y) = (WIDTH - 1, HEIGHT - 1)

    constructor(updateCallback) {
        this.updateCallback = updateCallback;
        this.board = Array(HEIGHT)
            .fill()
            .map(() =>
                Array(WIDTH).fill(null));

        this.current = null;
        this.nextShape = Shape.random();
        this.score = 0;
        this.finished = false;
    }

    getCSSClassName = (x, y) => {
        let isolatedBoard = null;
        if (this.current) {
            isolatedBoard = this.current.getIsolatedBoard();
        }
        let mergedBoard = (this.board[y][x] || (isolatedBoard && isolatedBoard[y][x]));
        if (mergedBoard) {
            return "occupied " + mergedBoard.getCSSClassName(x, y);
        } else {
            return "empty";
        }
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
            this.current.rotate(false); // geri al cunku hamle gecerli degil
        }      
    };

    moveRight = () => {
        if (!this.current) {
            return;
        }
        const { isolatedBoard, } = this.current.move(1, 0);
        if (this.hasCollision(isolatedBoard)) {
            this.current.move(-1, 0); // geri al cunku hamle gecerli degil
        }
    };

    moveLeft = () => {
        if (!this.current) {
            return;
        }
        const { isolatedBoard, } = this.current.move(-1, 0);
        if (this.hasCollision(isolatedBoard)) {
            this.current.move(1, 0); // geri al cunku hamle gecerli degil
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
                        if (isolatedBoard[_y][_x]) {
                            this.board[_y][_x] = this.current;
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

        return null; // TODO animasyonlu patlama icin burada patlayan bolumu return etmek gerekecek
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
                if (isolatedBoard[HEIGHT - 1][_x]) {
                    return true;
                }
            }
        }
        for (let _y = 0; _y < isolatedBoard.length; _y++) {
            for (let _x = 0; _x < isolatedBoard[_y].length; _x++) {
                if (this.board[_y][_x] && isolatedBoard[_y][_x]) {
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
        this.board[0] = Array(WIDTH).fill(null);
        this.score++;
    };

    checkLineCollapse = (y) => {
        for (let x = 0; x < WIDTH; x++) {
            if (!this.board[y][x]) {
                return false;
            }
        }
        return true;
    };

    getScore = () => {
        return ("000" + this.score).slice(-3);
    }

    getNextShape = () => {
        return this.nextShape;
    };
}

export default Board;
