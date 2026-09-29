const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);


// KAMERA
const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 13, 8);
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
scene.add(
    new THREE.AmbientLight(
        0xffffff,
        2
    )
);

const light = new THREE.DirectionalLight(
    0xffffff,
    4
);

light.position.set(0, 12, 5);
scene.add(light);


// ==========================
// MASA
// ==========================

const table = new THREE.Group();

scene.add(table);


// AHŞAP ÇERÇEVE

const frame = new THREE.Mesh(
    new THREE.BoxGeometry(
        12,
        0.7,
        6.8
    ),
    new THREE.MeshStandardMaterial({
        color: 0x6b3518
    })
);

frame.position.y = -0.35;

table.add(frame);


// YEŞİL ALAN

const cloth = new THREE.Mesh(
    new THREE.BoxGeometry(
        10.8,
        0.25,
        5.6
    ),
    new THREE.MeshStandardMaterial({
        color: 0x087a3c,
        roughness: 0.8
    })
);

table.add(cloth);


// BANTLAR

const railMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x164d2e
    });


function rail(x, z, width, depth) {

    const r = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            0.35,
            depth
        ),
        railMaterial
    );

    r.position.set(
        x,
        0.25,
        z
    );

    table.add(r);
}


rail(0, -2.9, 10.8, 0.35);
rail(0, 2.9, 10.8, 0.35);
rail(-5.4, 0, 0.35, 5.6);
rail(5.4, 0, 0.35, 5.6);


// DELİKLER

const pocketMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x000000
    });


function pocket(x, z) {

    const p = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.45,
            0.45,
            0.15,
            32
        ),
        pocketMaterial
    );

    p.position.set(
        x,
        0.18,
        z
    );

    table.add(p);
}


pocket(-5.35, -2.75);
pocket(0, -2.75);
pocket(5.35, -2.75);

pocket(-5.35, 2.75);
pocket(0, 2.75);
pocket(5.35, 2.75);


// ==========================
// TOPLAR
// ==========================

const balls = [];

const BALL_RADIUS = 0.27;


function createBall(
    color,
    x,
    z,
    isCue = false
) {

    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(
            BALL_RADIUS,
            32,
            32
        ),
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.2
        })
    );

    ball.position.set(
        x,
        0.32,
        z
    );

    ball.userData.velocity =
        new THREE.Vector3(0, 0, 0);

    ball.userData.isCue =
        isCue;

    scene.add(ball);

    balls.push(ball);

    return ball;
}


// BEYAZ TOP

const cueBall = createBall(
    0xffffff,
    -3.5,
    0,
    true
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
    0x111111,
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

        createBall(

            colors[index],

            2.0 +
            row * 0.48,

            (col - row / 2) * 0.55

        );

        index++;
    }
}


// ==========================
// VURUŞ SİSTEMİ
// ==========================

const raycaster =
    new THREE.Raycaster();

const mouse =
    new THREE.Vector2();

const plane =
    new THREE.Plane(
        new THREE.Vector3(0, 1, 0),
        -0.32
    );


let aiming = false;

let startPoint =
    new THREE.Vector3();


// GÜÇ

const powerSlider =
    document.querySelector(
        "#power input"
    );


// EKRAN → MASA

function getTablePoint(event) {

    const rect =
        renderer.domElement.getBoundingClientRect();

    mouse.x =
        ((event.clientX - rect.left) /
        rect.width) * 2 - 1;

    mouse.y =
        -((event.clientY - rect.top) /
        rect.height) * 2 + 1;

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const point =
        new THREE.Vector3();

    raycaster.ray.intersectPlane(
        plane,
        point
    );

    return point;
}


// DOKUNMAYA BAŞLA

renderer.domElement.addEventListener(
    "pointerdown",
    function(event) {

        if (ballsMoving()) {
            return;
        }

        const point =
            getTablePoint(event);

        const distance =
            point.distanceTo(
                cueBall.position
            );

        if (distance < 0.8) {

            aiming = true;

            startPoint.copy(point);

        }
    }
);


