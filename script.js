const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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

class Player{
    constructor(x,y,w,h,img){
        this.x = x;
        this.dx = 0;
        this.y = y;
        this.dy = 0;
        this.w = w;
        this.h = h;
        this.img = img;
        this.hp = 10;
        this.status = 0
    }
    Update(){
        this.x += this.dx;
        this.y += this.dy;
        this.dy *= 0.9;
        this.dx *= 0.9;
    }
    draw(ctx){
        ctx.drawImage(this.img[this.status],this.x,this.y,this.w,this.h);
    }
}

class Mover{
    constructor(x,y,w,h,img){
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
    update() {
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
    }
  }
    clickEvent(e){
        if(e.button === 0 && this.targetX === null && this.targetY === null){
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        }
    }
}