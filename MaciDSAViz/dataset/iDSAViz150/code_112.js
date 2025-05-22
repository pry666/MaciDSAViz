function FutureValue_4(am, w, h) {
    this.init(am, w, h);
}

FutureValue_4.prototype = new Algorithm();
FutureValue_4.prototype.constructor = FutureValue_4;
FutureValue_4.superclass = Algorithm.prototype;

FutureValue_4.prototype.init = function(am, w, h) {
    FutureValue_4.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
}

FutureValue_4.prototype.addControls = function() {
    this.controls = [];

    this.pushFieldPrincipal = addControlToAlgorithmBar("Text", "");
    this.pushFieldPrincipal.placeholder = "Enter the initial principal";  // 设置提示文本
    this.pushFieldPrincipal.style.width = "175px";
    this.pushFieldPrincipal.onkeydown = this.returnSubmit(this.pushFieldPrincipal, this.checkCallback.bind(this), 6);

    this.pushFieldApr = addControlToAlgorithmBar("Text", "");
    this.pushFieldApr.placeholder = "Enter the annual interest rate";  // 设置提示文本
    this.pushFieldApr.style.width = "175px";
    this.pushFieldApr.onkeydown = this.returnSubmit(this.pushFieldApr, this.checkCallback.bind(this), 6);

    this.pushButton = addControlToAlgorithmBar("Button", "执行");
    this.pushButton.onclick = this.checkCallback.bind(this);

    this.controls.push(this.pushFieldPrincipal);
    this.controls.push(this.pushFieldApr);
    this.controls.push(this.pushButton);
}

FutureValue_4.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
}

FutureValue_4.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
}

FutureValue_4.prototype.setup = function() {
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
    this.conditionLabel_3b_ID = this.nextIndex++;
    this.conditionLabel_3b2_ID = this.nextIndex++;
    this.conditionLabel_4_ID = this.nextIndex++;
    this.conditionLabel_4t_ID = this.nextIndex++;
    this.conditionLabel_4r_ID = this.nextIndex++;
    this.conditionLabel_5_ID = this.nextIndex++;
    this.conditionLabel_5b_ID = this.nextIndex++;
    this.conditionLabel_5t_ID = this.nextIndex++;
    this.conditionLabel_6_ID = this.nextIndex++;
    this.conditionLabel_6l_ID = this.nextIndex++;
    this.conditionLabel_7_ID = this.nextIndex++;
    this.conditionLabel_7b_ID = this.nextIndex++;
    this.conditionLabel_8_ID = this.nextIndex++;
    this.resulttext = this.nextIndex++;



    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "principal", 75, 50, 50, 50);
    this.cmd("CreateLabel", this.conditionLabel_1b_ID, "", 50, 70);
    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "apr", 75, 50, 150, 50);
    this.cmd("CreateLabel", this.conditionLabel_2b_ID, "", 150, 70);

    this.cmd("CreateRectangle", this.conditionLabel_3_ID, "i = 0", 100, 50, 100, 150);
    this.cmd("CreateLabel", this.conditionLabel_3b_ID, "", 100, 170);
    this.cmd("CreateLabel", this.conditionLabel_3b2_ID, "", 100, 175);

    this.cmd("CreateRectangle", this.conditionLabel_4_ID, "i < 10", 100, 50, 250, 250);
    this.cmd("CreateLabel", this.conditionLabel_4t_ID, "", 250, 225);
    this.cmd("CreateLabel", this.conditionLabel_4r_ID, "", 300, 250);

    this.cmd("CreateRectangle", this.conditionLabel_5_ID, "principal = principal * (1 + apr)", 150, 50, 450, 200);
    this.cmd("CreateLabel", this.conditionLabel_5t_ID, "", 450, 175);
    this.cmd("CreateLabel", this.conditionLabel_5b_ID, "", 450, 225);

    this.cmd("CreateRectangle", this.conditionLabel_6_ID, "i = i + 1", 100, 50, 250, 150);
    this.cmd("CreateLabel", this.conditionLabel_6l_ID, "", 200, 150);

    this.cmd("CreateRectangle", this.conditionLabel_7_ID, "i >= 10", 100, 50, 100, 250);
    this.cmd("CreateLabel", this.conditionLabel_7b_ID, "", 100, 270);

    this.cmd("CreateLabel", this.resulttext, "输出：", 300, 450);

    this.cmd("CreateRectangle", this.conditionLabel_8_ID, "The value in 10 years is:", 175, 50, 100, 350);

    this.cmd("Connect", this.conditionLabel_1b_ID, this.conditionLabel_3_ID);
    this.cmd("Connect", this.conditionLabel_2b_ID, this.conditionLabel_3_ID);
    this.cmd("Connect", this.conditionLabel_3b2_ID, this.conditionLabel_4t_ID);
    this.cmd("Connect", this.conditionLabel_3b_ID, this.conditionLabel_7_ID);
    this.cmd("Connect", this.conditionLabel_4r_ID, this.conditionLabel_5b_ID);
    this.cmd("Connect", this.conditionLabel_5t_ID, this.conditionLabel_6_ID);
    this.cmd("Connect", this.conditionLabel_6l_ID, this.conditionLabel_3_ID);
    this.cmd("Connect", this.conditionLabel_7b_ID, this.conditionLabel_8_ID);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}

FutureValue_4.prototype.checkCallback = function(event) {
    if (this.pushFieldPrincipal.value != "" && this.pushFieldApr.value != "") {
        var principal = parseFloat(this.pushFieldPrincipal.value);
        var apr = parseFloat(this.pushFieldApr.value);
        this.pushFieldPrincipal.value = "";
        this.pushFieldApr.value = "";
        this.implementAction(this.checkCondition.bind(this), [principal, apr]);
    }
}

FutureValue_4.prototype.checkCondition = function(values) {
    this.commands = [];
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_7_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_8_ID, "#000000");
    var principal = values[0];
    var apr = values[1];

    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_1_ID, "principal = " + principal);
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_2_ID, "apr = " + apr);
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("Step");

    var result = "";
    for (let i = 0; i < 10; i++) {
        this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
        this.cmd("Step");

        result = principal * (1 + apr);
        this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_5_ID, "principal = " + principal + " * (1 + " + apr + ")");
        this.cmd("Step");
        principal = result;
        this.cmd("SetText", this.conditionLabel_5_ID, "principal = " + principal);
        this.cmd("Step");
        this.cmd("SetText", this.resulttext, "输出: " + result.toFixed(2));
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
        this.cmd("Step");

        this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#000000");
        this.cmd("Step");

        this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_3_ID, "i = " + (i + 1));
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
        this.cmd("Step");
    }

    this.cmd("SetForegroundColor", this.conditionLabel_7_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_7_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_8_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_8_ID, "The value in 10 years is:" + principal);
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_8_ID, "#000000");
    this.cmd("Step");

    return this.commands;
}

FutureValue_4.prototype.reset = function() {
    this.top = 0;
    this.nextIndex = this.initialIndex;
}

FutureValue_4.prototype.clearCallback = function(event) {
    this.implementAction(this.clearData.bind(this), "");
}

FutureValue_4.prototype.clearData = function(ignored) {
    this.commands = new Array();
    this.clearAll();
    return this.commands;
}

FutureValue_4.prototype.clearAll = function() {
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
    currentAlg = new FutureValue_4(animManag, canvas.width, canvas.height);
}