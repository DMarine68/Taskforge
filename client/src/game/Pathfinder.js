// Pathfinding utility class (A* algorithm)
// Strict tile-based pathfinding - all logic uses tile coordinates

export class Pathfinder {
  constructor(tileGrid) {
    this.tileGrid = tileGrid;
  }

  // Find path using tile coordinates
  findPath(startTileX, startTileZ, endTileX, endTileZ) {
    const startTile = this.tileGrid.getTile(startTileX, startTileZ);
    const endTile = this.tileGrid.getTile(endTileX, endTileZ);
    
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
      const neighbors = this.getNeighbors(current.tileX, current.tileZ);
      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor) || !neighbor.walkable || neighbor.occupied) {
          continue;
        }

        const currentGScore = gScore.get(current) || Infinity;
        const moveCost = neighbor.moveCost || 1;
        const tentativeGScore = currentGScore + moveCost;
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

  // Get adjacent tiles (8-directional with proper costs)
  getNeighbors(tileX, tileZ) {
    const neighbors = [];
    const directions = [
      { x: 0, z: -1, cost: 1 },   // North
      { x: 1, z: -1, cost: Math.sqrt(2) }, // Northeast (diagonal)
      { x: 1, z: 0, cost: 1 },    // East
      { x: 1, z: 1, cost: Math.sqrt(2) }, // Southeast (diagonal)
      { x: 0, z: 1, cost: 1 },    // South
      { x: -1, z: 1, cost: Math.sqrt(2) }, // Southwest (diagonal)
      { x: -1, z: 0, cost: 1 },   // West
      { x: -1, z: -1, cost: Math.sqrt(2) } // Northwest (diagonal)
    ];

    for (const dir of directions) {
      const neighborX = tileX + dir.x;
      const neighborZ = tileZ + dir.z;
      const neighbor = this.tileGrid.getTile(neighborX, neighborZ);
      
      if (neighbor && neighbor.walkable && !neighbor.occupied) {
        // For diagonal movement, check that both cardinal neighbors are walkable
        if (dir.cost > 1) {
          const card1X = tileX + dir.x;
          const card1Z = tileZ;
          const card2X = tileX;
          const card2Z = tileZ + dir.z;
          
          const card1 = this.tileGrid.getTile(card1X, card1Z);
          const card2 = this.tileGrid.getTile(card2X, card2Z);
          
          if (card1 && card1.walkable && !card1.occupied &&
              card2 && card2.walkable && !card2.occupied) {
            neighbor.moveCost = dir.cost;
            neighbors.push(neighbor);
          }
        } else {
          neighbor.moveCost = dir.cost;
          neighbors.push(neighbor);
        }
      }
    }

    return neighbors;
  }

  // Heuristic function (diagonal distance for 8-directional movement)
  heuristic(a, b) {
    const dx = Math.abs(a.tileX - b.tileX);
    const dz = Math.abs(a.tileZ - b.tileZ);
    // Use diagonal distance (optimal for 8-directional movement)
    return Math.max(dx, dz) + (Math.sqrt(2) - 1) * Math.min(dx, dz);
  }
}
