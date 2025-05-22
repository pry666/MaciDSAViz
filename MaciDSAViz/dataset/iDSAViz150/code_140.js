function ClimbStairs(am, w, h) {
    this.init(am, w, h);
}

ClimbStairs.prototype = new Algorithm();
ClimbStairs.prototype.constructor = ClimbStairs;
ClimbStairs.superclass = Algorithm.prototype;

ClimbStairs.prototype.init = function(am, w, h) {
    ClimbStairs.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();

    this.a = 1;
    this.b = 1;
    this.stepCount = 0;
    this.currentN = 0;
    this.aID = this.nextIndex++;
    this.bID = this.nextIndex++;
    this.stepID = this.nextIndex++;
    this.highlightA = this.nextIndex++;
    this.highlightB = this.nextIndex++;
};

ClimbStairs.prototype.addControls = function() {
    this.controls = [];

    this.nField = addControlToAlgorithmBar("Text", "");
    this.nField.onkeydown = this.returnSubmit(this.nField, this.runCallback.bind(this), 2, true);
    this.controls.push(this.nField);

    this.runButton = addControlToAlgorithmBar("Button", "Run");
    this.runButton.onclick = this.runCallback.bind(this);
    this.controls.push(this.runButton);

    this.resetButton = addControlToAlgorithmBar("Button", "Reset");
    this.resetButton.onclick = this.resetCallback.bind(this);
    this.controls.push(this.resetButton);
};

ClimbStairs.prototype.reset = function() {
    this.nextIndex = 0;
    this.a = 1;
    this.b = 1;
    this.stepCount = 0;
    this.currentN = 0;
    this.aID = this.nextIndex++;
    this.bID = this.nextIndex++;
    this.stepID = this.nextIndex++;
    this.highlightA = this.nextIndex++;
    this.highlightB = this.nextIndex++;
};

ClimbStairs.prototype.runCallback = function() {
    var n = this.nField.value;
    if (n && parseInt(n) > 0) {
        this.nField.value = "";
        this.implementAction(this.climbStairs.bind(this), parseInt(n));
    }
};

ClimbStairs.prototype.resetCallback = function() {
    this.implementAction(this.resetAll.bind(this), "");
};

ClimbStairs.prototype.resetAll = function() {
    this.commands = [];
    this.cmd("Delete", this.aID);
    this.cmd("Delete", this.bID);
    this.cmd("Delete", this.stepID);
    this.cmd("Delete", this.highlightA);
    this.cmd("Delete", this.highlightB);
    return this.commands;
};

ClimbStairs.prototype.climbStairs = function(n) {
    this.commands = [];
    this.currentN = n;

    this.cmd("CreateLabel", this.aID, "a = 1", 100, 50);
    this.cmd("CreateLabel", this.bID, "b = 1", 100, 100);
    this.cmd("CreateLabel", this.stepID, "Step: 0", 100, 150);
    this.cmd("CreateHighlightCircle", this.highlightA, "#FF0000", 50, 50, 15);
    this.cmd("CreateHighlightCircle", this.highlightB, "#FF0000", 50, 100, 15);
    this.cmd("Step");

    for (let i = 0; i < n - 1; i++) {
        this.cmd("Move", this.highlightA, 50, 50 + i*50);
        this.cmd("Move", this.highlightB, 50, 100 + i*50);
        this.cmd("Step");

        const newA = this.b;
        const newB = this.a + this.b;

        this.cmd("SetText", this.aID, `a = ${this.b}`);
        this.cmd("SetText", this.bID, `b = ${this.a + this.b}`);
        this.cmd("SetText", this.stepID, `Step: ${i + 1}`);
        this.cmd("Step");

        this.a = newA;
        this.b = newB;
    }
    return this.commands;
};

ClimbStairs.prototype.disableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

ClimbStairs.prototype.enableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new ClimbStairs(animManag, canvas.width, canvas.height);
}