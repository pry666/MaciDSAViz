function SubsequenceCheck(am, w, h) {
    this.init(am, w, h);
}

SubsequenceCheck.prototype = new Algorithm();
SubsequenceCheck.prototype.constructor = SubsequenceCheck;
SubsequenceCheck.superclass = Algorithm.prototype;

SubsequenceCheck.CHAR_WIDTH = 30;
SubsequenceCheck.CHAR_HEIGHT = 30;
SubsequenceCheck.START_X = 50;
SubsequenceCheck.START_Y = 100;
SubsequenceCheck.POINTER_OFFSET = 40;
SubsequenceCheck.HIGHLIGHT_COLOR = "#FF0000";
SubsequenceCheck.NORMAL_COLOR = "#000000";

SubsequenceCheck.prototype.init = function(am, w, h) {
    SubsequenceCheck.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.sChars = [];
    this.tChars = [];
    this.iPointer = null;
    this.jPointer = null;
    this.iIndex = 0;
    this.jIndex = 0;
    this.resultLabel = null;

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

SubsequenceCheck.prototype.addControls = function() {
    this.controls = [];

    this.sField = addControlToAlgorithmBar("Text", "");
    this.sField.onkeydown = this.returnSubmit(this.sField, this.checkCallback.bind(this), 10, false);
    this.controls.push(this.sField);

    this.tField = addControlToAlgorithmBar("Text", "");
    this.tField.onkeydown = this.returnSubmit(this.tField, this.checkCallback.bind(this), 10, false);
    this.controls.push(this.tField);

    this.checkButton = addControlToAlgorithmBar("Button", "Check");
    this.checkButton.onclick = this.checkCallback.bind(this);
    this.controls.push(this.checkButton);
};

SubsequenceCheck.prototype.reset = function() {
    this.nextIndex = 0;
    this.iIndex = 0;
    this.jIndex = 0;
    this.sChars = [];
    this.tChars = [];
};

SubsequenceCheck.prototype.checkCallback = function() {
    var s = this.sField.value;
    var t = this.tField.value;
    if (s !== "" && t !== "") {
        this.sField.value = "";
        this.tField.value = "";
        this.implementAction(this.checkSubsequence.bind(this), {s: s, t: t});
    }
};

SubsequenceCheck.prototype.checkSubsequence = function(params) {
    this.commands = [];
    var s = params.s;
    var t = params.t;

    this.sChars = [];
    this.tChars = [];
    this.iIndex = 0;
    this.jIndex = 0;

    var x = SubsequenceCheck.START_X;
    var y = SubsequenceCheck.START_Y;

    for (var i = 0; i < s.length; i++) {
        this.sChars[i] = this.nextIndex++;
        this.cmd("CreateRectangle", this.sChars[i], s[i],
                 SubsequenceCheck.CHAR_WIDTH, SubsequenceCheck.CHAR_HEIGHT,
                 x, y);
        x += SubsequenceCheck.CHAR_WIDTH + 5;
    }

    x = SubsequenceCheck.START_X;
    y += SubsequenceCheck.CHAR_HEIGHT + 30;
    for (var j = 0; j < t.length; j++) {
        this.tChars[j] = this.nextIndex++;
        this.cmd("CreateRectangle", this.tChars[j], t[j],
                 SubsequenceCheck.CHAR_WIDTH, SubsequenceCheck.CHAR_HEIGHT,
                 x, y);
        x += SubsequenceCheck.CHAR_WIDTH + 5;
    }

    this.iPointer = this.nextIndex++;
    this.jPointer = this.nextIndex++;

    this.cmd("CreateHighlightCircle", this.iPointer, SubsequenceCheck.HIGHLIGHT_COLOR,
            SubsequenceCheck.START_X + SubsequenceCheck.CHAR_WIDTH/2,
            SubsequenceCheck.START_Y - SubsequenceCheck.POINTER_OFFSET, 15);
    this.cmd("CreateLabel", this.nextIndex++, "i",
            SubsequenceCheck.START_X + SubsequenceCheck.CHAR_WIDTH/2,
            SubsequenceCheck.START_Y - SubsequenceCheck.POINTER_OFFSET - 20);

    this.cmd("CreateHighlightCircle", this.jPointer, SubsequenceCheck.HIGHLIGHT_COLOR,
            SubsequenceCheck.START_X + SubsequenceCheck.CHAR_WIDTH/2,
            y - SubsequenceCheck.POINTER_OFFSET, 15);
    this.cmd("CreateLabel", this.nextIndex++, "j",
            SubsequenceCheck.START_X + SubsequenceCheck.CHAR_WIDTH/2,
            y - SubsequenceCheck.POINTER_OFFSET - 20);

    this.cmd("Step");

    while (this.iIndex < s.length && this.jIndex < t.length) {
        var sCharID = this.sChars[this.iIndex];
        var tCharID = this.tChars[this.jIndex];

        this.cmd("SetForegroundColor", sCharID, SubsequenceCheck.HIGHLIGHT_COLOR);
        this.cmd("SetForegroundColor", tCharID, SubsequenceCheck.HIGHLIGHT_COLOR);
        this.cmd("Step");

        if (s[this.iIndex] === t[this.jIndex]) {
            this.cmd("SetForegroundColor", sCharID, "#00FF00");
            this.cmd("SetForegroundColor", tCharID, "#00FF00");
            this.cmd("Step");
            this.iIndex++;
            this.updatePointer(this.iPointer, this.sChars, this.iIndex, SubsequenceCheck.START_Y - SubsequenceCheck.POINTER_OFFSET);
        } else {
            this.cmd("SetForegroundColor", sCharID, SubsequenceCheck.NORMAL_COLOR);
            this.cmd("SetForegroundColor", tCharID, "#FF0000");
            this.cmd("Step");
        }

        this.jIndex++;
        this.updatePointer(this.jPointer, this.tChars, this.jIndex, y - SubsequenceCheck.POINTER_OFFSET);

        this.cmd("SetForegroundColor", tCharID, SubsequenceCheck.NORMAL_COLOR);
        if (s[this.iIndex] !== t[this.jIndex-1]) {
            this.cmd("SetForegroundColor", sCharID, SubsequenceCheck.NORMAL_COLOR);
        }
        this.cmd("Step");
    }

    this.resultLabel = this.nextIndex++;
    var resultText = this.iIndex === s.length ? "True" : "False";
    this.cmd("CreateLabel", this.resultLabel, "Result: " + resultText,
            SubsequenceCheck.START_X, y + 50);
    this.cmd("Step");

    return this.commands;
};

SubsequenceCheck.prototype.updatePointer = function(pointerID, charArray, index, yPos) {
    if (index < charArray.length) {
        var newX = SubsequenceCheck.START_X + index*(SubsequenceCheck.CHAR_WIDTH+5) + SubsequenceCheck.CHAR_WIDTH/2;
        this.cmd("Move", pointerID, newX, yPos);
    }
};

SubsequenceCheck.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

SubsequenceCheck.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new SubsequenceCheck(animManag, canvas.width, canvas.height);
}