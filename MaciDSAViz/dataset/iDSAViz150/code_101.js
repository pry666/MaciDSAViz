function InterestCalculator(am, w, h) {
    this.init(am, w, h);
}

InterestCalculator.prototype = new Algorithm();
InterestCalculator.prototype.constructor = InterestCalculator;
InterestCalculator.superclass = Algorithm.prototype;

InterestCalculator.prototype.init = function(am, w, h) {
    InterestCalculator.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.amounts = [];
    this.rate = 0.05;

    this.arrayIDs = [];
    this.indexBoxID = null;
    this.currentIndex = 0;

    this.arrayStartX = 100;
    this.arrayStartY = 150;
    this.arrayElemWidth = 70;
    this.arrayElemHeight = 30;
    this.indexBoxX = 400;
    this.indexBoxY = 50;

    this.setupVisual();
};

InterestCalculator.prototype.addControls = function() {
    this.controls = [];

    this.amountsLabel = addLabelToAlgorithmBar("输入金额列表（用逗号分隔）：");
    this.amountsField = addControlToAlgorithmBar("Text", "");
    this.amountsField.value = "1000, 2200, 800, 360";
    this.controls.push(this.amountsField);

    this.rateLabel = addLabelToAlgorithmBar("利率（小数）：");
    this.rateField = addControlToAlgorithmBar("Text", "");
    this.rateField.value = "0.05";
    this.controls.push(this.rateField);

    this.calculateButton = addControlToAlgorithmBar("Button", "计算利息");
    this.calculateButton.onclick = this.calculateCallback.bind(this);
    this.controls.push(this.calculateButton);
};

InterestCalculator.prototype.setupVisual = function() {
    this.commands = [];

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

InterestCalculator.prototype.calculateCallback = function(event) {
    var amountsInput = this.amountsField.value.trim();
    var rateInput = parseFloat(this.rateField.value);

    if (amountsInput.length > 0 && !isNaN(rateInput)) {
        var amountsStrArray = amountsInput.split(",");
        this.amounts = [];
        for (var i = 0; i < amountsStrArray.length; i++) {
            var amount = parseFloat(amountsStrArray[i]);
            if (!isNaN(amount)) {
                this.amounts.push(amount);
            } else {
                alert("请输入有效的金额！");
                return;
            }
        }
        this.rate = rateInput;
        this.amountsField.disabled = true;
        this.rateField.disabled = true;
        this.calculateButton.disabled = true;
        this.implementAction(this.calculateInterest.bind(this), "");
    } else {
        alert("请输入有效的金额列表和利率！");
    }
};

InterestCalculator.prototype.calculateInterest = function(dummy) {
    this.commands = [];
    this.nextIndex = 0;

    if (this.arrayIDs.length > 0) {
        for (var i = 0; i < this.arrayIDs.length; i++) {
            this.cmd("Delete", this.arrayIDs[i]);
        }
        this.arrayIDs = [];
    }

    var arrayLength = this.amounts.length;
    var arrayX = this.arrayStartX;
    var arrayY = this.arrayStartY;

    for (var i = 0; i < arrayLength; i++) {
        var arrayID = this.nextIndex++;
        this.arrayIDs.push(arrayID);
        this.cmd("CreateRectangle", arrayID, this.amounts[i].toFixed(2), this.arrayElemWidth, this.arrayElemHeight, arrayX + i * (this.arrayElemWidth + 10), arrayY);
        this.cmd("SetFontSize", arrayID, 16);
    }
    this.cmd("Step");

    this.indexBoxID = this.nextIndex++;
    this.cmd("CreateRectangle", this.indexBoxID, "i = 0", 50, 30, this.indexBoxX, this.indexBoxY);
    this.cmd("SetFontSize", this.indexBoxID, 16);
    this.cmd("Step");

    for (var i = 0; i < arrayLength; i++) {
        this.cmd("SetText", this.indexBoxID, "i = " + i);
        this.cmd("Step");

        this.cmd("SetHighlight", this.arrayIDs[i], 1);
        this.cmd("Step");

        var oldAmount = this.amounts[i];
        var newAmount = oldAmount * (1 + this.rate);
        this.amounts[i] = newAmount;

        var calcLabelID = this.nextIndex++;
        var calcX = this.arrayStartX + i * (this.arrayElemWidth + 10);
        var calcY = this.arrayStartY - 50;
        var calcText = oldAmount.toFixed(2) + " × (1 + " + this.rate.toFixed(2) + ") = " + newAmount.toFixed(2);
        this.cmd("CreateLabel", calcLabelID, calcText, calcX, calcY);
        this.cmd("SetFontSize", calcLabelID, 16);
        this.cmd("Step");

        this.cmd("SetText", this.arrayIDs[i], newAmount.toFixed(2));
        this.cmd("Step");

        this.cmd("SetHighlight", this.arrayIDs[i], 0);
        this.cmd("Delete", calcLabelID);
    }

    this.cmd("Delete", this.indexBoxID);

    var resultLabelID = this.nextIndex++;
    var resultX = this.arrayStartX + (arrayLength * (this.arrayElemWidth + 10)) / 2; // 居中显示
    var resultY = this.arrayStartY + 100;
    var resultText = "更新后的金额列表：" + this.amounts.map(a => a.toFixed(2)).join(", ");
    this.cmd("CreateLabel", resultLabelID, resultText, resultX, resultY);
    this.cmd("SetFontSize", resultLabelID, 16);
    this.cmd("SetTextAlign", resultLabelID, "left");
    this.cmd("Step");

    return this.commands;
};

InterestCalculator.prototype.reset = function() {
    this.nextIndex = 0;
    this.animationManager.resetAll();
    this.amounts = [];
    this.rate = 0.05;
    this.arrayIDs = [];
    this.indexBoxID = null;
    this.currentIndex = 0;
    this.amountsField.disabled = false;
    this.rateField.disabled = false;
    this.calculateButton.disabled = false;
    this.setupVisual();
};

InterestCalculator.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

InterestCalculator.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new InterestCalculator(animManag, canvas.width, canvas.height);
}