import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

import { OrbitControls } from
"https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js";


/* =========================
   SAHNE
========================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x151515);


/* =========================
   KAMERA
========================= */

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 8, 9);


/* =========================
   RENDER
========================= */

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

document.body.appendChild(renderer.domElement);


/* =========================
   KAMERA KONTROLÜ
========================= */

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.target.set(0, 0, 0);

controls.enableDamping = true;

controls.minDistance = 5;
controls.maxDistance = 15;

controls.maxPolarAngle =
    Math.PI / 2.1;


/* =========================
   IŞIKLAR
========================= */

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

scene.add(ambientLight);


const mainLight =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

mainLight.position.set(
    0,
    10,
    5
);

scene.add(mainLight);


/* =========================
   BİLARDO MASASI
========================= */

const tableGroup =
    new THREE.Group();

scene.add(tableGroup);


/* Ahşap çerçeve */

const frameGeometry =
    new THREE.BoxGeometry(
        12,
        0.7,
        6.8
    );

const frameMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x5a3018,
        roughness: 0.5
    });

const frame =
    new THREE.Mesh(
        frameGeometry,
        frameMaterial
    );

frame.position.y = -0.35;

tableGroup.add(frame);


/* Yeşil oyun alanı */

const clothGeometry =
    new THREE.BoxGeometry(
        10.8,
        0.25,
        5.6
    );

const clothMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x087a3c,
        roughness: 0.8
    });

const cloth =
    new THREE.Mesh(
        clothGeometry,
        clothMaterial
    );

cloth.position.y = 0;

tableGroup.add(cloth);


/* =========================
   BANTLAR
========================= */

const railMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x164d2e
    });


function createRail(
    x,
    z,
    width,
    depth
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            0.35,
            depth
        );

    const rail =
        new THREE.Mesh(
            geometry,
            railMaterial
        );

    rail.position.set(
        x,
        0.25,
        z
    );

    tableGroup.add(rail);
}


createRail(
    0,
    -2.9,
    10.8,
    0.35
);

createRail(
    0,
    2.9,
    10.8,
    0.35
);

createRail(
    -5.4,
    0,
    0.35,
    5.6
);

createRail(
    5.4,
    0,
    0.35,
    5.6
);


/* =========================
   DELİKLER
========================= */

const pocketMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x050505
    });


function createPocket(x, z) {

    const geometry =
        new THREE.CylinderGeometry(
            0.42,
            0.42,
            0.12,
            32
        );

    const pocket =
        new THREE.Mesh(
            geometry,
            pocketMaterial
        );

    pocket.rotation.x =
        Math.PI / 2;

    pocket.position.set(
        x,
        0.18,
        z
    );

    tableGroup.add(pocket);
}


/* 6 delik */

createPocket(-5.35, -2.75);
createPocket(0, -2.75);
createPocket(5.35, -2.75);

createPocket(-5.35, 2.75);
createPocket(0, 2.75);
createPocket(5.35, 2.75);


/* =========================
   TOPLAR
========================= */

const balls = [];


function createBall(
    color,
    x,
    z
) {

    const geometry =
        new THREE.SphereGeometry(
            0.27,
            32,
            32
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.25
        });

    const ball =
        new THREE.Mesh(
            geometry,
            material
        );

    ball.position.set(
        x,
        0.32,
        z
    );

    scene.add(ball);

    balls.push(ball);

    return ball;
}


/* Beyaz top */

createBall(
    0xffffff,
    -3.3,
    0
);


/* Renkli toplar */

const colors = [
    0xff0000,
    0xffff00,
    0x0000ff,
    0xff6600,
    0x800080,
    0x00ffff,
    0xff1493,
    0x000000,
    0xff3333,
    0xffcc00,
    0x3333ff,
    0xff8800,
    0x9900cc,
    0x00aa55,
    0xff0055
];


let index = 0;

const startX = 2.4;

for (
    let row = 0;
    row < 5;
    row++
) {

    for (
        let col = 0;
        col <= row;
        col++
    ) {

        const x =
            startX +
            row * 0.48;

        const z =
            (col - row / 2) * 0.55;

        createBall(
            colors[index],
            x,
            z
        );

        index++;
    }
}


/* =========================
   MASA AYAKLARI
========================= */

const legMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x32190d
    });


function createLeg(x, z) {

    const geometry =
        new THREE.BoxGeometry(
            0.7,
            2.5,
            0.7
        );

    const leg =
        new THREE.Mesh(
            geometry,
            legMaterial
        );

    leg.position.set(
        x,
        -1.6,
        z
    );

    scene.add(leg);
}


createLeg(-4.8, -2.4);
createLeg(4.8, -2.4);
createLeg(-4.8, 2.4);
createLeg(4.8, 2.4);


/* =========================
   ZEMİN
========================= */

const floorGeometry =
    new THREE.PlaneGeometry(
        40,
        40
    );

const floorMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x222222
    });

const floor =
    new THREE.Mesh(
        floorGeometry,
        floorMaterial
    );

floor.rotation.x =
    -Math.PI / 2;

floor.position.y = -2.85;

scene.add(floor);


/* =========================
   EKRAN BOYUTU
========================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);


/* =========================
   OYUN DÖNGÜSÜ
========================= */

function animate() {

    requestAnimationFrame(
        animate
    );

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();
