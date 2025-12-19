export class StorageInventory {
  constructor(maxCapacity = 16) {
    this.maxCapacity = maxCapacity;
    this.storedItemType = null; // Only one type can be stored
    this.count = 0;
  }

  addItem(itemType, count = 1) {
    // If empty, can store any type
    if (this.storedItemType === null) {
      if (count <= this.maxCapacity) {
        this.storedItemType = itemType;
        this.count = count;
        return true;
      }
      return false; // Exceeds capacity
    }
    
    // If already storing this type, can add more up to capacity
    if (this.storedItemType === itemType) {
      if (this.count + count <= this.maxCapacity) {
        this.count += count;
        return true;
      }
      return false; // Would exceed capacity
    }
    
    // Different item type - cannot store
    return false;
  }

  removeItem(itemType, count = 1) {
    if (this.storedItemType !== itemType || this.count < count) {
      return false;
    }
    
    this.count -= count;
    if (this.count === 0) {
      this.storedItemType = null;
    }
    return true;
  }

  hasItem(itemType, count = 1) {
    return this.storedItemType === itemType && this.count >= count;
  }

  getItemCount(itemType) {
    if (this.storedItemType === itemType) {
      return this.count;
    }
    return 0;
  }

  getStoredItemType() {
    return this.storedItemType;
  }

  isFull() {
    return this.count >= this.maxCapacity;
  }

  isEmpty() {
    return this.count === 0;
  }

  getAllItems() {
    if (this.storedItemType) {
      return [{ type: this.storedItemType, count: this.count }];
    }
    return [];
  }

  clear() {
    this.storedItemType = null;
    this.count = 0;
  }
}

