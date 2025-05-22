function ChangeCounter(am, w, h) {
    this.init(am, w, h);
}

ChangeCounter.prototype = new Algorithm();
ChangeCounter.prototype.constructor = ChangeCounter;
ChangeCounter.superclass = Algorithm.prototype;

ChangeCounter.prototype.init = function(am, w, h) {
    ChangeCounter.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.quarters = 0;
    this.dimes = 0;
    this.nickels = 0;
    this.pennies = 0;
    this.total = 0;
};

ChangeCounter.prototype.addControls = function() {
    this.controls = [];

    this.quartersLabel = addLabelToAlgorithmBar("quarters = ");
    this.quartersField = addControlToAlgorithmBar("Text", "");
    this.quartersField.value = "0";
    this.controls.push(this.quartersField);

    this.dimesLabel = addLabelToAlgorithmBar("dimes = ");
    this.dimesField = addControlToAlgorithmBar("Text", "");
    this.dimesField.value = "0";
    this.controls.push(this.dimesField);

    this.nickelsLabel = addLabelToAlgorithmBar("nickels = ");
    this.nickelsField = addControlToAlgorithmBar("Text", "");
    this.nickelsField.value = "0";
    this.controls.push(this.nickelsField);

    this.penniesLabel = addLabelToAlgorithmBar("pennies = ");
    this.penniesField = addControlToAlgorithmBar("Text", "");
    this.penniesField.value = "0";
    this.controls.push(this.penniesField);

    this.calculateButton = addControlToAlgorithmBar("Button", "Count");
    this.calculateButton.onclick = this.calculateCallback.bind(this);
    this.controls.push(this.calculateButton);
};

ChangeCounter.prototype.calculateCallback = function(event) {
    var quarters = parseInt(this.quartersField.value);
    var dimes = parseInt(this.dimesField.value);
    var nickels = parseInt(this.nickelsField.value);
    var pennies = parseInt(this.penniesField.value);

    if (isNaN(quarters)) quarters = 0;
    if (isNaN(dimes)) dimes = 0;
    if (isNaN(nickels)) nickels = 0;
    if (isNaN(pennies)) pennies = 0;

    this.quarters = quarters;
    this.dimes = dimes;
    this.nickels = nickels;
    this.pennies = pennies;

    this.quartersField.value = "0";
    this.dimesField.value = "0";
    this.nickelsField.value = "0";
    this.penniesField.value = "0";

    this.implementAction(this.calculateTotal.bind(this), "");
};

