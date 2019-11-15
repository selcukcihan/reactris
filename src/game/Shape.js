import { WIDTH, HEIGHT } from './Constants';


class Shape {
    // Tum sekiller, bulunabilecekleri her pozisyonda
    //     koordinatlarla tanimlaniyor (this.orientations)
    // (this.x, this.y) sekilleri icine alan en kucuk kare kutunun
    //     sol ust kose kutucugunun (tile) koordinatlarini tutar.

    constructor() {
        this.orientationIndex = 0;
        this.y = 0; // baslangicta, tum sekiller icin, kapsayan kutu en tepeden baslar
    }

    move(deltaX, deltaY) {
        if (Math.abs(deltaX) + Math.abs(deltaY) > 1) {
            throw new Error("Can only move one square in any direction!");
        }
        this.x += deltaX;
        this.y += deltaY;
        if (this.checkBounds()) {
            return this.getIsolatedBoard();
        } else {
            return this.move(-1 * deltaX, -1 * deltaY);
        }
    }

    rotate(clockwise) {
        this.orientationIndex = (this.orientationIndex + this.orientations.length + (clockwise ? 1 : -1))
            % this.orientations.length;

        if (this.checkBounds()) {
            return this.getIsolatedBoard();
        } else {
            return this.rotate(!clockwise);
        }
    }

    getIsolatedBoard() {
        let isolatedBoard = Array(HEIGHT)
            .fill()
            .map(() =>
                Array(WIDTH).fill(0));
        for (let _y = 0; _y < this.orientations[this.orientationIndex].length; _y++) {
            for (let _x = 0; _x < this.orientations[this.orientationIndex][_y].length; _x++) {
                let box = this.orientations[this.orientationIndex];
                isolatedBoard[this.y + _y][this.x + _x] = box[_y][_x];
            }
        }
        return isolatedBoard;
    }

    checkBounds() {
        for (let _y = 0; _y < this.orientations[this.orientationIndex].length; _y++) {
            for (let _x = 0; _x < this.orientations[this.orientationIndex][_y].length; _x++) {
                let box = this.orientations[this.orientationIndex];
                if (box[_y][_x]) {
                    if (this.y + _y < 0 || this.x + _x < 0 || this.y + _y >= HEIGHT || this.x + _x >= WIDTH) {
                        return false;
                    }                    
                }
            }
        }
        return true;
    }

    static random() {
        const shapes = [LineShape, SquareShape, TShape, SShape, ZShape, JShape, LShape];
        const rnd = Math.floor(Math.random() * shapes.length);
        return new shapes[rnd]();
    }
}

class LineShape extends Shape {
    constructor() {
        super();
        this.x = 3;
        this.orientations = [
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
            ],
            [
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
        ];
    }
}

class SquareShape extends Shape {
    constructor() {
        super();
        this.x = 4;
        this.orientations = [
            [
                [1, 1],
                [1, 1],
            ],
        ];
    }
}

class TShape extends Shape {
    constructor() {
        super();
        this.x = 3;
        this.orientations = [
            [
                [1, 1, 1],
                [0, 1, 0],
                [0, 0, 0],
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 0, 1],
            ],
            [
                [0, 0, 0],
                [0, 1, 0],
                [1, 1, 1],
            ],
            [
                [1, 0, 0],
                [1, 1, 0],
                [1, 0, 0],
            ],
        ];
    }
}

class SShape extends Shape {
    constructor() {
        super();
        this.x = 3;
        this.orientations = [
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ],
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0],
            ],
        ];
    }
}

class ZShape extends Shape {
    constructor() {
        super();
        this.x = 3;
        this.orientations = [
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [1, 0, 0],
            ],
        ];
    }
}

class JShape extends Shape {
    constructor() {
        super();
        this.x = 3;
        this.orientations = [
            [
                [0, 0, 1],
                [0, 0, 1],
                [0, 1, 1],
            ],
            [
                [0, 0, 0],
                [1, 0, 0],
                [1, 1, 1],
            ],
            [
                [1, 1, 0],
                [1, 0, 0],
                [1, 0, 0],
            ],
            [
                [1, 1, 1],
                [0, 0, 1],
                [0, 0, 0],
            ],
        ];
    }
}

class LShape extends Shape {
    constructor() {
        super();
        this.x = 3;
        this.orientations = [
            [
                [1, 0, 0],
                [1, 0, 0],
                [1, 1, 0],
            ],
            [
                [1, 1, 1],
                [1, 0, 0],
                [0, 0, 0],
            ],
            [
                [0, 1, 1],
                [0, 0, 1],
                [0, 0, 1],
            ],
            [
                [0, 0, 0],
                [0, 0, 1],
                [1, 1, 1],
            ],
        ];
    }
}


export default Shape;
