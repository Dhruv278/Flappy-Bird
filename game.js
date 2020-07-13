

const cvs=document.getElementById("canvas")

const ctx=cvs.getContext("2d")
let degree=Math.PI/180;
start=1
let frame=0;
const sprite=new Image()
sprite.src="/img/sprite.png"
const SCORE_S=new Audio();
SCORE_S.src="/audio/sfx_point.wav";
const SWOOSH=new Audio();
SWOOSH.src="/audio/sfx_swooshing.wav";
const HIT=new Audio();
HIT.src="/audio/sfx_hit.wav";
const FLAP=new Audio();
FLAP.src="/audio/sfx_flap.wav";
const DIE=new Audio();
DIE.src="/audio/sfx_die.wav";
const getState={
    current:0,
    getready:0,
    game:1,
    over:2,
};
const startButton={
    x:120,
    y:275,
    w:83,
    h:29
}
cvs.addEventListener("click",function(evt){
   
    switch(getState.current){
        case getState.getready:
            SWOOSH.play()
            getState.current=getState.game;
            break;
        case getState.game:
            FLAP.play()
            bird.flap();
        
            break;
        case getState.over:
            let rect=cvs.getBoundingClientRect();
            let clickX=evt.clientX-rect.left;
            let clickY=evt.clientY-rect.top;
          console.log(clickX>=startButton.x,clickX<=startButton.x+startButton.w,clickY>=startButton.y,clickY,startButton.y+startButton.h)

            if(clickX>=startButton.x&& clickX<=startButton.x+startButton.w&&clickY>=
                startButton.y&&clickY<=startButton.y+startButton.h){
                    pipes.reset();
                    bird.speedReset();
                    score.reset()
                    getState.current=getState.getready;
                }
            break;
        
    }
  
    });
 bg={
    sX:0,
    sY:0,
    w:275,
    h:226,
    x:0,
    y:cvs.height-226,
    drawBg:function(){
      
       ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h)
       ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x+this.w,this.y,this.w,this.h)
    }
}
const fg={
    sX:276,
    SY:0,
    w:224,
    h:112,
    x:0,
    y:cvs.height-112,
    dx:2,
    drawFg:function(){
   
        ctx.drawImage(sprite,this.sX,this.SY,this.w,this.h,this.x,this.y,this.w,this.h)
        ctx.drawImage(sprite,this.sX,this.SY,this.w,this.h,this.x+this.w,this.y,this.w,this.h)
    },
    update:function(){
        if(getState.current==getState.game){
            this.x=(this.x-this.dx)%(this.w/2);
        }
    }
}
const bird={
    animation:[
        {sX:276,sY:112},
        {sX:276,sY:139},
        {sX:276,sY:164},
        {sX:276,sY:139},
    ],
    x:50,
    y:150,
    w:34,
    h:26,
    frame:0,
    gravity:0.20,
    speed:-0.75,
    jump:3.6,
    redius:12,
    rotation:0,
    drawBird:function(){
        let bird=this.animation[this.frame];
        ctx.save();
        ctx.translate(this.x,this.y)
        ctx.rotate(this.rotation)
        ctx.drawImage(sprite,bird.sX,bird.sY,this.w,this.h,-this.w/2,-this.h/2,this.w,this.w)
        ctx.restore()
    },
    flap:function(){
        // FLAP.play()
       this.speed=-this.jump
    },
    updateBird:function(){
        
        this.period=getState.current==getState.getready?10:5;
        this.frame+=frame%this.period==0 ? 1 : 0;
        this.frame=this.frame%this.animation.length;
        if(getState.getready==getState.current){
            this.rotation=0*degree
          this.y=150;
        }else{
            this.speed+=this.gravity;
            this.y+=this.speed;
            if(this.y+this.h/2>=cvs.height-fg.h){
                this.y=cvs.height-fg.h-this.h/2
               if(getState.current==getState.game){ 
                   DIE.play()
                getState.current=getState.over
               
         
               }
            }
            if(this.speed>=this.jump){
                this.rotation=90*degree
                this.frame=1
            }else{
                this.rotation=-25*degree
            }
        }
    },
    speedReset:function(){
        this.speed=-0.75
    }

}

