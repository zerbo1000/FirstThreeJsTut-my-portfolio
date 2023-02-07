// INSTALL threejs and vite ( npm run dev to start the live server )

//import * as THREE from 'three'; obj in the index.html file
import * as THREE from 'https://unpkg.com/three@0.148.0/build/three.module.js'
// IMPORT ORBIT CONTROL to MOVE THE CAMERA and see the object from around
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
//INSTALL DATDATGUI dat.gui FOR HANDY PARAMETER'S CONTROL: A lightweight graphical user interface for changing variables in JavaScript.
import * as dat from 'dat.gui'
//gsap for animate back to original color after hover of the mouse pass
import gsap from 'gsap'

// to take the position/rotation euler from the object after i put it manualy in the desired position
addEventListener('click', () => {
    console.log(orbitControl)
})


//QUATERNONI: vettore posizione P(px,py,pz) -> p′xi+p′yj+p′zk=q(pxi+pyj+pzk)q∗ -> P'=qPq* con q* cogniugato di q (q= a+bI+cJ+dK= a+V -> q*= a-bI-cJ-dK= a-V )
//formula di eulero: q = e^((θ/2)(axI + ayJ + azK)) = cos(θ/2) + (axI + ayJ + azK)sin(θ/2) dove θ angolo di rotazione e axI+ayJ+azK versore che rappresenta l'asse di rotazione
// un quaternone q=w+xI+yJ+zK dove (w) è seno dell'angolo di rotazione e (x,y,z) versore che rappresenta l'asse di rotazione 

// CREATE GUI OBJECT
const gui = new dat.GUI()
const world = {
    plane: {
        width: 800, //property: default value
        height: 400,
        widthSegments: 50,
        heightSegments: 25
    }
}
//.add to our gui menu    //min max value
gui.add(world.plane, 'width', 1, 1000).onChange(generetePlane)
gui.add(world.plane, 'height', 1, 1000).onChange(generetePlane)
gui.add(world.plane, 'widthSegments', 1, 50).onChange(generetePlane)
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generetePlane)

