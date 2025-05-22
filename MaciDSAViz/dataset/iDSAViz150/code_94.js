function Book_10(am, w, h) {
    this.init(am, w, h);
}

Book_10.prototype = new Algorithm();
Book_10.prototype.constructor = Book_10;
Book_10.superclass = Algorithm.prototype;

Book_10.prototype.init = function(am, w, h) {
    Book_10.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
}

Book_10.prototype.addControls = function() {
    this.controls = [];

    this.monthInputField = addControlToAlgorithmBar("Text", "");
    this.monthInputField.placeholder = "Enter month number (1-12)";
    this.monthInputField.style.width = "200px";
    this.monthInputField.onkeydown = this.returnSubmit(this.monthInputField, this.checkCallback.bind(this));

    this.executeButton = addControlToAlgorithmBar("Button", "执行");
    this.executeButton.onclick = this.checkCallback.bind(this);

    this.controls.push(this.monthInputField);
    this.controls.push(this.executeButton);
}

Book_10.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
}

Book_10.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
}

Book_10.prototype.setup = function() {
    this.nextIndex = 0;

    this.monthArrayID = [];
    this.monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < this.monthAbbreviations.length; i++) {
        const xPos = 50 + i * 60;  // 让每个方块水平排列
        const yPos = 100;
        const id = this.nextIndex++;

        this.monthArrayID.push(id);
        this.cmd("CreateRectangle", id, this.monthAbbreviations[i], 50, 50, xPos, yPos);
        this.cmd("SetForegroundColor", id, "#000000");
    }

    this.monthLabel_ID = this.nextIndex++;
    this.resultLabel_ID = this.nextIndex++;

    this.cmd("CreateRectangle", this.monthLabel_ID, "Month Number", 150, 50, 100, 200);
    this.cmd("CreateRectangle", this.resultLabel_ID, "Month Abbreviation", 200, 50, 300, 200);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}

Book_10.prototype.checkCallback = function(event) {
    if (this.monthInputField.value !== "") {
        var monthNumber = parseInt(this.monthInputField.value);
        this.monthInputField.value = "";
        this.implementAction(this.checkCondition.bind(this), [monthNumber]);
    }
}

Book_10.prototype.checkCondition = function(values) {
    this.commands = [];
    this.cmd("SetForegroundColor", this.monthLabel_ID, "#000000");
    this.cmd("SetForegroundColor", this.resultLabel_ID, "#000000");

    const monthNumber = values[0];

    this.cmd("SetForegroundColor", this.monthLabel_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.monthLabel_ID, "Month Number = " + monthNumber);
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.monthLabel_ID, "#000000");
    this.cmd("Step");

    if (monthNumber >= 1 && monthNumber <= 12) {
        const targetIndex = monthNumber - 1;

        const monthAbbrev = this.monthAbbreviations[targetIndex];

        this.cmd("SetForegroundColor", this.monthArrayID[targetIndex], "#00FF00");  // 绿色表示找到
        this.cmd("Step");
        this.cmd("SetText", this.resultLabel_ID, "The month abbreviation is " + monthAbbrev + ".");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.resultLabel_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.resultLabel_ID, "#000000");
        this.cmd("Step");
    } else {
        this.cmd("SetForegroundColor", this.resultLabel_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.resultLabel_ID, "Invalid month number!");
        this.cmd("SetForegroundColor", this.resultLabel_ID, "#000000");
        this.cmd("Step");
    }


    return this.commands;
}

Book_10.prototype.reset = function() {
    this.top = 0;
    this.nextIndex = this.initialIndex;
}

Book_10.prototype.clearCallback = function(event) {
    this.implementAction(this.clearData.bind(this), "");
}

Book_10.prototype.clearData = function(ignored) {
    this.commands = new Array();
    this.clearAll();
    return this.commands;
}

Book_10.prototype.clearAll = function() {
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
    currentAlg = new Book_10(animManag, canvas.width, canvas.height);
}