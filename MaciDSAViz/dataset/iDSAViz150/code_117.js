
function MonthAbbreviation(am, w, h) {
    this.init(am, w, h);
}

MonthAbbreviation.prototype = new Algorithm();
MonthAbbreviation.prototype.constructor = MonthAbbreviation;
MonthAbbreviation.superclass = Algorithm.prototype;

MonthAbbreviation.prototype.init = function(am, w, h) {
    MonthAbbreviation.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.months = "JanFebMarAprMayJunJulAugSepOctNovDec";
    this.n = 0;
    this.pos = 0;
    this.monthAbbrev = "";

    this.monthsCharID = []; // 存储每个字符的ID
    this.monthsIndexID = []; // 存储每个索引的ID

    this.setupVisual();
};

MonthAbbreviation.prototype.addControls = function() {
    this.controls = [];

    this.nLabel = addLabelToAlgorithmBar("n = ");
    this.nField = addControlToAlgorithmBar("Text", "");
    this.nField.value = "1";
    this.controls.push(this.nField);

    this.calculateButton = addControlToAlgorithmBar("Button", "Abbreviate");
    this.calculateButton.onclick = this.calculateCallback.bind(this);
    this.controls.push(this.calculateButton);
};

MonthAbbreviation.prototype.setupVisual = function() {
    this.commands = [];

    var startX = 50;
    var startY = 100;
    var charWidth = 20; // 每个字符之间的间距
    var monthsArray = this.months.split('');

    for (var i = 0; i < monthsArray.length; i++) {
        var charID = this.nextIndex++;
        var indexID = this.nextIndex++;
        var xPos = startX + i * charWidth;

        this.cmd("CreateLabel", charID, monthsArray[i], xPos, startY);
        this.cmd("SetFontSize", charID, 14);
        this.monthsCharID.push(charID);

        this.cmd("CreateLabel", indexID, i, xPos, startY + 20);
        this.cmd("SetFontSize", indexID, 12);
        this.monthsIndexID.push(indexID);
    }

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

MonthAbbreviation.prototype.calculateCallback = function(event) {
    var n = parseInt(this.nField.value);

    if (!isNaN(n) && n >= 1 && n <= 12) {
        this.n = n;
        this.nField.value = "1"; // 重置输入框的值
        this.implementAction(this.calculateMonthAbbreviation.bind(this), "");
    } else {
        alert("请输入1到12之间的整数。");
    }
};

MonthAbbreviation.prototype.calculateMonthAbbreviation = function(dummy) {
    this.commands = [];

    var centerX = 400;
    var nY = 200;
    var posY = 250;
    var resultY = 350;

    this.nLabelID = this.nextIndex++;
    this.nValueID = this.nextIndex++;
    this.cmd("CreateLabel", this.nLabelID, "n =", centerX - 50, nY);
    this.cmd("SetFontSize", this.nLabelID, 16);
    this.cmd("CreateRectangle", this.nValueID, this.n, 50, 30, centerX, nY);
    this.cmd("SetFontSize", this.nValueID, 16);
    this.cmd("Step");

    this.pos = (this.n - 1) * 3;
    this.posLabelID = this.nextIndex++;
    this.posValueID = this.nextIndex++;
    this.cmd("CreateLabel", this.posLabelID, "pos =", centerX - 50, posY);
    this.cmd("SetFontSize", this.posLabelID, 16);
    this.cmd("CreateRectangle", this.posValueID, "", 50, 30, centerX, posY);
    this.cmd("SetFontSize", this.posValueID, 16);

    var calcPosID = this.nextIndex++;
    this.cmd("CreateLabel", calcPosID, "pos = (" + this.n + " - 1) × 3 = " + this.pos, centerX + 150, posY);
    this.cmd("Step");
    this.cmd("SetText", this.posValueID, this.pos);
    this.cmd("Delete", calcPosID);
    this.cmd("Step");

    for (var i = 0; i < this.monthsCharID.length; i++) {
        if (i >= this.pos && i < this.pos + 3) {
            this.cmd("SetHighlight", this.monthsCharID[i], 1);
        }
    }
    this.cmd("Step");

    this.monthAbbrev = this.months.substring(this.pos, this.pos + 3);
    this.monthAbbrevLabelID = this.nextIndex++;
    this.monthAbbrevValueID = this.nextIndex++;
    this.cmd("CreateLabel", this.monthAbbrevLabelID, "monthAbbrev =", centerX - 80, resultY);
    this.cmd("SetFontSize", this.monthAbbrevLabelID, 16);
    this.cmd("CreateRectangle", this.monthAbbrevValueID, this.monthAbbrev, 80, 30, centerX + 30, resultY);
    this.cmd("SetFontSize", this.monthAbbrevValueID, 16);
    this.cmd("Step");

    var resultTextID = this.nextIndex++;
    this.cmd("CreateLabel", resultTextID, '月份缩写是 "' + this.monthAbbrev + '".', centerX + 150, resultY + 50);
    this.cmd("SetFontSize", resultTextID, 16);
    this.cmd("Step");

    for (var i = 0; i < this.monthsCharID.length; i++) {
        this.cmd("SetHighlight", this.monthsCharID[i], 0);
    }

    return this.commands;
};

MonthAbbreviation.prototype.reset = function() {
    this.nextIndex = 0;
    this.animationManager.resetAll();
    this.n = 0;
    this.pos = 0;
    this.monthAbbrev = "";
    this.monthsCharID = [];
    this.monthsIndexID = [];
    this.setupVisual();
};

MonthAbbreviation.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

MonthAbbreviation.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MonthAbbreviation(animManag, canvas.width, canvas.height);
}