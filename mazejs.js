var cwidth=900;
	var cheight=350;
	var ctx;//用于保存画布上的信息
	var everything=[];//保存所有对象
	var curwall;//对应当前墙
	var wallwidth=5;//固定墙宽
	var wallstyle="rgb(200,0,200)";
	var walls=[];//保存所有墙
	var inmotion=false;//正在拖动鼠标的指示
	var unit=10;//物体移动单位
function Token(sx,sy,rad,stylestring,n)//设置被移动物体的形态
{
    this.sx=sx;//设置属性
	this.sy=sy;
	this.rad=rad;
	this.draw=drawtoken;//设置绘制方法
	this.n=n;//设置图形边数
	this.angle=(2*Math.PI)/n;//计算角度？
	this.moveit=movetoken;//设置物体移动方法
	this.fillstyle=stylestring;//颜色
}
function drawtoken()//被移动物体的初始值
{
    ctx.fillStyle=this.fillstyle;
	var i;
	var rad=this.rad;
	ctx.beginPath();//开始路径
	ctx.moveTo(this.sx+rad*Math.cos(-.5*this.angle),this.sy+rad*Math.sin(-.5*this.angle));//移动到物体的第一个顶点
	for(i=1;i<this.n;i++)
	{ctx.lineTo(this.sx+rad*Math.cos((i-.5)*this.angle),this.sy+rad*Math.sin((i-.5)*this.angle));}
	ctx.fill();//图形绘制
}
function movetoken(dx,dy)//移动物体并判断是否触墙
{
    this.sx +=dx;//移动物体
	this.sy +=dy;
	var i;
	var wall;//用于每一面墙
	for(i=0;i<walls.length;i++)
	{
	    wall=walls[i];//抽取第i面墙
		if(intersect(wall.sx,wall.sy,wall.fx,wall.fy,this.sx,this.sy,this.rad))//检查物体与墙是否相交
		{
		   this.sx -=dx;//撤回移动
		   this.sy -=dy;
		   break;
		}
	}
	 if(this.sx == goal.sx && this.sy == goal.sy)
    {alert("you win!");
     
     }
     if(this.sx>900 || this.sx<0 || this.sy<0 || this.sy>350)
	 {alert("you are out of the canvas!");
      this.sx=100;
	  this.sy=100;
     }
}
function Wall(sx,sy,fx,fy,width,stylestring)//墙的初始化设置
{
    this.sx=sx;
	this.sy=sy;
	this.fx=fx;
	this.fy=fy;
	this.width=width;
	this.draw=drawAline;//设置绘制方法
	this.strokestyle=stylestring;//颜色
}
function drawAline()//墙的绘制方法
{
    ctx.lineWidth=this.width;//线宽
	ctx.strokeStyle=this.strokestyle;
	ctx.beginPath();//开始路径
	ctx.moveTo(this.sx,this.sy);//线的起点
	ctx.lineTo(this.fx,this.fy);//线的终点
	ctx.stroke();//画线
}




