
import * as THREE from 'https://unpkg.com/three@0.148.0/build/three.module.js'
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

const gui = new dat.GUI()
const world = {
    plane: {
        width: 800, 
        height: 400,
        widthSegments: 50,
        heightSegments: 25
    }
}
gui.add(world.plane, 'width', 1, 1000).onChange(generetePlane)
gui.add(world.plane, 'height', 1, 1000).onChange(generetePlane)
gui.add(world.plane, 'widthSegments', 1, 50).onChange(generetePlane)
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generetePlane)

function generetePlane() {
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
    
    const { array } = planeMesh.geometry.attributes.position
    const randomValues = []
    for (let i = 0; i < array.length; i++){
        if (i % 3 == 0) {
            const x = array[i]
            const y = array[i+1]
            const z = array[i+2]
            array[i]     = x + (Math.random()-0.5)*3
            array[i + 1] = y + (Math.random()-0.5)*3
            array[i + 2] = z + (Math.random()-0.5)*15
        }

        randomValues.push(Math.random())
    }
    planeMesh.geometry.attributes.position.randomValues = randomValues
    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array

    const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
        colors.push(0, 0.19, 0.4)
    }
    
    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

}

const raycaster = new THREE.Raycaster()

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()


renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)


camera.position.z = 300


 
const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height , world.plane.widthSegments, world.plane.heightSegments)
const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: true, 
    vertexColors: true
    })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)


const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-0.1, 0.5, 1) 
scene.add(light)
const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)



const mouse = {
    x: undefined,
    y: undefined
}

addEventListener('mousemove', (event) => {
    mouse.x =  (event.clientX/innerWidth)*2-1
    mouse.y = ((event.clientY/innerHeight)*2-1)*-1
    
})

let frame = 0

function animate() {

    requestAnimationFrame(animate)
    renderer.render(scene, camera)


    frame += 0.01
    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position
    for (let i = 0; i < array.length; i += 3){

        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i])/217

        array[i+1] = originalPosition[i+1] + Math.cos(frame + randomValues[i])/15
    }
    planeMesh.geometry.attributes.position.needsUpdate = true


    raycaster.setFromCamera(mouse, camera)

    const intersect = raycaster.intersectObject(planeMesh)

    if (intersect.length >0){

        const { color } = intersect[0].object.geometry.attributes

                    color.setX(intersect[0].face.a, 0.1) //R   
        /*face a*/  color.setY(intersect[0].face.a, 0.5) //G   to color one face you an array3
                    color.setZ(intersect[0].face.a, 1)   //B    
    
                    color.setX(intersect[0].face.b, 0.1) //R   
        /*face b*/  color.setY(intersect[0].face.b, 0.5) //G   to color one face you an array3  
                    color.setZ(intersect[0].face.b, 1)   //B  
            
                    color.setX(intersect[0].face.c, 0.1) //R   
        /*face c*/  color.setY(intersect[0].face.c, 0.5) //G   to color one face you an array3  
                    color.setZ(intersect[0].face.c, 1)   //B  
        intersect[0].object.geometry.attributes.color.needsUpdate = true

        const initialColor = {
            r: 0,
            g: 0.19,
            b: 0.4
        }
        const hoverColor = {
            r: 0.1,
            g: 0.5,
            b: 1
        }

        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            onUpdate: () => {
                color.setX(intersect[0].face.a, hoverColor.r) //R
                color.setY(intersect[0].face.a, hoverColor.g) //G
                color.setZ(intersect[0].face.a, hoverColor.b) //B

                color.setX(intersect[0].face.b, hoverColor.r)
                color.setY(intersect[0].face.b, hoverColor.g)
                color.setZ(intersect[0].face.b, hoverColor.b)

                color.setX(intersect[0].face.c, hoverColor.r)
                color.setY(intersect[0].face.c, hoverColor.g)
                color.setZ(intersect[0].face.c, hoverColor.b)
                color.needsUpdate = true
            }

        })

        
    }
}

animate()



