function RunningSum(am, w, h) {
    this.init(am, w, h);
}

RunningSum.prototype = new Algorithm();
RunningSum.prototype.constructor = RunningSum;
RunningSum.superclass = Algorithm.prototype;

RunningSum.ELEMENT_WIDTH = 60;
RunningSum.ELEMENT_HEIGHT = 40;
RunningSum.START_X = 30;
RunningSum.START_Y = 100;
RunningSum.LABEL_OFFSET = 20;
RunningSum.HIGHLIGHT_COLOR = "#FF0000";
RunningSum.FOREGROUND_COLOR = "#000000";
RunningSum.BACKGROUND_COLOR = "#87CEEB";

RunningSum.prototype.init = function(am, w, h) {
    RunningSum.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.arrayData = [];
    this.arrayIDs = [];
    this.indexLabels = [];
};

RunningSum.prototype.addControls = function() {
    this.controls = [];
    this.inputField = addControlToAlgorithmBar("Text", "");
    this.inputField.onkeydown = this.returnSubmit(this.inputField, this.runCallback.bind(this), 100, false);
    this.controls.push(this.inputField);

    this.runButton = addControlToAlgorithmBar("Button", "Run");
    this.runButton.onclick = this.runCallback.bind(this);
    this.controls.push(this.runButton);
};

RunningSum.prototype.reset = function() {
    this.nextIndex = 0;
    this.arrayData = [];
    this.arrayIDs = [];
    this.indexLabels = [];
};

RunningSum.prototype.runCallback = function() {
    var input = this.inputField.value;
    if (input) {
        var nums = input.split(",").map(Number);
        this.inputField.value = "";
        this.implementAction(this.runAlgorithm.bind(this), nums);
    }
};

RunningSum.prototype.runAlgorithm = function(nums) {
    this.commands = [];
    var n = nums.length;

    for (var i = 0; i < n; i++) {
        this.arrayIDs[i] = this.nextIndex++;
        var x = RunningSum.START_X + i * (RunningSum.ELEMENT_WIDTH + 10);
        this.cmd("CreateRectangle", this.arrayIDs[i], nums[i], RunningSum.ELEMENT_WIDTH, RunningSum.ELEMENT_HEIGHT, x, RunningSum.START_Y);
        this.cmd("SetForegroundColor", this.arrayIDs[i], RunningSum.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", this.arrayIDs[i], RunningSum.BACKGROUND_COLOR);

        this.indexLabels[i] = this.nextIndex++;
        this.cmd("CreateLabel", this.indexLabels[i], i, x, RunningSum.START_Y + RunningSum.ELEMENT_HEIGHT + RunningSum.LABEL_OFFSET);
        this.cmd("SetForegroundColor", this.indexLabels[i], "#000000");
    }
    this.cmd("Step");

    for (var i = 1; i < n; i++) {
        var highlightID = this.nextIndex++;
        this.cmd("CreateHighlightCircle", highlightID, RunningSum.HIGHLIGHT_COLOR,
            RunningSum.START_X + (i-1) * (RunningSum.ELEMENT_WIDTH + 10) + RunningSum.ELEMENT_WIDTH/2,
            RunningSum.START_Y + RunningSum.ELEMENT_HEIGHT/2, 15);
        this.cmd("Step");

        this.cmd("Move", highlightID,
            RunningSum.START_X + i * (RunningSum.ELEMENT_WIDTH + 10) + RunningSum.ELEMENT_WIDTH/2,
            RunningSum.START_Y + RunningSum.ELEMENT_HEIGHT/2);
        this.cmd("Step");

        nums[i] += nums[i-1];
        this.cmd("SetText", this.arrayIDs[i], nums[i]);
        this.cmd("Delete", highlightID);
        this.cmd("Step");
    }

    return this.commands;
};

RunningSum.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

RunningSum.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new RunningSum(animManag, canvas.width, canvas.height);
}