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
		} else {
			return this.find(this.set[x]);
		}
	}

	findCompress(x: number): number {
		if (this.set[x] < 0) {
			return x;
		} else {
			this.set[x] = this.findCompress(this.set[x]);
			return this.set[x];
		}
	}

	unionSetsRank(root1: number, root2: number) {
		if (this.set[root1] < this.set[root2]) {
			this.set[root2] = root1;
		} else if (this.set[root1] > this.set[root2]) {
			this.set[root1] = root2;
		} else {
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

export module LabyrinthGenerator {
	/**
	 * Generates a 2 dimensional number array with wall tiles (1 or 2) and "walkable" tiles (0)
	 * @param xSize Number of "rooms" in x direction of the grid.
	 * @param ySize Number of "rooms" in y direction of the grid.
	 * @returns The 2 dimensional array
	 */
	export function getLabyrinth(
		xSize: number,
		ySize: number
	): Array<Array<number>> {
		//Decide sizes
		xSize = xSize * 2 + 1;
		ySize = ySize * 2 + 1;

		// Generate map
		let map = new Array<Array<number>>(xSize);
		for (let i = 0; i < xSize; i++) {
			map[i] = new Array<number>();
		}

        //Generate walls
        generateMap(map, xSize, ySize);
        generateMaze(map, xSize, ySize);
        // printMap(map, xSize, ySize);

		return map;
	}

	function generateMap(
		map: Array<Array<number>>,
		xSize: number,
		ySize: number
	) {
		let counter = 3;

		for (let j = 0; j < ySize; j++) {
			for (let i = 0; i < xSize; i++) {
				if (i % 2 == 0 || j % 2 == 0) {
					if (i % 2 == 0 && j % 2 == 0) {
						map[i][j] = 2;
					} else {
						map[i][j] = 1;
					}
				} else {
					map[i][j] = counter;
					counter++;
				}
			}
		}
	}

	function generateMaze(
		map: Array<Array<number>>,
		xSize: number,
		ySize: number
	) {
		let spaces = new DisjointSets(((xSize - 1) / 2) * ((ySize - 1) / 2));
		let nrOfWalls =
			((xSize - 1) / 2) * ((ySize - 1) / 2) * 2 -
			(xSize - 1) / 2 -
			(ySize - 1) / 2;
		let tested = new Array<number>(nrOfWalls);
		for (let i = 0; i < nrOfWalls; i++) {
			tested[i] = 0;
		}

		let walls = new Array<number>(nrOfWalls);
		for (let i = 0; i < nrOfWalls; i++) {
			walls[i] = 1;
		}

		while (spaces.numberOfTrees() > 1) {
			removeRandomWall(map, xSize, ySize, spaces, walls, tested, nrOfWalls);
		}

		removeWalls(map, xSize, ySize, walls);
	}

	function removeWalls(
		map: Array<Array<number>>,
		xSize: number,
		ySize: number,
		walls: Array<number>
	) {
		let wallCounter = 0;

		for (let j = 1; j < ySize - 1; j++) {
			for (let k = 1; k < xSize - 1; k++) {
				if (map[k][j] == 1) {
					wallCounter++;
					map[k][j] = walls[wallCounter - 1];
				}
				if (map[k][j] > 2) {
					map[k][j] = 0;
				}
			}
		}
	}

	function removeRandomWall(
		map: Array<Array<number>>,
		xSize: number,
		ySize: number,
		spaces: DisjointSets,
		walls: Array<number>,
		tested: Array<number>,
		nrOfWalls: number
	) {
		let randWallSeed = Math.floor(
			Math.random() * getUnTested(tested, nrOfWalls)
		);
		let randWall = getIdxUnTested(tested, nrOfWalls, randWallSeed);

		if (walls[randWall] != 0 && tested[randWall] != 1) {
			let elements = new Array<number>();
			getElements(map, xSize, ySize, randWall, elements);

			if (
				spaces.findCompress(elements[0]) != spaces.findCompress(elements[1])
			) {
				spaces.unionSetsRank(
					spaces.find(elements[0]),
					spaces.find(elements[1])
				);

				walls[randWall] = 0;
			}
		}
		tested[randWall] = 1;
	}

	function getElements(
		map: Array<Array<number>>,
		xSize: number,
		ySize: number,
		randWall: number,
		elements: Array<number>
	) {
		let wallCounter = 0;
		let e1 = 0;
		let e2 = 0;

		for (let j = 0; j < ySize - 1; j++) {
			for (let k = 0; k < xSize - 1; k++) {
				if (map[k][j] == 1 && k != 0 && j != 0) {
					wallCounter++;
				}
				if (wallCounter == randWall + 1) {
					if (j % 2 == 0) {
						e1 = map[k][j - 1] - 3;
						e2 = map[k][j + 1] - 3;
					} else {
						e1 = map[k - 1][j] - 3;
						e2 = map[k + 1][j] - 3;
					}

					j = ySize - 1;
					k = xSize - 1;
				}
			}
		}

		elements.push(e1);
		elements.push(e2);
	}

	function getUnTested(tested: Array<number>, nrOfWalls: number) {
		let returnValue = 0;
		for (let i = 0; i < nrOfWalls; i++) {
			if (tested[i] == 0) {
				returnValue++;
			}
		}
		return returnValue;
	}

	function getIdxUnTested(
		tested: Array<number>,
		nrOfWalls: number,
		nr: number
	) {
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

	function printMap(map: Array<Array<number>>, xSize: number, ySize: number) {
		let output = "";
		for (let j = 0; j < ySize; j++) {
			for (let i = 0; i < xSize; i++) {
				output += map[i][j] + " ";
			}
			output += "\n";
		}

		console.log(output);
	}
}
