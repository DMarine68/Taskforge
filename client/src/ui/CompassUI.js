import * as THREE from 'three';

export class CompassUI {
  constructor(container, camera) {
    this.container = container;
    this.camera = camera;
    this.element = null;
    this.arrow = null;
    this.create();
  }

  create() {
    this.element = document.createElement('div');
    this.element.id = 'compass-ui';
    
    // Create simple circular compass
    this.element.innerHTML = `
      <div class="compass-circle">
        <div class="compass-label compass-n">N</div>
        <div class="compass-label compass-e">E</div>
        <div class="compass-label compass-s">S</div>
        <div class="compass-label compass-w">W</div>
        <div class="compass-arrow" id="compass-arrow"></div>
      </div>
    `;
    
    // Get reference to arrow
    this.arrow = this.element.querySelector('#compass-arrow');

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #compass-ui {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1000;
        width: 120px;
        height: 120px;
      }

      .compass-circle {
        position: relative;
        width: 120px;
        height: 120px;
        border: 3px solid #ffffff;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.7);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
      }

      .compass-label {
        position: absolute;
        color: #ffffff;
        font-size: 18px;
        font-weight: bold;
        font-family: Arial, sans-serif;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
      }

      .compass-n {
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
      }

      .compass-e {
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
      }

      .compass-s {
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
      }

      .compass-w {
        top: 50%;
        left: 8px;
        transform: translateY(-50%);
      }

      .compass-arrow {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        transform-origin: center center;
        transform: translate(-50%, -50%) rotate(0deg);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 50px solid #FFB6C1;
        filter: drop-shadow(0 0 3px rgba(255, 182, 193, 0.8));
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    if (!this.container.contains(this.element)) {
      this.container.appendChild(this.element);
    }
  }

  update() {
    if (!this.camera || !this.arrow) return;

    // Calculate camera heading (direction it's facing on XZ plane)
    // Get the camera's forward direction (in Three.js, forward is -Z in local space)
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(this.camera.quaternion);
    
    // Project onto XZ plane (ignore Y component for horizontal heading)
    const forwardXZ = new THREE.Vector3(forward.x, 0, forward.z);
    const length = Math.sqrt(forwardXZ.x * forwardXZ.x + forwardXZ.z * forwardXZ.z);
    if (length > 0) {
      forwardXZ.divideScalar(length);
    } else {
      // Fallback if length is 0
      forwardXZ.set(0, 0, 1);
    }
    
    // Calculate angle from north (positive Z direction)
    // In Three.js world space: North = +Z, East = +X, South = -Z, West = -X
    // atan2(x, z) gives angle: 0 = north (+Z), PI/2 = east (+X), PI = south (-Z), -PI/2 = west (-X)
    let angle = Math.atan2(forwardXZ.x, forwardXZ.z);
    
    // Convert to degrees (0-360)
    let degrees = (angle * 180 / Math.PI);
    if (degrees < 0) degrees += 360;
    
    // Rotate the arrow to point in the camera's direction
    // The arrow points up (north) at 0 degrees, so we rotate it by the camera heading
    this.arrow.style.transform = `translate(-50%, -50%) rotate(${degrees}deg)`;
  }
}
