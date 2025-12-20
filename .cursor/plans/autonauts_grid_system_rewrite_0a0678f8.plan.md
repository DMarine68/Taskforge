---
name: Autonauts Grid System Rewrite
overview: Rewrite the core grid system to enforce strict tile-based logic where everything snaps to integer tiles, movement is grid-based, and tile types are separated from tile content. The world looks 3D but thinks in 2D.
todos:
  - id: tilegrid_rewrite
    content: Rewrite TileGrid.js with chunked grid system, tile types, and strict coordinate system
    status: completed
  - id: terrain_integration
    content: Refactor Terrain.js to use tile types from TileGrid and render accordingly
    status: completed
  - id: pathfinder_tile_based
    content: Update Pathfinder.js to use strict tile coordinates and tile-to-tile movement
    status: completed
  - id: building_placement
    content: Enforce strict grid snapping and N×N placement rules in BuildingManager.js
    status: completed
  - id: player_movement
    content: Refactor Player.js to use tile-based movement with visual smoothing
    status: completed
  - id: villager_movement
    content: Update Villager.js to use tile-based movement
    status: completed
  - id: worldobject_centering
    content: Ensure WorldObject.js centers objects on tiles with cardinal orientation
    status: completed
  - id: building_alignment
    content: Verify Building.js aligns to grid and spans exact N×N tiles
    status: completed
  - id: interaction_snapping
    content: Update InteractionManager.js to snap all interactions to tile grid
    status: completed
---

# Autonauts-Style Grid System Rewrite

## Overview

Transform the current grid system into a strict, deterministic tile-based system where:

- Everything snaps to integer tile coordinates
- Movement is tile-to-tile (visually smoothed)
- Tile types are separate from tile content
- Buildings occupy N×N tiles with strict placement rules
- Pathfinding operates on a tile graph

## Core Changes

### 1. TileGrid.js - Core Grid Structure

**File**: `client/src/game/TileGrid.js`Rewrite to implement:

- **Chunked grid system** for infinite/expandable world
- **Tile type system**: Each tile has a base type (grass, dirt, water, farmable, etc.)
- **Tile content separation**: Content (trees, rocks, buildings) is separate from tile type
- **Strict coordinate system**: All positions are integer tile coordinates
- **Tile state management**: `occupied`, `walkable`, `type`, `content`

Key methods:

- `getTile(tileX, tileZ)` - Get tile by integer coordinates
- `getTileAtWorldPosition(worldX, worldZ)` - Convert world to tile coords
- `getWorldPosition(tileX, tileZ)` - Convert tile to world coords (always centers)
- `setTileType(tileX, tileZ, type)` - Set base tile type
- `setTileContent(tileX, tileZ, content)` - Set tile content (tree, rock, etc.)
- `canPlaceBuilding(tileX, tileZ, size)` - Check if N×N area is clear
- `isWalkable(tileX, tileZ)` - Check walkability

Tile data structure:

```javascript
{
  tileX, tileZ,           // Integer grid coordinates
  type: 'grass'|'dirt'|'water'|...,  // Base terrain type
  content: null|'tree'|'rock'|...,     // Object on tile
  occupied: false,        // Building occupies this tile
  walkable: true,         // Can entities walk here
  worldX, worldZ          // World position (tile center)
}
```



### 2. Terrain.js - Visual Tile Types

**File**: `client/src/game/Terrain.js`Refactor to:

- Query tile types from TileGrid instead of generating them
- Render terrain based on tile type
- Support tile type changes (e.g., grass → farmable soil)
- Visual representation matches tile type system

### 3. Pathfinder.js - Strict Tile-Based Pathfinding

**File**: `client/src/game/Pathfinder.js`Enforce:

- **Tile-to-tile movement**: Paths are sequences of tile coordinates
- **8-directional with proper costs**: Diagonals cost √2, cardinals cost 1
- **Tile adjacency checks**: Only move to adjacent tiles
- **No world-space calculations**: All logic uses tile coordinates

Key changes:

- `findPath(startTileX, startTileZ, endTileX, endTileZ)` - Uses tile coords
- `getNeighbors(tileX, tileZ)` - Returns adjacent tiles only
- Diagonal movement requires both cardinal neighbors to be walkable

### 4. BuildingManager.js - Strict Placement Rules

**File**: `client/src/game/BuildingManager.js`Enforce Autonauts-style placement:

- **Grid snapping**: Buildings snap to integer tile coordinates
- **N×N occupancy**: Buildings occupy square areas (1×1, 2×2, 3×3, etc.)
- **All tiles must be empty**: Check all required tiles before placement
- **90° rotation increments**: Rotation locked to 0°, 90°, 180°, 270°
- **Preview shows exact placement**: Preview matches final position exactly

Key changes:

- `canPlaceBuilding(tileX, tileZ, buildingType)` - Checks all N×N tiles
- `placeBuilding(tileX, tileZ, buildingType)` - Places at exact tile coords
- `updatePreview(tileX, tileZ)` - Snaps preview to tile grid

### 5. Player.js - Tile-Based Movement

**File**: `client/src/game/Player.js`Refactor movement to:

- **Always on tile centers**: Position always aligns to tile center
- **Tile-to-tile pathfinding**: Use tile coordinates, not world positions
- **Visual smoothing**: Smooth movement between tiles, but logic stays grid-based
- **Current tile tracking**: Always know which tile player occupies

Key changes:

- `moveTo(tileX, tileZ)` - Accept tile coordinates instead of world positions
- `update(deltaTime)` - Move tile-to-tile with visual smoothing
- `getCurrentTile()` - Returns current tile (already exists)
- `getTilePosition()` - Returns tile coordinates, not world position

### 6. Villager.js - Bot Tile Movement

**File**: `client/src/game/Villager.js`Apply same tile-based movement:

- Move tile-to-tile
- Visual smoothing for appearance
- Track current tile
- Use tile coordinates for all movement commands

### 7. WorldObject.js - Tile-Centered Objects

**File**: `client/src/game/WorldObject.js`Enforce:

- **Always centered on tile**: Objects positioned at tile center
- **Cardinal orientation**: Rotation locked to 90° increments
- **Tile coordinate storage**: Store tileX/tileZ, derive world position

### 8. Building.js - Grid-Aligned Buildings

**File**: `client/src/game/Building.js`Ensure:

- Buildings positioned at tile centers
- Multi-tile buildings span exact N×N tiles
- Visual representation matches tile occupancy

### 9. InteractionManager.js - Grid-Snapped Interactions

**File**: `client/src/game/InteractionManager.js`Update to:

- Snap click positions to nearest tile
- Use tile coordinates for all interactions
- Building placement preview snaps to grid

## Implementation Order

1. **TileGrid.js** - Core grid system with chunking and tile types
2. **Terrain.js** - Visual representation of tile types
3. **Pathfinder.js** - Strict tile-based pathfinding
4. **BuildingManager.js** - Grid-snapped placement
5. **Player.js** - Tile-based movement
6. **Villager.js** - Bot tile movement
7. **WorldObject.js** - Tile-centered objects
8. **Building.js** - Grid-aligned buildings
9. **InteractionManager.js** - Grid-snapped interactions

## Key Principles

- **No partial tiles**: Everything aligns to integer tile coordinates
- **Tile type ≠ content**: A tile can be grass and contain a tree
- **Visual smoothing**: Movement looks smooth but logic is discrete
- **Deterministic**: Same inputs always produce same results
- **Debuggable**: Easy to see which tile something is on

## Testing Considerations

- Verify all objects snap to tile centers
- Test building placement on exact N×N boundaries