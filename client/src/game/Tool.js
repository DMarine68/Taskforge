export class Tool {
  constructor(type, durability = 100) {
    this.type = type;
    this.durability = durability;
    this.maxDurability = durability;
  }

  use(amount = 1) {
    this.durability -= amount;
    return this.durability > 0;
  }

  repair(amount) {
    this.durability = Math.min(this.maxDurability, this.durability + amount);
  }

  isBroken() {
    return this.durability <= 0;
  }
}


