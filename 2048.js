// 面向对象
// 声明一个game对象
var game={
	data:null,RN:4,CN:4,//保存游戏二维数组总行数总列数
	score:0,//保存得分
	state:1,//保存游戏状态：1表示运行中，0表示结束
	RUNNING:1,//专门表示运行中状态
	GAMEOVER:0,//专门表示游戏结束状态
	//每个属性和方法之间必须用逗号分隔
	//对象自己的方法要使用自己的属性，必须用 this.

	start(){//游戏启动
		this.state=this.RUNNING;//重置游戏状态为运行中
		//新建空数组保存在data中
		this.score=0;
		this.data=[];
		for(var r=0;r<this.RN;r++){
		//r从0开始，到<RN结束
			this.data[r]=[];
			//新建空数组保存到data中r行
			for(var c=0;c<this.CN;c++){
			//c从0开始，到<CN结束
				this.data[r][c]=0;
				//设置data中r行c列的值为0
				}
			}//遍历结束
		this.randomNum();
		this.randomNum();
		this.updateView();
		//为document绑定onkeydown事件处理函数
		document.onkeydown=function(e){
			//根据当前按下的键的编码选择移动方向
			switch(e.keyCode){
				case 37://左移
					//this->.前的document
					this.moveLeft();
					//测试：console.log(this.data.join('\n'));
					break;
				case 38://上移
					this.moveUp();
					break;
				case 39://右移
					this.moveRight();
					break;
				case 40://下移
					this.moveDown();
					break;			
			}
		}.bind(this);//转换作用域为game对象
	},

	moveLeft(){//左移所有行
		//为数组拍照保存在before中
		var before=String(this.data);
		//遍历每一行
		for(var r=0;r<this.RN;r++){
			//左移第r行
			this.moveLeftInRow(r);
		}//（循环结束）
		//为数组拍照保存在after中
		var after=String(this.data);
		//如果发生了移动（before！=after）
		if(before!=after){
			//生成随机数
			this.randomNum();
			if(this.isGameOver()) //如果游戏结束
			this.state=this.GAMEOVER;//修改游戏状态
			//更新页面
			this.updateView();
		 }
	},

	moveLeftInRow(r){//左移第r行
		//c从0开始，到<CN-1结束，遍历r行中每个格
		for(var c=0;c<this.CN-1;c++){
		  //找r行c列右侧下一个不为0的位置nextc
		  var nextc=this.getNextInRowL(r,c);
		  //如果nextc为-1,就退出循环
		  if (nextc==-1)  break;
		  else if(this.data[r][c]==0){//否则 如果c列的值是0
			  //将nextc列的值赋值给c列
			  this.data[r][c]=this.data[r][nextc];
			  //将nextc列的值置为0
			  this.data[r][nextc]=0;
			//c留在原地:为了使右侧的两个相同的数能够在一次移动中合并到一起。
			  c--;
		  }else if(this.data[r][c]==this.data[r][nextc]){
			//否则 如果c列的值等于nextc列的值
			  //将c列的值*2
			  this.data[r][c]*=2;
			  this.score+=this.data[r][c];
			  //将nextc列置为0 
			  this.data[r][nextc]=0;
		  }
		}
	},

	getNextInRowL(r,c){
		//从c+1开始，到<CN结束
		for(var i=c+1;i<this.CN;i++){
		  //如果r行i位置不是0//返回i
			if(this.data[r][i]!=0) return i;//注意函数中无论什么地方，只要return之后方法就自动结束了
			}//(遍历结束)  
		  //返回-1
		  return -1;
    },
	moveRight(){//右移所有行
		//为data拍照，保存在before中
		var before=String(this.data)
		//遍历data中每一行
		for(var r=0;r<this.RN;r++){
		  //右移第r行
		  this.moveRightInRow(r);
		}//(遍历结束)
		//为data拍照，保存在after中
		var after=String(this.data)
		//如果发生了移动
		if(after!=before)
		  //随机生成数
		  this.randomNum();
		  if(this.isGameOver()) //如果游戏结束
			this.state=this.GAMEOVER;//修改游戏状态
		  //更新页面
		  this.updateView();
  },
  moveRightInRow(r){//右移第r行
    //c从CN-1开始，到>0结束，反向遍历r行中每个格
	for(var c=this.CN-1;c>0;c--){
      //找r行c列左侧前一个不为0的位置prevc
	  var prevc=this.getNextInRowR(r,c);
      //如果prevc为-1,就退出循环
	  if(prevc==-1) break;
      //否则
	  else
        //如果c列的值是0
		if(this.data[r][c]==0){
          //将prevc列的值赋值给c列
		  this.data[r][c]=this.data[r][prevc];
          //将prevc列的值置为0
		  this.data[r][prevc]=0;
          //c留在原地
		  c++;
        }else if(this.data[r][c]==this.data[r][prevc]){//否则 如果c列的值等于prevc列的值
          //将c列的值*2
		  this.data[r][c]*=2;
		  this.score+=this.data[r][c];
          //将prevc列置为0
		  this.data[r][prevc]=0;
		}
	}
  },

	getNextInRowR(r,c){
		//从c+1开始，到<CN结束
		for(var i=c-1;i>=0;i--){
		  //如果r行i位置不是0//返回i
			if(this.data[r][i]!=0) return i;
			}//(遍历结束)  
		  //返回-1
		  return -1;
    },

	moveUp(){//上移所有列
		//拍照当前数组保存在before中
		var before=String(this.data);
		//从c=0开始，遍历data中的每一列
		for(var c=0;c<this.CN;c++){
			//上移第r行
			this.moveUpInRow(c);
		}//（遍历结束）
		//拍照当前数组保存在after中
		var after=String(this.data);
		//如果before!=after
		if(before!=after){
			//生成随机数
			this.randomNum();
			if(this.isGameOver()) //如果游戏结束
			this.state=this.GAMEOVER;//修改游戏状态
			//更新页面
			this.updateView();
		}
	},

	moveUpInRow(c){
		//遍历所有行
		for(var r=0;r<this.RN-1;r++){
			//找到c列r行下边值不为0的行数保存在downc中
			var downc=this.getnextInRowU(r,c);
			//如果downc==-1
			if(downc==-1) break;//退出循环
			//否则如果如果r行的值为0
			else if(this.data[r][c]==0){
				//交换两行的值
				this.data[r][c]=this.data[downc][c];
				//将downc行的值置为0
				this.data[downc][c]=0;
				//r留在原地
				r--;
			}else if(this.data[r][c]==this.data[downc][c]){//否则如果两行的值相等
					//将r行的值*2
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
					//downc行的值置为0
					this.data[downc][c]=0;
			}
		}
	},
	getnextInRowU(r,c){
		//从r+1开始遍历所有行
		for(var i=r+1;i<this.RN;i++){
			//如果i行的值不为0，返回i
			if (this.data[i][c]!=0) return i;
		}//循环结束
		return -1;//返回-1
		
	},
	moveDown(){//下移所有列
		//对当前数组拍照保存在before中
		var before=String(this.data)
		//从c=0开始遍历每一列
		for(var c=0;c<this.CN;c++){
			//下移第r行
			this.moveDownInRow(c);
		}//（遍历结束）
		//对当前数组拍照保存在after中
		var after=String(this.data)
		//如果after！=before
		if(after!=before){
			//随机生成一个数
			this.randomNum();
			if(this.isGameOver()) //如果游戏结束
			this.state=this.GAMEOVER;//修改游戏状态
			//更新页面
			this.updateView();
		}
	},
	moveDownInRow(c){
		//从r=RN-1开始遍历所有行
		for(var r=this.RN-1;r>0;r--){
		//从r行c列开始向上找到不为0的行数记录在upc中
		var upc=this.getnextInRowD(r,c);
		//如果upc为-1的话退出循环
		if(upc==-1) break;
		//否则如果r行c列的值等于0的话
		else if(this.data[r][c]==0){
			//将upc行的值赋值给r行
			this.data[r][c]=this.data[upc][c];
			//将upc行的值置为0
			this.data[upc][c]=0;
			//r留在原地
			r++;
		}else if(this.data[r][c]==this.data[upc][c]){//否则如果r行c列的值等于upc行c列的值
			//r行c列的值自乘2
			this.data[r][c]*=2;
			this.score+=this.data[r][c];
			//将upc行的值置为0
			this.data[upc][c]=0;
		}
		}
	},

	getnextInRowD(r,c){
		//从r-1开始遍历所有行
		for(var i=r-1;i>=0;i--){
			//如果第i行的值不为0,返回i
			if(this.data[i][c]!=0) return i;
		}//（循环结束）
		//返回-1
		return -1;
	},
	//判断游戏是否结束
	isGameOver(){
		//遍历data
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				//如果当前元素是0，返回false
				if(this.data[r][c]==0) return false;
				//否则，如果c<CN-1且当前元素等于右侧元素
				else if(c<this.CN-1&&(this.data[r][c]==this.data[r][c+1])){
					//返回false
					return false;
				}else if(r<this.RN-1&&(this.data[r][c]==this.data[r+1][c])){//否则，如果r<RN-1且当前元素等于下方元素
					//返回false
					return false;
				}
			}
		}//（遍历结束）
		//返回true
		return true;
	},
	updateView(){//将data中的数据更新到每个div中
	//遍历二维数组
	for(var r=0;r<this.RN;r++){
		for(var c=0;c<this.CN;c++){
			var n=this.data[r][c];
			//找到id为crc的div
			var div=document.getElementById("c"+r+c);
			if(n!=0){//如果n不是0
				div.innerHTML=n;//设置div的内容为n
				//设置div的class为cell nn(为cell添加样式)
				div.className="cell n"+n;
			}else{
				div.innerHTML="";//清除div的内容
				//恢复div的class为cell
				div.className="cell";
			}
		}
		//更新得分：找到id为score的div，设置其内容为this.score
		document.getElementById("score").innerHTML=this.score;
		//找到id为gameOver的div
		var isOver=document.getElementById("gameOver");
		//如果游戏状态为GAMEOVER就设置div显示
		if(this.state==this.GAMEOVER){
			isOver.style.display="block";
			//找到id为final的span，设置其内容为this.score
			document.getElementById("final").innerHTML=this.score;
		}else{//否则就设置div隐藏
		isOver.style.display="none";
		}
	}
	},

	randomNum(){//在随机位置生成2或4
		//反复
		while(true){
			//在0~RN-1之间生成随机数r
			var r=Math.floor(Math.random()*this.RN)
			//在0~CN-1之间生成随机数c
			var c=Math.floor(Math.random()*this.CN)
			//如果data中r行c列的值为0
			if(this.data[r][c]==0){
				//将data中r行c列赋值为：随机生成一个小数，如果<0.5,就取2，否则就取4
				this.data[r][c]=(Math.random()<0.5?2:4);
				break;
			}
		}
	},
	

}
game.start();
