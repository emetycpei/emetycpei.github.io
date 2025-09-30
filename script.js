// --- 1. Setup the Scene ---
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3.5; // Slightly further back to see the environment better

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x333333); 

// --- 2. Add Lighting (Ensuring good visibility for reflection) ---
// Increased intensity to force the mirror to reflect brightly
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(0, 5, 5).normalize();
scene.add(directionalLight);

// --- 3. Create the Environment Map (Using .jpeg extension) ---
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('./textures/'); 

const environmentMap = cubeTextureLoader.load([
    // UPDATED TO .jpeg EXTENSION
    'posx.jpeg', 'negx.jpeg', 
    'posy.jpeg', 'negy.jpeg', 
    'posz.jpeg', 'negz.jpeg'  
], (texture) => {
    // SUCCESS: Sets the background once ALL 6 textures are loaded.
    scene.background = texture;
    console.log("Environment map loaded successfully.");
}, undefined, (err) => {
    // ERROR: Shows a solid color if the load fails (e.g., missing 3 files)
    console.error('Failed to load environment map textures. Check the 6 files.', err);
    scene.background = new THREE.Color(0x666666); 
});

// --- 4. Create the 3D Mirror Object with two distinct sides ---
const mirrorWidth = 2.5;
const mirrorHeight = 4;
const mirrorThickness = 0.1;

const planeGeometry = new THREE.PlaneGeometry(mirrorWidth, mirrorHeight);

// Material for the REFLECTIVE FRONT SIDE (White/Mirror)
const reflectiveMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, 
    roughness: 0.0,  // Perfect reflection
    metalness: 1.0,  // Fully metallic/mirror
    envMap: environmentMap, // This will be the key to fixing the reflection issue
    side: THREE.FrontSide 
});

// Material for the ROYAL PURPLE NON-REFLECTIVE BACK SIDE
const purpleMaterial = new THREE.MeshBasicMaterial({
    color: 0x6A0DAD, // Royal Purple
    side: THREE.BackSide,
    // Ensure the material is visible even without intense lighting
    lights: false 
});

const frontMirror = new THREE.Mesh(planeGeometry, reflectiveMaterial);
const backPurple = new THREE.Mesh(planeGeometry, purpleMaterial);
backPurple.rotation.y = Math.PI; // Correctly rotates the purple side to face backward

const frameGeometry = new THREE.BoxGeometry(mirrorWidth + 0.2, mirrorHeight + 0.2, mirrorThickness);
const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080, 
    roughness: 0.6,
    metalness: 0.2
});
const frame = new THREE.Mesh(frameGeometry, frameMaterial);

const mirrorGroup = new THREE.Group();
mirrorGroup.add(frontMirror);
mirrorGroup.add(backPurple);
mirrorGroup.add(frame);
scene.add(mirrorGroup);

frontMirror.position.z = mirrorThickness / 2;
backPurple.position.z = -mirrorThickness / 2;


// --- 5. Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    mirrorGroup.rotation.y += 0.005; 

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