//generetePlane function for datdatgui
function generetePlane() {
    //MIE PROVE
    //camera.position.z = 300;
    //orbitControl.target.set(0, 0, 0);
    //orbitControl.update();
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 300
    camera.rotation.set(0,0,0);



    //dispose = smaltisci la vecchia mesh ( per questioni di memoria)
    planeMesh.geometry.dispose()
    //assign plane to gui
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
    
    //position randomization
    const { array } = planeMesh.geometry.attributes.position//.array (destructuring array part of this thing)
    const randomValues = []
    for (let i = 0; i < array.length; i++){
        //i%3 to have this activated every three since x x+1=y x+2=z
        if (i % 3 == 0) {
        //since the array is made of xyz value like [x1,y1,z1,x2,y2,z2,x3,...] you access them like below
            const x = array[i]
            const y = array[i+1]
            const z = array[i + 2]

            // move the plane in the space ( for every point -> move every point)
            //array[i] = x + 3
            //array[i+1] = y + 3
            //every point (array) in z-axis at random height
            array[i]     = x + (Math.random()-0.5)*3
            array[i + 1] = y + (Math.random()-0.5)*3
            array[i + 2] = z + (Math.random()-0.5)*15
        }

        //we put this random value creator here to expoit this for loop on the right array lenght
        randomValues.push(Math.random())
    }
    //console.log(randomValues)
    //add this randomValues array to the planeMesh object
    planeMesh.geometry.attributes.position.randomValues = randomValues
    //to create wave effect on the surface we use sen and cos, we need to alter x and y position of the meshes but we also need to reference to the original position, so we create a new attribute for position egual to the origianl position array to not to alter and use as reference
    //console.log(planeMesh.geometry.attributes.position.array)
    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array

/* first randomization (only z random height)
    //FOR LOOP TO MODIFY EVERY Z VALUE of the POSITION of the MESH
    //from the console with console.log you can SEE ATTRIBUTES, there u can see the available properties, so with their name now u can ACCESS and MODIFY them here in FILE
    //console.log(planeMesh.geometry.attributes.position.array)
    // you can destructure this: planeMesh.geometry.attributes.position.array like below, so the 'array' is transferred as the const, so we can use the const in the code like for the 'for-loop'
    const { array } = planeMesh.geometry.attributes.position//.array (destructuring array part of this thing)
    for (let i = 0; i < array.length; i += 3){
        //since the array is made of xyz value like [x1,y1,z1,x2,y2,z2,x3,...] you access them like below
        const x = array[i]
        const y = array[i+1]
        const z = array[i+2]
        // move the plane in the space ( for every point -> move every point)
        //array[i] = x + 3
        //array[i+1] = y + 3
        //every point (array) in z-axis at random height
        array[i]     = x + (Math.random()-0.5) // random in 0 1 range, if u put -0.5 get random in -0,5 0.5 , increse randomness with *n
        array[i + 1] = y + (Math.random()-0.5)
        array[i + 2] = z + (Math.random()-0.5)
    }
*/
    //set the color for all the mesh not just one (363 total = 3 * 121 , 121 is the .count) , position is the position of the mesh no is also the number of mesh in the scene, that need so to be colored
    const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
        colors.push(0, 0.19, 0.4)
    }
    //set a new (unexisting) ATTRIBITE for COLOR IN planeMesh
    //console.log(planeMesh.geometry.attributes)
    //.setAttribute ( name : String, attribute : BufferAttribute ) : this
    //Sets an attribute to this geometry. Use this rather than the attributes property, because an internal hashmap of .attributes is maintained to speed up iterating over attributes.
    //set attribute need to be set as ('name', 'type/array')
    //TYPE (array) is Float32Array and is possible to see this from other attributes in the planeMesh.geomtery consoling.log it out, so you add it as new Three buffer attribute, inside the arg of float32 there is an UNTYPED ARRAY [a, b ,c ] -> [r, g, b]  this is needed to make sure every member in this array are of the type float32 (required to have the bufferAttribute to work)
    //the last number in arg of BufferAttribute is the GROUPING NUMBER or itemSize, ie which base number will the group made of, since the color is R G B are 3 item so every rgb groups is of course a group of three data
    //from the doc: https://threejs.org/docs/#api/en/core/BufferAttribute
    //When creating an instance of a TypedArray subclass (e.g. Int8Array), an array buffer is created internally in memory
    //COSTRUCTOR: BufferAttribute( array : TypedArray, itemSize : Integer, normalized : Boolean )
    //-> array -> Must be a TypedArray. Used to instantiate the buffer. This array should have (itemSize * numVertices) elements, where numVertices is the number of vertices in the associated BufferGeometry.
    //itemSize -- the number of values of the array that should be associated with a particular vertex. For instance, if this attribute is storing a 3-component vector (such as a position, normal, or color), then itemSize should be 3.
    //planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array([0, 0, 1]), 3))
    // insted of [0, 0, 1] now we set the 'colors' array created above with the for-loop to get the number of mesh in the scene and have all of them colored (ie setting this color attribute for all the mesh, not only one (which by defaul would be the top left))
    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

}

//ADD RAYCASTER: ray raggio caster angolo di incidenza, can image a ray caster as a laser ray that point everytime from you mouse to a point on the scene. Raycasting is used for mouse picking (working out what objects in the 3d space the mouse is over (needed for 2d render of 3d objects) and is able TO MONITOR WHEN MOUSE IS OR NOT TOUCHING AN OBJECT , is a ray tracing techinc.
const raycaster = new THREE.Raycaster()
//console.log(raycaster)

// CREATE A SCENE CAMERA AND A RENDER:
const scene = new THREE.Scene();
//camera argument: (degree field views, aspect ratio over scene, near clipper plane, far clipping plane)
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
// render to put 3dimension to the screen
const renderer = new THREE.WebGLRenderer()


//SET SOME STUFF FOR RENDER AND APPEND TO HTML FILE TO SEE IT
// we put render on the screen and this act as canvas in which we inject our 3d obj on
renderer.setSize(innerWidth, innerHeight)
// to avoid gidderish we put pixel ratio same as device, it render more clear
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

