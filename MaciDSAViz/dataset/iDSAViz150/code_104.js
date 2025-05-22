function Celsius_2(am, w, h) {
    this.init(am, w, h);
}

Celsius_2.prototype = new Algorithm();
Celsius_2.prototype.constructor = Celsius_2;
Celsius_2.superclass = Algorithm.prototype;

Celsius_2.prototype.init = function(am, w, h) {
    Celsius_2.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
}

Celsius_2.prototype.addControls = function() {
    this.controls = [];
    this.pushField = addControlToAlgorithmBar("Text", "");
    this.pushField.onkeydown = this.returnSubmit(this.pushField, this.checkCallback.bind(this), 6);
    this.pushButton = addControlToAlgorithmBar("Button", "转换");
    this.pushButton.onclick = this.checkCallback.bind(this);
    this.controls.push(this.pushField);
    this.controls.push(this.pushButton);
}

Celsius_2.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
}

Celsius_2.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
}

Celsius_2.prototype.setup = function() {
    this.nextIndex = 0;
    this.conditionLabel_1_ID = this.nextIndex++;
    this.conditionLabel_1r_ID = this.nextIndex++;
    this.conditionLabel_2_ID = this.nextIndex++;
    this.conditionLabel_2r_ID = this.nextIndex++;
    this.conditionLabel_3_ID = this.nextIndex++;
    this.resulttext = this.nextIndex++;

    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "Celsius", 100, 50, 100, 100);
    this.cmd("CreateLabel", this.conditionLabel_1r_ID, "", 150, 100);

    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "Fahrenheit = 9/5 * Celsius + 32", 175, 50, 275, 100); // 计算框
    this.cmd("CreateLabel", this.conditionLabel_2r_ID, "", 362, 100);

    this.cmd("CreateRectangle", this.conditionLabel_3_ID, "输出", 125, 50, 450, 100);

    this.cmd("Connect", this.conditionLabel_1r_ID, this.conditionLabel_2_ID);
    this.cmd("Connect", this.conditionLabel_2r_ID, this.conditionLabel_3_ID);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}

Celsius_2.prototype.checkCallback = function(event) {
    if (this.pushField.value != "") {
        var pushVal = this.pushField.value;
        this.pushField.value = ""
        this.implementAction(this.checkCondition.bind(this), pushVal);
    }
}

Celsius_2.prototype.checkCondition = function(celsius) {
    this.commands = [];
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("SetForegroundColor", this.resulttext, "#000000");
    this.cmd("SetText", this.conditionLabel_1_ID, "Celsius: " + celsius + "°C");

    var fahrenheit = (9 / 5) * parseFloat(celsius) + 32;

    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000"); // 高亮显示初始摄氏度
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#FF0000"); // 高亮显示摄氏温度输入
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_2_ID, "Fahrenheit = 9/5 * " + celsius + " + 32");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
    this.cmd("Step");

    this.cmd("SetText", this.conditionLabel_3_ID, "Fahrenheit： " + fahrenheit.toFixed(2) + "°F");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("Step");

    return this.commands;
}

Celsius_2.prototype.reset = function() {
    this.top = 0;
    this.nextIndex = this.initialIndex;
}

Celsius_2.prototype.clearCallback = function(event) {
    this.implementAction(this.clearData.bind(this), "");
}

Celsius_2.prototype.clearData = function(ignored) {
    this.commands = new Array();
    this.clearAll();
    return this.commands;
}

Celsius_2.prototype.clearAll = function() {
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
    currentAlg = new Celsius_2(animManag, canvas.width, canvas.height);
}