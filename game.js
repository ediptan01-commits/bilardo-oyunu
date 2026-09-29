const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const info = document.getElementById("info");
const powerSlider = document.querySelector("#power input");

let W, H;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

/* =========================
   MASA
========================= */

const table = {
    x: 45,
    y: 130,
    w: 0,
    h: 0
};

function updateTable() {
    table.w = Math.min(W - 90, 650);
    table.h = table.w * 0.52;

    table.x = (W - table.w) / 2;
    table.y = Math.max(100, (H - table.h) / 2);
}

updateTable();

/* =========================
   TOPLAR
========================= */

const balls = [];

const colors = [
    "#ffffff",
    "#ffd21c",
    "#1746d1",
    "#d92828",
    "#7d27b8",
    "#ff7b19",
    "#168a3a",
    "#8b1e24",
    "#111111",
    "#ffd21c",
    "#1746d1",
    "#d92828",
    "#7d27b8",
    "#ff7b19",
    "#168a3a",
    "#8b1e24"
];

function createBall(x, y, color, number) {

    balls.push({
        x,
        y,
        vx: 0,
        vy: 0,
        r: 11,
        color,
        number
    });
}

/* Beyaz top */

createBall(
    0.25,
    0.5,
    "#ffffff",
    0
);

/* Üçgen dizilim */

const startX = 0.68;
const startY = 0.5;
const spacing = 0.034;

let number = 1;

for (let row = 0; row < 5; row++) {

    for (let col = 0; col <= row; col++) {

        createBall(
            startX + row * spacing,
            startY + (col - row / 2) * spacing,
            colors[number],
            number
        );

        number++;

    }
}

/* =========================
   KOORDİNAT
========================= */

function ballPosition(ball) {

    return {
        x: table.x + ball.x * table.w,
        y: table.y + ball.y * table.h
    };
}

/* =========================
   DELİKLER
========================= */

function pockets() {

    const r = 22;

    return [

        { x: table.x, y: table.y, r },
        { x: table.x + table.w / 2, y: table.y, r },
        { x: table.x + table.w, y: table.y, r },

        { x: table.x, y: table.y + table.h, r },
        { x: table.x + table.w / 2, y: table.y + table.h, r },
        { x: table.x + table.w, y: table.y + table.h, r }

    ];
}

/* =========================
   NİŞAN
========================= */

let aimX = W / 2;
let aimY = H / 2;

let aiming = false;

canvas.addEventListener("pointerdown", e => {

    aiming = true;

    aimX = e.clientX;
    aimY = e.clientY;

});

canvas.addEventListener("pointermove", e => {

    if (!aiming) return;

    aimX = e.clientX;
    aimY = e.clientY;

});

canvas.addEventListener("pointerup", e => {

    if (!aiming) return;

    aiming = false;

    shoot(e.clientX, e.clientY);

});

/* =========================
   VURUŞ
========================= */

function shoot(x, y) {

    const cue = balls[0];

    const p = ballPosition(cue);

    let dx = p.x - x;
    let dy = p.y - y;

    const length = Math.sqrt(
        dx * dx + dy * dy
    );

    if (length < 5) return;

    dx /= length;
    dy /= length;

    const power =
        Number(powerSlider.value) / 5;

    cue.vx = dx * power;
    cue.vy = dy * power;
}

/* =========================
   FİZİK
========================= */

function physics() {

    for (const ball of balls) {

        ball.x += ball.vx / table.w;
        ball.y += ball.vy / table.h;

        ball.vx *= 0.985;
        ball.vy *= 0.985;

        if (Math.abs(ball.vx) < 0.01) {
            ball.vx = 0;
        }

        if (Math.abs(ball.vy) < 0.01) {
            ball.vy = 0;
        }

        const radiusX = ball.r / table.w;
        const radiusY = ball.r / table.h;

        if (ball.x < radiusX) {

            ball.x = radiusX;
            ball.vx *= -0.85;

        }

        if (ball.x > 1 - radiusX) {

            ball.x = 1 - radiusX;
            ball.vx *= -0.85;

        }

        if (ball.y < radiusY) {

            ball.y = radiusY;
            ball.vy *= -0.85;

        }

        if (ball.y > 1 - radiusY) {

            ball.y = 1 - radiusY;
            ball.vy *= -0.85;

        }

    }

    /* Top-top çarpışması */

    for (let i = 0; i < balls.length; i++) {

        for (let j = i + 1; j < balls.length; j++) {

            const a = balls[i];
            const b = balls[j];

            const ax = a.x * table.w;
            const ay = a.y * table.h;

            const bx = b.x * table.w;
            const by = b.y * table.h;

            let dx = bx - ax;
            let dy = by - ay;

            let distance =
                Math.sqrt(dx * dx + dy * dy);

            const minDistance =
                a.r + b.r;

            if (distance === 0) {
                distance = 0.01;
            }

            if (distance < minDistance) {

                dx /= distance;
                dy /= distance;

                const overlap =
                    minDistance - distance;

                a.x -= dx * overlap / table.w / 2;
                a.y -= dy * overlap / table.h / 2;

                b.x += dx * overlap / table.w / 2;
                b.y += dy * overlap / table.h / 2;

                const relativeVelocity =
                    (b.vx - a.vx) * dx +
                    (b.vy - a.vy) * dy;

                if (relativeVelocity < 0) {

                    const impulse =
                        relativeVelocity * 0.95;

                    a.vx += dx * impulse;
                    a.vy += dy * impulse;

                    b.vx -= dx * impulse;
                    b.vy -= dy * impulse;

                }

            }

        }

    }

    /* Delik kontrolü */

    for (let i = balls.length - 1; i >= 0; i--) {

        const ball = balls[i];
        const p = ballPosition(ball);

        for (const pocket of pockets()) {

            const dx = p.x - pocket.x;
            const dy = p.y - pocket.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < pocket.r - 4) {

                if (ball.number === 0) {

                    ball.x = 0.25;
                    ball.y = 0.5;
                    ball.vx = 0;
                    ball.vy = 0;

                } else {

                    balls.splice(i, 1);

                }

                break;

            }

        }

    }

}

