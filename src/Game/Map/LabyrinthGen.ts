
class DisjointSets {
    size: number;
    set: Array<number>;

    constructor(size: number) {
        this.size = size;
        this.set = new Array<number>(size).fill(-1);
    }

    find(x: number): number {
        if (this.set[x] < 0) {
            return x;
        }
        else {
            return this.find(this.set[x]);
        }
    }

    findCompress(x: number): number {
        if (this.set[x] < 0) {
            return x;
        }
        else {
            this.set[x] = this.findCompress(this.set[x]);
            return this.set[x];
        }
    }

    unionSetsRank(root1: number, root2: number) {
        if (this.set[root1] < this.set[root2]) {
            this.set[root2] = root1;
        }
        else if (this.set[root1] > this.set[root2]) {
            this.set[root1] = root2;
        }
        else {
            this.set[root2] = root1;
            this.set[root1]--;
        }
    }
    
    numberOfTrees(): number {
        let returnValue = 0;
        for (let i = 0; i < this.size; i++) {
            if (this.set[i] < 0) {
                returnValue++;
            }
        }
        return returnValue;
    }

    printSet() {
        console.log(this.set);
    }
}


export default class LabyrinthGen {
    private xSize;
    private ySize;
    
    map: Array<Array<number>>;

    constructor(xSize: number, ySize: number) {
        //Decide sizes
        this.xSize = xSize * 2 + 1;
        this.ySize = ySize * 2 + 1;

        // Generate map
        this.map = new Array<Array<number>>(this.xSize);
        for (let i = 0; i < this.xSize; i++) {
            this.map[i] = new Array<number>();
        }

        //Generate walls
        this.generateMap();
        this.generateMaze();
        this.printMap();
    }

    private generateMap() {
        let counter = 3;

        for (let j = 0; j < this.ySize; j++) {
            for (let i = 0; i < this.xSize; i++) {
                if (i % 2 == 0 || j % 2 == 0) {
                    if (i % 2 == 0 && j % 2 == 0) {
                        this.map[i][j] = 2;
                    }
                    else {
                        this.map[i][j] = 1;
                    }

                }
                else {
                    this.map[i][j] = counter;
                    counter++;
                }
            }
        }
    }

    private generateMaze() {
        let spaces = new DisjointSets(((this.xSize - 1) / 2)*((this.ySize - 1) / 2));
        let nrOfWalls = ((this.xSize - 1) / 2)*((this.ySize - 1) / 2) * 2 - ((this.xSize - 1) / 2) - ((this.ySize - 1) / 2);
        let tested = new Array<number>(nrOfWalls);
        for (let i = 0; i < nrOfWalls; i++) {
            tested[i] = 0;
        }

        let walls = new Array<number>(nrOfWalls);
        for (let i = 0; i < nrOfWalls; i++) {
            walls[i] = 1;
        }

        while (spaces.numberOfTrees() > 1) {
            this.removeRandomWall(spaces, walls, tested, nrOfWalls);
        }

        this.removeWalls(walls, nrOfWalls);
    }

    private removeWalls(walls: Array<number>, nrOfWalls: number) {
        let wallCounter = 0;

        for (let j = 1; j < this.ySize - 1; j++) {
            for (let k = 1; k < this.xSize - 1; k++) {
                if (this.map[k][j] == 1) {
                    wallCounter++;
                    this.map[k][j] = walls[wallCounter - 1];
                }
                if (this.map[k][j] > 2) {
                    this.map[k][j] = 0;
                }
            }
        }
    }
    
    private removeRandomWall(spaces: DisjointSets, walls: Array<number>, tested: Array<number>, nrOfWalls: number) {
        let randWallSeed = Math.floor(Math.random() * (this.getUnTested(tested, nrOfWalls)));
        let randWall = this.getIdxUnTested(tested, nrOfWalls, randWallSeed);

        if (walls[randWall] != 0 && tested[randWall] != 1) {
            let elements = new Array<number>();
            this.getElements(randWall, elements);

            if (spaces.findCompress(elements[0]) != spaces.findCompress(elements[1])) {
                spaces.unionSetsRank(spaces.find(elements[0]), spaces.find(elements[1]));

                walls[randWall] = 0;
            }
        }
        tested[randWall] = 1;
    }

    private getElements(randWall: number, elements: Array<number>) {
        let wallCounter = 0;
        let e1 = 0;
        let e2 = 0;
    
        for (let j = 0; j < this.ySize - 1; j++) {
            for (let k = 0; k < this.xSize - 1; k++) {
                if (this.map[k][j] == 1 && k != 0 && j != 0) {
                    wallCounter++;
                }
                if (wallCounter == randWall + 1) {
                    if (j % 2 == 0) {
                        e1 = this.map[k][j - 1] - 3;
                        e2 = this.map[k][j + 1] - 3;
                    }
                    else {
                        e1 = this.map[k - 1][j] - 3;
                        e2 = this.map[k + 1][j] - 3;
                    }
    
    
    
                    j = this.ySize - 1;
                    k = this.xSize - 1;
                }
            }
        }
    
        elements.push(e1);
        elements.push(e2);
    
    }

    private getUnTested(tested: Array<number>, nrOfWalls: number) {
        let returnValue = 0;
        for (let i = 0; i < nrOfWalls; i++) {
            if (tested[i] == 0) {
                returnValue++;
            }
        }
        return returnValue;
    }

    private getIdxUnTested(tested: Array<number>, nrOfWalls: number, nr: number) {
        let returnValue = 0;
        let counter = 0;
        for (let i = 0; i < nrOfWalls; i++) {
            if (tested[i] == 0) {
                counter++;
                if (counter == nr) {
                    returnValue = i;
                    i = nrOfWalls;
                }
            }
        }
        return returnValue;
    }

    private printMap() {
        let output = "";
        for (let j = 0; j < this.ySize; j++) {
            for (let i = 0; i < this.xSize; i++) {
                output += this.map[i][j] + " ";
            }
            output += "\n";
        }

        console.log(output);
    }
}