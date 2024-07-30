
import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

let camera, controls, scene, renderer, stats;

let mesh, geometry, material, clock;

const worldWidth = 128, worldDepth = 128;

init();

function init() {
    const waterImg = 'https://media.istockphoto.com/id/1158274915/vector/grass-seamless-realistic-texture-green-lawn-field-or-meadow-vector-background-summer-or.jpg?s=612x612&w=0&k=20&c=7AAqciofj43K5kmQxxOBCO1Rj0YUuFZdcTuO9XwZOsc='


    const cameraFov = 60; // 60
    const cameraNear = 1; // 1
    const cameraFar = 20000; // 20000
    camera = new THREE.PerspectiveCamera(cameraFov, window.innerWidth / window.innerHeight, cameraNear, cameraFar);
    camera.position.y = 200;

    clock = new THREE.Clock();

    // ***
    //          SCENE
    // ***
    scene = new THREE.Scene();
    scene.background = new THREE.Color(
        0xaaafff
    );


    // ***
    //          FOG
    // ***
    const fogAmount = 0.0007; // 0.0007
    const fogColor = new THREE.Color(0xaaccff);
    scene.fog = new THREE.FogExp2(fogColor, fogAmount);

    // ***
    //          GEOMETRY
    // ***

    const geometryWidth = 20000;
    const geometryHeight = 20000;
    const geometryWidthSections = worldWidth + 1; // number of waves in direction
    const geometryHeightSections = worldDepth + 10; // number of waves in direction
    geometry = new THREE.PlaneGeometry(geometryWidth, geometryHeight, geometryWidthSections, geometryHeightSections);
    geometry.rotateX(- Math.PI / 2); // rotate the plane so it is flat

    const position = geometry.attributes.position;
    position.usage = THREE.DynamicDrawUsage;

    for (let i = 0; i < position.count; i++) {
        const amt = 35; // 35
        const y = amt * Math.sin(i / 2);
        position.setY(i, y);
    }

    const texture = new THREE.TextureLoader().load(waterImg);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(55, 55); // 5, 5
    texture.colorSpace = THREE.SRGBColorSpace;

    // ***
    //          MATERIAL
    // light blue
    // ***
    const materialColor = 0x7788ff;

    material = new THREE.MeshBasicMaterial({ color: materialColor, map: texture });
    // make hte material light blue glowing
    // material = new THREE.MeshBasicMaterial({ color: materialColor, map: texture, emissive: 0x0000ff, emissiveIntensity: 0.1 });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    controls = new FirstPersonControls(camera, renderer.domElement);

    controls.movementSpeed = 300;
    controls.lookSpeed = 0.05;

    stats = new Stats();
    document.body.appendChild(stats.dom);

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();

}

//

function animate() {

    render();
    stats.update();

}

function render() {

    const delta = clock.getDelta();
    const time = clock.getElapsedTime() * 10;

    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {

        const y = 35 * Math.sin(i / 5 + (time + i) / 7);
        position.setY(i, y);

    }

    position.needsUpdate = true;

    controls.update(delta);
    renderer.render(scene, camera);

}
