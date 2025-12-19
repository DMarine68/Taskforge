// Character controller for smooth movement and animation
// This will be used by both Player and Villagers

export class CharacterController {
  constructor(character, speed = 2.0) {
    this.character = character;
    this.speed = speed;
    this.path = [];
    this.currentPathIndex = 0;
    this.isMoving = false;
  }

  setPath(path) {
    this.path = path;
    this.currentPathIndex = 0;
    this.isMoving = path.length > 0;
  }

  update(deltaTime) {
    if (!this.isMoving || this.path.length === 0) {
      return;
    }

    const targetTile = this.path[this.currentPathIndex];
    if (!targetTile) {
      this.isMoving = false;
      return;
    }

    const targetX = targetTile.worldX;
    const targetZ = targetTile.worldZ;
    const currentX = this.character.mesh.position.x;
    const currentZ = this.character.mesh.position.z;

    const dx = targetX - currentX;
    const dz = targetZ - currentZ;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 0.1) {
      // Reached waypoint
      this.character.mesh.position.x = targetX;
      this.character.mesh.position.z = targetZ;
      this.currentPathIndex++;
      
      if (this.currentPathIndex >= this.path.length) {
        this.isMoving = false;
        this.path = [];
        this.currentPathIndex = 0;
      }
    } else {
      // Move towards waypoint
      const moveDistance = this.speed * deltaTime;
      if (moveDistance >= distance) {
        this.character.mesh.position.x = targetX;
        this.character.mesh.position.z = targetZ;
        this.currentPathIndex++;
        
        if (this.currentPathIndex >= this.path.length) {
          this.isMoving = false;
          this.path = [];
          this.currentPathIndex = 0;
        }
      } else {
        this.character.mesh.position.x += (dx / distance) * moveDistance;
        this.character.mesh.position.z += (dz / distance) * moveDistance;
      }

      // Rotate to face movement direction
      if (distance > 0.01) {
        const angle = Math.atan2(dx, dz);
        this.character.mesh.rotation.y = angle;
      }
    }
  }

  stop() {
    this.isMoving = false;
    this.path = [];
    this.currentPathIndex = 0;
  }
}


