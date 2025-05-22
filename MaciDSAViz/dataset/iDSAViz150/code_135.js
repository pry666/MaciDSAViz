function LongestCommonPrefix(am, w, h) {
    this.init(am, w, h);
}

LongestCommonPrefix.prototype = new Algorithm();
LongestCommonPrefix.prototype.constructor = LongestCommonPrefix;
LongestCommonPrefix.superclass = Algorithm.prototype;

LongestCommonPrefix.ELEMENT_WIDTH = 80;
LongestCommonPrefix.ELEMENT_HEIGHT = 30;
LongestCommonPrefix.STARTING_X = 50;
LongestCommonPrefix.STARTING_Y = 50;
LongestCommonPrefix.SPACING_X = 100;
LongestCommonPrefix.SPACING_Y = 50;
LongestCommonPrefix.FOREGROUND_COLOR = "#000055";
LongestCommonPrefix.BACKGROUND_COLOR = "#AAAAFF";

LongestCommonPrefix.prototype.init = function(am, w, h) {
    LongestCommonPrefix.superclass.init.call(this, am, w, h);
    this.addControls();

    this.nextIndex = 0;

    this.strings = ["flower", "flow", "flight"];
    this.stringIDs = [];
    this.stringLabels = [];
    this.stringPositions = [];

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();

    this.createStringVisualization();
};

LongestCommonPrefix.prototype.addControls = function() {
    this.controls = [];

    this.startButton = addControlToAlgorithmBar("Button", "Start");
    this.startButton.onclick = this.startCallback.bind(this);
    this.controls.push(this.startButton);
};

LongestCommonPrefix.prototype.reset = function() {
    this.nextIndex = 0;
};

LongestCommonPrefix.prototype.startCallback = function() {
    this.implementAction(this.longestCommonPrefix.bind(this), "");
};

LongestCommonPrefix.prototype.createStringVisualization = function() {
    this.commands = [];
    for (let i = 0; i < this.strings.length; i++) {
        let stringID = this.nextIndex++;
        let stringX = LongestCommonPrefix.STARTING_X + i * LongestCommonPrefix.SPACING_X;
        let stringY = LongestCommonPrefix.STARTING_Y;

        this.cmd("CreateRectangle", stringID, this.strings[i],
                 LongestCommonPrefix.ELEMENT_WIDTH,
                 LongestCommonPrefix.ELEMENT_HEIGHT,
                 stringX, stringY);
        this.cmd("SetForegroundColor", stringID, LongestCommonPrefix.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", stringID, LongestCommonPrefix.BACKGROUND_COLOR);
        this.stringIDs.push(stringID);
        this.stringPositions.push({x: stringX, y: stringY});
    }
    this.cmd("Step");
};

LongestCommonPrefix.prototype.longestCommonPrefix = function(unused) {
    this.commands = [];

    let result = this.lcp(0, this.strings.length - 1);

    let resultID = this.nextIndex++;
    let resultX = LongestCommonPrefix.STARTING_X;
    let resultY = LongestCommonPrefix.STARTING_Y + 2 * LongestCommonPrefix.SPACING_Y;

    this.cmd("CreateRectangle", resultID, "LCP: " + result,
             LongestCommonPrefix.ELEMENT_WIDTH,
             LongestCommonPrefix.ELEMENT_HEIGHT,
             resultX, resultY);
    this.cmd("SetForegroundColor", resultID, LongestCommonPrefix.FOREGROUND_COLOR);
    this.cmd("SetBackgroundColor", resultID, LongestCommonPrefix.BACKGROUND_COLOR);
    this.cmd("Step");

    return this.commands;
};

LongestCommonPrefix.prototype.lcp = function(start, end) {
    if (start == end) {
        return this.strings[start];
    }

    let mid = Math.floor((start + end) / 2);
    let lcpLeft = this.lcp(start, mid);
    let lcpRight = this.lcp(mid + 1, end);

    return this.commonPrefix(lcpLeft, lcpRight);
};

LongestCommonPrefix.prototype.commonPrefix = function(left, right) {
    let minLength = Math.min(left.length, right.length);
    for (let i = 0; i < minLength; i++) {
        if (left[i] != right[i]) {
            return left.substring(0, i);
        }
    }
    return left.substring(0, minLength);
};

LongestCommonPrefix.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

LongestCommonPrefix.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new LongestCommonPrefix(animManag, canvas.width, canvas.height);
}