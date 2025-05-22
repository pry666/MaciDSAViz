function PrimeChecker(am, w, h) {
    this.init(am, w, h);
}

PrimeChecker.prototype = new Algorithm();
PrimeChecker.prototype.constructor = PrimeChecker;
PrimeChecker.superclass = Algorithm.prototype;

PrimeChecker.prototype.init = function(am, w, h) {
    PrimeChecker.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.array = [];
    this.currentNum = null;
    this.currentDivisor = null;
    this.resultLabel = null;
    this.sqrtLabel = null;
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

PrimeChecker.prototype.addControls = function() {
    this.controls = [];
    this.checkField = addControlToAlgorithmBar("Text", "");
    this.checkField.onkeydown = this.returnSubmit(this.checkField, this.checkCallback.bind(this), 10, false);
    this.controls.push(this.checkField);

    this.checkButton = addControlToAlgorithmBar("Button", "Check Prime");
    this.checkButton.onclick = this.checkCallback.bind(this);
    this.controls.push(this.checkButton);
};

PrimeChecker.prototype.reset = function() {
    this.nextIndex = 0;
    this.array = [];
    this.currentNum = null;
    this.currentDivisor = null;

    if (this.resultLabel != null) {
        this.cmd("Delete", this.resultLabel);
        this.resultLabel = null;
    }
    if (this.sqrtLabel != null) {
        this.cmd("Delete", this.sqrtLabel);
        this.sqrtLabel = null;
    }
    for (let i = 0; i < this.divisorRects.length; i++) {
        this.cmd("Delete", this.divisorRects[i]);
    }
    this.divisorRects = [];
};

PrimeChecker.prototype.checkCallback = function() {
    let num = this.checkField.value;
    if (num !== "") {
        this.checkField.value = "";
        this.implementAction(this.checkPrime.bind(this), parseInt(num));
    }
};

PrimeChecker.prototype.checkPrime = function(num) {
    this.commands = [];
    this.divisorRects = [];

    this.resultLabel = this.nextIndex++;
    this.cmd("CreateLabel", this.resultLabel, `Checking if ${num} is prime`, 20, 20, 0);
    this.cmd("Step");

    if (num <= 1) {
        this.cmd("SetText", this.resultLabel, `${num} ≤ 1 → Not Prime`);
        this.cmd("Step");
        return this.commands;
    }

    const sqrtVal = Math.sqrt(num);
    this.sqrtLabel = this.nextIndex++;
    this.cmd("CreateLabel", this.sqrtLabel, `√${num} ≈ ${Math.floor(sqrtVal)}`, 20, 40, 0);
    this.cmd("Step");

    let xPos = 20, yPos = 80;
    for (let i = 2; i <= Math.floor(sqrtVal); i++) {
        const rectID = this.nextIndex++;
        this.divisorRects.push(rectID);
        this.cmd("CreateRectangle", rectID, i, 40, 30, xPos, yPos);
        this.cmd("SetForegroundColor", rectID, "#0000FF");
        this.cmd("Step");

        this.cmd("SetHighlight", rectID, 1);
        this.cmd("Step");

        if (num % i === 0) {
            this.cmd("SetText", this.resultLabel, `${num} ÷ ${i} = ${num/i} → Not Prime`);
            this.cmd("SetBackgroundColor", rectID, "#FF0000");
            this.cmd("Step");
            return this.commands;
        }
        this.cmd("SetHighlight", rectID, 0);
        xPos += 50;
    }

    this.cmd("SetText", this.resultLabel, `No divisors found → Prime`);
    this.cmd("Step");
    return this.commands;
};

PrimeChecker.prototype.disableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

PrimeChecker.prototype.enableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;
function init() {
    var animManag = initCanvas();
    currentAlg = new PrimeChecker(animManag, canvas.width, canvas.height);
}