var row, // 行
    col; // 列

var lock = 0; // 判断是否开始

var x = 1,
    y = 2; // 当前坐标

var map = [];
// map 为 迷宫地图 是一个 二维数组

var rightWay = [];
// rightWay 为 正确的路

function Block(className) {
    this.className = className;
    this.isThrough = -1; // -1 代表墙  0 代表未走过的路  1 代表走过的路
}

// 生成地图 并 渲染dom 结构
function createMap() {
    map = new Array(row);
    for (var i = 0; i < row; i++) {
        map[i] = new Array(col);
        for (var j = 0; j < col; j++) {
            if (i == 0 || i == row - 1) {
                map[i][j] = new Block('road');
                map[i][j].isThrough = -1;
            } else if (j == 0 || j == col - 1) {
                map[i][j] = new Block('road');
                map[i][j].isThrough = -1;
            } else {
                map[i][j] = new Block('wall');
                map[i][j].isThrough = -1;
            }
        }
    }



    randomMap();

    var maze = document.getElementById('maze');
    maze.innerHTML = '';
    maze.style.width = col * 10 + 'px';
    maze.style.height = row * 10 + 'px';
    var str = '';
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            str += '<div class="block ' + map[i][j].className + '"></div>';
        }
    }
    maze.innerHTML = str;
    renderTips();

}

// 随机生成地图函数
function randomMap() {
    var X = [],
        Y = [];

    X.push(2);
    Y.push(2);

    while (X.length != 0) {

        var r = Math.floor(Math.random() * X.length);
        var x = X[r],
            y = Y[r];
        var count = 0;
        for (var i = x - 1; i < x + 2; i++) {
            for (var j = y - 1; j < y + 2; j++) {
                if (Math.abs(x - i) + Math.abs(y - j) == 1 && map[i][j].className == 'road') {
                    ++count;
                }
            }
        }

        if (count <= 1) {
            map[x][y].className = 'road';
            map[x][y].isThrough = 0;
            for (var i = x - 1; i < x + 2; i++) {
                for (var j = y - 1; j < y + 2; j++) {
                    if (Math.abs(x - i) + Math.abs(y - j) == 1 && map[i][j].className == 'wall') {
                        X.push(i);
                        Y.push(j);
                    }
                }
            }
        }

        X.splice(r, 1);
        Y.splice(r, 1);
    }

    map[2][1].className = 'in';
    map[2][1].isThrough = 1;
    for (var i = row - 3; i >= 0; i--) {
        if (map[i][col - 3].className == 'road') {
            map[i][col - 2].className = 'out';
            map[i][col - 2].isThrough = 0;
            break;
        }
    }
}

// 运动函数
// 传入参数说明
// [0,1]  -> right
// [0,-1] -> left
// [1,0]  -> down
// [-1,0] -> up
function animation(directionArr) {
    var up = directionArr[0];
    var right = directionArr[1];
    var divArr = document.getElementById('maze').getElementsByTagName('div');
    if (map[y + up][x + right].isThrough == -1) {
        // 下一个是墙
        renderTips('wall');
    } else if (map[y + up][x + right].isThrough == 0) {
        // 下一个是未走过的路

        if (map[y + up][x + right].className == 'out') {
            x = x + right;
            y = y + up;
            alert('Congratulations, you found the exit. Now play again');
            location.reload();
            // renderTips('over');
            lock = 0;
        } else {
            var num = (y + up) * col + (x + right);
            map[y + up][x + right].isThrough = 1;
            divArr[num].style.backgroundColor = 'green';
            x = x + right;
            y = y + up;
            if (right == 1 && up == 0) {
                renderTips('right');
            } else if (right == -1 && up == 0) {
                renderTips('left');
            } else if (right == 0 && up == -1) {
                renderTips('up');
            } else if (right == 0 && up == 1) {
                renderTips('down');
            }
        }

    } else {
        var num = (y) * col + (x);
        divArr[num].style.backgroundColor = '#fff';
        map[y][x].isThrough = 0;
        x = x + right;
        y = y + up;
        renderTips('back');
    }
}


// status 状态 表示按下键盘之后的状态是什么
function renderTips(status) {
    var tips = document.getElementsByClassName('tips')[0];
    if (!lock) {
        tips.innerHTML = 'press ↑ ↓ ← → to play game';
        tips.style.display = 'block';
    }
    if (lock) {
        if (status == 'wall') {
            tips.innerHTML = 'The next grid is the wall. Please find another way';
        } else if (status == 'back') {
            tips.innerHTML = 'You are returning';
        } else if (status == 'up') {
            tips.innerHTML = 'You are going up';
        } else if (status == 'down') {
            tips.innerHTML = 'You are going down';
        } else if (status == 'right') {
            tips.innerHTML = 'You are going right';
        } else if (status == 'left') {
            tips.innerHTML = 'You are going left';
        }
    }
}

// 自动寻路函数
function autoFindWay(nowX, nowY) {
    if (map[nowY][nowX].className == 'out') {
        var maze = document.getElementById('maze');
        maze.innerHTML = '';
        maze.style.width = col * 10 + 'px';
        maze.style.height = row * 10 + 'px';
        var str = '';
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                if (map[i][j].isThrough == 1) {
                    str += '<div class="block ' + map[i][j].className + '" style="background-color: #0f0"></div>';
                } else {
                    str += '<div class="block ' + map[i][j].className + '"></div>';
                }
            }
        }
        maze.innerHTML = str;
        document.getElementsByClassName('tips')[0].innerHTML = 'Automatic route finding';
        return true;
    }

    var next = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]
    ];

    next.sort(function() {
        return Math.random() - 0.5;
    });

    for (var i = 0; i < next.length; i++) {

        if (nowX + next[i][1] < 2 || nowX + next[i][1] > col - 2 || nowY + next[i][0] < 2 || nowY + next[i][0] > row - 2) {
            continue;
        } else if (map[nowY + next[i][0]][nowX + next[i][1]].isThrough == 0) {
            map[nowY + next[i][0]][nowX + next[i][1]].isThrough = 1;
            if (!autoFindWay(nowX + next[i][1], nowY + next[i][0])) {
                map[nowY + next[i][0]][nowX + next[i][1]].isThrough = 0;
            }
        }
    }
    return false;
}

function init() {
    var createDom = document.getElementById('create');
    createDom.onclick = function() {
        row = Number(document.getElementById('heigth').value);
        col = Number(document.getElementById('width').value);
        if (!row || !col || row > 55 || row < 0 || col > 80 || col < 0) {
            alert('输入的列宽有误，请重新输入');
            return;
        }
        createMap();
        var timer = setInterval(function() {
            document.onkeydown = function(ev) {
                lock = 1;
                if (ev.key == 'ArrowLeft') {
                    animation([0, -1]);
                } else if (ev.key == 'ArrowUp') {
                    animation([-1, 0]);
                } else if (ev.key == 'ArrowRight') {
                    animation([0, 1]);
                } else if (ev.key == 'ArrowDown') {
                    animation([1, 0]);
                }
            }
        }, 200);
        // return;
    }

    var auto = document.getElementById('auto');
    auto.onclick = function() {
        autoFindWay(1, 2);
    }
}

init();