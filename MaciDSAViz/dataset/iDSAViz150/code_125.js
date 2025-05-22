function StrStrAlgorithm(am, w, h) {
    this.init(am, w, h);
}

StrStrAlgorithm.prototype = new Algorithm();
StrStrAlgorithm.prototype.constructor = StrStrAlgorithm;
StrStrAlgorithm.superclass = Algorithm.prototype;

StrStrAlgorithm.prototype.init = function(am, w, h) {
    StrStrAlgorithm.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.haystackRects = [];
    this.needleRects = [];
    this.indexLabels = [];
    this.highlightIDs = [];
};

StrStrAlgorithm.prototype.addControls = function() {
    this.controls = [];

    this.haystackField = addControlToAlgorithmBar("Text", "");
    this.haystackField.onkeydown = this.returnSubmit(this.haystackField, null, 20, false);
    this.controls.push(this.haystackField);

    this.needleField = addControlToAlgorithmBar("Text", "");
    this.needleField.onkeydown = this.returnSubmit(this.needleField, null, 20, false);
    this.controls.push(this.needleField);

    this.searchButton = addControlToAlgorithmBar("Button", "Search");
    this.searchButton.onclick = this.searchCallback.bind(this);
    this.controls.push(this.searchButton);
};

StrStrAlgorithm.prototype.reset = function() {
    this.nextIndex = 0;
    this.haystackRects = [];
    this.needleRects = [];
    this.indexLabels = [];
    this.highlightIDs = [];
};

StrStrAlgorithm.prototype.searchCallback = function() {
    var haystack = this.haystackField.value;
    var needle = this.needleField.value;
    this.implementAction(this.doSearch.bind(this), {haystack: haystack, needle: needle});
};

StrStrAlgorithm.prototype.doSearch = function(params) {
    this.commands = [];
    var h = params.haystack;
    var n = params.needle;
    var hLen = h.length;
    var nLen = n.length;

    this.haystackRects.forEach(id => this.cmd("Delete", id));
    this.needleRects.forEach(id => this.cmd("Delete", id));
    this.indexLabels.forEach(id => this.cmd("Delete", id));
    this.highlightIDs.forEach(id => this.cmd("Delete", id));

    var startX = 50;
    var startY = 80;
    var rectWidth = 30;
    var rectHeight = 30;
    var spacing = 35;

    this.haystackRects = [];
    for (let i = 0; i < hLen; i++) {
        var id = this.nextIndex++;
        this.cmd("CreateRectangle", id, h[i], rectWidth, rectHeight, startX + i*spacing, startY);
        this.haystackRects.push(id);

        var labelID = this.nextIndex++;
        this.cmd("CreateLabel", labelID, i, startX + i*spacing, startY + 40, true);
        this.indexLabels.push(labelID);
    }

    var needleY = startY + 100;
    this.needleRects = [];
    for (let i = 0; i < nLen; i++) {
        var id = this.nextIndex++;
        this.cmd("CreateRectangle", id, n[i], rectWidth, rectHeight, startX + i*spacing, needleY);
        this.needleRects.push(id);
    }
    this.cmd("Step");

    var found = -1;
    for (let i = 0; i <= hLen - nLen; i++) {
        var highlightID = this.nextIndex++;
        this.cmd("CreateHighlightCircle", highlightID, "#FF0000", startX + i*spacing, startY - 40, 15);
        this.highlightIDs.push(highlightID);
        this.cmd("Step");

        let match = true;
        for (let j = 0; j < nLen; j++) {
            var hCharID = this.haystackRects[i+j];
            var nCharID = this.needleRects[j];

            this.cmd("SetBackgroundColor", hCharID, "#FFFF00");
            this.cmd("SetBackgroundColor", nCharID, "#FFFF00");
            this.cmd("Step");

            if (h[i+j] !== n[j]) {
                match = false;
                this.cmd("SetBackgroundColor", hCharID, "#FF0000");
                this.cmd("SetBackgroundColor", nCharID, "#FF0000");
                this.cmd("Step");
                this.cmd("SetBackgroundColor", hCharID, "#FFFFFF");
                this.cmd("SetBackgroundColor", nCharID, "#FFFFFF");
                break;
            }

            this.cmd("SetBackgroundColor", hCharID, "#00FF00");
            this.cmd("SetBackgroundColor", nCharID, "#00FF00");
            this.cmd("Step");
            this.cmd("SetBackgroundColor", hCharID, "#FFFFFF");
            this.cmd("SetBackgroundColor", nCharID, "#FFFFFF");
        }

        if (match) {
            for (let j = 0; j < nLen; j++) {
                this.cmd("SetBackgroundColor", this.haystackRects[i+j], "#00FF00");
            }
            this.cmd("Step");
            found = i;
            break;
        }

        this.cmd("Delete", highlightID);
        this.cmd("Step");
    }

    if (found === -1) {
        var labelID = this.nextIndex++;
        this.cmd("CreateLabel", labelID, "No match found!", startX, startY + 150, true);
        this.cmd("Step");
        this.highlightIDs.push(labelID);
    }

    return this.commands;
};

StrStrAlgorithm.prototype.disableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = true);
};

StrStrAlgorithm.prototype.enableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = false);
};

var currentAlg;
function init() {
    var animManag = initCanvas();
    currentAlg = new StrStrAlgorithm(animManag, canvas.width, canvas.height);
}