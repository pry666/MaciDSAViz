function LongestCommonPrefix(am, w, h) {
    this.init(am, w, h);
}

LongestCommonPrefix.prototype = new Algorithm();
LongestCommonPrefix.prototype.constructor = LongestCommonPrefix;
LongestCommonPrefix.superclass = Algorithm.prototype;

LongestCommonPrefix.prototype.init = function(am, w, h) {
    LongestCommonPrefix.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.strs = ["flower", "flow", "flight"]; // Example input
    this.labels = [];
    this.rectangles = [];
    this.minLength = Math.min(...this.strs.map(s => s.length));
    this.low = 0;
    this.high = this.minLength;
    this.mid = 0;
    this.commonPrefix = "";

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

LongestCommonPrefix.prototype.addControls = function() {
    this.controls = [];

    this.startButton = addControlToAlgorithmBar("Button", "Start");
    this.startButton.onclick = this.startCallback.bind(this);
    this.controls.push(this.startButton);
};

LongestCommonPrefix.prototype.reset = function() {
    this.nextIndex = 0;
    this.low = 0;
    this.high = this.minLength;
    this.mid = 0;
    this.commonPrefix = "";

    for (let i = 0; i < this.rectangles.length; i++) {
        this.cmd("Delete", this.rectangles[i]);
    }
    for (let i = 0; i < this.labels.length; i++) {
        this.cmd("Delete", this.labels[i]);
    }
    this.rectangles = [];
    this.labels = [];
};

LongestCommonPrefix.prototype.startCallback = function() {
    this.implementAction(this.start.bind(this));
};

LongestCommonPrefix.prototype.start = function() {
    this.commands = [];
    this.createVisualization();
    this.binarySearch();
    return this.commands;
};

LongestCommonPrefix.prototype.createVisualization = function() {
    const startX = 50;
    const startY = 50;
    const rectWidth = 50;
    const rectHeight = 30;
    const spacing = 60;

    for (let i = 0; i < this.strs.length; i++) {
        const labelID = this.nextIndex++;
        const rectID = this.nextIndex++;

        this.labels.push(labelID);
        this.rectangles.push(rectID);

        this.cmd("CreateLabel", labelID, `String ${i + 1}:`, startX, startY + i * spacing);
        this.cmd("CreateRectangle", rectID, this.strs[i], rectWidth, rectHeight, startX + 100, startY + i * spacing);
    }
    this.cmd("Step");
};

LongestCommonPrefix.prototype.binarySearch = function() {
    while (this.low < this.high) {
        this.mid = Math.floor((this.high - this.low + 1) / 2) + this.low;
        if (this.isCommonPrefix(this.mid)) {
            this.low = this.mid;
        } else {
            this.high = this.mid - 1;
        }
        this.updateHighlight();
        this.cmd("Step");
    }
    this.commonPrefix = this.strs[0].substring(0, this.low);
    this.cmd("SetText", this.labels[0], `Longest Common Prefix: ${this.commonPrefix}`);
};

LongestCommonPrefix.prototype.isCommonPrefix = function(length) {
    const prefix = this.strs[0].substring(0, length);
    for (let i = 1; i < this.strs.length; i++) {
        if (!this.strs[i].startsWith(prefix)) {
            return false;
        }
    }
    return true;
};

LongestCommonPrefix.prototype.updateHighlight = function() {
    const startX = 50;
    const startY = 50;
    const rectWidth = 50;
    const rectHeight = 30;
    const spacing = 60;

    for (let i = 0; i < this.strs.length; i++) {
        const prefix = this.strs[i].substring(0, this.mid);
        this.cmd("SetText", this.rectangles[i], prefix);
        this.cmd("SetForegroundColor", this.rectangles[i], "#0000FF");
        this.cmd("SetBackgroundColor", this.rectangles[i], "#FFFF00");
    }
    this.cmd("Step");

    for (let i = 0; i < this.strs.length; i++) {
        this.cmd("SetText", this.rectangles[i], this.strs[i]);
        this.cmd("SetForegroundColor", this.rectangles[i], "#000000");
        this.cmd("SetBackgroundColor", this.rectangles[i], "#FFFFFF");
    }
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