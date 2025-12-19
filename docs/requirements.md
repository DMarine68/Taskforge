# Taskforge: Automation - Requirements Document

This document extracts all requirements from the design documents for implementation.

## Core Game Requirements

### Technology Stack
- **3D Engine**: Three.js
- **Frontend**: Vanilla JavaScript/TypeScript
- **Desktop**: Electron
- **Multiplayer**: Node.js + WebSocket server
- **Build Tool**: Webpack/Vite
- **Styling**: CSS with #6FD6FF branding color

### Visual Style
- 3D low-poly graphics
- Tile-based grid world
- Point-and-click movement
- Autonauts-like visual style and UX

### Platform
- Primary: Electron desktop app
- Secondary: Web browser (optional)

---

## Gameplay Systems

### Player Character
- Playable character in god view
- Point-and-click movement
- A* pathfinding
- Click-to-interact with world objects

### World System
- Tile/grid-based world
- Walkable/non-walkable tiles
- Visual tile highlighting

### Interaction System
- Click detection on objects
- Interaction range checking
- Basic actions (chop tree, pick up item)
- Resource spawning and collection

### Inventory System
- Player inventory storage
- Item pickup/drop
- Inventory UI display

---

## Automation Systems

### Building System
- Placement on grid tiles
- Resource costs required
- Building types:
  - Storage (stores items)
  - Workshop (crafting)
- Building interaction (click to open UI)
- Preview ghost building during placement
- Tile highlighting for valid placement

### Blueprints System
- Blueprint data structure
- Recipe definitions
- Unlock system (tutorial/progression)
- Blueprint UI panel
- Unlocked/locked states
- Resource requirements display

### Crafting System
- Craft items from blueprints
- Check resource availability
- Crafting time/progress
- Craft items in inventory

### Tools System
- Tools as craftable items
- Tools required for certain actions
- Tool durability (optional)

---

## Visual Programming System

### Command System Architecture
- Base Command class with:
  - Execute() function
  - CanExecute() validation
  - GetDuration() timing
  - OnSuccess/OnFailure callbacks
  - Command state (Pending, Executing, Success, Failed)
  - Command parameters

### Program Data Structure
- Program as tree of command nodes
- Each node has:
  - Command type
  - Parameters (Item Type, Target, etc.)
  - Child nodes (for loops/conditions)
  - Node ID
- Serializable for save/load

### Program Executor
- Executes program node tree sequentially
- Handles loops by tracking loop state
- Handles conditions by evaluating and branching
- Manages execution state
- Reports current command to UI

### Command Types

#### Movement Commands
- `Move To [Location/Item/Entity]` - Navigate to target
- `Find [Item Type]` - Locate nearest item of type
- `Find Nearest [Entity Type]` - Find closest entity

#### Interaction Commands
- `Chop Tree` - Cut down a tree
- `Mine Stone` - Extract from stone deposit
- `Pick Up [Item]` - Collect an item
- `Put Down` - Drop carried item
- `Plant [Crop Type]` - Plant a seed
- `Harvest [Crop]` - Collect grown crop
- `Water [Crop]` - Water a plant
- `Build [Building Type]` - Construct a building
- `Repair [Building]` - Fix damaged structure
- `Cook [Recipe]` - Process items into food
- `Craft [Item]` - Create items from materials

#### Storage Commands
- `Store [Item]` - Put item in storage
- `Take From Storage [Item Type]` - Retrieve items
- `Deposit At [Building]` - Deliver to specific location

#### Control Flow Commands
- `Repeat Forever` - Infinite loop
- `Repeat [Number] Times` - Finite loop
- `Repeat Until [Condition]` - Conditional loop
- `If [Condition] Then` - Conditional execution
- `If [Condition] Else` - Conditional branching
- `While [Condition]` - Loop while true
- `Break` - Exit current loop
- `Wait [Seconds]` - Pause execution
- `Stop` - End program execution

#### Condition Checks
- `Inventory Full?` - Check if carrying max items
- `Inventory Empty?` - Check if carrying nothing
- `Has [Item]?` - Check if holding specific item
- `Can See [Item/Entity]?` - Check if target exists nearby
- `Building Complete?` - Check building status
- `Crop Ready?` - Check if crop is harvestable
- `Energy Low?` - Check if villager is tired

