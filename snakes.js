function myfunction()
{
	var canvas = document.getElementById('hexmape');
	var currState="left";
	var score = 0;
	var tx,ty;
	var playstate = "play";
	var hexHeight,hexRadius,
	hexRectHeight, hexRectWidth,
	sideLength = 15,	
	BoardWidth = 24,
	BoardHeight = 27,
	HexAngle = 0.5235987756;
	
	//DrawPLayfield
	hexHeight = Math.sin(HexAngle)*sideLength;
	hexRadius = Math.cos(HexAngle)*sideLength;
	hexRectHeight = sideLength + 2*hexHeight;
	hexRectWidth = 2*hexRadius;
	
	//SelectedCells
	var CurrCoord = [];
	CurrCoord.push({x:8*hexRectWidth,y:4.5*hexRectHeight});
	CurrCoord.push({x:9*hexRectWidth,y:4.5*hexRectHeight});
	CurrCoord.unshift({x:7*hexRectWidth,y:4.5*hexRectHeight});
	CurrCoord.unshift({x:6*hexRectWidth,y:4.5*hexRectHeight});
	
	if(canvas.getContext)
	{
		var ctx = canvas.getContext('2d');  
		ctx.strokeStyle = '#DEB887';
		ctx.lineWidth = 1;
		ctx.fillStyle = '#fffbb2'; 
		drawhexboard(ctx);
		
		ctx.fillStyle = '#005500';
		drawHexagon(ctx,CurrCoord[0].x,CurrCoord[0].y,true);
		
			for(var i=1;i<CurrCoord.length;i++)
			{
				selectCell(CurrCoord[i]);
			}
		
		genfood();
	}
	
	$('#res').css('width','30%');
	$('#res').css('float','left');
	$('#hexmape').css('float','left');
	
	$(document).keydown(function(e){
	
		console.log(e.keyCode);
		if((e.keyCode == 37)&&(playstate=="play"))
		{
			if(currState != "right")
			{
				currState = "left";
				move(CurrCoord,-1);
			}
		}
			
		if((e.keyCode == 38)&&(playstate=="play"))
		{
			if((currState === "left")||(currState === "upright"))
			{
				currState = "upleft";
				moveup(CurrCoord,-1);
			}
			else if((currState === "right")||(currState === "upleft"))
			{
				currState = "upright";
				moveup(CurrCoord,1);
			}	
		}
		
		if((e.keyCode == 39)&&(playstate=="play"))
		{	
			if(currState != "left")
			{	
				currState = "right";
				move(CurrCoord,1);
			}
		}
		
		if((e.keyCode == 40)&&(playstate=="play"))
		{
			if((currState === "left")||(currState === "downright"))
			{
				currState = "downleft";	
				movedown(CurrCoord,-1);
			}
			else if((currState === "right")||(currState === "downleft"))
			{
				currState = "downright";	
				movedown(CurrCoord,1);
			}	
		}
		
		//pause
		else if((e.keyCode == 32)&&(playstate=="play"))
		{
			playstate = "pause";
			clearInterval(myinterval);
		}
		
		else if((e.keyCode == 32)&&(playstate=="pause"))
		{
			playstate = "play";
			myinterval =setInterval(intervalfunc,200);
		}
		
		else if((e.keyCode == 32)&&(playstate=="gameover"))
		{
			playstate = "play";
			location.reload();
		}
	})
	
	function drawhexboard(ctx)
	{
	var i,j;
	for(i = 0; i < BoardWidth; ++i) 
	{
		for(j = 0; j < BoardHeight; ++j) 
		{
			drawHexagon(
			ctx,
			i * hexRectWidth + ((j % 2) * hexRadius),
			j * (sideLength + hexHeight),
			true
			);
		}
	}
	}
	
	function drawHexagon(canvasContext,x,y,fill)
	{
		var fill = fill || false;
		canvasContext.beginPath();
		canvasContext.moveTo(x + hexRadius, y);
		canvasContext.lineTo(x + hexRectWidth, y + hexHeight);
		canvasContext.lineTo(x + hexRectWidth, y + hexHeight + sideLength);
		canvasContext.lineTo(x + hexRadius, y + hexRectHeight);
		canvasContext.lineTo(x, y + sideLength + hexHeight);
		canvasContext.lineTo(x, y + hexHeight);
		//canvasContext.lineTo(x + hexRadius, y);
		canvasContext.closePath();
		if(fill) {
		canvasContext.fill();
		} 
		//else {
		canvasContext.stroke();
		//}	
	}
	
	
	//selectCell
	function selectCell(CurrCoord)
	{
		ctx.fillStyle = '#003300';   //snake color
		drawHexagon(ctx,CurrCoord.x,CurrCoord.y,true);
		ctx.fillStyle = '#fffbb2';   //background
		drawHexagon(ctx,CurrCoord.x,CurrCoord.y,false);
	}


	//Moveside
	function move(CurrCoord,direction)
	{
	flag=0;
	var nx = CurrCoord[0].x + direction*hexRectWidth;
	var ny = CurrCoord[0].y;
	
		if(containsxy(nx,ny,CurrCoord))
		{
			playstate = "gameover";
			clearInterval(myinterval);
			document.getElementById("res").innerHTML = "Game Over! Score is: " + score;
		}
	CurrCoord.unshift({x:nx,y:ny});
	
		if((Math.abs(tx-nx)>1e-6)||(Math.abs(ty-ny)>1e-6))
		{
			ctx.fillStyle = '#fffbb2';
			drawHexagon(ctx,CurrCoord[CurrCoord.length-1].x,CurrCoord[CurrCoord.length-1].y,true);
			CurrCoord.pop();
		}
		else{
			score = score + 10;
			genfood();
		}
	
	ctx.fillStyle = '#005500';
	drawHexagon(ctx,CurrCoord[0].x,CurrCoord[0].y,true);
	selectCell(CurrCoord[1]);
	
		if((CurrCoord[0].x<0)||(CurrCoord[0].x>24.5*hexRectWidth))
		{
			flag=1;
		}
	
		if(flag===1)
		{
			playstate = "gameover";
			clearInterval(myinterval);
			document.getElementById("res").innerHTML = "Game Over! Score is: " + score;
			
		}
	
	}
	
	//moveup
	function moveup(CurrCoord,direction)
	{
	flag=0;
	var nx = CurrCoord[0].x + 0.5*direction*hexRectWidth;
	var ny = CurrCoord[0].y - (sideLength + hexHeight);
	
		if(containsxy(nx,ny,CurrCoord))
		{
			playstate = "gameover";
			clearInterval(myinterval);
			document.getElementById("res").innerHTML = "Game Over! Score is: " + score;
		}
	CurrCoord.unshift({x:nx,y:ny});
	
	if((Math.abs(tx-nx)>1e-6)||(Math.abs(ty-ny)>1e-6))
	{
		ctx.fillStyle = '#fffbb2';
		drawHexagon(ctx,CurrCoord[CurrCoord.length-1].x,CurrCoord[CurrCoord.length-1].y,true);
		CurrCoord.pop();
	}
	else{
		score = score + 10;
		genfood();	
	}
	
	ctx.fillStyle = '#005500';
	drawHexagon(ctx,CurrCoord[0].x,CurrCoord[0].y,true);
	selectCell(CurrCoord[1]);
	
	if((CurrCoord[0].y<0)||(CurrCoord[0].y>=(14*hexRectHeight + 13*sideLength))||(CurrCoord[0].x<0)||(CurrCoord[0].x>24.5*hexRectWidth))
	{
		flag=1;
	}
	
	if(flag===1)//gameover
	{
		playstate = "gameover";
		clearInterval(myinterval);
		document.getElementById("res").innerHTML = "Game Over! Score is: " + score;
		
	}
	}
	
	
	//movedown
	function movedown(CurrCoord,direction)
	{
	flag=0;
	var nx = CurrCoord[0].x + 0.5*direction*hexRectWidth;
	var ny = CurrCoord[0].y + (sideLength + hexHeight);
	
		if(containsxy(nx,ny,CurrCoord))
		{
			playstate = "gameover";
			clearInterval(myinterval);
			document.getElementById("res").innerHTML = "Game Over! Score is: " + score;
		}
		
	CurrCoord.unshift({x:nx,y:ny});
	if((Math.abs(tx-nx)>1e-6)||(Math.abs(ty-ny)>1e-6))
	{
		ctx.fillStyle = '#fffbb2';
		drawHexagon(ctx,CurrCoord[CurrCoord.length-1].x,CurrCoord[CurrCoord.length-1].y,true);
		CurrCoord.pop();
	}
	else{
		score = score + 10;
		genfood();
	}
	
	ctx.fillStyle = '#005500';
	drawHexagon(ctx,CurrCoord[0].x,CurrCoord[0].y,true);
	selectCell(CurrCoord[1]);
	
	if((CurrCoord[0].y<0)||(CurrCoord[0].y>=(14*hexRectHeight + 13*sideLength))||(CurrCoord[0].x<0)||(CurrCoord[0].x>24.5*hexRectWidth))
	{
		flag=1;
	}
	
	if(flag===1)
	{
		playstate = "gameover";
		clearInterval(myinterval);
		document.getElementById("res").innerHTML = "Game Over! Score is: " + score;	
		
	}
	}
	
//containsxy
function containsxy(tx,ty,CurrCoord)
{
	for(var i=0;i<CurrCoord.length;i++)
	{
		if(Math.abs(CurrCoord[i].x-tx)<1e-6)
		{
			if(Math.abs(CurrCoord[i].y-ty)<1e-6)
			{
				return true;
			}
		}
	}
	return false;
}
	
	
//Generate food for snake
function genfood()
{
	var tj = Math.floor(Math.random()*25);
	var ti = Math.floor(Math.random()*22);
	tx = ti * hexRectWidth + ((tj % 2) * hexRadius);
	ty = tj * (sideLength + hexHeight);
	ctx.fillStyle = '#b20000';
		if(containsxy(tx,ty,CurrCoord))
		{
			genfood();
		}
		else
		{
			drawHexagon(ctx,tx,ty,true);
		}
	ctx.fillStyle = '#fffbb2';
}


	function intervalfunc()
	{
	document.getElementById("res").innerHTML = "Score: " + score;
		if(currState === "left")
		{
		move(CurrCoord,-1);
		}
		else if(currState === "right")
		{
		move(CurrCoord,1);
		}
		else if(currState === "upleft")
		{
		moveup(CurrCoord,-1);
		}
		else if(currState === "upright")
		{
		moveup(CurrCoord,1);
		}
		else if(currState === "downleft")
		{
		movedown(CurrCoord,-1);
		}
		else if(currState === "downright")
		{
		movedown(CurrCoord,1);
		}
	}	
var myinterval = setInterval(intervalfunc,200);
}

$(document).ready(myfunction);
