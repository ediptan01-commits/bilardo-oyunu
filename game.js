const info = document.getElementById("info");

info.textContent = "1/3 - JavaScript çalışıyor";

if (typeof THREE === "undefined") {
    info.textContent = "❌ THREE.JS YÜKLENMEDİ";
    throw new Error("Three.js yüklenmedi");
}

info.textContent = "2/3 - Three.js yüklendi";

try {

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.set(0, 2, 6);
    camera.lookAt(0, 0, 0);

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

    const light = new THREE.DirectionalLight(
        0xffffff,
        2
    );

    light.position.set(3, 5, 5);
    scene.add(light);

    const ambient = new THREE.AmbientLight(
        0xffffff,
        1
    );

    scene.add(ambient);

    const geometry = new THREE.BoxGeometry(
        2,
        2,
        2
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x00ff00
    });

    const cube = new THREE.Mesh(
        geometry,
        material
    );

    scene.add(cube);

    info.textContent = "✅ 3/3 - 3D ÇALIŞIYOR";

    function animate() {

        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(
            scene,
            camera
        );
    }

    animate();

    window.addEventListener("resize", () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    });

} catch (error) {

    info.textContent =
        "❌ HATA: " + error.message;

    console.error(error);

}