/* =========================
   ÇİZİM
========================= */

function drawTable() {

    updateTable();

    /* Ahşap dış kasa */

    ctx.fillStyle = "#633b1d";

    ctx.fillRect(
        table.x - 25,
        table.y - 25,
        table.w + 50,
        table.h + 50
    );

    /* Yeşil bant */

    ctx.fillStyle = "#126b38";

    ctx.fillRect(
        table.x - 15,
        table.y - 15,
        table.w + 30,
        table.h + 30
    );

    /* Masa */

    ctx.fillStyle = "#087a3e";

    ctx.fillRect(
        table.x,
        table.y,
        table.w,
        table.h
    );

    /* Hafif perspektif çizgileri */

    ctx.strokeStyle =
        "rgba(255,255,255,0.08)";

    ctx.lineWidth = 2;

    for (let i = 1; i < 6; i++) {

        const x =
            table.x + table.w * i / 6;

        ctx.beginPath();

        ctx.moveTo(x, table.y);
        ctx.lineTo(x, table.y + table.h);

        ctx.stroke();

    }

    /* Delikler */

    for (const pocket of pockets()) {

        ctx.beginPath();

        ctx.arc(
            pocket.x,
            pocket.y,
            pocket.r,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#050505";

        ctx.fill();

        ctx.strokeStyle = "#222";

        ctx.lineWidth = 3;

        ctx.stroke();

    }

}

/* =========================
   TOP ÇİZİM
========================= */

function drawBalls() {

    for (const ball of balls) {

        const p = ballPosition(ball);

        /* Gölge */

        ctx.beginPath();

        ctx.arc(
            p.x + 3,
            p.y + 4,
            ball.r,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(0,0,0,0.35)";

        ctx.fill();

        /* Top */

        const gradient =
            ctx.createRadialGradient(
                p.x - 4,
                p.y - 5,
                1,
                p.x,
                p.y,
                ball.r
            );

        gradient.addColorStop(
            0,
            "#ffffff"
        );

        gradient.addColorStop(
            0.25,
            ball.color
        );

        gradient.addColorStop(
            1,
            "#111111"
        );

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            ball.r,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = gradient;

        ctx.fill();

        /* Numara */

        if (ball.number > 0) {

            ctx.fillStyle = "#ffffff";

            ctx.font =
                "bold 8px Arial";

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(
                ball.number,
                p.x,
                p.y
            );

        }

    }

}

/* =========================
   ISTAKA / NİŞAN ÇİZGİSİ
========================= */

function drawAim() {

    const cue = balls[0];

    if (!cue) return;

    const p = ballPosition(cue);

    if (!aiming) {

        ctx.beginPath();

        ctx.moveTo(p.x, p.y);
        ctx.lineTo(aimX, aimY);

        ctx.strokeStyle =
            "rgba(255,255,255,0.35)";

        ctx.lineWidth = 2;

        ctx.setLineDash([8, 8]);

        ctx.stroke();

        ctx.setLineDash([]);

    }

    /* Istaka */

    let dx = p.x - aimX;
    let dy = p.y - aimY;

    const len =
        Math.sqrt(dx * dx + dy * dy);

    if (len < 1) return;

    dx /= len;
    dy /= len;

    const cueLength = 130;

    const startX =
        p.x - dx * 35;

    const startY =
        p.y - dy * 35;

    const endX =
        p.x - dx * cueLength;

    const endY =
        p.y - dy * cueLength;

    ctx.beginPath();

    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);

    ctx.strokeStyle = "#d8a45d";
    ctx.lineWidth = 7;

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(startX, startY);
    ctx.lineTo(
        startX - dx * 18,
        startY - dy * 18
    );

    ctx.strokeStyle = "#eeeeee";
    ctx.lineWidth = 4;

    ctx.stroke();

}

/* =========================
   OYUN DÖNGÜSÜ
========================= */

function gameLoop() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );

    drawTable();

    physics();

    drawBalls();

    drawAim();

    requestAnimationFrame(gameLoop);

}

info.textContent =
    "🎱 3D Bilardo • Nişan al ve vur";

gameLoop();
