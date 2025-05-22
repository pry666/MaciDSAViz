function FindMaxThreeValuesAlternative(am, w, h) {
    this.init(am, w, h);
}

FindMaxThreeValuesAlternative.prototype = new Algorithm();
FindMaxThreeValuesAlternative.prototype.constructor = FindMaxThreeValuesAlternative;
FindMaxThreeValuesAlternative.superclass = Algorithm.prototype;

FindMaxThreeValuesAlternative.prototype.init = function(am, w, h) {
    FindMaxThreeValuesAlternative.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.x1 = 0;
    this.x2 = 0;
    this.x3 = 0;
    this.maxval = 0;

    this.variableIDs = {};
    this.compareResultIDs = []; // 存储比较结果的ID

    this.setupVisual();
};

FindMaxThreeValuesAlternative.prototype.addControls = function() {
    this.controls = [];

    this.x1Label = addLabelToAlgorithmBar("x1 = ");
    this.x1Field = addControlToAlgorithmBar("Text", "");
    this.x1Field.value = "0";
    this.controls.push(this.x1Field);

    this.x2Label = addLabelToAlgorithmBar("x2 = ");
    this.x2Field = addControlToAlgorithmBar("Text", "");
    this.x2Field.value = "0";
    this.controls.push(this.x2Field);

    this.x3Label = addLabelToAlgorithmBar("x3 = ");
    this.x3Field = addControlToAlgorithmBar("Text", "");
    this.x3Field.value = "0";
    this.controls.push(this.x3Field);

    this.compareButton = addControlToAlgorithmBar("Button", "找出最大值");
    this.compareButton.onclick = this.compareCallback.bind(this);
    this.controls.push(this.compareButton);
};