const pipes={
    position:[],
    top:{
        sX:553,
        sY:0,
    },
    bottom:{
        sX:503,
        sY:0
    },
    w:53,
    h:400,
    gap:100,
    maxYPos:-170,
    dx:2,
    draw:function(){
       if(getState.current==getState.game){ 
        for (let index = 0; index < this.position.length; index++) {
            const p = this.position[index];
            let topYPos=p.y;
            let bottomYPos=p.y+this.h+this.gap;
            // top pipe
            ctx.drawImage(sprite,this.top.sX,this.top.sY,this.w,this.h,p.x,
                topYPos,this.w,this.h);
            // bottom pipe
            ctx.drawImage(sprite,this.bottom.sX,this.bottom.sY,this.w,this.h,p.x,bottomYPos,this.w,this.h);

            
        }
    }
    },
    update:function(){
        if(getState.current!=getState.game)return;
        if(frame%100==0){
            this.position.push({
                x:cvs.width,
                y:this.maxYPos*(Math.random()+1)
            });
        }
        for(let i=0;i<this.position.length;i++){
            let p=this.position[i];
            p.x-=this.dx
            bottomYPos=p.y+this.h+this.gap
            if(bird.x+bird.redius>p.x&&bird.x-bird.redius<p.x+this.w&&
                bird.y+bird.redius>p.y&& bird.y-bird.redius<p.y+this.h){
                    HIT.play()  
                    getState.current=getState.over;
                    
                }
            if(bird.x+bird.redius>p.x&&bird.x-bird.redius<p.x+this.w&&
                bird.y+bird.redius>bottomYPos&& bird.y-bird.redius<bottomYPos+this.h){
                    HIT.play()
                    getState.current=getState.over;
                  
                }
            if(p.x+this.w<bird.x-bird.w/2){
                score.value+=1;
                SCORE_S.play()
                score.best=Math.max(score.value,score.best)
                localStorage.setItem("best",score.best)
                this.position.shift();
            }
            if(p.x+this.w<=0){
             
            }
        }
    },
    reset:function(){
        this.position=[]
    }
  
}
const score={
    best:parseInt(localStorage.getItem("best"))||0,
    value:0,
    draw:function(){
        ctx.fillStyle="#FFF";
        ctx.strokeStyle="#000"
    if(getState.current==getState.game){
        ctx.lineWidth=2;
        ctx.font="35px Teko";
        ctx.fillText(this.value,cvs.width/2,50);
        ctx.strokeText(this.value,cvs.width/2,50);
    }
    else if(getState.current==getState.over){
        // score value
    
        ctx.font="25px Teko";
        ctx.fillText(this.value,225,190);
        ctx.strokeText(this.value,225,190);
        // Best value
        ctx.fillText(this.best,225,234);
        ctx.strokeText(this.best,225,234);
    }
    },
    reset:function(){
        this.value=0;
    }
}
// get ready message
const getready={
    sX:0,
    sY:228,
    w:173,
    h:152,
    x:cvs.width/2-173/2,
    y:80,
    draw:function(){
        if(getState.current==getState.getready){ 
           pipes.position=[]
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.w)
        }
    }
}
const gameover={
    sX:175,
    sY:228 ,
    w:225,
    h:202,
    x:cvs.width/2-225/2,
    y:90,
    draw:function(){
        if(getState.current==getState.over){ 
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.w)
        }
    }
}
// create state


function draw(){
    ctx.fillStyle="#70c5ce";
    ctx.fillRect(0,0,cvs.clientWidth,cvs.height)
    bg.drawBg()
    fg.drawFg()
    bird.drawBird()
    getready.draw()
    gameover.draw()
    pipes.draw()
    score.draw()
}
function update(){
    bird.updateBird()
    fg.update()
    pipes.update()
}
function loop(){
    update()
    draw()
 
    frame++;
    requestAnimationFrame(loop)
}
// if(start==1){
// sprite.onload=loop
// start++
// }
loop(); 
