import { Command } from '../Command.js';

export class MoveToCommand extends Command {
  constructor(parameters) {
    super('moveTo', parameters);
    this.duration = 0; // Instant
  }

  execute(villager) {
    super.execute(villager);
    const target = this.parameters.target;
    if (villager.moveTo(target.x, target.z)) {
      this.state = 'success';
    } else {
      this.onFailure(villager);
    }
  }
}

export class PickUpCommand extends Command {
  constructor(parameters) {
    super('pickUp', parameters);
    this.duration = 1.0; // 1 second
  }

  execute(villager) {
    super.execute(villager);
    // Simplified - would need to find nearby items
    this.state = 'success';
  }
}

export const commands = {
  'moveTo': MoveToCommand,
  'pickUp': PickUpCommand
};