//instance for ORBITCONTROL (camera, domElement) (you see only one side since the LIGHT is in one side and you are ROTATING the CAMERA not moving the PLANE, if u don't create a new light from behind
const orbitControl = new OrbitControls(camera, renderer.domElement)

// MOVE CAMERA IN THE SPACE camera default is in the center, this way you move it from the center
//camera.position.z = 300

//MIE PROVE CAMERA UN PO DI LATO NERA
// new position black screen light diagonal MINE
// coordinates and angles takes thanks to the click event listener on the orbit contro
camera.position.x = -51.84342246097927;
camera.position.y = -82.98084293245468;
camera.position.z = 283.5955557722148;
//euler rotation _x _y _z
camera.rotation.set(0.2846565975055706, -0.17368331075614302, 0.05052206591937414);
//also lookAt is useful to have the camera loo At a point in space
//camera.lookAt(100, 100, 100);

/* 
//camera.position.z = 500
//The OrbitControls orbit around the target 
//orbitControl.target.set(100, 0, 120)
orbitControl.update()
camera.position.x= -211.66446840912604
camera.position.y= 135.8949932847439
camera.position.z= 163.4952709200528
let matrixArray =  [
        0.6112985129013488,
        -2.7755575615628914e-17,
        0.7914001062197297,
        0,
        0.3584910404009193,
        0.8915189958725215,
        -0.27690802435234246,
        0,
        -0.7055482280304203,
        0.4529833109491464,
        0.5449842364001761,
        0,
        -211.66446840912604,
        135.8949932847439,
        163.4952709200528,
        1
    ]
    let matrixWorldArray =  [
        0.6112985129013488,
        -2.7755575615628914e-17,
        0.7914001062197297,
        0,
        0.3584910404009193,
        0.8915189958725215,
        -0.27690802435234246,
        0,
        -0.7055482280304203,
        0.4529833109491464,
        0.5449842364001761,
        0,
        -211.66446840912604,
        135.8949932847439,
        163.4952709200528,
        1
]
    let projectionMatrixArray =  [
        1.7121770021259695,
        0,
        0,
        0,
        0,
        1.3032253728412058,
        0,
        0,
        0,
        0,
        -1.0002000200020003,
        -1,
        0,
        0,
        -0.20002000200020004,
        0
    ]
    for (let i = 0; i < matrixArray.length;i++){camera.matrix.elements[i] = matrixArray[i]}
    for (let i = 0; i < matrixWorldArray.length;i++){camera.matrixWorld.elements[i] = matrixWorldArray[i]}
    for (let i = 0; i < projectionMatrixArray.length;i++){camera.projectionMatrix.elements[i] = projectionMatrixArray[i]}
for (let i = 0; i < projectionMatrixArray.length; i++){ camera.projectionMatrix.elements[i] = projectionMatrixArray[i] }
*/
    


//PLANE
//arg(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer) 
const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height , world.plane.widthSegments, world.plane.heightSegments)
                                                                 //make both side of plane visible
//const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide})
//new material: MeshPHONGMaterial (need a LIGHT on the scene, to ENLIGHT it)
const planeMaterial = new THREE.MeshPhongMaterial({
    //color: 0xff0000, comment this out since now we use setAttribute colors 0,0,1 for vertexColor and this would go in conflict
    side: THREE.DoubleSide,
    //show z-axis inner PrimitiveTriangle's shadows
    flatShading: true, //flatShading: THREE.FlatShading
    //Vertex colors aren't that relevant when you have a fully textured 3d mesh. But it gets interesting when you have an untextured but colored mesh. In that case you assign a color to every vertex. The shader would then color each pixel of a polygon by interpolating between the colors of the three vertices. Vertex colors can also sometimes be interesting in combination with textures. When you want to use a shading algorithm like Gouraud Shading, you just calculate the light intensity on each vertex, assign the light color to the vertex as a vertex color, and when you render the texture you multiply the color value of each texture pixel with the interpolated colors. This allows you to calculate light sources in the vertex shader instead of the pixel shader. This is usually far faster, because the vertex shader is usually executed far less frequently.
    //The closest fragments to vertex A get the color of it, the closesr to vertex B get the colornof B, and the color interpolates between the 2. It works the same way as per-vertex lighting. It's an easy way to add colors to a model without using a texture.
    vertexColors: true
    })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