#### Memory/Variables
- `Remember [Value]` - Store value in memory
- `Recall [Memory Slot]` - Retrieve stored value
- `Count [Item Type]` - Count items in inventory/storage
- `Set Variable [Name] To [Value]` - Store variable

#### Advanced Commands
- `Teach [Other Villager]` - Copy program to another villager
- `Work At [Building]` - Operate a specific building
- `Sleep` - Rest to restore energy
- `Eat [Food]` - Consume food
- `Drop Everything` - Clear inventory
- `Prioritize [Task]` - Set task priority

### Program Editor UI
- Opens when clicking on a villager
- Shows villager's current program/script
- Command palette on left side
- Program canvas in center
- Drag-and-drop command blocks
- Visual flow from top to bottom
- Command parameter configuration
- Visual connection lines between commands
- Indentation for nested commands (loops, conditions)
- Color coding:
  - Blue: Movement commands
  - Green: Resource gathering
  - Orange: Building/construction
  - Purple: Control flow (loops, conditions)
  - Yellow: Storage/memory
  - Red: Error/invalid commands

### Program Editor Features
- Drag & Drop: Commands from palette to program area
- Command Parameter Selection: Click parameters to configure
- Visual Feedback:
  - Highlight active command during execution
  - Show villager's current step in program
  - Color-code command status (success/failure/waiting)
- Program Validation:
  - Check for syntax errors
  - Warn about infinite loops
  - Suggest optimizations
- Copy/Paste: Duplicate command blocks or entire programs
- Undo/Redo: Program editing history
- Search: Find commands quickly in palette
- Templates: Save/load common programs

### Program Execution
- Villager starts executing from top of program
- Commands execute sequentially
- Loops repeat until condition met
- Conditions branch execution
- If command fails, villager waits or moves to next command
- Programs run continuously while villager is active

### Program Storage
- Each villager has a saved program
- Programs can be:
  - Copied to other villagers
  - Saved as templates
  - Loaded from templates
  - Shared between villagers

---

## Villager System

### Villager Features
- Villager spawning
- Low-poly villager model/placeholder
- Basic villager AI (idle behavior, task assignment)
- Villager interaction (click to select)
- Villager info panel
- Basic task assignment UI
- Villager inventory (separate from player)
- Visual indicators:
  - Selected villager highlight
  - Task progress indicators
  - Program status display
  - Command highlight during execution
  - Program preview
  - Error indicators when stuck/failing

### Villager Automation
- Programmed villagers work automatically
- No need to manually assign tasks
- Players focus on:
  - Designing efficient programs
  - Optimizing resource flows
  - Planning village layout
  - Creating production chains

### Scaling
- Start with 1-2 villagers, simple tasks
- Scale to 10-50+ villagers, complex automation
- Players create "specialist" villagers:
  - Woodcutter (specialized tree program)
  - Farmer (optimized crop cycle)
  - Builder (construction specialist)
  - Hauler (resource transport)
  - Craftsperson (item production)

---

## Environment

### World Objects
- Trees (harvestable, respawn/regrow)
- Foliage
- Stone deposits
- Resource items (wood, stone, etc.)
- Crop plots
- Crops (grow over time)

### Resource System
- Trees spawn on tiles
- Resources drop when trees are chopped
- Visual feedback for interactions
- Resource respawn/regrow behavior

---

## UI Systems