FindMaxThreeValuesAlternative.prototype.setupVisual = function() {
    this.commands = [];

    this.x1Pos = { x: 150, y: 100 };
    this.x2Pos = { x: 150, y: 200 };
    this.x3Pos = { x: 150, y: 300 };
    this.maxvalPos = { x: 500, y: 200 };
    this.compareResultStartPos = { x: 350, y: 150 };
    this.compareResultSpacing = 30; // 每行比较结果的垂直间距

    this.variableIDs['x1Label'] = this.nextIndex++;
    this.cmd("CreateLabel", this.variableIDs['x1Label'], "x1", this.x1Pos.x, this.x1Pos.y);
    this.cmd("SetFontSize", this.variableIDs['x1Label'], 16);

    this.variableIDs['x1Box'] = this.nextIndex++;
    this.cmd("CreateRectangle", this.variableIDs['x1Box'], "", 70, 30, this.x1Pos.x + 50, this.x1Pos.y);
    this.cmd("SetFontSize", this.variableIDs['x1Box'], 16);

    this.variableIDs['x2Label'] = this.nextIndex++;
    this.cmd("CreateLabel", this.variableIDs['x2Label'], "x2", this.x2Pos.x, this.x2Pos.y);
    this.cmd("SetFontSize", this.variableIDs['x2Label'], 16);

    this.variableIDs['x2Box'] = this.nextIndex++;
    this.cmd("CreateRectangle", this.variableIDs['x2Box'], "", 70, 30, this.x2Pos.x + 50, this.x2Pos.y);
    this.cmd("SetFontSize", this.variableIDs['x2Box'], 16);

    this.variableIDs['x3Label'] = this.nextIndex++;
    this.cmd("CreateLabel", this.variableIDs['x3Label'], "x3", this.x3Pos.x, this.x3Pos.y);
    this.cmd("SetFontSize", this.variableIDs['x3Label'], 16);

    this.variableIDs['x3Box'] = this.nextIndex++;
    this.cmd("CreateRectangle", this.variableIDs['x3Box'], "", 70, 30, this.x3Pos.x + 50, this.x3Pos.y);
    this.cmd("SetFontSize", this.variableIDs['x3Box'], 16);

    this.variableIDs['maxvalLabel'] = this.nextIndex++;
    this.cmd("CreateLabel", this.variableIDs['maxvalLabel'], "maxval", this.maxvalPos.x, this.maxvalPos.y);
    this.cmd("SetFontSize", this.variableIDs['maxvalLabel'], 16);

    this.variableIDs['maxvalBox'] = this.nextIndex++;
    this.cmd("CreateRectangle", this.variableIDs['maxvalBox'], "", 70, 30, this.maxvalPos.x + 70, this.maxvalPos.y);
    this.cmd("SetFontSize", this.variableIDs['maxvalBox'], 16);

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

FindMaxThreeValuesAlternative.prototype.compareCallback = function(event) {
    var x1Input = parseFloat(this.x1Field.value);
    var x2Input = parseFloat(this.x2Field.value);
    var x3Input = parseFloat(this.x3Field.value);

    if (!isNaN(x1Input) && !isNaN(x2Input) && !isNaN(x3Input)) {
        this.x1 = x1Input;
        this.x2 = x2Input;
        this.x3 = x3Input;

        this.x1Field.disabled = true;
        this.x2Field.disabled = true;
        this.x3Field.disabled = true;
        this.compareButton.disabled = true;

        this.implementAction(this.findMax.bind(this), "");
    } else {
        alert("请输入有效的数值！");
    }
};

FindMaxThreeValuesAlternative.prototype.findMax = function(dummy) {
    this.commands = [];
    let currentCompareLine = 0; // 记录当前比较结果行数

    this.addCompareResult = function(text) {
        let compareLabelID = this.nextIndex++;
        let posY = this.compareResultStartPos.y + currentCompareLine * this.compareResultSpacing;
        this.cmd("CreateLabel", compareLabelID, text, this.compareResultStartPos.x, posY);
        this.cmd("SetFontSize", compareLabelID, 16);
        this.compareResultIDs.push(compareLabelID);
        this.cmd("Step");
        currentCompareLine++;
    }.bind(this);

    this.cmd("SetText", this.variableIDs['x1Box'], this.x1);
    this.cmd("SetText", this.variableIDs['x2Box'], this.x2);
    this.cmd("SetText", this.variableIDs['x3Box'], this.x3);
    this.cmd("Step");

    this.cmd("SetHighlight", this.variableIDs['x1Box'], 1);
    this.cmd("SetHighlight", this.variableIDs['maxvalBox'], 1);
    this.cmd("Step");

    this.maxval = this.x1;
    this.cmd("SetText", this.variableIDs['maxvalBox'], this.maxval);
    this.cmd("SetHighlight", this.variableIDs['x1Box'], 0);
    this.cmd("SetHighlight", this.variableIDs['maxvalBox'], 0);
    this.cmd("Step");

    this.cmd("SetHighlight", this.variableIDs['x2Box'], 1);
    this.cmd("SetHighlight", this.variableIDs['maxvalBox'], 1);
    this.cmd("Step");

    let comparison1 = this.x2 > this.maxval;
    let comparisonText1 = "x2 > maxval: " + comparison1;
    this.addCompareResult(comparisonText1);

    this.cmd("SetHighlight", this.variableIDs['x2Box'], 0);
    this.cmd("SetHighlight", this.variableIDs['maxvalBox'], 0);
    this.cmd("Step");

    if (comparison1) {
        this.cmd("SetHighlight", this.variableIDs['x2Box'], 1);
        this.cmd("SetHighlight", this.variableIDs['maxvalBox'], 1);
        this.cmd("Step");

        this.maxval = this.x2;
        this.cmd("SetText", this.variableIDs['maxvalBox'], this.maxval);
        this.cmd("SetHighlight", this.variableIDs['x2Box'], 0);
        this.cmd("SetHighlight", this.variableIDs['maxvalBox'], 0);
        this.cmd("Step");
    }

    this.cmd("SetHighlight", this.variableIDs['x3Box'], 1);
    this.cmd("SetHighlight", this.variableIDs['maxvalBox'], 1);
    this.cmd("Step");

    let comparison2 = this.x3 > this.maxval;
    let comparisonText2 = "x3 > maxval: " + comparison2;
    this.addCompareResult(comparisonText2);

    this.cmd("SetHighlight", this.variableIDs['x3Box'], 0);
    this.cmd("SetHighlight", this.variableIDs['maxvalBox'], 0);
    this.cmd("Step");

    if (comparison2) {
        this.cmd("SetHighlight", this.variableIDs['x3Box'], 1);
        this.cmd("SetHighlight", this.variableIDs['maxvalBox'], 1);
        this.cmd("Step");

        this.maxval = this.x3;
        this.cmd("SetText", this.variableIDs['maxvalBox'], this.maxval);
        this.cmd("SetHighlight", this.variableIDs['x3Box'], 0);
        this.cmd("SetHighlight", this.variableIDs['maxvalBox'], 0);
        this.cmd("Step");
    }

    this.cmd("Step");
    this.enableUI();
    return this.commands;
};

FindMaxThreeValuesAlternative.prototype.reset = function() {
    this.nextIndex = 0;
    this.x1 = 0;
    this.x2 = 0;
    this.x3 = 0;
    this.maxval = 0;
    this.variableIDs = {};
    this.compareResultIDs = [];
    this.animationManager.resetAll();
    this.setupVisual();
    this.x1Field.disabled = false;
    this.x2Field.disabled = false;
    this.x3Field.disabled = false;
    this.compareButton.disabled = false;
};

FindMaxThreeValuesAlternative.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

FindMaxThreeValuesAlternative.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new FindMaxThreeValuesAlternative(animManag, canvas.width, canvas.height);
}