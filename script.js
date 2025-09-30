// --- 1. Setup the Scene ---
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3; 

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x333333); // A slightly lighter dark grey for a generic indoor feel

// --- 2. Add Lighting (Ensuring good visibility) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 1.8); // Brighter ambient
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(0, 5, 5).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 50); 
pointLight.position.set(-3, 3, 3);
scene.add(pointLight);

// --- 3. Create the Environment Map (LOCAL RETAIL-LIKE/INDOOR) ---
const cubeTextureLoader = new THREE.CubeTextureLoader();
// !!! IMPORTANT: This path assumes you have a 'textures/' folder 
// !!!          in your root directory containing the 6 cubemap images.
cubeTextureLoader.setPath('./textures/'); // LOOKING FOR LOCAL FILES

const environmentMap = cubeTextureLoader.load([
    'posx.jepg', 'negx.jpg',
    'posy.jpg', 'negy.jpg',
    'posz.jpg', 'negz.jpg'
], () => {
    // Callback function once textures are loaded
    scene.background = environmentMap;
}, undefined, (err) => {
    // Error handling if textures fail to load (e.g., file not found)
    console.error('Failed to load environment map textures:', err);
    // Fallback: Use a solid color background if textures fail to load
    scene.background = new THREE.Color(0x666666); 
});

// --- 4. Create the 3D Mirror Object with two distinct sides ---
const mirrorWidth = 2.5;
const mirrorHeight = 4;
const mirrorThickness = 0.1;

const planeGeometry = new THREE.PlaneGeometry(mirrorWidth, mirrorHeight);

// Material for the REFLECTIVE FRONT SIDE (Guaranteed Mirror Look)
const reflectiveMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, 
    roughness: 0.0,  // Perfect reflection
    metalness: 1.0,  // Fully metallic/mirror
    envMap: environmentMap, // Reflects the loaded environment
    side: THREE.FrontSide 
});

// Material for the ROYAL PURPLE NON-REFLECTIVE BACK SIDE
const purpleMaterial = new THREE.MeshBasicMaterial({
    color: 0x6A0DAD, // Royal Purple
    side: THREE.BackSide
});

const frontMirror = new THREE.Mesh(planeGeometry, reflectiveMaterial);
const backPurple = new THREE.Mesh(planeGeometry, purpleMaterial);
backPurple.rotation.y = Math.PI; 

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
