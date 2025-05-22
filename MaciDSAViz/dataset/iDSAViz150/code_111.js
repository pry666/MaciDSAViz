function SwapVariables(am, w, h) {
    this.init(am, w, h);
}

SwapVariables.prototype = new Algorithm();
SwapVariables.prototype.constructor = SwapVariables;
SwapVariables.superclass = Algorithm.prototype;

SwapVariables.prototype.init = function(am, w, h) {
    SwapVariables.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.xValue = 0; // x 的默认值
    this.yValue = 0; // y 的默认值

    this.xLabelID = this.nextIndex++;
    this.xBoxID = this.nextIndex++;
    this.yLabelID = this.nextIndex++;
    this.yBoxID = this.nextIndex++;
    this.tempLabelID = this.nextIndex++;
    this.tempBoxID = this.nextIndex++;

    this.setupVisual();
};

SwapVariables.prototype.addControls = function() {
    this.controls = [];

    this.xField = addControlToAlgorithmBar("Text", "x:");
    this.xField.value = "0";
    this.controls.push(this.xField);

    this.yField = addControlToAlgorithmBar("Text", "y:");
    this.yField.value = "0";
    this.controls.push(this.yField);

    this.swapButton = addControlToAlgorithmBar("Button", "Swap");
    this.swapButton.onclick = this.swapCallback.bind(this);
    this.controls.push(this.swapButton);
};

SwapVariables.prototype.setupVisual = function() {
    this.commands = [];

    this.xLabelPos = { x: 150, y: 100 };
    this.xBoxPos = { x: 200, y: 100 };
    this.yLabelPos = { x: 150, y: 150 };
    this.yBoxPos = { x: 200, y: 150 };
    this.tempLabelPos = { x: 350, y: 125 };
    this.tempBoxPos = { x: 400, y: 125 };

    this.cmd("CreateLabel", this.xLabelID, "x", this.xLabelPos.x, this.xLabelPos.y);
    this.cmd("CreateRectangle", this.xBoxID, "", 50, 30, this.xBoxPos.x, this.xBoxPos.y);

    this.cmd("CreateLabel", this.yLabelID, "y", this.yLabelPos.x, this.yLabelPos.y);
    this.cmd("CreateRectangle", this.yBoxID, "", 50, 30, this.yBoxPos.x, this.yBoxPos.y);

    this.cmd("CreateLabel", this.tempLabelID, "temp", this.tempLabelPos.x, this.tempLabelPos.y);
    this.cmd("SetAlpha", this.tempLabelID, 0);
    this.cmd("CreateRectangle", this.tempBoxID, "", 50, 30, this.tempBoxPos.x, this.tempBoxPos.y);
    this.cmd("SetAlpha", this.tempBoxID, 0);

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

SwapVariables.prototype.swapCallback = function(event) {
    var xInput = parseFloat(this.xField.value);
    var yInput = parseFloat(this.yField.value);

    if (!isNaN(xInput) && !isNaN(yInput)) {
        this.xValue = xInput;
        this.yValue = yInput;

        this.cmd("SetText", this.xBoxID, this.xValue);
        this.cmd("SetText", this.yBoxID, this.yValue);

        this.implementAction(this.swapVariables.bind(this), "");
    }
};

SwapVariables.prototype.swapVariables = function(dummy) {
    this.commands = [];
    var temp = this.xValue
    this.cmd("SetAlpha", this.tempLabelID, 1);
    this.cmd("SetAlpha", this.tempBoxID, 1);
    this.cmd("Step");

    this.cmd("SetHighlight", this.xBoxID, 1);
    this.cmd("SetHighlight", this.tempBoxID, 1);
    this.cmd("Step");

    var tempValueID = this.nextIndex++;
    this.cmd("CreateLabel", tempValueID, this.xValue, this.xBoxPos.x, this.xBoxPos.y);
    this.cmd("Move", tempValueID, this.tempBoxPos.x, this.tempBoxPos.y);
    this.cmd("Step");
    this.cmd("SetText", this.tempBoxID, this.xValue);
    this.cmd("Delete", tempValueID);
    this.cmd("SetHighlight", this.xBoxID, 0);
    this.cmd("SetHighlight", this.tempBoxID, 0);
    this.cmd("Step");

    this.cmd("SetHighlight", this.yBoxID, 1);
    this.cmd("SetHighlight", this.xBoxID, 1);
    this.cmd("Step");

    var xValueID = this.nextIndex++;
    this.cmd("CreateLabel", xValueID, this.yValue, this.yBoxPos.x, this.yBoxPos.y);
    this.cmd("Move", xValueID, this.xBoxPos.x, this.xBoxPos.y);
    this.cmd("Step");
    this.xValue = this.yValue;
    this.cmd("SetText", this.xBoxID, this.xValue);
    this.cmd("Delete", xValueID);
    this.cmd("SetHighlight", this.yBoxID, 0);
    this.cmd("SetHighlight", this.xBoxID, 0);
    this.cmd("Step");

    this.cmd("SetHighlight", this.tempBoxID, 1);
    this.cmd("SetHighlight", this.yBoxID, 1);
    this.cmd("Step");

    var yValueID = this.nextIndex++;
    this.cmd("CreateLabel", yValueID, temp, this.tempBoxPos.x, this.tempBoxPos.y);
    this.cmd("Move", yValueID, this.yBoxPos.x, this.yBoxPos.y);
    this.cmd("Step");
    this.yValue = temp;
    this.cmd("SetText", this.yBoxID, this.yValue);
    this.cmd("Delete", yValueID);
    this.cmd("SetHighlight", this.tempBoxID, 0);
    this.cmd("SetHighlight", this.yBoxID, 0);
    this.cmd("Step");

    this.cmd("SetAlpha", this.tempBoxID, 0);
    this.cmd("SetAlpha", this.tempLabelID, 0);

    return this.commands;
};

SwapVariables.prototype.reset = function() {
    this.nextIndex = 0;
    this.xValue = 0;
    this.yValue = 0;
    this.animationManager.resetAll();
    this.setupVisual();
};

SwapVariables.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

SwapVariables.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new SwapVariables(animManag, canvas.width, canvas.height);
}