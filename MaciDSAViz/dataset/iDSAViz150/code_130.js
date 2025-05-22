function MajorityElement(am, w, h) {
    this.init(am, w, h);
}

MajorityElement.prototype = new Algorithm();
MajorityElement.prototype.constructor = MajorityElement;
MajorityElement.superclass = Algorithm.prototype;

MajorityElement.ELEMENT_WIDTH = 50;
MajorityElement.ELEMENT_HEIGHT = 30;
MajorityElement.START_X = 50;
MajorityElement.START_Y = 100;
MajorityElement.COUNTER_Y = 200;
MajorityElement.HIGHLIGHT_COLOR = "#FF0000";
MajorityElement.CANDIDATE_COLOR = "#00FF00";

MajorityElement.prototype.init = function(am, w, h) {
    MajorityElement.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.arrayData = [];
    this.arrayIDs = [];
    this.candidateID = null;
    this.countLabelID = null;
    this.majorityCount = 0;
};

MajorityElement.prototype.addControls = function() {
    this.controls = [];

    this.inputField = addControlToAlgorithmBar("Text", "");
    this.inputField.onkeydown = this.returnSubmit(this.inputField, this.runCallback.bind(this), 100, false);
    this.controls.push(this.inputField);

    this.runButton = addControlToAlgorithmBar("Button", "Find Majority");
    this.runButton.onclick = this.runCallback.bind(this);
    this.controls.push(this.runButton);
};

MajorityElement.prototype.reset = function() {
    this.nextIndex = 0;
    this.arrayData = [];
    this.arrayIDs = [];
    this.candidateID = null;
    this.countLabelID = null;
};

MajorityElement.prototype.runCallback = function() {
    if (this.inputField.value !== "") {
        this.arrayData = this.inputField.value.split(",").map(Number);
        this.inputField.value = "";
        this.implementAction(this.runAlgorithm.bind(this), "");
    }
};

MajorityElement.prototype.runAlgorithm = function(params) {
    this.commands = [];
    this.majorityCount = Math.floor(this.arrayData.length / 2);

    this.arrayIDs.forEach(id => this.cmd("Delete", id));
    if (this.candidateID) this.cmd("Delete", this.candidateID);
    if (this.countLabelID) this.cmd("Delete", this.countLabelID);

    this.arrayIDs = [];
    for (let i = 0; i < this.arrayData.length; i++) {
        const x = MajorityElement.START_X + i * (MajorityElement.ELEMENT_WIDTH + 5);
        const id = this.nextIndex++;
        this.cmd("CreateRectangle", id, this.arrayData[i], MajorityElement.ELEMENT_WIDTH,
                MajorityElement.ELEMENT_HEIGHT, x, MajorityElement.START_Y);
        this.arrayIDs.push(id);
    }
    this.cmd("Step");

    while (true) {
        const candidateIndex = Math.floor(Math.random() * this.arrayData.length);
        const candidate = this.arrayData[candidateIndex];
        let count = 0;

        this.candidateID = this.nextIndex++;
        this.cmd("CreateHighlightCircle", this.candidateID, MajorityElement.CANDIDATE_COLOR,
                MajorityElement.START_X + candidateIndex * (MajorityElement.ELEMENT_WIDTH + 5),
                MajorityElement.START_Y, 15);
        this.cmd("Step");

        this.countLabelID = this.nextIndex++;
        this.cmd("CreateLabel", this.countLabelID, `Count: ${count}`,
                MajorityElement.START_X, MajorityElement.COUNTER_Y);
        this.cmd("Step");

        for (let i = 0; i < this.arrayData.length; i++) {
            if (this.arrayData[i] === candidate) {
                count++;
                this.cmd("SetHighlight", this.arrayIDs[i], 1);
                this.cmd("SetText", this.countLabelID, `Count: ${count}`);
                this.cmd("Step");
                this.cmd("SetHighlight", this.arrayIDs[i], 0);
                this.cmd("Step");
            }
        }

        if (count > this.majorityCount) {
            this.cmd("SetForegroundColor", this.candidateID, MajorityElement.HIGHLIGHT_COLOR);
            this.cmd("Step");
            break;
        } else {
            this.cmd("Delete", this.candidateID);
            this.cmd("Delete", this.countLabelID);
            this.cmd("Step");
        }
    }
    return this.commands;
};

MajorityElement.prototype.disableUI = function(event) {
    this.controls.forEach(control => control.disabled = true);
};

MajorityElement.prototype.enableUI = function(event) {
    this.controls.forEach(control => control.disabled = false);
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MajorityElement(animManag, canvas.width, canvas.height);
}