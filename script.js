// --- 1. Setup the Scene ---
const scene = new THREE.Scene();

// Camera (Field of View, Aspect Ratio, Near Clip, Far Clip)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Move the camera back so we can see the object

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- 2. Create the 3D Object (Cube) ---
// Geometry: Defines the shape (a box)
const geometry = new THREE.BoxGeometry(1, 1, 1); // 1x1x1 unit cube

// Material: Defines the appearance (color, shininess, texture, etc.)
// MeshLambertMaterial requires a light source to be visible.
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 }); // Bright green color

// Mesh: Combines geometry and material
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// --- 3. Add Lighting ---
// Smart mirrors are often viewed in low light, so lighting is critical.
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light from all directions
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White directional light
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// --- 4. Animation Loop (The Core of 3D) ---
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube on the X and Y axes
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    // Render the scene from the perspective of the camera
    renderer.render(scene, camera);
}

// --- 5. Handle Resizing (Good practice for smart mirror displays) ---
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the animation
animate();