//ADD IT
scene.add(planeMesh)




// FROM HERE until the light CODE (excluded) is the same code from the generatePlane func so you could delete this and call only the func

//generetePlane()
/*
//position of the vertex of the meshes
//FOR LOOP TO MODIFY EVERY VALUE of the POSITION of the MESH
//from the console with console.log you can SEE ATTRIBUTES, there u can see the available properties, so with their name now u can ACCESS and MODIFY them here in FILE
//console.log(planeMesh.geometry.attributes.position.array)
// you can destructure this: planeMesh.geometry.attributes.position.array like below, so the 'array' is transferred as the const, so we can use the const in the code like for the 'for-loop'
const { array } = planeMesh.geometry.attributes.position//.array (destructuring array part of this thing)
const randomValues = []
for (let i = 0; i < array.length; i++){
    //i%3 to have this activated every three since x x+1=y x+2=z
    if (i % 3 == 0) {
    //since the array is made of xyz value like [x1,y1,z1,x2,y2,z2,x3,...] you access them like below
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]
    // move the plane in the space ( for every point -> move every point)
    //array[i] = x + 3
    //array[i+1] = y + 3
    //every point (array) in z-axis at random height
    array[i]     = x + (Math.random()-0.5)*3
    array[i + 1] = y + (Math.random()-0.5)*3
    array[i + 2] = z + (Math.random()-0.5)*15
    }
    
    //we put this random value creator here to expoit this for loop on the right array lenght
    randomValues.push(Math.random())
}
//console.log(randomValues)
//add this randomValues array to the planeMesh object
planeMesh.geometry.attributes.position.randomValues = randomValues
//to create wave effect on the surface we use sen and cos, we need to alter x and y position of the meshes but we also need to reference to the original position, so we create a new attribute for position egual to the origianl position array to not to alter and use as reference
//console.log(planeMesh.geometry.attributes.position.array)
planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array


//set the color for all the mesh not just one (363 total = 3 * 121 , 121 is the .count) , position is the position of the mesh no is also the number of mesh in the scene, that need so to be colored
const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
    colors.push(0, 0.19, 0.4)
}
//set a new (unexisting) ATTRIBITE for COLOR IN planeMesh
//console.log(planeMesh.geometry.attributes)
//.setAttribute ( name : String, attribute : BufferAttribute ) : this
//Sets an attribute to this geometry. Use this rather than the attributes property, because an internal hashmap of .attributes is maintained to speed up iterating over attributes.
//set attribute need to be set as ('name', 'type/array')
//TYPE (array) is Float32Array and is possible to see this from other attributes in the planeMesh.geomtery consoling.log it out, so you add it as new Three buffer attribute, inside the arg of float32 there is an UNTYPED ARRAY [a, b ,c ] -> [r, g, b]  this is needed to make sure every member in this array are of the type float32 (required to have the bufferAttribute to work)
//the last number in arg of BufferAttribute is the GROUPING NUMBER or itemSize, ie which base number will the group made of, since the color is R G B are 3 item so every rgb groups is of course a group of three data
//from the doc: https://threejs.org/docs/#api/en/core/BufferAttribute
//When creating an instance of a TypedArray subclass (e.g. Int8Array), an array buffer is created internally in memory
//COSTRUCTOR: BufferAttribute( array : TypedArray, itemSize : Integer, normalized : Boolean )
//-> array -> Must be a TypedArray. Used to instantiate the buffer. This array should have (itemSize * numVertices) elements, where numVertices is the number of vertices in the associated BufferGeometry.
//itemSize -- the number of values of the array that should be associated with a particular vertex. For instance, if this attribute is storing a 3-component vector (such as a position, normal, or color), then itemSize should be 3.
//planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array([0, 0, 1]), 3))
// insted of [0, 0, 1] now we set the 'colors' array created above with the for-loop to get the number of mesh in the scene and have all of them colored (ie setting this color attribute for all the mesh, not only one (which by defaul would be the top left))
planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
*/

