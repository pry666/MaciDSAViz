function MissingNumber(am, w, h) {
    this.init(am, w, h);
}

MissingNumber.prototype = new Algorithm();
MissingNumber.prototype.constructor = MissingNumber;
MissingNumber.superclass = Algorithm.prototype;

MissingNumber.ELEMENT_WIDTH = 50;
MissingNumber.ELEMENT_HEIGHT = 30;
MissingNumber.START_X = 50;
MissingNumber.START_Y = 100;
MissingNumber.FOREGROUND_COLOR = "#000000";
MissingNumber.BACKGROUND_COLOR = "#FFFFFF";
MissingNumber.HIGHLIGHT_COLOR = "#FF0000";
MissingNumber.RESULT_COLOR = "#00FF00";

MissingNumber.prototype.init = function(am, w, h) {
    MissingNumber.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.arrayData = [];
    this.arrayIDs = [];
    this.highlightIDs = [];
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

MissingNumber.prototype.addControls = function() {
    this.controls = [];
    this.inputField = addControlToAlgorithmBar("Text", "");
    this.inputField.onkeydown = this.returnSubmit(this.inputField, this.runCallback.bind(this), 100, false);
    this.controls.push(this.inputField);

    this.runButton = addControlToAlgorithmBar("Button", "Run");
    this.runButton.onclick = this.runCallback.bind(this);
    this.controls.push(this.runButton);
};

MissingNumber.prototype.reset = function() {
    this.nextIndex = 0;
    this.arrayData = [];
    this.arrayIDs = [];
    this.highlightIDs = [];
};

MissingNumber.prototype.runCallback = function() {
    var input = this.inputField.value;
    if (input) {
        this.arrayData = input.split(",").map(Number).sort((a,b) => a-b);
        this.implementAction(this.runAlgorithm.bind(this), "");
    }
};

MissingNumber.prototype.runAlgorithm = function(params) {
    this.commands = [];
    var missing = this.arrayData.length;

    for (let i = 0; i < this.arrayData.length; i++) {
        this.arrayIDs[i] = this.nextIndex++;
        this.cmd("CreateRectangle", this.arrayIDs[i], this.arrayData[i],
                 MissingNumber.ELEMENT_WIDTH, MissingNumber.ELEMENT_HEIGHT,
                 MissingNumber.START_X + i*MissingNumber.ELEMENT_WIDTH,
                 MissingNumber.START_Y);
        this.cmd("SetForegroundColor", this.arrayIDs[i], MissingNumber.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", this.arrayIDs[i], MissingNumber.BACKGROUND_COLOR);
        this.cmd("Step");
    }

    for (let i = 0; i < this.arrayData.length; i++) {
        const highlightID = this.nextIndex++;
        this.highlightIDs.push(highlightID);
        this.cmd("CreateHighlightCircle", highlightID, MissingNumber.HIGHLIGHT_COLOR,
                 MissingNumber.START_X + i*MissingNumber.ELEMENT_WIDTH + MissingNumber.ELEMENT_WIDTH/2,
                 MissingNumber.START_Y + MissingNumber.ELEMENT_HEIGHT/2, 20);
        this.cmd("Step");

        if (this.arrayData[i] !== i) {
            this.cmd("SetBackgroundColor", this.arrayIDs[i], MissingNumber.RESULT_COLOR);
            this.cmd("Step");
            missing = i;
            break;
        }

        this.cmd("Delete", highlightID);
        this.cmd("Step");
    }

    if (missing === this.arrayData.length) {
        const resultID = this.nextIndex++;
        this.cmd("CreateRectangle", resultID, missing,
                 MissingNumber.ELEMENT_WIDTH, MissingNumber.ELEMENT_HEIGHT,
                 MissingNumber.START_X + missing*MissingNumber.ELEMENT_WIDTH,
                 MissingNumber.START_Y);
        this.cmd("SetBackgroundColor", resultID, MissingNumber.RESULT_COLOR);
        this.cmd("Step");
    }

    return this.commands;
};

MissingNumber.prototype.disableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

MissingNumber.prototype.enableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MissingNumber(animManag, canvas.width, canvas.height);
}