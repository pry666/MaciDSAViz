function CharCounter(am, w, h) {
    this.init(am, w, h);
}

CharCounter.prototype = new Algorithm();
CharCounter.prototype.constructor = CharCounter;
CharCounter.superclass = Algorithm.prototype;

CharCounter.CHAR_WIDTH = 30;
CharCounter.CHAR_HEIGHT = 40;
CharCounter.START_X = 50;
CharCounter.START_Y = 50;
CharCounter.HIGHLIGHT_COLOR = "#FF0000";
CharCounter.COUNT_START_X = 50;
CharCounter.COUNT_START_Y = 150;

CharCounter.prototype.init = function(am, w, h) {
    CharCounter.superclass.init.call(this, am, w, h);
    this.addControls();

    this.nextIndex = 0;
    this.stringChars = [];
    this.countLabelID = null;
    this.highlightCircleID = null;
    this.currentIndex = 0;
    this.countValue = 0;
    this.targetChar = '';
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

CharCounter.prototype.addControls = function() {
    this.controls = [];

    this.stringField = addControlToAlgorithmBar("Text", "");
    this.stringField.onkeydown = this.returnSubmit(this.stringField, null, 20, false);
    this.controls.push(this.stringField);

    this.charField = addControlToAlgorithmBar("Text", "");
    this.charField.onkeydown = this.returnSubmit(this.charField, null, 1, false);
    this.controls.push(this.charField);

    this.countButton = addControlToAlgorithmBar("Button", "Count");
    this.countButton.onclick = this.countCallback.bind(this);
    this.controls.push(this.countButton);
};

CharCounter.prototype.countCallback = function(event) {
    var inputString = this.stringField.value;
    var targetChar = this.charField.value;

    if (inputString !== "" && targetChar !== "") {
        this.implementAction(this.countChars.bind(this), {string: inputString, char: targetChar});
    }
};

CharCounter.prototype.countChars = function(params) {
    this.commands = [];
    this.stringField.value = "";
    this.charField.value = "";

    this.stringChars.forEach(id => this.cmd("Delete", id));
    if (this.countLabelID !== null) this.cmd("Delete", this.countLabelID);
    if (this.highlightCircleID !== null) this.cmd("Delete", this.highlightCircleID);

    this.nextIndex = 0;
    this.stringChars = [];
    this.currentIndex = 0;
    this.countValue = 0;
    this.targetChar = params.char;

    const chars = params.string.split('');
    for (let i = 0; i < chars.length; i++) {
        const xPos = CharCounter.START_X + i * CharCounter.CHAR_WIDTH;
        const charID = this.nextIndex++;
        this.cmd("CreateLabel", charID, chars[i], xPos, CharCounter.START_Y);
        this.stringChars.push(charID);
    }

    this.countLabelID = this.nextIndex++;
    this.cmd("CreateLabel", this.countLabelID, "Count: 0", CharCounter.COUNT_START_X, CharCounter.COUNT_START_Y);

    this.highlightCircleID = this.nextIndex++;
    this.cmd("CreateHighlightCircle", this.highlightCircleID, CharCounter.HIGHLIGHT_COLOR,
             CharCounter.START_X - 15, CharCounter.START_Y - 15, 20);

    this.cmd("Step");

    for (let i = 0; i < chars.length; i++) {
        const newX = CharCounter.START_X + i * CharCounter.CHAR_WIDTH - 15;
        this.cmd("Move", this.highlightCircleID, newX, CharCounter.START_Y - 15);
        this.cmd("Step");

        if (chars[i] === this.targetChar) {
            this.countValue++;
            this.cmd("SetText", this.countLabelID, `Count: ${this.countValue}`);
            this.cmd("SetBackgroundColor", this.stringChars[i], "#00FF00");
        } else {
            this.cmd("SetBackgroundColor", this.stringChars[i], "#FF0000");
        }
        this.cmd("Step");
    }

    const resultID = this.nextIndex++;
    this.cmd("CreateLabel", resultID, `Final Count: ${this.countValue}`,
             CharCounter.COUNT_START_X, CharCounter.COUNT_START_Y + 40);
    this.cmd("Step");

    return this.commands;
};

CharCounter.prototype.reset = function() {
    this.nextIndex = 0;
    this.stringChars = [];
    this.countLabelID = null;
    this.highlightCircleID = null;
    this.currentIndex = 0;
    this.countValue = 0;
    this.targetChar = '';
};

CharCounter.prototype.disableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = true);
};

CharCounter.prototype.enableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = false);
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new CharCounter(animManag, canvas.width, canvas.height);
}