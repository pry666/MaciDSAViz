function Book_24(am, w, h) {
    this.init(am, w, h);
}

Book_24.prototype = new Algorithm();
Book_24.prototype.constructor = Book_24;
Book_24.superclass = Algorithm.prototype;

Book_24.prototype.init = function(am, w, h) {
    Book_24.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
}

Book_24.prototype.addControls = function() {
    this.controls = [];

    this.pushButton = addControlToAlgorithmBar("Button", "执行");
    this.pushButton.onclick = this.checkCallback.bind(this);
    this.controls.push(this.pushButton);
}

Book_24.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
}

Book_24.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
}

Book_24.prototype.setup = function() {
    /*
    1为principal输入框
    2为apr输入框
    3为i=0循环初始化条件框
    4为i<0循环判断框
    5为循环内容执行框
    6为i=i+1
    7为循环结束条件i>=10
    8为输出框
    t b l r 代表上下左右
     */
    this.nextIndex = 0;
    this.conditionLabel_1_ID = this.nextIndex++;
    this.conditionLabel_1b_ID = this.nextIndex++;
    this.conditionLabel_1b2_ID = this.nextIndex++;
    this.conditionLabel_2_ID = this.nextIndex++;
    this.conditionLabel_2t_ID = this.nextIndex++;
    this.conditionLabel_2r_ID = this.nextIndex++;
    this.conditionLabel_3_ID = this.nextIndex++;
    this.conditionLabel_3b_ID = this.nextIndex++;
    this.conditionLabel_3t_ID = this.nextIndex++;
    this.conditionLabel_4_ID = this.nextIndex++;
    this.conditionLabel_4l_ID = this.nextIndex++;
    this.conditionLabel_5_ID = this.nextIndex++;
    this.conditionLabel_5b_ID = this.nextIndex++;

    this.printDisplay_ID = this.nextIndex++;

    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "i = 0", 100, 50, 100, 150);
    this.cmd("CreateLabel", this.conditionLabel_1b_ID, "", 100, 170);
    this.cmd("CreateLabel", this.conditionLabel_1b2_ID, "", 100, 175);

    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "while i <= 10", 100, 50, 250, 250);
    this.cmd("CreateLabel", this.conditionLabel_2t_ID, "", 250, 225);
    this.cmd("CreateLabel", this.conditionLabel_2r_ID, "", 300, 250);

    this.cmd("CreateRectangle", this.conditionLabel_3_ID, "print(i)", 150, 50, 450, 200);
    this.cmd("CreateLabel", this.conditionLabel_3t_ID, "", 450, 175);
    this.cmd("CreateLabel", this.conditionLabel_3b_ID, "", 450, 225);

    this.cmd("CreateRectangle", this.conditionLabel_4_ID, "i = i + 1", 100, 50, 250, 150);
    this.cmd("CreateLabel", this.conditionLabel_4l_ID, "", 200, 150);

    this.cmd("CreateRectangle", this.conditionLabel_5_ID, "i > 10", 100, 50, 100, 250);
    this.cmd("CreateLabel", this.conditionLabel_5b_ID, "", 100, 270);

    this.cmd("CreateLabel", this.printDisplay_ID, "", 450, 300);

    this.cmd("Connect", this.conditionLabel_1b2_ID, this.conditionLabel_2t_ID);
    this.cmd("Connect", this.conditionLabel_1b_ID, this.conditionLabel_5_ID);
    this.cmd("Connect", this.conditionLabel_2r_ID, this.conditionLabel_3b_ID);
    this.cmd("Connect", this.conditionLabel_3t_ID, this.conditionLabel_4_ID);
    this.cmd("Connect", this.conditionLabel_4l_ID, this.conditionLabel_1_ID);


    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}

Book_24.prototype.checkCallback = function(event) {
    this.implementAction(this.checkCondition.bind(this));
}

Book_24.prototype.checkCondition = function(values) {
    this.commands = [];
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");

    this.print = "";

    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("Step");

    for (let i = 0; i <= 10; i++) {
        this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
        this.cmd("Step");

        this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_3_ID, "print("+i+")");
        this.cmd("Step");
        this.print += `${i}\n`;
        this.cmd("SetText", this.printDisplay_ID, this.print);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
        this.cmd("Step");

        this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_4_ID, "i = "+i+" + 1");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_4_ID, "i = "+(i+1));
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
        this.cmd("Step");

        this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_1_ID, "i = "+(i+1));
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
        this.cmd("Step");
    }

    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
    this.cmd("Step");

    return this.commands;
}

Book_24.prototype.reset = function() {
    this.top = 0;
    this.nextIndex = this.initialIndex;
}

Book_24.prototype.clearCallback = function(event) {
    this.implementAction(this.clearData.bind(this), "");
}

Book_24.prototype.clearData = function(ignored) {
    this.commands = new Array();
    this.clearAll();
    return this.commands;
}

Book_24.prototype.clearAll = function() {
    this.commands = new Array();
    for (var i = 0; i < this.top; i++) {
        this.cmd("SetText", this.arrayID[i], "");
    }
    this.top = 0;
    this.cmd("SetText", this.topID, "0");
    return this.commands;
}

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new Book_24(animManag, canvas.width, canvas.height);
}