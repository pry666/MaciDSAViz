function MissingNumber(am, w, h) {
    this.init(am, w, h);
}

MissingNumber.prototype = new Algorithm();
MissingNumber.prototype.constructor = MissingNumber;
MissingNumber.superclass = Algorithm.prototype;

MissingNumber.ELEMENT_WIDTH = 50;
MissingNumber.ELEMENT_HEIGHT = 30;
MissingNumber.START_X = 50;
MissingNumber.START_Y = 50;
MissingNumber.SPACE = 10;
MissingNumber.FORMULA_Y = 200;
MissingNumber.RESULT_Y = 250;

MissingNumber.prototype.init = function(am, w, h) {
    MissingNumber.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.arrayElements = [];
    this.totalLabel = null;
    this.sumLabel = null;
    this.resultLabel = null;
};

MissingNumber.prototype.addControls = function() {
    this.controls = [];

    this.inputField = addControlToAlgorithmBar("Text", "");
    this.inputField.onkeydown = this.returnSubmit(this.inputField, this.calculateCallback.bind(this), 100, false);
    this.controls.push(this.inputField);

    this.calculateButton = addControlToAlgorithmBar("Button", "Calculate");
    this.calculateButton.onclick = this.calculateCallback.bind(this);
    this.controls.push(this.calculateButton);
};

MissingNumber.prototype.reset = function() {
    this.nextIndex = 0;
    this.arrayElements = [];
    this.totalLabel = null;
    this.sumLabel = null;
    this.resultLabel = null;
};

MissingNumber.prototype.calculateCallback = function() {
    var input = this.inputField.value;
    if (input) {
        var nums = input.split(',').map(Number);
        if (nums.every(n => !isNaN(n))) {
            this.implementAction(this.calculate.bind(this), nums);
        } else {
            alert("Invalid input: must be comma-separated numbers");
        }
        this.inputField.value = "";
    }
};

MissingNumber.prototype.calculate = function(nums) {
    this.commands = [];

    this.arrayElements.forEach(id => this.cmd("Delete", id));
    if (this.totalLabel) this.cmd("Delete", this.totalLabel);
    if (this.sumLabel) this.cmd("Delete", this.sumLabel);
    if (this.resultLabel) this.cmd("Delete", this.resultLabel);

    this.arrayElements = [];
    let x = MissingNumber.START_X;
    for (let i = 0; i < nums.length; i++) {
        const id = this.nextIndex++;
        this.arrayElements.push(id);
        this.cmd("CreateRectangle", id, nums[i], MissingNumber.ELEMENT_WIDTH, MissingNumber.ELEMENT_HEIGHT, x, MissingNumber.START_Y);
        x += MissingNumber.ELEMENT_WIDTH + MissingNumber.SPACE;
    }
    this.cmd("Step");

    const n = nums.length;
    const total = n * (n + 1) / 2;
    this.totalLabel = this.nextIndex++;
    this.cmd("CreateLabel", this.totalLabel, `Expected Sum: ${n}*(${n}+1)/2 = ${total}`,
             MissingNumber.START_X, MissingNumber.FORMULA_Y);
    this.cmd("Step");

    const arrSum = nums.reduce((a,b) => a+b, 0);
    this.sumLabel = this.nextIndex++;
    this.cmd("CreateLabel", this.sumLabel, `Actual Sum: ${nums.join('+')} = ${arrSum}`,
             MissingNumber.START_X, MissingNumber.FORMULA_Y + 30);
    this.cmd("Step");

    this.resultLabel = this.nextIndex++;
    this.cmd("CreateLabel", this.resultLabel, `Missing Number: ${total} - ${arrSum} = ${total - arrSum}`,
             MissingNumber.START_X, MissingNumber.RESULT_Y);
    this.cmd("SetForegroundColor", this.resultLabel, "#FF0000");
    this.cmd("Step");

    return this.commands;
};

MissingNumber.prototype.disableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = true);
};

MissingNumber.prototype.enableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = false);
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MissingNumber(animManag, canvas.width, canvas.height);
}