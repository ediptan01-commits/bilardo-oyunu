import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// SAHNE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// KAMERA
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 8, 9);
camera.lookAt(0, 0, 0);

// RENDER
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


// IŞIK
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(
    0xffffff,
    4
);

mainLight.position.set(0, 10, 5);

scene.add(mainLight);


// ==========================
// BİLARDO MASASI
// ==========================

const table = new THREE.Group();

scene.add(table);


// AHŞAP ÇERÇEVE

const frame = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.7, 6.8),
    new THREE.MeshStandardMaterial({
        color: 0x6b3518
    })
);

frame.position.y = -0.35;

table.add(frame);


// YEŞİL KUMAŞ

const cloth = new THREE.Mesh(
    new THREE.BoxGeometry(10.8, 0.25, 5.6),
    new THREE.MeshStandardMaterial({
        color: 0x087a3c
    })
);

cloth.position.y = 0;

table.add(cloth);


// ==========================
// BANTLAR
// ==========================

const railMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x164d2e
    });


function createRail(x, z, width, depth) {

    const rail = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            0.35,
            depth
        ),
        railMaterial
    );

    rail.position.set(
        x,
        0.25,
        z
    );

    table.add(rail);
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


// ==========================
// DELİKLER
// ==========================

const pocketMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x000000
    });


function createPocket(x, z) {

    const pocket = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.45,
            0.45,
            0.15,
            32
        ),
        pocketMaterial
    );

    pocket.position.set(
        x,
        0.18,
        z
    );

    table.add(pocket);
}


createPocket(-5.35, -2.75);
createPocket(0, -2.75);
createPocket(5.35, -2.75);

createPocket(-5.35, 2.75);
createPocket(0, 2.75);
createPocket(5.35, 2.75);


// ==========================
// TOPLAR
// ==========================

function createBall(color, x, z) {

    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.27,
            32,
            32
        ),
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.25
        })
    );

    ball.position.set(
        x,
        0.32,
        z
    );

    scene.add(ball);
}


// BEYAZ TOP

createBall(
    0xffffff,
    -3.3,
    0
);


// RENKLİ TOPLAR

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
            2.4 +
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


// ==========================
// MASA AYAKLARI
// ==========================

const legMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x32190d
    });


function createLeg(x, z) {

    const leg = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.7,
            2.5,
            0.7
        ),
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


// ==========================
// ZEMİN
// ==========================

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(
        40,
        40
    ),
    new THREE.MeshStandardMaterial({
        color: 0x222222
    })
);

floor.rotation.x =
    -Math.PI / 2;

floor.position.y =
    -2.85;

scene.add(floor);


// ==========================
// EKRAN BOYUTU
// ==========================

window.addEventListener(
    "resize",
    function () {

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


// ==========================
// OYUN DÖNGÜSÜ
// ==========================

function animate() {

    requestAnimationFrame(
        animate
    );

    renderer.render(
        scene,
        camera
    );
}

animate();
