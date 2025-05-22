function MajorityElement(am, w, h) {
    this.init(am, w, h);
}

MajorityElement.prototype = new Algorithm();
MajorityElement.prototype.constructor = MajorityElement;
MajorityElement.superclass = Algorithm.prototype;

MajorityElement.ELEMENT_WIDTH = 50;
MajorityElement.ELEMENT_HEIGHT = 30;
MajorityElement.START_X = 50;
MajorityElement.START_Y = 100;
MajorityElement.FOREGROUND_COLOR = "#000000";
MajorityElement.BACKGROUND_COLOR = "#87CEEB";
MajorityElement.HIGHLIGHT_COLOR = "#FF0000";

MajorityElement.prototype.init = function(am, w, h) {
    MajorityElement.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.arrayData = [];
    this.arrayID = [];
    this.labels = [];
    this.highlightCircle = null;
};

MajorityElement.prototype.addControls = function() {
    this.controls = [];
    this.inputField = addControlToAlgorithmBar("Text", "");
    this.inputField.onkeydown = this.returnSubmit(this.inputField, this.runCallback.bind(this), 100, false);
    this.controls.push(this.inputField);

    this.runButton = addControlToAlgorithmBar("Button", "Run");
    this.runButton.onclick = this.runCallback.bind(this);
    this.controls.push(this.runButton);
};

MajorityElement.prototype.runCallback = function() {
    var input = this.inputField.value;
    if (input) {
        this.inputField.value = "";
        this.implementAction(this.runAlgorithm.bind(this), input);
    }
};

MajorityElement.prototype.runAlgorithm = function(input) {
    this.commands = [];
    this.arrayData = input.split(",").map(Number);
    this.arrayID = [];
    this.nextIndex = 0;

    for (let i = 0; i < this.arrayData.length; i++) {
        this.arrayID[i] = this.nextIndex++;
        const x = MajorityElement.START_X + i * MajorityElement.ELEMENT_WIDTH;
        this.cmd("CreateRectangle", this.arrayID[i], this.arrayData[i],
                MajorityElement.ELEMENT_WIDTH, MajorityElement.ELEMENT_HEIGHT,
                x, MajorityElement.START_Y);
        this.cmd("SetForegroundColor", this.arrayID[i], MajorityElement.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", this.arrayID[i], MajorityElement.BACKGROUND_COLOR);
    }
    this.cmd("Step");

    this.arrayData.sort((a,b) => a-b);
    for (let i = 0; i < this.arrayData.length; i++) {
        const newX = MajorityElement.START_X + i * MajorityElement.ELEMENT_WIDTH;
        this.cmd("Move", this.arrayID[i], newX, MajorityElement.START_Y + 100);
        this.cmd("SetText", this.arrayID[i], this.arrayData[i]);
    }
    this.cmd("Step");

    const midIndex = Math.floor(this.arrayData.length / 2);
    const midX = MajorityElement.START_X + midIndex * MajorityElement.ELEMENT_WIDTH + MajorityElement.ELEMENT_WIDTH/2;
    this.highlightCircle = this.nextIndex++;
    this.cmd("CreateHighlightCircle", this.highlightCircle, MajorityElement.HIGHLIGHT_COLOR,
            midX, MajorityElement.START_Y + 100 + MajorityElement.ELEMENT_HEIGHT/2, 20);
    this.cmd("Step");

    return this.commands;
};

MajorityElement.prototype.reset = function() {
    this.nextIndex = 0;
    this.arrayData = [];
    this.arrayID = [];
};

MajorityElement.prototype.disableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = true);
};

MajorityElement.prototype.enableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = false);
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MajorityElement(animManag, canvas.width, canvas.height);
}