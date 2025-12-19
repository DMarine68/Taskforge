// Pathfinding utility class (A* algorithm)
// This is used by Player and will be used by Villagers

export class Pathfinder {
  constructor(tileGrid) {
    this.tileGrid = tileGrid;
  }

  findPath(startX, startZ, endX, endZ) {
    const startTile = this.tileGrid.getTileAt(startX, startZ);
    const endTile = this.tileGrid.getTileAt(endX, endZ);
    
    if (!startTile || !endTile || !endTile.walkable) {
      return [];
    }

    const openSet = [startTile];
    const closedSet = [];
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    gScore.set(startTile, 0);
    fScore.set(startTile, this.heuristic(startTile, endTile));

    while (openSet.length > 0) {
      // Find node with lowest fScore
      let current = openSet[0];
      let currentIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        const score = fScore.get(openSet[i]) || Infinity;
        const currentScore = fScore.get(current) || Infinity;
        if (score < currentScore) {
          current = openSet[i];
          currentIndex = i;
        }
      }

      if (current === endTile) {
        // Reconstruct path
        const path = [];
        let node = endTile;
        while (node) {
          path.unshift(node);
          node = cameFrom.get(node);
        }
        return path;
      }

      openSet.splice(currentIndex, 1);
      closedSet.push(current);

      // Check neighbors
      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor) || !neighbor.walkable || neighbor.occupied) {
          continue;
        }

        const tentativeGScore = (gScore.get(current) || Infinity) + 1;
        const neighborGScore = gScore.get(neighbor) || Infinity;
        
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= neighborGScore) {
          continue;
        }

        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + this.heuristic(neighbor, endTile));
      }
    }

    return []; // No path found
  }

  getNeighbors(tile) {
    const neighbors = [];
    const directions = [
      { x: 0, z: -1 }, // North
      { x: 1, z: 0 },  // East
      { x: 0, z: 1 },  // South
      { x: -1, z: 0 }, // West
      { x: 1, z: -1 }, // NE
      { x: 1, z: 1 },  // SE
      { x: -1, z: 1 }, // SW
      { x: -1, z: -1 } // NW
    ];

    for (const dir of directions) {
      const neighborX = tile.x + dir.x;
      const neighborZ = tile.z + dir.z;
      if (neighborX >= 0 && neighborX < this.tileGrid.width &&
          neighborZ >= 0 && neighborZ < this.tileGrid.height) {
        const neighbor = this.tileGrid.tiles[neighborX][neighborZ];
        if (neighbor) {
          neighbors.push(neighbor);
        }
      }
    }

    return neighbors;
  }

  heuristic(a, b) {
    // Euclidean distance
    const dx = a.x - b.x;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dz * dz);
  }
}


