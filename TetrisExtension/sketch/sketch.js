var gridSize=40;
var boardWidth=400;
var boardHeight=480;
var boardStartX=20;
var boardStartY=75;
var score=0;
var frameTime=50;
var GameOver=false;

var figures=[[1,3,5,7],[2,4,5,7],[3,5,4,6],[3,5,4,7],[2,3,5,7],[3,5,7,6],[2,3,4,5]];

var curr={};
var next={};
var frameCnt=0;
var rows=boardWidth/gridSize;
var cols=boardHeight/gridSize;
var field=[];

function Point() {
    this.x=0;
    this.y=0;
}

function Block() {
    this.n=floor(random(7));
    this.col=color(floor(random(200)),floor(random(200)),floor(random(200)));
    this.x=4;
    this.y=0;
    this.a=[];
    for (var i=0;i<4;i++) {
        this.a[i]=new Point();
        this.a[i].x=figures[this.n][i]%2;
        this.a[i].y=floor(figures[this.n][i]/2);
    }
    this.rotate = function() {
        var p=this.a[1];
        for (var i=0;i<4;i++) {
            var x=this.a[i].y-p.y;
            var y=this.a[i].x-p.x;
            this.a[i].x=p.x-x;
            this.a[i].y=p.y+y;
        }
        if (check()==0) {
            console.log("Outsie");
            for (var j=0;j<3;j++) {
                var p=this.a[1];
                for (var i=0;i<4;i++) {
                    var x=this.a[i].y-p.y;
                    var y=this.a[i].x-p.x;
                    this.a[i].x=p.x-x;
                    this.a[i].y=p.y+y;
                }
            }
        }
    }
    this.show = function() {
        for (var i=0;i<4;i++) {
            fill(this.col);
            rect((this.a[i].x+this.x)*gridSize+boardStartX,(this.a[i].y+this.y)*gridSize+boardStartY,gridSize,gridSize);
        }
    }
}

function setup() {
	createCanvas(650,580);
    setField();
    curr = new Block();
    next = new Block();
    next.x=12;
    next.y=2;
}

function draw() {
    if (!GameOver) {
        gameArea();
        fall();
        checkScore();
    }
}

function keyPressed() {
    if (key==' ') {
        setField();
        curr = new Block();
        next = new Block();
        next.x=12;
        next.y=2;
        score=0;
        GameOver=false;
    }
    if (GameOver)
        return;
    var tmpX=curr.x;
    var tmpY=curr.y;
    if (key=='A'||key=='%') {
        curr.x--;
    }
    if (key=='D'||key=='\'') {
        curr.x++;
    }
    if (key=='W'||key=='&') {
        curr.rotate();
    }
    if (key=='S'||key=='(') {
        curr.y++;
    }
    if (check()==0) {
        curr.x=tmpX;
        curr.y=tmpY;
    }
    
}

function checkScore() {
    for (var i=cols-1;i>=0;i--) {
        var cnt=0;
        for (var j=0;j<rows;j++) {
            if (field[i][j]!=0) {
                cnt++;
            }
        }
        if (cnt==rows) {
            score+=10;
            for (var k=i;k>0;k--) {
                for (var j=0;j<rows;j++) {
                    field[k][j]=field[k-1][j];
                }
            }
        }
    }
}

function fall() {
    frameCnt++;
    var tmpX=curr.x;
    var tmpY=curr.y;
    if (frameCnt>frameTime) {
        frameCnt=0;
        curr.y++;
    }
    if (check()==0) {
        curr.x=tmpX;
        curr.y=tmpY;
        for (var i=0;i<4;i++) {
            field[curr.a[i].y+curr.y][curr.a[i].x+curr.x]=curr.col;
        }
        curr.col=next.col;
        curr.n=next.n;
        curr.a=next.a;
        curr.x=4;
        curr.y=0;
        next = new Block();
        next.x=12;
        next.y=2;
        if (check()==0) {
            GameOver=true;
            fill(255);
            textSize(20);
            text(" Game Over !",boardStartX+boardWidth+50,height*3/4);
            textSize(15);
            text(" Press Space",boardStartX+boardWidth+60,height*3/4+25);
        }
    }
}

function check() {
    for (var i=0;i<4;i++) {
        if ((curr.a[i].x+curr.x)<0||(curr.a[i].x+curr.x)>=rows||(curr.a[i].y+curr.y)>=cols||(curr.a[i].y+curr.y)<0)
            return 0;
        if (field[(curr.a[i].y+curr.y)][(curr.a[i].x+curr.x)])
            return 0;
    }
    return 1;
}

function gameArea() {
    background(200);
    stroke(0);
    fill(0,0,100);
    textSize(40);
    text("Tetris",225,50);
    fill(220);
    rect(boardStartX,boardStartY,boardWidth,boardHeight);
    stroke(0);
    for (var i=0;i<boardWidth/gridSize;i++) {
        line(i*gridSize+boardStartX,boardStartY,i*gridSize+boardStartX,boardHeight+boardStartY);
    }
    for (var i=0;i<boardHeight/gridSize;i++) {
        line(boardStartX,i*gridSize+boardStartY,boardWidth+boardStartX,i*gridSize+boardStartY);
    }
    fill(150);
    rect(boardStartX+boardWidth+10,boardStartY+50,width-(boardStartX+boardWidth+20),375);
    fill(255);
    textSize(18);
    text("Score : "+score,boardStartX+boardWidth+25,boardStartY+75);
    for (var i=0;i<cols;i++) {
        for (var j=0;j<rows;j++) {
            if (field[i][j]!=0) {
                fill(field[i][j]);
                rect(j*gridSize+boardStartX,i*gridSize+boardStartY,gridSize,gridSize);
            }
        }
    }
    curr.show();
    next.show();
}

function setField() {
    field=[];
    for (var i=0;i<cols;i++) {
        field[i]=[];
        for (var j=0;j<rows;j++)
            field[i][j]=0;
    }
}