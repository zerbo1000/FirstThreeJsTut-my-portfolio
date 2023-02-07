// INSTALL threejs and vite ( npm run dev to start the live server )

//import * as THREE from 'three'; obj in the index.html file
import * as THREE from 'https://unpkg.com/three@0.148.0/build/three.module.js';

// CREATE A SCENE CAMERA AND A RENDER:
const scene = new THREE.Scene();
//camera argument: (degree field views, aspect ratio over scene, near clipper plane, far clipping plane)
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
// render to put 3dimension to the screen
const renderer = new THREE.WebGLRenderer()


//SET SOME STUFF FOR RENDER AND APPEN TO HTML FILE TO SEE IT
// we put render on the screen and this act as canvas in which we inject our 3d obj on
renderer.setSize(innerWidth, innerHeight)
// to avoid gidderish we put pixel ratio same as device, it render more clear
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)


// we need MESH which need GEOMETRY object and a MATERIAL object
//BOX GEOMETRY agrument (weight lenght height)
const boxGeometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color: 0x00FF00})
const mesh = new THREE.Mesh(boxGeometry, material)

//ADD MESH TO A SCENE
scene.add(mesh)

// MOVE CAMERA IN THE SPACE camera default is in the center, this way you move it from the center
camera.position.z = 5


//PLANE
//arg(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10)
                                                                 //make both side of plane visible
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
//ADD IT
scene.add(planeMesh)


//ANIMATE : loop function to iterate animation
function animate() {

    //ANIMATION LOOP call himself
    requestAnimationFrame(animate)
    // RENDER IT OUT:  arg(scene, camera)
    renderer.render(scene, camera)
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.01

    planeMesh.rotation.x +=0.007
    planeMesh.rotation.y +=0.001
}

animate()

