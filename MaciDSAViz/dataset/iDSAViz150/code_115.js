function FactorialCalculator(am, w, h) {
    this.init(am, w, h);
}

FactorialCalculator.prototype = new Algorithm();
FactorialCalculator.prototype.constructor = FactorialCalculator;
FactorialCalculator.superclass = Algorithm.prototype;

FactorialCalculator.prototype.init = function(am, w, h) {
    FactorialCalculator.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.factorialValue = 1;
    this.n = 0;
    this.currentFactor = 0;
};

FactorialCalculator.prototype.addControls = function() {
    this.controls = [];

    this.nLabel = addLabelToAlgorithmBar("n = ");
    this.nField = addControlToAlgorithmBar("Text", "");
    this.nField.value = "0";
    this.controls.push(this.nField);

    this.calculateButton = addControlToAlgorithmBar("Button", "Calculate");
    this.calculateButton.onclick = this.calculateCallback.bind(this);
    this.controls.push(this.calculateButton);
};

FactorialCalculator.prototype.calculateCallback = function(event) {
    var n = parseInt(this.nField.value);

    if (!isNaN(n) && n >= 0) {
        this.n = n;
        this.nField.value = "0";
        this.implementAction(this.calculateFactorial.bind(this), "");
    } else {
        alert("请输入一个非负整数！");
    }
};

FactorialCalculator.prototype.calculateFactorial = function(dummy) {
    this.commands = [];
    this.nextIndex = 0;

    this.factorialValue = 1;

    var leftX = 100;
    var rightX = 400;
    var nY = 50;
    var factorY = 100;
    var factorialY = 75;
    var resultY = 250;

    this.nLabelID = this.nextIndex++;
    this.nValueID = this.nextIndex++;
    this.cmd("CreateLabel", this.nLabelID, "n =", leftX, nY);
    this.cmd("CreateRectangle", this.nValueID, this.n, 50, 30, leftX + 50, nY);

    this.factorLabelID = this.nextIndex++;
    this.factorValueID = this.nextIndex++;
    this.cmd("CreateLabel", this.factorLabelID, "factor =", leftX, factorY);
    this.cmd("CreateRectangle", this.factorValueID, "", 50, 30, leftX + 50, factorY);

    this.factorialLabelID = this.nextIndex++;
    this.factorialValueID = this.nextIndex++;
    this.cmd("CreateLabel", this.factorialLabelID, "fact =", rightX, factorialY);
    this.cmd("CreateRectangle", this.factorialValueID, this.factorialValue, 50, 30, rightX + 50, factorialY);

    this.cmd("Step");

    var factor = this.n + 1; // 将在循环开始时自减
    var factorDecrementID = this.nextIndex++;

    while (factor > 2) {
        factor--;
        this.cmd("CreateLabel", factorDecrementID, factor + 1 + " - 1 = " + factor, leftX + 150, factorY);
        this.cmd("SetHighlight", this.factorValueID, 1);
        this.cmd("Step");
        this.cmd("SetText", this.factorValueID, factor);
        this.cmd("Delete", factorDecrementID);
        this.cmd("SetHighlight", this.factorValueID, 0);
        this.cmd("Step");

        this.cmd("SetHighlight", this.factorValueID, 1);
        this.cmd("SetHighlight", this.factorialValueID, 1);
        this.cmd("Step");

        var movingFactorID = this.nextIndex++;
        this.cmd("CreateLabel", movingFactorID, factor, leftX + 50, factorY);
        this.cmd("Move", movingFactorID, rightX + 50, factorialY);
        this.cmd("Step");

        this.factorialValue *= factor;
        this.cmd("SetText", this.factorialValueID, this.factorialValue);
        this.cmd("Delete", movingFactorID);

        var calcLabelID = this.nextIndex++;
        var calcX = rightX + 150;
        var calcY = factorialY;
        this.cmd("CreateLabel", calcLabelID, "fact = " + this.factorialValue + " (fact * " + factor + ")", calcX, calcY);
        this.cmd("Step");
        this.cmd("Delete", calcLabelID);

        this.cmd("SetHighlight", this.factorValueID, 0);
        this.cmd("SetHighlight", this.factorialValueID, 0);
        this.cmd("Step");
    }

    if (factor === 2) {
        factor--;
        this.cmd("CreateLabel", factorDecrementID, factor + 1 + " - 1 = " + factor, leftX + 150, factorY);
        this.cmd("SetHighlight", this.factorValueID, 1);
        this.cmd("Step");
        this.cmd("SetText", this.factorValueID, factor);
        this.cmd("Delete", factorDecrementID);
        this.cmd("SetHighlight", this.factorValueID, 0);
        this.cmd("Step");

        this.cmd("SetHighlight", this.factorValueID, 1);
        this.cmd("SetHighlight", this.factorialValueID, 1);
        this.cmd("Step");

        var movingFactorID = this.nextIndex++;
        this.cmd("CreateLabel", movingFactorID, factor, leftX + 50, factorY);
        this.cmd("Move", movingFactorID, rightX + 50, factorialY);
        this.cmd("Step");

        this.factorialValue *= factor;
        this.cmd("SetText", this.factorialValueID, this.factorialValue);
        this.cmd("Delete", movingFactorID);

        var calcLabelID = this.nextIndex++;
        var calcX = rightX + 150;
        var calcY = factorialY;
        this.cmd("CreateLabel", calcLabelID, "fact = " + this.factorialValue + " (fact * " + factor + ")", calcX, calcY);
        this.cmd("Step");
        this.cmd("Delete", calcLabelID);

        this.cmd("SetHighlight", this.factorValueID, 0);
        this.cmd("SetHighlight", this.factorialValueID, 0);
        this.cmd("Step");
    }

    this.cmd("Delete", this.factorLabelID);
    this.cmd("Delete", this.factorValueID);

    this.resultLabelID = this.nextIndex++;
    this.cmd("CreateLabel", this.resultLabelID, "The factorial of " + this.n + " is " + this.factorialValue, rightX, resultY);

    return this.commands;
};

FactorialCalculator.prototype.reset = function() {
    this.nextIndex = 0;
    this.animationManager.resetAll();
    this.factorialValue = 1;
    this.n = 0;
};

FactorialCalculator.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

FactorialCalculator.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new FactorialCalculator(animManag, canvas.width, canvas.height);
}