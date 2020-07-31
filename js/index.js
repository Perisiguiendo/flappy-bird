//用对象收编变量

var bird = {
    skyPosition: 0, //天空初始位置
    skyStep: 3, //填空移动速度
    birdStepY: 1, //小鸟自由落体模拟
    startFlag: false, //游戏开始标志
    birdTop: 350,
    minTop: 0,
    maxTop: 860,
    pipeLength: 7, //管子数
    pipeOffset: 300, //管子之间的间距
    birdFlyHeight: -10, //小鸟点击之后向上飞的高度
    pipeArr: [], //管子的存储
    score: 0,
    pipeLastIndex: 6, //最后一根管子的索引


    /**
     * 初始化函数
     */
    init: function () {
        this.initData();
        this.animate();
        this.handle();

        if(sessionStorage.getItem('play')) {
            this.start();
        }
    },

    /**
     * 
     */
    initData: function () {
        //el表示父元素
        this.el = document.getElementById('game');
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
        this.oFlappyBird = this.el.getElementsByClassName('flappy-bird')[0];
        this.oMenu = this.el.getElementsByClassName('menu')[0];
        this.oShare = this.el.getElementsByClassName('share')[0];
        this.oMask = this.el.getElementsByClassName('mask')[0];
        this.oEnd = this.el.getElementsByClassName('end')[0];
        this.oFinalScore = this.oEnd.getElementsByClassName('final-score')[0];
        this.scoreArr = this.getScore();
        this.oRankList = this.oEnd.getElementsByClassName('rank-list')[0];
        this.oRestart = this.oEnd.getElementsByClassName('restart')[0];
    },

    /**
     * 获取分数
     */
    getScore: function () {
        var scoreArr = getLocal('score');
        return scoreArr ? scoreArr : [];

    },

    /**
     * 设置分数
     */
    setScore: function () {
        this.scoreArr.push({
            score: this.score,
            time: this.getDate(),
        })
        setLocal('score', this.scoreArr);

    },

    /**
     * 获取时间
     */
    getDate: function () {
        var d = new Date();
        var year = formatNum(d.getFullYear());
        var month = formatNum(d.getMonth() + 1);
        var day = formatNum(d.getDay());
        var hour = formatNum(d.getHours());
        var min = formatNum(d.getMinutes());
        var sec = formatNum(d.getSeconds());
        return `${year}.${month}.${day} ${hour}:${min}:${sec}`;
    },

    /**
     * 管理所有的动画函数
     */
    animate: function () {
        var self = this;
        this.timer = setInterval(function () {
            self.skyMove();

            if (self.startFlag) {
                self.birdDrop();
                self.pipeMove();
            }
        }, 30)
    },

    /**
     * 天空移动
     */
    skyMove: function () {
        this.skyPosition -= this.skyStep;
        this.el.style.backgroundPositionX = this.skyPosition + 'px';
    },

    /**
     * 管子移动
     */
    pipeMove: function () {
        for (let i = 0; i < this.pipeLength; i++) {
            var oUpPipe = this.pipeArr[i].up;
            var oDownPipe = this.pipeArr[i].down;
            var x = oUpPipe.offsetLeft - this.skyStep;

            if (x < -52) {
                var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
                oUpPipe.style.left = lastPipeLeft + 300 + 'px';
                oDownPipe.style.left = lastPipeLeft + 300 + 'px';
                this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;
                var pipeHeight = this.getPipeHeight()
                oUpPipe.style.height = pipeHeight.up + 'px';
                oDownPipe.style.height = pipeHeight.down + 'px';
                continue;
            }
            oUpPipe.style.left = x + 'px';
            oDownPipe.style.left = x + 'px';
        }
    },

    /**
     * 获取管子的高度
     */
    getPipeHeight: function () {
        var upHeight = 140 + Math.floor(Math.random() * 292);
        var downHeight = 925 - 200 - upHeight;
        return {
            up: upHeight,
            down: downHeight
        };
    },

    /**
     * 创建柱子
     */
    createPipe: function (x) {
        var upHeight = 140 + Math.floor(Math.random() * 292);
        var downHeight = 925 - 200 - upHeight;

        var oUpPipe = createEle('div', ['pipe', 'pipe-up'], {
            height: upHeight + 'px',
            left: x + 'px'
        })

        var oDownPipe = createEle('div', ['pipe', 'pipe-down'], {
            height: downHeight + 'px',
            left: x + 'px'
        })

        this.el.appendChild(oUpPipe);
        this.el.appendChild(oDownPipe);

        this.pipeArr.push({
            up: oUpPipe,
            down: oDownPipe,
            y: [upHeight, upHeight + 200]
        })
    },

    /**
     * 小鸟自由落体模拟
     */
    birdDrop: function () {
        this.birdTop += ++this.birdStepY;
        this.oBird.style.top = this.birdTop + 'px';
        this.judgeKnock();
        this.addScore();
    },

    /**
     * 碰撞检测
     */
    judgeKnock: function () {
        this.judgeBoundary();
        this.judgePipe();
    },

    /**
     * 边界碰撞检测
     */
    judgeBoundary: function () {
        if (this.birdTop < this.minTop || this.birdTop > this.maxTop) {
            this.failGame();
        }
    },

    /**
     * 柱子碰撞检测
     */
    judgePipe: function () {
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        var pipeY = this.pipeArr[index].y;
        var birdY = this.birdTop;

        if ((pipeX <= 120 && pipeX >= 26) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
            this.failGame();
        }
    },

    handle: function () {
        this.handleStart();
        this.handleClick();
        this.handleRestart();
    },

    start: function () {
        this.startFlag = true;
        this.oStart.style.display = 'none';
        this.oFlappyBird.style.display = 'none';
        this.oMenu.style.display = 'none';
        this.oShare.style.display = 'none';
        this.oScore.style.display = 'block';
        this.skyStep = 6;
        this.oBird.className = 'bird fly ';
        this.oBird.style.left = '100px';
        for (let i = 0; i < this.pipeLength; i++) {
            this.createPipe(this.pipeOffset * (i + 1));
        }
        this.birdDrop();
    },

    /**
     * 点击开始游戏
     */
    handleStart: function () {
        this.oStart.onclick = this.start.bind(this);
    },

    handleRestart: function () {
        this.oRestart.onclick = function () {
            
            sessionStorage.setItem('play', true);
            window.location.reload();
        }
    },

    /**
     * 
     */
    handleClick: function () {
        var self = this;
        this.el.onclick = function (e) {
            if (!e.target.classList.contains('start')) {
                self.birdStepY = self.birdFlyHeight;
            }
        }
    },

    /**
     * 加分
     */
    addScore: function () {
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;

        if (pipeX < 27) {
            this.oScore.innerText = ++this.score;
        }
    },

    /**
     * 游戏失败
     */
    failGame: function () {
        clearInterval(this.timer);
        this.setScore();
        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        this.oBird.style.display = 'none';
        this.oScore.style.display = 'none';
        this.oFinalScore.innerText = this.score;
        this.renderRankList();
    },


    renderRankList: function () {
        var template = '';
        for (let i = 0; i < this.scoreArr.length; i++) {
            var degreeClass = '';
            switch (i) {
                case 0:
                    degreeClass = 'first';
                    break;
                case 1:
                    degreeClass = 'second';
                    break;
                case 2:
                    degreeClass = 'third';
                    break;
            }
            template += `
            <li class="rank-item">
                    <span class="rank-degree ${degreeClass}"></span>
                    <span class="rank-score">${this.scoreArr[i].score}</span>
                    <span class="rank-time">${this.scoreArr[i].time}</span>
            </li>
            `;
            this.oRankList.innerHTML = template;
        }

    }



};