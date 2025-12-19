import { BlueprintManager } from './BlueprintManager.js';

export class CraftingSystem {
  constructor() {
    this.blueprintManager = new BlueprintManager();
  }

  craft(blueprintId, inventory) {
    const blueprint = this.blueprintManager.getBlueprint(blueprintId);
    if (!blueprint) return false;

    return blueprint.craft(inventory);
  }

  getAvailableBlueprints(inventory) {
    return this.blueprintManager.getAllBlueprints().filter(bp => {
      return bp.unlocked && bp.canCraft(inventory);
    });
  }

  getBlueprintManager() {
    return this.blueprintManager;
  }
}