ChangeCounter.prototype.calculateTotal = function(dummy) {
    this.commands = [];
    this.nextIndex = 0; // 重置可视化对象的索引

    var labelX = 100;
    var boxX = 200;
    var quartersY = 50;
    var dimesY = 100;
    var nickelsY = 150;
    var penniesY = 200;
    var totalY = 300;

    this.quartersLabelID = this.nextIndex++;
    this.quartersBoxID = this.nextIndex++;
    this.cmd("CreateLabel", this.quartersLabelID, "Quarters", labelX, quartersY);
    this.cmd("CreateRectangle", this.quartersBoxID, this.quarters, 50, 30, boxX, quartersY);

    this.dimesLabelID = this.nextIndex++;
    this.dimesBoxID = this.nextIndex++;
    this.cmd("CreateLabel", this.dimesLabelID, "Dimes", labelX, dimesY);
    this.cmd("CreateRectangle", this.dimesBoxID, this.dimes, 50, 30, boxX, dimesY);

    this.nickelsLabelID = this.nextIndex++;
    this.nickelsBoxID = this.nextIndex++;
    this.cmd("CreateLabel", this.nickelsLabelID, "Nickels", labelX, nickelsY);
    this.cmd("CreateRectangle", this.nickelsBoxID, this.nickels, 50, 30, boxX, nickelsY);

    this.penniesLabelID = this.nextIndex++;
    this.penniesBoxID = this.nextIndex++;
    this.cmd("CreateLabel", this.penniesLabelID, "Pennies", labelX, penniesY);
    this.cmd("CreateRectangle", this.penniesBoxID, this.pennies, 50, 30, boxX, penniesY);


    var quartersValue = this.quarters * 0.25;
    var quartersValueID = this.nextIndex++;
    this.cmd("CreateLabel", quartersValueID, "", boxX + 150, quartersY);

    this.cmd("SetHighlight", this.quartersBoxID, 1);
    this.cmd("Step");
    this.cmd("SetText", quartersValueID, this.quarters + " x 0.25 = " + quartersValue.toFixed(2));
    this.cmd("SetHighlight", this.quartersBoxID, 0);
    this.cmd("Step");

    var dimesValue = this.dimes * 0.10;
    var dimesValueID = this.nextIndex++;
    this.cmd("CreateLabel", dimesValueID, "", boxX + 150, dimesY);

    this.cmd("SetHighlight", this.dimesBoxID, 1);
    this.cmd("Step");
    this.cmd("SetText", dimesValueID, this.dimes + " x 0.10 = " + dimesValue.toFixed(2));
    this.cmd("SetHighlight", this.dimesBoxID, 0);
    this.cmd("Step");

    var nickelsValue = this.nickels * 0.05;
    var nickelsValueID = this.nextIndex++;
    this.cmd("CreateLabel", nickelsValueID, "", boxX + 150, nickelsY);

    this.cmd("SetHighlight", this.nickelsBoxID, 1);
    this.cmd("Step");
    this.cmd("SetText", nickelsValueID, this.nickels + " x 0.05 = " + nickelsValue.toFixed(2));
    this.cmd("SetHighlight", this.nickelsBoxID, 0);
    this.cmd("Step");

    var penniesValue = this.pennies * 0.01;
    var penniesValueID = this.nextIndex++;
    this.cmd("CreateLabel", penniesValueID, "", boxX + 150, penniesY);

    this.cmd("SetHighlight", this.penniesBoxID, 1);
    this.cmd("Step");
    this.cmd("SetText", penniesValueID, this.pennies + " x 0.01 = " + penniesValue.toFixed(2));
    this.cmd("SetHighlight", this.penniesBoxID, 0);
    this.cmd("Step");

    var totalValue = quartersValue + dimesValue + nickelsValue + penniesValue;
    var totalLabelID = this.nextIndex++;
    this.cmd("CreateLabel", totalLabelID, "Total", labelX, totalY);

    var totalBoxID = this.nextIndex++;
    this.cmd("CreateRectangle", totalBoxID, "", 100, 30, boxX, totalY);

    var runningTotal = 0;
    var runningTotalID = this.nextIndex++;

    this.cmd("CreateLabel", runningTotalID, "", boxX + 150, totalY);

    runningTotal += quartersValue;
    this.cmd("SetHighlight", totalBoxID, 1);
    this.cmd("SetText", runningTotalID, "Total = $" + runningTotal.toFixed(2));
    this.cmd("SetText", totalBoxID, runningTotal.toFixed(2));
    this.cmd("Step");
    this.cmd("SetHighlight", totalBoxID, 0);

    runningTotal += dimesValue;
    this.cmd("SetHighlight", totalBoxID, 1);
    this.cmd("SetText", runningTotalID, "Total = $" + runningTotal.toFixed(2));
    this.cmd("SetText", totalBoxID, runningTotal.toFixed(2));
    this.cmd("Step");
    this.cmd("SetHighlight", totalBoxID, 0);

    runningTotal += nickelsValue;
    this.cmd("SetHighlight", totalBoxID, 1);
    this.cmd("SetText", runningTotalID, "Total = $" + runningTotal.toFixed(2));
    this.cmd("SetText", totalBoxID, runningTotal.toFixed(2));
    this.cmd("Step");
    this.cmd("SetHighlight", totalBoxID, 0);

    runningTotal += penniesValue;
    this.cmd("SetHighlight", totalBoxID, 1);
    this.cmd("SetText", runningTotalID, "Total = $" + runningTotal.toFixed(2));
    this.cmd("SetText", totalBoxID, runningTotal.toFixed(2));
    this.cmd("Step");
    this.cmd("SetHighlight", totalBoxID, 0);

    this.cmd("SetText", runningTotalID, "Total = $" + runningTotal.toFixed(2));
    this.cmd("Step");

    this.cmd("Delete", runningTotalID);

    this.total = runningTotal;

    return this.commands;
};

ChangeCounter.prototype.reset = function() {
    this.nextIndex = 0;
    this.animationManager.resetAll();
    this.quarters = 0;
    this.dimes = 0;
    this.nickels = 0;
    this.pennies = 0;
    this.total = 0;
};

ChangeCounter.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

ChangeCounter.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new ChangeCounter(animManag, canvas.width, canvas.height);
}