var mypent=new Token(100,100,20,"rgb(0,0,250)",5);//游戏角色设置
var goal=new Token(800,250,20,"rgb(0,250,250)",3);
everything.push(mypent);
everything.push(goal);
function init()
{
    ctx=document.getElementById('canvas').getContext('2d');//完成所有绘制
	canvas1=document.getElementById('canvas');//定义cavas1
	canvas1.addEventListener('mousedown',startwall,false);
	canvas1.addEventListener('mousemove',stretchwall,false);
	canvas1.addEventListener('mouseup',finish,false);
	window.addEventListener('keydown',getkeyAndMove,false);
	drawall();
	
}
function startwall(ev)
{   
    var mx;
	var my;
	if(ev.layerX || ev.layerX == 0)//用layerX确定鼠标位置
	{
	    mx=ev.layerX;
		my=ev.layerY;
	}
	else if(ev.offsetX || ev.offsetX == 0)//用offsetX确定鼠标位置
	{
	    mx=ev.offsetX;
		my=ev.offsetY;
	}
	curwall=new Wall(mx,my,mx+1,my+1,wallwidth,wallstyle);//创建新的墙
	inmotion=true;
	everything.push(curwall);
	drawall();
}
function stretchwall(ev)
{
    if(inmotion)
	{
	    var mx;
		var my;
		if(ev.layerX || ev.layerX == 0)
		{
		    mx=ev.layerX;
		    my=ev.layerY;
		}
		else if(ev.offsetX || ev.offsetX == 0)
	    {
	        mx=ev.offsetX;
		    my=ev.offsetY;
	    }
		curwall.fx=mx;
		curwall.fy=my;
		drawall();
	}
}
function finish(ev)
{
    inmotion=false;
	walls.push(curwall);//将绘制的墙加入已有的墙
}
function drawall()//绘制所有对象
{
    ctx.clearRect(0,0,cwidth,cheight);//擦除画布
	var i;
	for(i=0;i<everything.length;i++)
	    {everything[i].draw();}
}
function getkeyAndMove(event)
{
    var keyCode;
	if(event == null)
	{
	    keyCode=window.event.keyCode;
		window.event.preventDefault();//停止默认动作
	}
	else
	{
	    keyCode=event.keyCode;
		event.preventDefault();
	}
	switch(keyCode)
	{
	    case 37:mypent.moveit(-unit,0);break;
		case 38:mypent.moveit(0,-unit);break;
		case 39:mypent.moveit(unit,0);break;
		case 40:mypent.moveit(0,unit);break;
		default:window.removeEventListener('keydown',getkeyAndMove,false);
	}
	drawall();
}
function intersect(sx,sy,fx,fy,cx,cy,rad) //用向量算法实现的伪碰撞检测
{
    var dx;
	var dy;
	var t;
	var rt;
	dx=fx-sx;
	dy=fy-sy;
	t=0.0-((sx-cx)*dx+(sy-cy)*dy)/((dx*dx)+(dy*dy));
	if(t<0.0)
	   {t=0.0;} 
	else if(t>1.0)
	   {t=1.0;} 
	dx=(sx+t*(fx-sx))-cx;
	dy=(sy+t*(fy-sy))-cy;
	rt=(dx*dx)+(dy*dy);
	if(rt<(rad*rad))
	   {return true;} 
	else
	   {return false;}
}
//存储墙体数据，请使用chrome或fireFox测试
function savewalls() {
    var w = [];//w存储每个墙体的起始点、结束点坐标信息
    var allw=[];//allw存储所有的墙体
    var sw;//所有的信息转换为字符串后保存到sw中
    var onewall;//存储墙体坐标信息的字符串
    var i;
    //获取数据的名称
    var lsname = document.sf.slname.value;
    //变量墙体的坐标数据，并将它们保存到w中
    for (i=0;i<walls.length;i++) {
        w.push(walls[i].sx);
        w.push(walls[i].sy);
        w.push(walls[i].fx);
        w.push(walls[i].fy);
        onewall = w.join("+");//将墙体坐标信息转换为字符串，以"+"分割
        allw.push(onewall);//将墙体添加到allw数组中
        w = [];//清空w，因为要用它来存储下一个墙体的数据
    }
    sw = allw.join(";");//将所有墙体的所有信息转换为字符串，以";"分割传递给sw
    
    try {
     localStorage.setItem(lsname,sw);//存储数据
     alert("Walls saved as "+lsname);
        }
      catch (e) {//捕获数据存储错误，并给出错误提示信息
         alert("data not saved, error given: "+e);
          }
    return false;//方式表单提交后页面跳转
}
function getwalls() {
    var swalls;
    var sw;
    var i;
    var sx;
    var sy;
    var fx;
    var fy;
    var curwall;
    var lsname=document.gf.glname.value;
    swalls=localStorage.getItem(lsname);
    if (swalls!=null) {//如果信息不为空，进行数据解码
    wallstgs = swalls.split(";");//首先分解成单独的墙体
    for (i=0;i<wallstgs.length;i++) {//然后将每个墙体的坐标信息分离出来
        sw = wallstgs[i].split("+");
        
        sx = Number(sw[0]);
        sy = Number(sw[1]);
        fx = Number(sw[2]);
        fy = Number(sw[3]);
        curwall = new Wall(sx,sy,fx,fy,wallwidth,wallstyle);//创建新的墙体
        walls.push(curwall);//将墙体添加到walls数组中
        everything.push(curwall);//将墙体添加到everything显示列表中
    }
    //刷新屏幕
    drawall();
    }
    else {
        //如果swalls为空，提示没有存储任何数据
        alert("No data retrieved.");
    }
    //侦听键盘事件
    window.addEventListener('keydown',getkeyAndMove,false);
    return false;//防止页面跳转
}
