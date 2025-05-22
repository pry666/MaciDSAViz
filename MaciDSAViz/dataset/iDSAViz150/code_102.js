function Book_18(am, w, h) {
    this.init(am, w, h);
}

Book_18.prototype = new Algorithm();
Book_18.prototype.constructor = Book_18;
Book_18.superclass = Algorithm.prototype;

Book_18.prototype.init = function(am, w, h) {
    Book_18.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
}

Book_18.prototype.addControls = function() {
    this.controls = [];
    this.pushField = addControlToAlgorithmBar("Text", "");
    this.pushField.placeholder = "What is the Celsius temperature?";  // 设置提示文本
    this.pushField.style.width = "200px";
    this.pushField.onkeydown = this.returnSubmit(this.pushField, this.checkCallback.bind(this), 6);
    this.pushButton = addControlToAlgorithmBar("Button", "转换");
    this.pushButton.onclick = this.checkCallback.bind(this);
    this.controls.push(this.pushField);
    this.controls.push(this.pushButton);
}

Book_18.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
}

Book_18.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
}

Book_18.prototype.setup = function() {
    this.nextIndex = 0;
    this.conditionLabel_1_ID = this.nextIndex++;
    this.conditionLabel_1r_ID = this.nextIndex++;
    this.conditionLabel_2_ID = this.nextIndex++;
    this.conditionLabel_2r_ID = this.nextIndex++;
    this.conditionLabel_3_ID = this.nextIndex++;
    this.conditionLabel_3b_ID = this.nextIndex++;
    this.conditionLabel_4_ID = this.nextIndex++;
    this.conditionLabel_4b_ID = this.nextIndex++;
    this.conditionLabel_5_ID = this.nextIndex++;
    this.conditionLabel_5b_ID = this.nextIndex++;
    this.conditionLabel_6_ID = this.nextIndex++;
    this.conditionLabel_7_ID = this.nextIndex++;

    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "Celsius", 100, 50, 100, 100);
    this.cmd("CreateLabel", this.conditionLabel_1r_ID, "", 150, 100);

    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "Fahrenheit = 9/5 * Celsius + 32", 175, 50, 275, 100); // 计算框
    this.cmd("CreateLabel", this.conditionLabel_2r_ID, "", 362, 100);

    this.cmd("CreateRectangle", this.conditionLabel_3_ID, "print", 225, 50, 500, 100);
    this.cmd("CreateLabel", this.conditionLabel_3b_ID, "", 500, 125);

    this.cmd("CreateRectangle", this.conditionLabel_4_ID, "fahrenheit > 90", 125, 50, 400, 200);
    this.cmd("CreateRectangle", this.conditionLabel_5_ID, "fahrenheit < 30", 125, 50, 600, 200);
    this.cmd("CreateLabel", this.conditionLabel_4b_ID, "", 400, 220);
    this.cmd("CreateLabel", this.conditionLabel_5b_ID, "", 600, 220);

    this.cmd("CreateRectangle", this.conditionLabel_6_ID, "It’s really hot out there. Be careful!", 175, 50, 400, 300);
    this.cmd("CreateRectangle", this.conditionLabel_7_ID, "Brrrrr. Be sure to dress warmly!", 175, 50, 600, 300);

    this.cmd("Connect", this.conditionLabel_1r_ID, this.conditionLabel_2_ID);
    this.cmd("Connect", this.conditionLabel_2r_ID, this.conditionLabel_3_ID);
    this.cmd("Connect", this.conditionLabel_3b_ID, this.conditionLabel_4_ID);
    this.cmd("Connect", this.conditionLabel_3b_ID, this.conditionLabel_5_ID);
    this.cmd("Connect", this.conditionLabel_4b_ID, this.conditionLabel_6_ID);
    this.cmd("Connect", this.conditionLabel_5b_ID, this.conditionLabel_7_ID);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}

Book_18.prototype.checkCallback = function(event) {
    if (this.pushField.value != "") {
        var pushVal = this.pushField.value;
        this.pushField.value = ""
        this.implementAction(this.checkCondition.bind(this), pushVal);
    }
}

Book_18.prototype.checkCondition = function(celsius) {
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
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_2_ID, "Fahrenheit = " + fahrenheit);
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
    this.cmd("Step");

    this.cmd("SetText", this.conditionLabel_3_ID, "The temperature is " + fahrenheit.toFixed(2) + " degrees Fahrenheit.");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("Step");

    if (fahrenheit > 90){
        this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#000000");
        this.cmd("Step");
    }
    if (fahrenheit < 30){
        this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_7_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_7_ID, "#000000");
        this.cmd("Step");
    }

    return this.commands;
}

Book_18.prototype.reset = function() {
    this.top = 0;
    this.nextIndex = this.initialIndex;
}

Book_18.prototype.clearCallback = function(event) {
    this.implementAction(this.clearData.bind(this), "");
}

Book_18.prototype.clearData = function(ignored) {
    this.commands = new Array();
    this.clearAll();
    return this.commands;
}

Book_18.prototype.clearAll = function() {
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
    currentAlg = new Book_18(animManag, canvas.width, canvas.height);
}