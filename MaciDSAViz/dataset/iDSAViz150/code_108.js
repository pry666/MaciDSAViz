function Book_23(am, w, h) {
    this.init(am, w, h);
}

Book_23.prototype = new Algorithm();
Book_23.prototype.constructor = Book_23;
Book_23.superclass = Algorithm.prototype;

Book_23.prototype.init = function (am, w, h) {
    Book_23.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
};

Book_23.prototype.addControls = function () {
    this.controls = [];

    this.numField = addControlToAlgorithmBar("Text", "");
    this.numField.placeholder = "Enter number count (n)";
    this.numField.style.width = "200px";
    this.numField.onkeydown = this.returnSubmit(this.numField, this.checkCallback.bind(this), 4);

    this.executeButton = addControlToAlgorithmBar("Button", "Execute");
    this.executeButton.onclick = this.checkCallback.bind(this);

    this.controls.push(this.numField);
    this.controls.push(this.executeButton);
};

Book_23.prototype.enableUI = function () {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

Book_23.prototype.disableUI = function () {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

Book_23.prototype.setup = function () {
    this.nextIndex = 0;
    this.conditionLabel_1_ID = this.nextIndex++;
    this.conditionLabel_1b_ID = this.nextIndex++;
    this.conditionLabel_2_ID = this.nextIndex++;
    this.conditionLabel_2b_ID = this.nextIndex++;
    this.conditionLabel_2r_ID = this.nextIndex++;
    this.conditionLabel_2r2_ID = this.nextIndex++;
    this.conditionLabel_3_ID = this.nextIndex++;
    this.conditionLabel_3b_ID = this.nextIndex++;
    this.conditionLabel_4_ID = this.nextIndex++;
    this.conditionLabel_4r_ID = this.nextIndex++;
    this.conditionLabel_4r2_ID = this.nextIndex++;
    this.conditionLabel_4b_ID = this.nextIndex++;
    this.conditionLabel_5_ID = this.nextIndex++;

    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "initialize", 100, 50, 250, 50);
    this.cmd("CreateLabel", this.conditionLabel_1b_ID, "", 250, 75);

    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "for i in range(n)", 150, 50, 250, 150);
    this.cmd("CreateLabel", this.conditionLabel_2b_ID, "", 250, 175);
    this.cmd("CreateLabel", this.conditionLabel_2r_ID, "", 325, 150);
    this.cmd("CreateLabel", this.conditionLabel_2r2_ID, "", 400, 150);

    this.cmd("CreateRectangle", this.conditionLabel_3_ID, "x", 150, 50, 250, 250);
    this.cmd("CreateLabel", this.conditionLabel_3b_ID, "", 250, 275);

    this.cmd("CreateRectangle", this.conditionLabel_4_ID, "total", 150, 50, 250, 350);
    this.cmd("CreateLabel", this.conditionLabel_4b_ID, "", 250, 375);
    this.cmd("CreateLabel", this.conditionLabel_4r_ID, "", 325, 350);
    this.cmd("CreateLabel", this.conditionLabel_4r2_ID, "", 400, 350);

    this.cmd("CreateRectangle", this.conditionLabel_5_ID, "print", 200, 50, 250, 450);

    this.cmd("Connect", this.conditionLabel_1b_ID, this.conditionLabel_2_ID);
    this.cmd("Connect", this.conditionLabel_2b_ID, this.conditionLabel_3_ID);
    this.cmd("Connect", this.conditionLabel_3b_ID, this.conditionLabel_4_ID);
    this.cmd("Connect", this.conditionLabel_4b_ID, this.conditionLabel_5_ID);

    this.cmd("Connect", this.conditionLabel_4r_ID, this.conditionLabel_4r2_ID);
    this.cmd("Connect", this.conditionLabel_4r2_ID, this.conditionLabel_2r2_ID);
    this.cmd("Connect", this.conditionLabel_2r2_ID, this.conditionLabel_2r_ID);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

Book_23.prototype.checkCallback = function () {
    if (this.numField.value !== "") {
        const n = parseInt(this.numField.value);
        if (n > 0) {
            this.numField.value = "";
            this.implementAction(this.checkCondition.bind(this), n);
        } else {
            alert("Please enter a valid number greater than 0.");
        }
    }
};

Book_23.prototype.checkCondition = function (n) {
    this.commands = [];
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");

    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
    this.cmd("Step");
    let total = 0;
    this.cmd("SetText", this.conditionLabel_1_ID, "total = 0");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_2_ID, "for i in range("+n+")");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("Step");

    for (let i = 0; i < n; i++) {
        this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_2_ID, "i = " + i);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
        this.cmd("Step");

        this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
        this.cmd("Step");
        const input = parseFloat(prompt(`Enter number ${i + 1}:`));
        this.cmd("SetText", this.conditionLabel_3_ID, "x = " + input);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
        this.cmd("Step");

        this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_4_ID, "total = total + x");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_4_ID, "total = "+total+" + "+input);
        this.cmd("Step");
        total += input;
        this.cmd("SetText", this.conditionLabel_4_ID, "total = "+total);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
        this.cmd("Step");
    }
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_5_ID, "The average of the numbers is total/n");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_5_ID, "The average of the numbers is "+total+"/"+n);
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_5_ID, "The average of the numbers is " + total/n);
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
    this.cmd("Step");

    return this.commands;
};

Book_23.prototype.reset = function () {
    this.commands = [];
    return this.commands;
};

var currentAlg;

function init() {
    const animManag = initCanvas();
    currentAlg = new Book_23(animManag, canvas.width, canvas.height);
}