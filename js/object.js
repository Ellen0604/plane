// ----------------------------1、背景类--------------------------

function Background(){
	this.w = 320;
	this.h = 568;
	this.img = oArr[0];	//背景图对象
	this.y = 0;  //y坐标
	this.speed = 2;  //速度
};
Background.prototype = {
	// 绘制背景图片
	draw:function(){
		if (this.y>=canvas.height) {
			this.y = 0;
		}

		// drawImage(img,x,y,w,h,rx,ry,rw,rh);
		context.drawImage(this.img,0,0,this.w,this.h,0,this.y,canvas.width,canvas.height);
		context.drawImage(this.img,0,0,this.w,this.h,0,this.y-canvas.height,canvas.width,canvas.height);

		// 改变y值
		this.y += this.speed;
	}
};

// ----------------------------2、英雄机类---------------------------

function Hero(){
	// 英雄机宽高
	this.w = 66;
	this.h = 82;
	// 飞机坐标
	this.x = canvas.width*0.5 - this.w/2;
	this.y = canvas.height*0.8;
	// 图片对象(数组)
	this.imgs = [oArr[11],oArr[12]];
	// 图片下标
	this.imgsIndex = 0;
	// 延迟(切换可视)
	this.delay = 5;
	// 延迟下标
	this.delayIndex = 0;
};
Hero.prototype = {
	// 绘制英雄机图片
	draw:function(){	
		this.delayIndex ++;
		if (this.delayIndex > this.delay) {
			// 互换图片
			this.imgsIndex = this.imgsIndex ? 0 : 1;
			// 恢复delayIndex为0
			this.delayIndex = 0;
		}
		context.drawImage(this.imgs[this.imgsIndex],this.x,this.y);
	}
};

// -------------------------3、子弹类--------------------------------

function Bullet(){
	// 子弹宽高
	this.w = 6;
	this.h = 14;
	// 原图对象
	this.img = oArr[1];
	// 子弹速度
	this.speed = 5;
	// 延迟
	this.delay = 5;
	this.delayIndex = 0;
	// 保存子弹数量
	this.objArr = [];
};
Bullet.prototype = {
	// 绘制子弹图片
	draw:function(hero,enemy){
		// 累加延迟下标
		this.delayIndex++;
		// 是否发射新子弹
		if (this.delayIndex > this.delay) {
			// 创建一个子弹信息
			var obj = {
				x: hero.x + hero.w/2 - this.w/2,
				y: hero.y - this.h
			}
			// 把子弹信息存入数组
			this.objArr.push(obj);

			// 恢复delayIndex为0
			this.delayIndex = 0;
		}

		// 遍历子弹数组，把所有子弹都滑到canvas上
		for (var i = 0; i < this.objArr.length; i++) {
			// 改变子弹的y值
			this.objArr[i].y -= this.speed;

			// 判断子弹是否超出屏幕
											// 8.1 调用fight方法
			if(this.objArr[i].y < -this.h || this.fight(enemy,enemy.objArr,this.objArr[i].x,this.objArr[i].y)){
				// 在数组里面删除
				this.objArr.splice(i,1);
				// 直接跳到下一个循环
				continue;
			}

			// 绘制子弹
			context.drawImage(this.img,this.objArr[i].x,this.objArr[i].y);
		}
	},

	// 8.1 创建方法
	fight:function(ele,arr,x,y){
		// console.log(this)
		for (var i = 0; i < arr.length; i++) {
			// 绘制敌机路径
			context.beginPath();
			context.rect(arr[i].x,arr[i].y,ele.w,ele.h);
			context.closePath();
			// 判断子弹是否在路径内
			if (context.isPointInPath(x,y)) {
				arr[i].hp--;
				return true;
			}
		}
		return false;
	}
};

// -------------------------4、敌机类--------------------------------

function Enemy(){
	// 敌机宽高
	this.w = 34;
	this.h = 24;
	// 延迟
	this.delay = 30;
	this.delayIndex = 0;
	// 敌机图片数组
	this.imgs = [oArr[6],oArr[2],oArr[3],oArr[4],oArr[5]]
	// 保存敌机数量
	this.objArr = [];
	// 
}
Enemy.prototype = {
	// 绘制敌机
	draw:function(){
		// 累加延迟下标
		this.delayIndex++;
		// 是否生成新敌机
		if (this.delayIndex > this.delay) {
			// 随机速度[2-4]
			var _speed = Math.random()*3+2;
			// 随机x坐标[0到cw-]
			var _x = Math.random()*(canvas.width-this.w);
			var obj = {
				x: _x,
				y: -this.h,
				// 敌机速度
				speed: _speed,
				// 生命值
				hp: 2,
				// 是否死亡
				dieBol: false,
				// 图片下标(如果死亡切换爆炸图片)
				imgIndex: 0,
			}
			// 把敌机信息存入数组
			this.objArr.push(obj);

			// 恢复delayIndex为0
			this.delayIndex = 0;
		}

		// 遍历绘制敌机
		for (var i = 0; i < this.objArr.length; i++) {
			// 改变敌机的y值
			this.objArr[i].y += this.objArr[i].speed;

			// 判断敌机是否死亡
			if (this.objArr[i].hp <= 0) {
				this.objArr[i].dieBol = true;
			}

			// 判断敌机是否超出屏幕
			if (this.objArr[i].y > canvas.height || this.objArr[i].dieBol == true) {
					
				// 8.1 如果死亡改变图像
				this.objArr[i].imgIndex ++;

				if (this.objArr[i].imgIndex >= 4) {
					sum++;
					score.innerText = "分数：" + sum;
					// 删除对应数组里面的对象
					this.objArr.splice(i,1);
					// 回退i值
					i--;
					continue;
					
				}	
			}

			// 绘制敌机
			context.drawImage(this.imgs[this.objArr[i].imgIndex],this.objArr[i].x,this.objArr[i].y);
		}		
	}
}