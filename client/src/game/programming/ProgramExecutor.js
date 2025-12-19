import { Command } from './Command.js';
import { commands } from './commands/index.js';

export class ProgramExecutor {
  constructor(villager) {
    this.villager = villager;
    this.program = null;
    this.currentNodeIndex = 0;
    this.currentCommand = null;
    this.isRunning = false;
  }

  setProgram(program) {
    this.program = program;
    this.currentNodeIndex = 0;
    this.isRunning = false;
  }

  start() {
    if (!this.program || this.program.nodes.length === 0) return;
    this.isRunning = true;
    this.currentNodeIndex = 0;
    this.executeNext();
  }

  stop() {
    this.isRunning = false;
    if (this.currentCommand) {
      this.currentCommand.reset();
    }
    this.currentCommand = null;
  }

  executeNext() {
    if (!this.isRunning || !this.program) return;

    if (this.currentNodeIndex >= this.program.nodes.length) {
      // Loop back to start for repeat forever
      this.currentNodeIndex = 0;
    }

    const node = this.program.nodes[this.currentNodeIndex];
    if (!node) {
      this.stop();
      return;
    }

    const CommandClass = commands[node.type];
    if (!CommandClass) {
      console.warn(`Unknown command type: ${node.type}`);
      this.currentNodeIndex++;
      setTimeout(() => this.executeNext(), 0);
      return;
    }

    this.currentCommand = new CommandClass(node.parameters || {});
    if (this.currentCommand.canExecute(this.villager)) {
      this.currentCommand.execute(this.villager);
    } else {
      this.currentCommand.onFailure(this.villager);
      this.currentNodeIndex++;
      setTimeout(() => this.executeNext(), 0);
    }
  }

  update(deltaTime) {
    if (!this.isRunning || !this.currentCommand) return;

    this.currentCommand.update(deltaTime, this.villager);

    if (this.currentCommand.state === 'success') {
      this.currentNodeIndex++;
      this.currentCommand = null;
      setTimeout(() => this.executeNext(), 0);
    } else if (this.currentCommand.state === 'failed') {
      this.currentNodeIndex++;
      this.currentCommand = null;
      setTimeout(() => this.executeNext(), 0);
    }
  }
}

