/**
 * Professional 3D Portfolio Enhancer
 * Creates floating geometric shapes, particle effects, and 3D image transformations
 */

class Portfolio3DEnhancer {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.animationId = null;
    
    // 3D objects
    this.shapes = [];
    this.particles = [];
    this.lights = [];
    
    // Mouse tracking
    this.mouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    
    // Configuration
    this.config = {
      shapeCount: window.innerWidth < 768 ? 8 : 15,
      particleCount: window.innerWidth < 768 ? 50 : 100,
      colors: {
        primary: 0x2c3e50,    // Dark blue-gray
        secondary: 0x34495e,  // Darker blue-gray
        accent: 0x3498db,     // Professional blue
        metal: 0x7f8c8d,      // Metallic gray
        highlight: 0x95a5a6,  // Light gray
        gold: 0xf39c12,       // Gold accent
        orange: 0xe67e22      // Orange accent
      }
    };
    
    this.init();
  }
  
  async init() {
    try {
      console.log('Initializing 3D Portfolio Enhancer...');
      
      // Load Three.js
      await this.loadThreeJS();
      
      // Wait a bit for Three.js to be fully available
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create 3D scene
      this.createScene();
      this.createCamera();
      this.createRenderer();
      this.createLighting();
      
      // Add 3D objects
      this.createShapes();
      this.createParticles();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Add 3D effects to images
      this.enhance3DImages();
      
      // Start animation loop
      this.animate();
      
      console.log('3D Portfolio Enhancer initialized successfully!');
    } catch (error) {
      console.error('3D Enhancement failed:', error);
      // Fallback: Add basic CSS 3D effects
      this.addFallback3DEffects();
    }
  }
  
  async loadThreeJS() {
    if (typeof THREE !== 'undefined') {
      console.log('Three.js already loaded');
      return;
    }
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        console.log('Three.js loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Three.js');
        reject(new Error('Failed to load Three.js'));
      };
      document.head.appendChild(script);
    });
  }
  
  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent
  }
  
  createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 15);
  }
  
  createRenderer() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = '3d-enhancement-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
      opacity: 0.9;
    `;
    
    document.body.appendChild(this.canvas);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  
  createLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    // Accent lights with colors from your images
    const pointLight1 = new THREE.PointLight(this.config.colors.accent, 0.6, 50);
    pointLight1.position.set(-15, 10, 10);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(this.config.colors.gold, 0.4, 30);
    pointLight2.position.set(15, -10, 5);
    this.scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(this.config.colors.orange, 0.3, 25);
    pointLight3.position.set(0, 15, -10);
    this.scene.add(pointLight3);
  }
  
  createShapes() {
    const geometries = [
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      new THREE.TetrahedronGeometry(1.2),
      new THREE.OctahedronGeometry(1),
      new THREE.IcosahedronGeometry(0.8),
      new THREE.ConeGeometry(0.8, 1.6, 6),
      new THREE.CylinderGeometry(0.5, 0.8, 1.2, 8)
    ];
    
    const materials = [
      new THREE.MeshPhongMaterial({ 
        color: this.config.colors.primary,
        transparent: true,
        opacity: 0.8,
        shininess: 100
      }),
      new THREE.MeshLambertMaterial({ 
        color: this.config.colors.secondary,
        transparent: true,
        opacity: 0.7
      }),
      new THREE.MeshPhongMaterial({ 
        color: this.config.colors.metal,
        transparent: true,
        opacity: 0.9,
        shininess: 150
      }),
      new THREE.MeshPhongMaterial({ 
        color: this.config.colors.gold,
        transparent: true,
        opacity: 0.6,
        shininess: 200
      }),
      new THREE.MeshPhongMaterial({ 
        color: this.config.colors.orange,
        transparent: true,
        opacity: 0.7,
        shininess: 120
      })
    ];
    
    for (let i = 0; i < this.config.shapeCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const shape = new THREE.Mesh(geometry, material);
      
      // Random positioning
      shape.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 25
      );
      
      // Random rotation
      shape.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Random scale
      const scale = 0.8 + Math.random() * 1.2;
      shape.scale.set(scale, scale, scale);
      
      // Animation properties
      shape.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.03,
          y: (Math.random() - 0.5) * 0.03,
          z: (Math.random() - 0.5) * 0.03
        },
        floatSpeed: 0.002 + Math.random() * 0.003,
        floatRange: 3 + Math.random() * 4,
        initialY: shape.position.y,
        driftSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        }
      };
      
      shape.castShadow = true;
      shape.receiveShadow = true;
      
      this.scene.add(shape);
      this.shapes.push(shape);
    }
  }
  
  createParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = this.config.particleCount;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    const colorOptions = [
      this.config.colors.primary,
      this.config.colors.accent,
      this.config.colors.gold,
      this.config.colors.orange,
      this.config.colors.highlight
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Positions
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      
      // Colors
      color.setHex(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Sizes
      sizes[i] = Math.random() * 3 + 1;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 3,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.userData = {
      velocity: new Float32Array(particleCount * 3),
      originalPositions: positions.slice()
    };
    
    // Initialize velocities
    for (let i = 0; i < particleCount; i++) {
      particles.userData.velocity[i * 3] = (Math.random() - 0.5) * 0.03;
      particles.userData.velocity[i * 3 + 1] = (Math.random() - 0.5) * 0.03;
      particles.userData.velocity[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
    }
    
    this.scene.add(particles);
    this.particles.push(particles);
  }
  
  enhance3DImages() {
    // Add 3D effects to profile images
    const profileImages = document.querySelectorAll('.profile-img, .about__pic');
    
    profileImages.forEach((img, index) => {
      // Add CSS 3D transforms
      img.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      img.style.transformStyle = 'preserve-3d';
      
      // Add hover effects
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'perspective(1000px) rotateY(15deg) rotateX(5deg) translateZ(20px) scale(1.05)';
        img.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(52, 152, 219, 0.3)';
        img.style.filter = 'brightness(1.1) contrast(1.1)';
      });
      
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
        img.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        img.style.filter = 'brightness(1) contrast(1)';
      });
      
      // Add subtle floating animation
      img.style.animation = `float3D ${3 + index * 0.5}s ease-in-out infinite`;
    });
    
    // Add floating animation keyframes
    if (!document.getElementById('3d-animations')) {
      const style = document.createElement('style');
      style.id = '3d-animations';
      style.textContent = `
        @keyframes float3D {
          0%, 100% { 
            transform: perspective(1000px) translateY(0px) rotateY(0deg); 
          }
          50% { 
            transform: perspective(1000px) translateY(-10px) rotateY(2deg); 
          }
        }
        
        @keyframes pulse3D {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(52, 152, 219, 0.6);
          }
        }
        
        .skill-box {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        
        .skill-box:hover {
          transform: perspective(1000px) rotateX(10deg) rotateY(10deg) translateZ(20px) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
        }
        
        .projects__item {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        
        .projects__item:hover {
          transform: perspective(1000px) rotateX(5deg) translateZ(15px) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  setupEventListeners() {
    // Mouse movement for interactive camera
    document.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      this.targetRotation.x = this.mouse.y * 0.05;
      this.targetRotation.y = this.mouse.x * 0.05;
    });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }
  
  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }
  
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const time = performance.now() * 0.001;
    
    // Animate shapes
    this.shapes.forEach((shape, index) => {
      const userData = shape.userData;
      
      // Rotation
      shape.rotation.x += userData.rotationSpeed.x;
      shape.rotation.y += userData.rotationSpeed.y;
      shape.rotation.z += userData.rotationSpeed.z;
      
      // Floating motion
      shape.position.y = userData.initialY + Math.sin(time * userData.floatSpeed + index) * userData.floatRange;
      
      // Subtle drifting
      shape.position.x += userData.driftSpeed.x;
      shape.position.z += userData.driftSpeed.z;
      
      // Boundary wrapping
      if (shape.position.x > 30) shape.position.x = -30;
      if (shape.position.x < -30) shape.position.x = 30;
      if (shape.position.z > 20) shape.position.z = -20;
      if (shape.position.z < -20) shape.position.z = 20;
    });
    
    // Animate particles
    this.particles.forEach(particleSystem => {
      const positions = particleSystem.geometry.attributes.position.array;
      const velocity = particleSystem.userData.velocity;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Apply velocity
        positions[i] += velocity[i];
        positions[i + 1] += velocity[i + 1];
        positions[i + 2] += velocity[i + 2];
        
        // Boundary checking with smooth wrapping
        if (positions[i] > 30) positions[i] = -30;
        if (positions[i] < -30) positions[i] = 30;
        if (positions[i + 1] > 30) positions[i + 1] = -30;
        if (positions[i + 1] < -30) positions[i + 1] = 30;
        if (positions[i + 2] > 20) positions[i + 2] = -20;
        if (positions[i + 2] < -20) positions[i + 2] = 20;
        
        // Add wave motion
        positions[i + 1] += Math.sin(time * 0.5 + positions[i] * 0.1) * 0.05;
      }
      
      particleSystem.geometry.attributes.position.needsUpdate = true;
    });
    
    // Smooth camera movement
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;
    
    this.camera.rotation.x = this.currentRotation.x;
    this.camera.rotation.y = this.currentRotation.y;
    
    // Subtle camera floating
    this.camera.position.y = Math.sin(time * 0.3) * 0.8;
    this.camera.position.x = Math.cos(time * 0.2) * 0.5;
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
  
  addFallback3DEffects() {
    console.log('Adding fallback 3D effects...');
    
    // Add CSS-only 3D effects as fallback
    const style = document.createElement('style');
    style.textContent = `
      body {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%);
        background-attachment: fixed;
      }
      
      .profile-img, .about__pic {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform-style: preserve-3d;
      }
      
      .profile-img:hover, .about__pic:hover {
        transform: perspective(1000px) rotateY(15deg) rotateX(5deg) translateZ(20px) scale(1.05);
        box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(52, 152, 219, 0.3);
        filter: brightness(1.1) contrast(1.1);
      }
      
      .skill-box:hover {
        transform: perspective(1000px) rotateX(10deg) rotateY(10deg) translateZ(20px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      }
      
      .projects__item:hover {
        transform: perspective(1000px) rotateX(5deg) translateZ(15px);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Public methods
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
  
  setOpacity(opacity) {
    if (this.canvas) {
      this.canvas.style.opacity = opacity;
    }
  }
}

// Initialize when DOM is ready
let portfolio3D = null;

function init3DEnhancement() {
  console.log('Starting 3D enhancement initialization...');
  
  // Always try to load 3D enhancement
  portfolio3D = new Portfolio3DEnhancer();
  
  // Expose global controls
  window.Portfolio3D = {
    destroy: () => {
      if (portfolio3D) {
        portfolio3D.destroy();
        portfolio3D = null;
      }
    },
    setOpacity: (opacity) => portfolio3D?.setOpacity(opacity)
  };
}

// Initialize immediately or when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init3DEnhancement);
} else {
  // Small delay to ensure everything is loaded
  setTimeout(init3DEnhancement, 100);
}

// Page visibility API for performance
document.addEventListener('visibilitychange', () => {
  if (portfolio3D && portfolio3D.animationId) {
    if (document.hidden) {
      cancelAnimationFrame(portfolio3D.animationId);
      portfolio3D.animationId = null;
    } else if (!portfolio3D.animationId) {
      portfolio3D.animate();
    }
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Portfolio3DEnhancer;
}