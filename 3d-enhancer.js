class Portfolio3DEnhancer {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.animationId = null;

    this.shapes = [];
    this.particles = [];

    this.mouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };

    this.config = {
      shapeCount: 55, // more shapes
      particleCount: 900, // more stars
      spawnRange: { x: 140, y: 120, z: 170 }, // closer range
      colors: {
        star: 0x000000,
        glow1: 0xff0000,
        glow2: 0x00ffcc,
        glow3: 0x0000ff,
        glow4: 0xff00ff,
        glow5: 0xffff00
      }
    };

    this.init();
  }

  async init() {
    await this.loadThreeJS();
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createLighting();
    this.createShapes();
    this.createWorlds();
    this.createParticles();
    this.setupEventListeners();
    this.enhance3DImages();
    this.animate();
  }

  async loadThreeJS() {
    if (typeof THREE !== "undefined") return;
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Three.js"));
      document.head.appendChild(script);
    });
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0); // gray bg
  }

  createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(70, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 80); // closer view
  }

  createRenderer() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "3d-enhancement-canvas";
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
    `;
    document.body.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  createLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 400);
    pointLight.position.set(0, 50, 100);
    this.scene.add(pointLight);
  }

  createShapes() {
    const geometries = [
      new THREE.TorusGeometry(2, 0.6, 16, 60),
      new THREE.TorusKnotGeometry(1.5, 0.5, 200, 30),
      new THREE.ConeGeometry(2, 4, 16),
      new THREE.DodecahedronGeometry(2),
      new THREE.BoxGeometry(2, 2, 2)
    ];

    for (let i = 0; i < this.config.shapeCount; i++) {
      const geometry =
        geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshPhongMaterial({
        color: Object.values(this.config.colors)[
          Math.floor(Math.random() * 5)
        ],
        emissive: 0x222222,
        shininess: 150
      });
      const shape = new THREE.Mesh(geometry, material);

      shape.position.set(
        (Math.random() - 0.5) * this.config.spawnRange.x,
        (Math.random() - 0.5) * this.config.spawnRange.y,
        (Math.random() - 0.5) * this.config.spawnRange.z
      );

      shape.userData = {
        floatSpeed: 0.5 + Math.random() * 1,
        floatRange: 6 + Math.random() * 5,
        initialY: shape.position.y,
        driftX: (Math.random() - 0.5) * 0.03,
        driftZ: (Math.random() - 0.5) * 0.03
      };

      this.scene.add(shape);
      this.shapes.push(shape);
    }
  }

  createWorlds() {
    const loader = new THREE.TextureLoader();
    const textures = [
      "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
      "https://threejs.org/examples/textures/planets/mars_1024.jpg",
      "https://threejs.org/examples/textures/planets/jupiter2_1024.jpg",
      "https://threejs.org/examples/textures/planets/venus.jpg"
    ];

    textures.forEach(texUrl => {
      loader.load(texUrl, texture => {
        const material = new THREE.MeshStandardMaterial({ map: texture });
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(5, 32, 32),
          material
        );
        sphere.position.set(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 120
        );

        sphere.userData = {
          floatSpeed: 0.2 + Math.random() * 0.5,
          floatRange: 12 + Math.random() * 6,
          initialY: sphere.position.y,
          driftX: (Math.random() - 0.5) * 0.02,
          driftZ: (Math.random() - 0.5) * 0.02
        };

        this.scene.add(sphere);
        this.shapes.push(sphere);
      });
    });
  }

  createParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = this.config.particleCount;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color = new THREE.Color();
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

      color.setHex(this.config.colors.star);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(particles);
    this.particles.push(particles);
  }

  enhance3DImages() {
    const style = document.createElement("style");
    style.id = "3d-enhancements";
    style.textContent = `
      @keyframes float3D {
        0%, 100% { transform: translateY(0px) rotateY(0deg); }
        50% { transform: translateY(-15px) rotateY(5deg); }
      }

      .profile-img, .about__pic {
        transition: all 0.5s ease;
        animation: float3D 6s ease-in-out infinite;
      }

      .skill-box, .projects__item {
        transition: all 0.4s ease;
      }

      .profile-img:hover, .about__pic:hover,
      .skill-box:hover, .projects__item:hover {
        transform: perspective(1000px) rotateY(15deg) rotateX(10deg) translateZ(20px) scale(1.05);
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }
    `;
    document.head.appendChild(style);
  }

  setupEventListeners() {
    document.addEventListener("mousemove", e => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.targetRotation.x = this.mouse.y * 0.05;
      this.targetRotation.y = this.mouse.x * 0.05;
    });

    window.addEventListener("resize", () => this.handleResize());
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

    this.shapes.forEach(shape => {
      shape.rotation.x += 0.003;
      shape.rotation.y += 0.004;

      if (shape.userData) {
        shape.position.y =
          shape.userData.initialY +
          Math.sin(time * shape.userData.floatSpeed) * shape.userData.floatRange;
        shape.position.x += shape.userData.driftX;
        shape.position.z += shape.userData.driftZ;
      }
    });

    this.camera.rotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
    this.camera.rotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;

    this.renderer.render(this.scene, this.camera);
  }
}

let portfolio3D = null;
function init3DEnhancement() {
  portfolio3D = new Portfolio3DEnhancer();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init3DEnhancement);
} else {
  setTimeout(init3DEnhancement, 100);
}