//ADD A LIGHT for the PHONG
// arg (color, intensity)
const light = new THREE.DirectionalLight(0xffffff, 1)
// object created, now position it and add it to scene
light.position.set(-0.1, 0.5, 1) //x y z position of the light 
scene.add(light)
//add LIGHT from BEHIND
const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)


//ADD HOVER EFFECT (eventListener for Mouse Event): add mousemove eventlistener, normalize mouse coordinate, import raycaster, test for intersect, based off intersected face, change surrounding vertex colors
const mouse = {
    x: undefined,
    y: undefined
}

addEventListener('mousemove', (event) => {
    //to get mouse coordinate we pass the event in arg and use .clientC on it
    //console.log(mouse)
    //RAYCASTER
    //NORMALIZE COORDINATE (-1, 1) for RAYCASTER (default for BROWSER and website is (0, 0) at TOP LEFT, while for RAYCASTER (0, 0) is CENTER of the SCREEN )
    mouse.x =  (event.clientX/innerWidth)*2-1
    mouse.y = ((event.clientY/innerHeight)*2-1)*-1
    // quadranti normalizzati:  -1 1 __|__ 1 1  
    //                          -1-1   |   1-1
    
})


/*
planeMesh.modelViewMatrix.elements = [
        0.9034752768010974,
        0.11109620294688949,
        -0.4139928234884805,
        0,
        -1.3877787807814457e-17,
        0.9658282632755697,
        0.25918288110540194,
        0,
        0.4286402036780738,
        -0.2341653252488089,
        0.8726019575052184,
        0,
        1.865174681370263e-14,
        -7.105427357601002e-15,
        -300.0000000000007,
        1
    ]


planeMesh.normalMatrix.elements= [
        0.9034752768010972,
        0.11109620294688946,
        -0.4139928234884804,
        -2.7755575615628907e-17,
        0.9658282632755696,
        0.2591828811054019,
        0.4286402036780737,
        -0.23416532524880887,
        0.8726019575052183
    ]
*/

//neede for wave effect surface
let frame = 0

