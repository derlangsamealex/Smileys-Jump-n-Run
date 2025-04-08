let to1,world, enemy;
onload=function() {
  to1=setTimeout(init,500)
}
function init() {
  world=new World();  
  world.start();
}
onkeydown = function() {
	switch(event.key) {
		case "ArrowLeft":
		    world.player.direction="left";
		break;
		case "ArrowRight":
			world.player.direction="right";
		break;
		case " ":
			world.player.jump();
		break;
	}
}
onkeyup = function() {
	switch(event.key) {
		case "ArrowLeft":
		    world.player.direction=undefined;
		break;
		case "ArrowRight":
			world.player.direction=undefined;
		break;
	}
}
function randomFloor(canvas,ctx,count) {
  
  switch (Math.ceil(Math.random()*3)) {
    case 1:
      ctx.beginPath();
      ctx.moveTo(count,300);
      ctx.lineTo(count+180,300);
      ctx.moveTo(count+180,250);
      ctx.lineTo(count+200,250);
      ctx.moveTo(count+200,200);
      ctx.lineTo(count+220,200);
      ctx.moveTo(count+250,200);
      ctx.lineTo(count+300,200);
      ctx.stroke();
    break;
    case 2:
      ctx.beginPath();
      ctx.moveTo(count,280);
      ctx.lineTo(count+100,280);
      ctx.moveTo(count+140,280)
      ctx.lineTo(count+180,280);
      ctx.moveTo(count+200,280);
      ctx.lineTo(count+220,280);
      ctx.moveTo(count+240,280);
      ctx.lineTo(count+260,280);
      ctx.moveTo(count+280,280);
      ctx.lineTo(count+300,280);;
      ctx.stroke();
    break;
    case 3:
      ctx.beginPath();
      ctx.moveTo(count,300);
      ctx.lineTo(count+100,300);
      ctx.moveTo(count+140,260)
      ctx.lineTo(count+180,260);
      ctx.moveTo(count+200,220);
      ctx.lineTo(count+220,220);
      ctx.moveTo(count+240,180);
      ctx.lineTo(count+260,180);
      ctx.moveTo(count+280,280);
      ctx.lineTo(count+300,280);
      ctx.stroke();
  }
}
function endFloor(surface,ctx,count) {
  ctx.beginPath();
  ctx.moveTo(count,300);
  ctx.lineTo(count+360,300);
  ctx.stroke();
  enemy=new Enemy(count+250,275);
  surface.appendChild(enemy.canvas);
  
}
function calcDirection(dx,dy) {
  if(dx==0&&dy==0) {
    return 0;
  }
  if(dx>=0&&dy>=0) {
    return Math.PI-Math.atan(Math.abs(dx/dy));
  }
  if(dx>=0&&dy<0) {    
    return Math.atan(Math.abs(dx/dy));
  }
  if(dx<0&&dy<0) {
    return 2*Math.PI-Math.atan(Math.abs(dx/dy));
  }
  if(dx<0&&dy>=0) {
    return Math.PI+Math.atan(Math.abs(dx/dy));
  }
}        
World=function() {
  this.g=0.1;
  this.t1=0;
  this.count=0;
  this.surface=document.createElement("div");
  this.surface.style.position="absolute";
  this.surface.style.left=0;
  this.surface.style.top=0;
  this.surface.style.width=innerWidth+"px";
  this.surface.style.height=innerHeight-100+"px";
  this.surface.style.overflow="hidden";
  document.body.appendChild(this.surface);
  this.canvas=document.createElement("canvas");
  this.canvas.style.position="absolute";
  this.canvas.style.left=0;
  this.canvas.style.top=0;
  this.canvas.width=5000;
  this.canvas.height=500;
  this.surface.appendChild(this.canvas);
  this.ctx=this.canvas.getContext("2d");
  this.player=new Player(100,276);
  this.control=new Control(this.player); 
  this.surface.appendChild(this.player.canvas);
  this.setFloor=function() {
    this.ctx.beginPath();
    this.ctx.moveTo(0,300);
    this.ctx.lineWidth=10;
    this.ctx.lineTo(300,300);
    this.ctx.stroke();
  }
  this.setFloor();
  this.start=function() {
    this.t1=setInterval(this.isRunning.bind(this),20);
  }
  this.isRunning=function() {
    if(this.ctx.getImageData(this.player.xPos+10,Math.ceil(this.player.yPos)+20,1,1).data[0]==0&&this.ctx.getImageData(this.player.xPos+10,Math.ceil(this.player.yPos)+20,1,1).data[3]==255) {
      this.player.falling?this.player.vy=0:null;
      this.player.falling=false;
    } else {
      this.player.falling=true;
      this.vy>=1?null:this.player.vy+=this.g;
    }
    this.player.move();
    if(this.count>=3000) {
      this.count%300==0?endFloor(this.surface,this.ctx,this.count):null;
      if(this.count<=3290) {
        this.count+=0.5;
      this.surface.scrollLeft=-300+this.count; 
      }
    } else {
      this.surface.scrollLeft=-300+this.count++;
      (this.count)%300==0?randomFloor(this.surface,this.ctx,this.count):null;
    }
    if(this.player.xPos<=0+this.count/4-20||this.player.yPos>=500) {
      this.ctx.clearRect(300,0,36000,500);
      this.count=0;
      this.player.xPos=100;
      this.player.yPos=276;
      this.player.vy=0;
      alert("again")
    }
  }
}
Control=function(player) {
  this.surface=document.createElement("div");
  this.surface.style.position="absolute";
  this.surface.style.left=0;
  this.surface.style.top=innerHeight-100+"px";
  this.surface.style.width=innerWidth+"px";
  this.surface.style.height=100+"px";
  this.surface.style.backgroundColor="#AAAAAA"
  this.surface.style.overflow="hidden";
  document.body.appendChild(this.surface);
  this.moveButton=new MoveButton(20,0,player);  
  this.button=new Button(200,0,player);
  this.surface.appendChild(this.moveButton.canvas);
  this.surface.appendChild(this.button.canvas);
}
MoveButton=function(x,y,player) {
  let xt,yz,touches=0;
  this.width=innerWidth;
  this.height=innerHeight;
  this.canvas=document.createElement("canvas");
  this.canvas.style.position="absolute";
  this.canvas.style.left=x+"px";    
  this.canvas.style.top=0;
  this.canvas.width=100;
  this.canvas.height=100;  
  this.ctx=this.canvas.getContext("2d");
  for(let i=1;i<=7;i+=2) {
    this.ctx.beginPath();     
    this.ctx.fillStyle="grey";
    this.ctx.arc(50,50,49,Math.PI/4*i,Math.PI/4*(i+2));   
    this.ctx.lineTo(50,50);
    this.ctx.fill();
    this.ctx.stroke();
  }
  this.handleEvent=function(){
    switch(event.type) {
      case "touchstart":
        xt=event.touches[0].clientX-x;
 yt=event.touches[0].clientY-this.height+100;
        if(event.touches.length==2) {
          xt=event.targetTouches[0].clientX-x; 
          yt=event.targetTouches[0].clientY-this.height+100;
        }     
        this.pressedKey(xt,yt);
      break;
      case "touchmove":
        xt=event.touches[0].clientX-x;
        yt=event.touches[0].clientY-this.height+100;
        if(event.touches.length==2) {
          xt=event.targetTouches[0].clientX-x; 
          yt=event.targetTouches[0].clientY-this.height+100;
        } 
        this.pressedKey(xt,yt)
      break;
      case "touchend":
        player.direction=undefined;
      break;
    }
  }
  this.pressedKey=async function(x,y) {
    let dx=x-50;
    let dy=y-50;
    let delta=(dx**2+dy**2)**0.5;   
    if(delta<=50) {
      if(calcDirection(dx, dy) > Math.PI/4*7||calcDirection(dx, dy) <= Math.PI/4) {
        player.direction="up";
      }  
      if(calcDirection(dx, dy) > Math.PI/4&&calcDirection(dx,dy) <= Math.PI/4*3) {
        player.direction="right";
      }
      if(calcDirection(dx,dy)>Math.PI/4*3&&calcDirection(dx,dy)<=Math.PI/4*5) {
        player.direction="down";  
      }
      if(calcDirection(dx,dy)>Math.PI/4*5&&calcDirection(dx,dy)<=Math.PI/4*7) {
        player.direction="left";  
      }
    }
    else {
      player.direction=undefined;
    }
  }
  this.canvas.addEventListener("touchstart",this);
  this.canvas.addEventListener("touchmove",this);
  this.canvas.addEventListener("touchend",this)
}
Button=function(x,y,player) {
this.canvas=document.createElement("canvas");
  this.canvas.style.position="absolute";
  this.canvas.style.left=x+"px";
  this.canvas.style.top=0;
  this.canvas.width=100;
  this.canvas.height=100;  
  this.ctx=this.canvas.getContext("2d");
  this.ctx.beginPath();
  this.ctx.fillStyle="grey";
  this.ctx.arc(50,50,30,0,2*Math.PI);
  this.ctx.fill();
  this.handleEvent=function() {
    switch(event.type) {
      case "touchstart":
        player.jump();
      break;
    }
  }
  this.canvas.addEventListener("touchstart",this);
}
Player=function(x,y) {    
  this.falling=true;
  this.count=0;
  this.vy=0;
  this.xPos=x;
  this.yPos=y;
  this.direction;
  this.canvas=document.createElement("canvas");
  this.canvas.style.position="absolute";
  this.canvas.style.left=x+"px";
  this.canvas.style.top=y+"px";
  this.canvas.width=22;
  this.canvas.height=22;  
  this.ctx=this.canvas.getContext("2d");
  this.createSmiley=function() {
    this.ctx.beginPath();     
    this.ctx.fillStyle="yellow";
   this.ctx.arc(11,11,10,0,Math.PI*2,true);   
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.beginPath();     
    this.ctx.fillStyle="black";
    this.ctx.arc(8,8,1.2,0,Math.PI*2,true);   
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(14,8,1.2,0,Math.PI*2,true);   
    this.ctx.fill();
    this.ctx.beginPath();
        this.ctx.arc(11,12,3.3,Math.PI*0.8,Math.PI*0.2,true);
      this.ctx.stroke();
  }
  this.createSmiley();
  this.animation=function() {
    this.count++;
    if(this.count<=40)
    {
      this.ctx.beginPath();
      this.ctx.strokeStyle="black";
        this.ctx.arc(11,12,3.3,Math.PI*0.8,Math.PI*0.2,true);
      this.ctx.stroke();
    }
    else
    {
      this.ctx.beginPath();
      this.ctx.strokeStyle="yellow";
        this.ctx.arc(11,12,3.3,Math.PI*0.8,Math.PI*0.2,true);
      this.ctx.stroke()
      this.ctx.beginPath();
      this.ctx.fillStyle="black"
      this.ctx.arc(11,15.8,2.5,0,Math.PI*2,true);
      this.ctx.fill();    
      if(this.count==80) {
        this.count=0;  
        this.ctx.beginPath();
        this.ctx.fillStyle="yellow";
        this.ctx.arc(11,15.8,2.5,0,Math.PI*2,true);
        this.ctx.fill();
        this.ctx.stroke();
      }
    }        
  }
  this.move=function() {
    switch(this.direction) {
      case "up":
        
      break;
      case "down":
        
      break;
      case "left":
        this.xPos-=2;
        this.canvas.style.left=this.xPos+"px";
      break;
      case "right":
        this.xPos+=2;
        this.canvas.style.left=this.xPos+"px";
      break;
      default:
    }
    
    this.yPos+=this.vy;
    this.canvas.style.top=this.yPos+"px";
    this.animation();
  }        
  this.jump=function() {
    this.falling?null:this.vy=-3.6;
  }
}
Enemy=function(x,y) {
  this.canvas=document.createElement("canvas");
  this.canvas.style.position="absolute";
  this.canvas.style.left=x+"px";
  this.canvas.style.top=y+"px";
  this.canvas.width=22;
  this.canvas.height=22;  
  this.ctx=this.canvas.getContext("2d");
  this.ctx.beginPath();
  this.ctx.fillStyle="#FF0000";
  this.ctx.arc(11,11,10,0,2*Math.PI);  
  this.ctx.fill();
}