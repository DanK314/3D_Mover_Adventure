const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');
let SW = canvas.width;
let SH = canvas.height;
const FPS = 120

function pol(r, thetaInDegrees) {
    const theta = thetaInDegrees * Math.PI / 180;
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    return { x, y };
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Player {
    constructor(x, y, w, h, img) {
        this.x = x;
        this.dx = 0;
        this.y = y;
        this.dy = 0;
        this.w = w;
        this.h = h;
        this.img = img;
        this.hp = 10;
    }
    Update() {
        this.x += this.dx;
        this.y += this.dy;
        this.dy *= 0.9;
        this.dx *= 0.9;
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
}

class Mover {
    constructor(x, y, w, h, img) {
        this.x = x;
        this.dx = 0;
        this.y = y;
        this.dy = 0;
        this.w = w;
        this.h = h;
        this.img = img;
        this.status = 0;
        this.targetX = null;
        this.targetY = null;
        this.speed = 10;
    }
    update(P) {
        if (this.targetX !== null && this.targetY !== null) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.hypot(dx, dy);

            if (dist < this.speed) {
                // 목표 근처 도착 시 위치 고정 및 이동 종료
                this.x = this.targetX;
                this.y = this.targetY;
                this.targetX = null;
                this.targetY = null;
            } else {
                // 단위 벡터 곱해서 일정 속도로 이동
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }
        }else{
            this.x = P.x;
            this.y = P.y;
        }
    }
    clickEvent(e) {
        if (e.button === 0 && this.targetX === null && this.targetY === null) {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        }
    }
    draw(ctx,P){
        ctx.drawImage(this.img, this.x,this.y, this.w, this.h);
        ctx.beginPath();
        ctx.moveTo(P.x,P.y);
        ctx.lineTo(this.x,this.y);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.stroke();
    }
}
let player;
let mover;
let Images = [new Image(),new Image()];

Images[0].src = "imgs/Player.png"
Images[1].src = "imgs/mover.png"

function reset(){
    player = new Player((SW/2)-15,0,30,30,Images[0])
    mover = new Mover(player.x,player.y,10,10,Images[1])
}
function StartGame() {
    reset();

    // 현재 눌려 있는 키의 상태를 저장하는 객체
    const pressedKeys = {};

    // 키를 누를 때 이벤트
    addEventListener("keydown", (e) => {
        // 화살표 키가 눌렸을 때 브라우저의 기본 스크롤 동작을 막음
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
        }
        // 눌린 키의 상태를 true로 설정
        pressedKeys[e.key] = true;
    });

    // 키에서 손을 뗄 때 이벤트
    addEventListener("keyup", (e) => {
        // 손을 뗀 키의 상태를 false로 설정
        pressedKeys[e.key] = false;
    });

    // 메인 루프에서 플레이어의 속도를 업데이트하는 함수
    function updatePlayerMovement() {
        const speed = 5;
        let dx = 0;
        let dy = 0;

        // 눌린 키 상태에 따라 dx와 dy를 설정
        if (pressedKeys["ArrowLeft"]) {
            dx = -speed;
        }
        if (pressedKeys["ArrowRight"]) {
            dx = speed;
        }
        if (pressedKeys["ArrowUp"]) {
            dy = -speed;
        }
        if (pressedKeys["ArrowDown"]) {
            dy = speed;
        }

        // 플레이어의 최종 속도에 할당
        player.dx = dx;
        player.dy = dy;
    }

    function mainLoop() {
        SW = canvas.width;
        SH = canvas.height;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, SW, SH);

        updatePlayerMovement(); // 매 프레임마다 키 상태를 확인하여 플레이어 속도 업데이트

        player.Update();
        mover.update(player);
        player.draw(ctx);
        mover.draw(ctx, player);
    }

    addEventListener("mousedown", (e) => mover.clickEvent(e));
    setInterval(mainLoop, 1000 / FPS);
}
// Promise를 사용하여 각 이미지의 로딩을 기다립니다.
function load() {
    const promises = Images.map(img => {
        return new Promise((resolve, reject) => {
            img.onload = () => {
                console.log("Image loaded!");
                resolve();
            };
            img.onerror = () => {
                console.log("Image failed to load!");
                reject();
            };
        });
    });

    // 모든 Promise가 완료될 때까지 기다립니다.
    Promise.all(promises)
        .then(() => {
            console.log("All images loaded successfully!");
            StartGame();
        })
        .catch(() => {
            console.error("Failed to load one or more images.");
        });
}
load();