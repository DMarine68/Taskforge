export class Blueprint {
  constructor(id, name, description, requirements, result, unlocked = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.requirements = requirements; // { itemType: count }
    this.result = result; // { type: itemType, count: number }
    this.unlocked = unlocked;
  }

  canCraft(inventory) {
    if (!this.unlocked) return false;
    
    // Bypass requirements in admin mode
    if (window.adminMode) return true;
    
    for (const [itemType, count] of Object.entries(this.requirements)) {
      if (!inventory.hasItem(itemType, count)) {
        return false;
      }
    }
    return true;
  }

  craft(inventory) {
    if (!this.canCraft(inventory)) return false;

    // Remove requirements (unless admin mode is enabled)
    if (!window.adminMode) {
      for (const [itemType, count] of Object.entries(this.requirements)) {
        inventory.removeItem(itemType, count);
      }
    }

    // Add result
    inventory.addItem(this.result.type, this.result.count);
    return true;
  }
}