// PARMAĞI BIRAK

renderer.domElement.addEventListener(
    "pointerup",
    function(event) {

        if (!aiming) {
            return;
        }

        aiming = false;

        const endPoint =
            getTablePoint(event);

        const direction =
            new THREE.Vector3()
                .subVectors(
                    startPoint,
                    endPoint
                );

        const distance =
            direction.length();

        if (distance < 0.05) {
            return;
        }

        direction.normalize();


        const power =
            Number(powerSlider.value) / 100;


        const speed =
            Math.min(
                distance * 8,
                12
            ) * power;


        cueBall.userData.velocity
            .copy(direction)
            .multiplyScalar(speed);
    }
);


// ==========================
// TOPLAR HAREKET
// ==========================

function ballsMoving() {

    for (const ball of balls) {

        if (
            ball.userData.velocity.length()
            > 0.02
        ) {

            return true;
        }
    }

    return false;
}


// ==========================
// FİZİK
// ==========================

function updatePhysics() {

    for (const ball of balls) {

        const velocity =
            ball.userData.velocity;


        ball.position.x +=
            velocity.x * 0.016;

        ball.position.z +=
            velocity.z * 0.016;


        // SÜRTÜNME

        velocity.multiplyScalar(
            0.985
        );


        if (
            velocity.length() < 0.015
        ) {

            velocity.set(
                0,
                0,
                0
            );
        }


        // SOL / SAĞ BANT

        if (
            ball.position.x <
            -5.05
        ) {

            ball.position.x =
                -5.05;

            velocity.x =
                Math.abs(
                    velocity.x
                ) * 0.85;
        }


        if (
            ball.position.x >
            5.05
        ) {

            ball.position.x =
                5.05;

            velocity.x =
                -Math.abs(
                    velocity.x
                ) * 0.85;
        }


        // ALT / ÜST BANT

        if (
            ball.position.z <
            -2.55
        ) {

            ball.position.z =
                -2.55;

            velocity.z =
                Math.abs(
                    velocity.z
                ) * 0.85;
        }


        if (
            ball.position.z >
            2.55
        ) {

            ball.position.z =
                2.55;

            velocity.z =
                -Math.abs(
                    velocity.z
                ) * 0.85;
        }
    }


    // TOP-TOP ÇARPIŞMASI

    for (
        let i = 0;
        i < balls.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < balls.length;
            j++
        ) {

            const a = balls[i];
            const b = balls[j];

            const dx =
                b.position.x -
                a.position.x;

            const dz =
                b.position.z -
                a.position.z;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dz * dz
                );

            const minDistance =
                BALL_RADIUS * 2;


            if (
                distance > 0 &&
                distance < minDistance
            ) {

                const nx =
                    dx / distance;

                const nz =
                    dz / distance;


                const relativeX =
                    b.userData.velocity.x -
                    a.userData.velocity.x;

                const relativeZ =
                    b.userData.velocity.z -
                    a.userData.velocity.z;


                const velocityAlongNormal =
                    relativeX * nx +
                    relativeZ * nz;


                if (
                    velocityAlongNormal < 0
                ) {

                    const impulse =
                        velocityAlongNormal;


                    a.userData.velocity.x +=
                        impulse * nx;

                    a.userData.velocity.z +=
                        impulse * nz;

                    b.userData.velocity.x -=
                        impulse * nx;

                    b.userData.velocity.z -=
                        impulse * nz;
                }


                const overlap =
                    minDistance -
                    distance;


                a.position.x -=
                    nx * overlap / 2;

                a.position.z -=
                    nz * overlap / 2;

                b.position.x +=
                    nx * overlap / 2;

                b.position.z +=
                    nz * overlap / 2;
            }
        }
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


// ZEMİN

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
// EKRAN
// ==========================

window.addEventListener(
    "resize",
    function() {

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

    updatePhysics();

    renderer.render(
        scene,
        camera
    );
}

animate();
