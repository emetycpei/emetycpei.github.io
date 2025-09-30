// --- 1. Setup the Scene ---
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3; // Adjust camera position for a closer view of the mirror

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x222222); // Dark grey background as fallback if env map fails

// --- 2. Add Lighting ---
// Crucial for reflections and showing off materials
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Brighter ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(0, 10, 5).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5, 50); // Softer point light
pointLight.position.set(-3, 3, 3);
scene.add(pointLight);

// --- 3. Create the Retail Changing Room Environment ---
const cubeTextureLoader = new THREE.CubeTextureLoader();
// Using a retail interior like 'Park' from Three.js examples
// This gives a nice indoor, somewhat generic mall/store feel.
cubeTextureLoader.setPath('https://threejs.org/examples/textures/cube/Park2/'); 

const environmentMap = cubeTextureLoader.load([
    'posx.jpg', 'negx.jpg',
    'posy.jpg', 'negy.jpg',
    'posz.jpg', 'negz.jpg'
]);

scene.background = environmentMap; // Set the environment as the scene background for visual context

// --- 4. Create the 3D Mirror Object with two distinct sides ---
// We'll create two separate meshes, one for the front and one for the back,
// as PlaneGeometry by default renders both sides with the same material.
// This gives us full control over each face.

// Dimensions of the mirror
const mirrorWidth = 2.5;
const mirrorHeight = 4;
const mirrorThickness = 0.1; // For the frame

// Geometry for the mirror surface (front and back)
const planeGeometry = new THREE.PlaneGeometry(mirrorWidth, mirrorHeight);

// Material for the reflective front side
const reflectiveMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White base color for maximum reflection
    roughness: 0.05, // Very low roughness for clear reflections
    metalness: 0.9,  // High metalness makes it mirror-like
    envMap: environmentMap, // This makes it reflect the environment
    side: THREE.FrontSide // Explicitly render only the front face
});

// Material for the royal purple non-reflective back side
const purpleMaterial = new THREE.MeshBasicMaterial({
    color: 0x6A0DAD, // Royal Purple
    side: THREE.BackSide // Explicitly render only the back face
});

// Create the front mirror mesh
const frontMirror = new THREE.Mesh(planeGeometry, reflectiveMaterial);
// We might need to rotate it if the default plane faces Z-axis and we want it to face the camera
frontMirror.rotation.y = Math.PI; // Rotate 180 degrees if needed, so the front is visible (adjust as you test)
// For PlaneGeometry, default normal is +Z. If camera is at +Z, it faces away.
// So we apply it to the front of the combined object later.

// Create the back purple plane mesh
const backPurple = new THREE.Mesh(planeGeometry, purpleMaterial);


// A simple frame for the mirror
const frameGeometry = new THREE.BoxGeometry(mirrorWidth + 0.2, mirrorHeight + 0.2, mirrorThickness); // Slightly larger
const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080, // Dark grey for the frame
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
frontMirror.position.z = mirrorThickness / 2; // Front face of the group
backPurple.position.z = -mirrorThickness / 2; // Back face of the group (needs to be rotated to show purple)
backPurple.rotation.y = Math.PI; // Rotate the back plane so its purple side faces 'backwards' from the group's perspective.


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
