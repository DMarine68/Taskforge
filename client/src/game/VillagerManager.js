import { Villager } from './Villager.js';

export class VillagerManager {
  constructor(scene, tileGrid) {
    this.scene = scene;
    this.tileGrid = tileGrid;
    this.villagers = [];
  }

  spawnVillager(tileX, tileZ) {
    const villager = new Villager(this.scene, this.tileGrid, tileX, tileZ);
    this.villagers.push(villager);
    return villager;
  }

  getVillagers() {
    return this.villagers;
  }

  update(deltaTime) {
    this.villagers.forEach(villager => {
      villager.update(deltaTime);
    });
  }
}

