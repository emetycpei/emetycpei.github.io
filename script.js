// --- 1. Setup the Scene ---
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3; 

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x222222); 

// --- 2. Add Lighting (Increased Intensity) ---
// Increased intensity to ensure the reflective material is active
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 5, 5).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 50); 
pointLight.position.set(-3, 3, 3);
scene.add(pointLight);

// --- 3. Create the Environment Map (Retail/Indoor Look) ---
const cubeTextureLoader = new THREE.CubeTextureLoader();
// Using 'Park' which is a large interior/exterior space that works well for reflections
// NOTE: Your image shows this loading correctly, but the mirror material isn't
cubeTextureLoader.setPath('https://threejs.org/examples/textures/cube/Park2/'); 

const environmentMap = cubeTextureLoader.load([
    'posx.jpg', 'negx.jpg',
    'posy.jpg', 'negy.jpg',
    'posz.jpg', 'negz.jpg'
]);

scene.background = environmentMap;

// --- 4. Create the 3D Mirror Object with two distinct sides ---
const mirrorWidth = 2.5;
const mirrorHeight = 4;
const mirrorThickness = 0.1;

// Geometry for the mirror surface
const planeGeometry = new THREE.PlaneGeometry(mirrorWidth, mirrorHeight);

// Material for the REFLECTIVE FRONT SIDE (FORCED MIRROR LOOK)
const reflectiveMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White base color
    roughness: 0.0,  // CRITICAL: Set to 0.0 for PERFECT MIRROR reflection
    metalness: 1.0,  // CRITICAL: Set to 1.0 for metallic/mirror look
    envMap: environmentMap, 
    side: THREE.FrontSide 
});

// Material for the ROYAL PURPLE NON-REFLECTIVE BACK SIDE
const purpleMaterial = new THREE.MeshBasicMaterial({
    color: 0x6A0DAD, // Royal Purple
    side: THREE.BackSide
});

// Create the front mirror mesh
const frontMirror = new THREE.Mesh(planeGeometry, reflectiveMaterial);

// Create the back purple plane mesh
const backPurple = new THREE.Mesh(planeGeometry, purpleMaterial);
backPurple.rotation.y = Math.PI; // Ensure the purple side is facing away

// A simple frame for the mirror
const frameGeometry = new THREE.BoxGeometry(mirrorWidth + 0.2, mirrorHeight + 0.2, mirrorThickness);
const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080, 
    roughness: 0.6,
    metalness: 0.2
});
const frame = new THREE.Mesh(frameGeometry, frameMaterial);

// Group the mirror parts to make them rotate together
const mirrorGroup = new THREE.Group();
mirrorGroup.add(frontMirror);
mirrorGroup.add(backPurple);
mirrorGroup.add(frame);
scene.add(mirrorGroup);

// Position the individual planes within the group
frontMirror.position.z = mirrorThickness / 2;
backPurple.position.z = -mirrorThickness / 2;


// --- 5. Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Rotate the entire mirror group
    mirrorGroup.rotation.y += 0.005; 

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
