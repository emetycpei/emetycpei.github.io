// --- 1. Setup the Scene ---
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7; // Adjust camera position to see the mirror better

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x222222); // Dark grey background for better contrast

// --- 2. Add Lighting ---
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Brighter ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5).normalize();
scene.add(directionalLight);

// Add a point light to cast more interesting reflections
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(-5, 5, 5);
scene.add(pointLight);

// --- 3. Create a reflective environment for the mirror ---
// Without an environment, the mirror would reflect nothing.
// Let's create a simple skybox (cube with textures)
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('https://threejs.org/examples/textures/cube/Bridge2/'); // Example skybox textures from Three.js examples

const reflectionCube = cubeTextureLoader.load([
    'posx.jpg', 'negx.jpg',
    'posy.jpg', 'negy.jpg',
    'posz.jpg', 'negz.jpg'
]);

scene.background = reflectionCube; // Use the skybox as the scene background for reflections

// --- 4. Create the 3D Mirror Object ---
// Geometry: A simple flat plane for the mirror surface
const mirrorGeometry = new THREE.PlaneGeometry(5, 8); // A rectangle, good for a mirror

// Material: MeshStandardMaterial is excellent for reflective surfaces.
// It requires an environment map.
const mirrorMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc, // Base color (can be overridden by reflection)
    roughness: 0.05, // Lower roughness means shinier/more reflective
    metalness: 0.95, // Higher metalness makes it look more like metal/mirror
    envMap: reflectionCube // The critical part: tells the material what to reflect
});

const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
scene.add(mirror);

// Let's add a frame to the mirror for better visualization
const frameGeometry = new THREE.BoxGeometry(5.2, 8.2, 0.2); // Slightly larger than the mirror
const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8, metalness: 0.1 }); // Brown, less reflective
const frame = new THREE.Mesh(frameGeometry, frameMaterial);
frame.position.z = -0.11; // Place it slightly behind the mirror plane
scene.add(frame);


// --- 5. Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Optional: Rotate the mirror slightly to show off reflections
    mirror.rotation.y += 0.003;
    frame.rotation.y += 0.003;


    // Render the scene
    renderer.render(scene, camera);
}

// --- 6. Handle Resizing ---
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the animation
animate();
