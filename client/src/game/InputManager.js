import * as THREE from 'three';

export class InputManager {
  constructor(camera, renderer, player, tileGrid) {
    this.camera = camera;
    this.renderer = renderer;
    this.player = player;
    this.tileGrid = tileGrid;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.renderer.domElement.addEventListener('click', (e) => this.onClick(e), false);
    this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
  }

  onMouseMove(event) {
    // Update mouse position for raycasting
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onClick(event) {
    // Raycast to find click position
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Create a plane at y=0 to intersect with
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, intersectionPoint);

    // Move player to clicked position
    if (this.player) {
      this.player.moveTo(intersectionPoint.x, intersectionPoint.z);
    }
  }

  getMouseWorldPosition() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, intersectionPoint);
    return intersectionPoint;
  }
}


