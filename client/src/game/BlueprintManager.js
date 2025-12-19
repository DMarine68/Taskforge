import { Blueprint } from './Blueprint.js';

export class BlueprintManager {
  constructor() {
    this.blueprints = new Map();
    this.initializeBlueprints();
  }

  initializeBlueprints() {
    // Starting blueprints (unlocked by default)
    this.addBlueprint(new Blueprint(
      'axe',
      'Axe',
      'Tool for chopping trees',
      { wood: 5, stone: 2 },
      { type: 'axe', count: 1 },
      true
    ));

    this.addBlueprint(new Blueprint(
      'pickaxe',
      'Pickaxe',
      'Tool for mining stone',
      { wood: 3, stone: 5 },
      { type: 'pickaxe', count: 1 },
      false
    ));

    // More blueprints can be added here
  }

  addBlueprint(blueprint) {
    this.blueprints.set(blueprint.id, blueprint);
  }

  getBlueprint(id) {
    return this.blueprints.get(id);
  }

  getAllBlueprints() {
    return Array.from(this.blueprints.values());
  }

  unlockBlueprint(id) {
    const blueprint = this.blueprints.get(id);
    if (blueprint) {
      blueprint.unlocked = true;
    }
  }

  isUnlocked(id) {
    const blueprint = this.blueprints.get(id);
    return blueprint ? blueprint.unlocked : false;
  }
}


