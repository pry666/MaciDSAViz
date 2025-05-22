function MajorityElement(am, w, h) {
    this.init(am, w, h);
}

MajorityElement.prototype = new Algorithm();
MajorityElement.prototype.constructor = MajorityElement;
MajorityElement.superclass = Algorithm.prototype;

MajorityElement.ELEMENT_WIDTH = 50;
MajorityElement.ELEMENT_HEIGHT = 30;
MajorityElement.START_X = 50;
MajorityElement.START_Y = 50;
MajorityElement.CANDIDATE_X = 50;
MajorityElement.CANDIDATE_Y = 150;
MajorityElement.COUNT_X = 50;
MajorityElement.COUNT_Y = 200;

MajorityElement.prototype.init = function(am, w, h) {
    MajorityElement.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.arrayID = [];
    this.candidateID = this.nextIndex++;
    this.countID = this.nextIndex++;
    this.currentHighlight = null;

    this.commands = [];
    this.cmd("CreateRectangle", this.candidateID, "Candidate: None", 120, 30, MajorityElement.CANDIDATE_X, MajorityElement.CANDIDATE_Y);
    this.cmd("CreateRectangle", this.countID, "Count: 0", 120, 30, MajorityElement.COUNT_X, MajorityElement.COUNT_Y);
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

MajorityElement.prototype.addControls = function() {
    this.controls = [];
    this.inputField = addControlToAlgorithmBar("Text", "");
    this.inputField.onkeydown = this.returnSubmit(this.inputField, this.runCallback.bind(this), 60, false);
    this.controls.push(this.inputField);

    this.runButton = addControlToAlgorithmBar("Button", "Run");
    this.runButton.onclick = this.runCallback.bind(this);
    this.controls.push(this.runButton);

    this.resetButton = addControlToAlgorithmBar("Button", "Reset");
    this.resetButton.onclick = this.resetCallback.bind(this);
    this.controls.push(this.resetButton);
};

MajorityElement.prototype.resetCallback = function(event) {
    this.implementAction(this.reset.bind(this), "");
};

MajorityElement.prototype.reset = function() {
    this.commands = [];
    for (let i = 0; i < this.arrayID.length; i++) {
        this.cmd("Delete", this.arrayID[i]);
    }
    this.arrayID = [];
    this.nextIndex = 2;
    this.cmd("SetText", this.candidateID, "Candidate: None");
    this.cmd("SetText", this.countID, "Count: 0");
    return this.commands;
};

MajorityElement.prototype.runCallback = function(event) {
    const input = this.inputField.value.replace(/ /g, '');
    if (input) {
        this.inputField.value = "";
        const nums = input.split(',').map(Number);
        this.implementAction(this.processAlgorithm.bind(this), nums);
    }
};

MajorityElement.prototype.processAlgorithm = function(nums) {
    this.commands = [];

    const elementSpacing = 60;
    for (let i = 0; i < nums.length; i++) {
        const xPos = MajorityElement.START_X + i * elementSpacing;
        const yPos = MajorityElement.START_Y;
        const id = this.nextIndex++;
        this.arrayID.push(id);
        this.cmd("CreateRectangle", id, nums[i], MajorityElement.ELEMENT_WIDTH, MajorityElement.ELEMENT_HEIGHT, xPos, yPos);
    }
    this.cmd("Step");

    let candidate = null;
    let count = 0;

    for (let i = 0; i < nums.length; i++) {
        const currentID = this.nextIndex++;
        this.cmd("CreateHighlightCircle", currentID, "#FF0000",
            MajorityElement.START_X + i * elementSpacing + MajorityElement.ELEMENT_WIDTH/2,
            MajorityElement.START_Y + MajorityElement.ELEMENT_HEIGHT/2, 15);
        this.currentHighlight = currentID;
        this.cmd("Step");

        if (count === 0) {
            candidate = nums[i];
            this.cmd("SetText", this.candidateID, `Candidate: ${candidate}`);
            this.cmd("SetForegroundColor", this.arrayID[i], "#0000FF");
            this.cmd("SetBackgroundColor", this.arrayID[i], "#CCCCFF");
            this.cmd("Step");
        }

        if (nums[i] === candidate) {
            count++;
        } else {
            count--;
        }
        this.cmd("SetText", this.countID, `Count: ${count}`);
        this.cmd("Step");

        this.cmd("Delete", this.currentHighlight);
        this.currentHighlight = null;
    }

    this.cmd("SetForegroundColor", this.candidateID, "#009900");
    this.cmd("SetBackgroundColor", this.candidateID, "#CCFFCC");
    this.cmd("Step");

    return this.commands;
};

MajorityElement.prototype.disableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = true);
};

MajorityElement.prototype.enableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = false);
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MajorityElement(animManag, canvas.width, canvas.height);
}