export class Program {
  constructor() {
    this.nodes = [];
    this.name = 'Untitled Program';
  }

  addNode(node) {
    this.nodes.push(node);
  }

  removeNode(node) {
    const index = this.nodes.indexOf(node);
    if (index > -1) {
      this.nodes.splice(index, 1);
    }
  }

  serialize() {
    return JSON.stringify({
      name: this.name,
      nodes: this.nodes.map(node => ({
        type: node.type,
        parameters: node.parameters
      }))
    });
  }

  static deserialize(data) {
    const program = new Program();
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    program.name = parsed.name || 'Untitled Program';
    // Reconstruct nodes (simplified)
    return program;
  }
}


