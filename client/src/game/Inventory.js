export class Inventory {
  constructor(maxSize = 20) {
    this.items = new Map(); // itemType -> count
    this.maxSize = maxSize;
    this.currentSize = 0;
  }

  addItem(itemType, count = 1) {
    const currentCount = this.items.get(itemType) || 0;
    const newCount = currentCount + count;
    
    if (this.currentSize + count <= this.maxSize) {
      this.items.set(itemType, newCount);
      this.currentSize += count;
      return true;
    }
    return false; // Inventory full
  }

  removeItem(itemType, count = 1) {
    const currentCount = this.items.get(itemType) || 0;
    if (currentCount >= count) {
      const newCount = currentCount - count;
      if (newCount === 0) {
        this.items.delete(itemType);
      } else {
        this.items.set(itemType, newCount);
      }
      this.currentSize -= count;
      return true;
    }
    return false; // Not enough items
  }

  hasItem(itemType, count = 1) {
    const currentCount = this.items.get(itemType) || 0;
    return currentCount >= count;
  }

  getItemCount(itemType) {
    return this.items.get(itemType) || 0;
  }

  isFull() {
    return this.currentSize >= this.maxSize;
  }

  isEmpty() {
    return this.currentSize === 0;
  }

  getAllItems() {
    return Array.from(this.items.entries()).map(([type, count]) => ({ type, count }));
  }

  clear() {
    this.items.clear();
    this.currentSize = 0;
  }
}