//ANIMATE : loop function to iterate animation
function animate() {

    //ANIMATION LOOP call himself
    requestAnimationFrame(animate)
    // RENDER IT OUT:  arg(scene, camera)
    renderer.render(scene, camera)

    //planeMesh.rotation.x +=0.007
    //                              random num between two num
    //planeMesh.rotation.y +=(Math.random() * (0.005 - 0.0001) + 0.0001)

    //increase as we loop through animate()
    frame += 0.01
    // at every animation frame all the position will move of the same quantity cos(frame)
    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position
    for (let i = 0; i < array.length; i += 3){
        //x
                              //we add a RANDOM VALUE to have wave effect (every vertex move indipendenty not all vertex of the same quantity)
        // we need both frame and random since: frame is a number that always increase, and let scroll the whole x axis of the cos, but is the same for every loop, so you need a random value added different for every vertex ([i] loop) , so you have a value THAT ALWAYS INCREASE, but of a value different for every vertex (every loop cycle) , in the end u can not put only random since give numbers in (0, 1) where cose is always positive, while u need to move cos from pos to negative. U can not even use random+1 which get cos to positive to negative it will anyway be of the same distance for every loop since the random value array is fixed, so you will have some vertex always going left and some always going right
        //1.5 + Math.random() got more neg then pos so go more left
        //1 + Math.random() got more pos then neg so go more right
        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i])/217
        //if (i == 0) {console.log(Math.cos(frame)) }  //show -1 1 
        //if (i == 0) {console.log(Math.cos(frame + randomValues[i])) }  //show
        //if (i == 0) {console.log(randomValues[i])}  //show
        //console.log(Math.cos(randomValues[i]))  //show
        //console.log(Math.cos(frame + randomValues[i]))  //show
        //console.log(array[i])  //show
        //console.log(frame)  //show
        //console.log(randomValues[i])  //show
        //if (i == 0) {console.log(array[i]) }         //show -n n
        //y
        array[i+1] = originalPosition[i+1] + Math.cos(frame + randomValues[i])/15
    }
    //needUpdate to show effect on the scene
    planeMesh.geometry.attributes.position.needsUpdate = true


    

    //ADD RAYCASTER TO animation , set from camera method
    raycaster.setFromCamera(mouse, camera)
    // choose intersection between ray and object: this way will be created an OBJECT WITH DATA when the mouse hover an object and AN EMPTY OBJECT when the mouse is not on an object, but u can put a check so it will log only object with data
    //this is needed since with only the mouse over if u change the angle of view during usage thank to orbit control the hover effect has no effect, with the raycaster the hover effect has effect no matter what the caster angle is
    const intersect = raycaster.intersectObject(planeMesh)

    //WHEN THE MOUSE HOVER HOVER an OBJECT not the empty scene MODIFY THE COLOR
    if (intersect.length >0){
        //FACE: Represents a section bounded by a specific amount of HALF-EDGES. The current implementation assumes that a face always consist of three edges.
        //console.log(intersect[0].face)
        //console.log(intersect[0].object.geometry.attributes.color)
        //.color got an array like (0,0,1,0,0,1,0,0,1,0,0,1,0,0,1, ... ) which are groups or three of (x0,y0,z0,x1,y1,z1,x2,y2,z2,.....xn,yn,zn), which represent every mesh vertex, you can like x0 and change only that so you chnage the COLOR of THAT VERTIX
          //(X,Y,Z)=(R,G,B) setXArg('quale tripla di valori? la prima ie la 0', 'colore da settare: nero')
        //intersect[0].object.geometry.attributes.color.setX(0, 1)
        //destructure intersect[0].object.geometry.attributes.color
        const { color } = intersect[0].object.geometry.attributes
        

        //SINGLE TRIANGLE MESH: got three vertex

                    color.setX(intersect[0].face.a, 0.1) //R   
        /*face a*/  color.setY(intersect[0].face.a, 0.5) //G   to color one face you an array3
                    color.setZ(intersect[0].face.a, 1)   //B    
    
                    color.setX(intersect[0].face.b, 0.1) //R   
        /*face b*/  color.setY(intersect[0].face.b, 0.5) //G   to color one face you an array3  
                    color.setZ(intersect[0].face.b, 1)   //B  
            
                    color.setX(intersect[0].face.c, 0.1) //R   
        /*face c*/  color.setY(intersect[0].face.c, 0.5) //G   to color one face you an array3  
                    color.setZ(intersect[0].face.c, 1)   //B  
        //to update
        intersect[0].object.geometry.attributes.color.needsUpdate = true

        //gsap to animate BACK TO ORIGINAL color after hover
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
        // .to() what do we want to animate to
        //ANIMATE BETWEEN: when is normal take '.to( , { * , ()=>{} } )' but on update take '.to( , { , ()=>{*} } )'
        //.to('property that is going to be animated', {obj of data})
        //we set hoverColor to be object object of our animation (param changing), change (r g b ) from initial to hover
        // .to('property/object/element to animate', {initial/default value, ()=>{animated/changed/updated value}} )
        gsap.to(hoverColor, {
            //those three are the property that has hoverColor that we want to animate
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            onUpdate: () => {
                //intersect[0].object.geometry.attributes...
                color.setX(intersect[0].face.a, hoverColor.r) //R
                color.setY(intersect[0].face.a, hoverColor.g) //G
                color.setZ(intersect[0].face.a, hoverColor.b) //B

                color.setX(intersect[0].face.b, hoverColor.r)
                color.setY(intersect[0].face.b, hoverColor.g)
                color.setZ(intersect[0].face.b, hoverColor.b)

                color.setX(intersect[0].face.c, hoverColor.r)
                color.setY(intersect[0].face.c, hoverColor.g)
                color.setZ(intersect[0].face.c, hoverColor.b)
                // last need update needed to have the color back to initial also AFTER THE MOUSE LEAVE THE OBJECT not only when the mouse got from one mech to another as the update above does
                color.needsUpdate = true
            }

        })

        
    }
}

animate()

