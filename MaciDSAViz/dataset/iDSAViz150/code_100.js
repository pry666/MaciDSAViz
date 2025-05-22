function Book_16(am, w, h) {
    this.init(am, w, h);
}

Book_16.prototype = new Algorithm();
Book_16.prototype.constructor = Book_16;
Book_16.superclass = Algorithm.prototype;

Book_16.prototype.init = function(am, w, h) {
    Book_16.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
}

Book_16.prototype.addControls = function() {
    this.controls = [];

    this.pushButton = addControlToAlgorithmBar("Button", "计算");
    this.pushButton.onclick = this.checkCallback.bind(this);
    this.controls.push(this.pushButton);
}

Book_16.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
}

Book_16.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
}

Book_16.prototype.setup = function() {
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
    this.conditionLabel_2_ID = this.nextIndex++;
    this.conditionLabel_2b_ID = this.nextIndex++;
    this.conditionLabel_3_ID = this.nextIndex++;
    this.conditionLabel_3lt_ID = this.nextIndex++;
    this.conditionLabel_3lb_ID = this.nextIndex++;


    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "amount", 75, 50, 100, 100);
    this.cmd("CreateLabel", this.conditionLabel_1b_ID, "", 100, 125);
    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "rate", 75, 50, 200, 100);
    this.cmd("CreateLabel", this.conditionLabel_2b_ID, "", 200, 125);

    this.cmd("CreateRectangle", this.conditionLabel_3_ID, " addInterest(balance, rate)", 175, 100, 350, 200);
    this.cmd("CreateLabel", this.conditionLabel_3lt_ID, "", 265, 150);
    this.cmd("CreateLabel", this.conditionLabel_3lb_ID, "", 265, 250);

    this.cmd("Connect", this.conditionLabel_1b_ID, this.conditionLabel_3lt_ID);
    this.cmd("Connect", this.conditionLabel_2b_ID, this.conditionLabel_3lt_ID);
    this.cmd("Connect", this.conditionLabel_3lb_ID, this.conditionLabel_1b_ID);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}

Book_16.prototype.checkCallback = function(event) {
    this.implementAction(this.checkCondition.bind(this));
}

Book_16.prototype.checkCondition = function(values) {
    this.commands = [];
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");


    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_1_ID, "amount = 1000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_2_ID, "rate = 0.05");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_3_ID, "newBalance = balance * (1 + rate) ");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_3_ID, "newBalance = 1000 * (1 + 0.05) ");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_3_ID, "newBalance = 1050 ");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_3_ID, "return newBalance");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_1_ID, "amount = newBalance");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_1_ID, "amount = 1050");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("Step");

    return this.commands;
}

Book_16.prototype.reset = function() {
    this.top = 0;
    this.nextIndex = this.initialIndex;
}

Book_16.prototype.clearCallback = function(event) {
    this.implementAction(this.clearData.bind(this), "");
}

Book_16.prototype.clearData = function(ignored) {
    this.commands = new Array();
    this.clearAll();
    return this.commands;
}

Book_16.prototype.clearAll = function() {
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
    currentAlg = new Book_16(animManag, canvas.width, canvas.height);
}