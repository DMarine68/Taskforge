export class Command {
  constructor(type, parameters = {}) {
    this.type = type;
    this.parameters = parameters;
    this.state = 'pending'; // pending, executing, success, failed
    this.duration = 0;
    this.elapsedTime = 0;
  }

  canExecute(villager) {
    return this.state === 'pending' || this.state === 'failed';
  }

  execute(villager) {
    this.state = 'executing';
    this.elapsedTime = 0;
  }

  update(deltaTime, villager) {
    this.elapsedTime += deltaTime;
    if (this.elapsedTime >= this.duration) {
      this.onComplete(villager);
    }
  }

  onComplete(villager) {
    this.state = 'success';
  }

  onFailure(villager) {
    this.state = 'failed';
  }

  reset() {
    this.state = 'pending';
    this.elapsedTime = 0;
  }
}


