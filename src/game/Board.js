import { WIDTH, HEIGHT } from './Constants';
import Shape from './Shape';
/*
rotasyonlar saat yonunde

Top-left tile of the board has coordinates (x, y) = (0, 0)
Bottom-right tile has coordinates          (x, y) = (w - 1, h - 1)

xxxx

xxx
 x

xx
xx

x
xxx

  x
xxx

xx
 xx

 xx
xx
*/




class Board {
    constructor(updateCallback) {
        this.updateCallback = updateCallback;
        this.board = Array(HEIGHT)
            .fill()
            .map(() =>
                Array(WIDTH).fill(0));

        this.current = null;
    }

    isOccupied = (x, y) => {
        let isolatedBoard = null;
        if (this.current) {
            isolatedBoard = this.current.getIsolatedBoard();
        }
        return this.board[y][x] === 1 || (isolatedBoard && isolatedBoard[y][x] === 1);
    };

    hasCollision = (isolatedBoard) => {
        for (let i = 0; i < this.board[i].length; i++) {
            for (let j = 0; j < this.board[j].length; j++) {
                if (this.board[i][j] && isolatedBoard[i][j]) {
                    return true;
                }
            }
        }
        return false;
    }

    rotate = () => {
        if (!this.current) {
            return;
        }
        let isolatedBoard = this.current.rotate(true);

        // check collision
        if (this.hasCollision(isolatedBoard)) {
            this.current.rotate(false); // undo the move
        }

        // hareket ettir ettirebilirsen (aşağı değil, olduğu yerde)
        // ettirebilirsen true dön
        // komponent isOccupied çağıra çağıra boyasın ekranı akabinde (eğer true dönerse)        
    };

    moveRight = () => {
        if (!this.current) {
            return;
        }
        let isolatedBoard = this.current.move(1, 0);

        // check collision
        if (this.hasCollision(isolatedBoard)) {
            this.current.move(-1, 0); // undo the move
        }
    };

    moveLeft = () => {
        if (!this.current) {
            return;
        }
        let isolatedBoard = this.current.move(-1, 0);

        // check collision
        if (this.hasCollision(isolatedBoard)) {
            this.current.move(1, 0); // undo the move
        }
    };

    moveDown = () => {
        if (this.current) {
            this.current.move(0,  1);
            // eğer bir yere gidemediyse, bak bakalım patlayan yer var mı
        } else {
            this.current = Shape.random();
        }

        return null;
        // mevcutta bi parça varsa bir aşağı kaydır
        //     kayamıyorsa patlamaları kontrol et ve patlat
        // mevcutta bi parça yoksa, yeni parça üret en tepeden başlat

        // komponent her halükarda ekranı boyamak için isOccupied çağıracak
        // TODO: patlamalarda efekti nasıl vercez?
    };
}

export default Board;