### Required Menus
- **Loading Screen**: Must be functional, not placeholder
- **Main Menu**:
  - Logo display (taskforge_logo.png)
  - Play button
  - Multiplayer button
  - Settings button (placeholder)
  - Quit button
  - Branding color (#6FD6FF) for accents
- **Pause Menu**:
  - ESC key to open/close
  - Resume button
  - Settings button
  - Quit to menu button

### Menu State Management
- Game state machine (Menu, Playing, Paused)
- Scene transitions

### Audio System
- Play `main_menu.mp3` on loop in menu
- Other `.mp3` files shuffle during gameplay
- Audio manager class
- Volume controls (basic)

---

## Multiplayer System

### Room Code System
- Host creates a room → generates a code
- Friend enters code → joins the same world
- Room code display
- Player list

### State Synchronization
- Player positions
- Placed buildings
- Resource changes
- Villager programs (optional)

### Networking
- Node.js + WebSocket server
- Client WebSocket connection
- Join room by code
- Send/receive game state
- Conflict resolution:
  - Handle simultaneous actions
  - Authority system (server-authoritative)
- Connection logging
- State sync verification
- Error handling
- Disconnection handling

---

## Progression System

### Command Unlock System
- Track unlocked commands per player
- Unlock commands through:
  - Tutorial completion
  - Population milestones
  - Building unlocks
  - Research/technology
- Show locked commands in palette (grayed out)

### Starting Commands
- Move To
- Pick Up
- Put Down
- Find Nearest

### Early Unlocks (Tutorial)
- Store
- Repeat Forever
- Basic gathering (Chop, Mine)

### Mid-Game Unlocks
- Farming commands (Plant, Harvest, Water)
- Building commands
- Conditions (If/Else)
- Repeat N Times

### Late-Game Unlocks
- Advanced conditions
- Memory/Variables
- Teach (program sharing)
- Complex control flow

---

## Assets & Branding

### Asset Organization
- `Images/` → `client/public/images/`
- `Sounds/Music/` → `client/public/sounds/music/`
- Use `icon.ico` for Electron app icon
- Use `taskforge_logo.png` for menu branding

### Branding
- Primary color: `#6FD6FF` (RGB 111, 214, 255)
- Gold outlines for emphasis
- Apply to:
  - Buttons
  - Titles
  - Highlights
  - Progress bars
  - Accent elements

### Music System
- `main_menu.mp3` loops in main menu
- Other `.mp3` files shuffle during gameplay
- Audio manager handles playback

---

## Build Requirements

### Required Commands
- `npm install` must work
- `npm run start` launches Electron app
- `npm run build` creates distributable
- Web build should also work (optional)

### Project Structure
```
taskforge-automation/
├── client/                 # Electron + Web client
│   ├── src/
│   │   ├── game/          # Three.js game logic
│   │   ├── ui/            # UI components
│   │   ├── networking/    # WebSocket client
│   │   └── main.js        # Electron main process
│   ├── public/            # Static assets
│   └── package.json
├── server/                 # Node.js WebSocket server
│   ├── src/
│   └── package.json
├── docs/
│   ├── requirements.md    # This file
│   └── progress.md        # Milestone tracking
└── package.json           # Root workspace
```

---

## Success Criteria

✅ Game launches in Electron  
✅ Player can move character via click  
✅ Can place buildings and craft items  
✅ Can program villagers with visual editor  
✅ Multiplayer works with room codes  
✅ All menus functional  
✅ Music plays correctly  
✅ Branding colors applied  
✅ Game remains playable throughout development  
✅ Players can create a working woodcutter program in < 2 minutes  
✅ Programs execute reliably without getting stuck  
✅ System handles 50+ villagers efficiently  
✅ UI is intuitive and fun to use  
✅ Complex automation chains are possible  
✅ Game feels like Autonauts (automation-focused, programming-centric)

---

## Design Principles

1. **Simplicity First**: Commands should be simple and intuitive
2. **Visual Clarity**: Programs should be easy to read and understand
3. **Immediate Feedback**: Players should see results quickly
4. **Scalability**: System should work with 1 villager or 100
5. **Reusability**: Programs should be easy to copy and modify
6. **Progressive Complexity**: Start simple, unlock advanced features
7. **Failure Handling**: Programs should handle failures gracefully
8. **Performance**: Program execution should be efficient

---

## Example Programs

### Basic Woodcutter
```
Repeat Forever:
  Find Nearest Tree
  Move To Tree
  Chop Tree
  Pick Up Wood
  If Inventory Full Then:
    Find Nearest Storage
    Move To Storage
    Store Wood
```

### Farmer (Wheat Cycle)
```
Repeat Forever:
  Find Nearest Empty Crop Plot
  Move To Crop Plot
  Plant Wheat
  Wait 10 Seconds
  Find Nearest Wheat Crop
  Move To Wheat Crop
  Harvest Wheat
  Pick Up Wheat
  Find Nearest Storage
  Move To Storage
  Store Wheat
```

### Builder (With Material Check)
```
Repeat Forever:
  If Has Construction Materials Then:
    Find Nearest Incomplete Building
    Move To Building
    Build Building
  Else:
    Find Nearest Storage
    Take Construction Materials
```


