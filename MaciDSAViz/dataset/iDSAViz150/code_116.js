function Book_8(am, w, h) {
    this.init(am, w, h);
}

Book_8.prototype = new Algorithm();
Book_8.prototype.constructor = Book_8;
Book_8.superclass = Algorithm.prototype;

Book_8.prototype.init = function(am, w, h) {
    Book_8.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
}

Book_8.prototype.addControls = function() {
    this.controls = [];

    this.pushFieldFirst = addControlToAlgorithmBar("Text", "");
    this.pushFieldFirst.placeholder = "Please enter your first name";  // 设置提示文本
    this.pushFieldFirst.style.width = "175px";
    this.pushFieldFirst.onkeydown = this.returnSubmit(this.pushFieldFirst, this.checkCallback.bind(this));

    this.pushFieldLast = addControlToAlgorithmBar("Text", "");
    this.pushFieldLast.placeholder = "Please enter your last name";  // 设置提示文本
    this.pushFieldLast.style.width = "175px";
    this.pushFieldLast.onkeydown = this.returnSubmit(this.pushFieldLast, this.checkCallback.bind(this));

    this.pushButton = addControlToAlgorithmBar("Button", "执行");
    this.pushButton.onclick = this.checkCallback.bind(this);

    this.controls.push(this.pushFieldFirst);
    this.controls.push(this.pushFieldLast);
    this.controls.push(this.pushButton);
}

Book_8.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
}

Book_8.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
}

Book_8.prototype.setup = function() {
    this.nextIndex = 0;
    this.conditionLabel_1_ID = this.nextIndex++;
    this.conditionLabel_1b_ID = this.nextIndex++;
    this.conditionLabel_2_ID = this.nextIndex++;
    this.conditionLabel_2b_ID = this.nextIndex++;
    this.conditionLabel_3_ID = this.nextIndex++;
    this.conditionLabel_3b_ID = this.nextIndex++;
    this.conditionLabel_4_ID = this.nextIndex++;
    this.conditionLabel_4b_ID = this.nextIndex++;
    this.conditionLabel_5_ID = this.nextIndex++;

    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "first", 100, 50, 100, 100);
    this.cmd("CreateLabel", this.conditionLabel_1b_ID, "", 100, 120);
    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "last", 100, 50, 250, 100);
    this.cmd("CreateLabel", this.conditionLabel_2b_ID, "", 250, 120);

    this.cmd("CreateRectangle", this.conditionLabel_3_ID, "first[0]", 100, 50, 100, 200);
    this.cmd("CreateLabel", this.conditionLabel_3b_ID, "", 100, 225);
    this.cmd("CreateRectangle", this.conditionLabel_4_ID, "last[0:7]", 100, 50, 250, 200);
    this.cmd("CreateLabel", this.conditionLabel_4b_ID, "", 250, 225);

    this.cmd("CreateRectangle", this.conditionLabel_5_ID, "last", 200, 50, 175, 300);

    this.cmd("Connect", this.conditionLabel_1b_ID, this.conditionLabel_3_ID);
    this.cmd("Connect", this.conditionLabel_2b_ID, this.conditionLabel_4_ID);
    this.cmd("Connect", this.conditionLabel_3b_ID, this.conditionLabel_5_ID);
    this.cmd("Connect", this.conditionLabel_4b_ID, this.conditionLabel_5_ID);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}

Book_8.prototype.checkCallback = function(event) {
    if (this.pushFieldFirst.value !== "" && this.pushFieldLast.value !== "") {
        var firstName = this.pushFieldFirst.value.toLowerCase();
        var lastName = this.pushFieldLast.value.toLowerCase();
        this.pushFieldFirst.value = "";
        this.pushFieldLast.value = "";
        this.implementAction(this.checkCondition.bind(this), [firstName, lastName]);
    }
}

Book_8.prototype.checkCondition = function(values) {
    this.commands = [];
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
    var firstname = values[0];
    var lastname = values[1];

    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_1_ID, "first = " + firstname);
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_2_ID, "last = " + lastname);
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_3_ID, "first[0] = " + firstname[0]);
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_4_ID, "last[0:7] = " + lastname.slice(0, 7));
    this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
    this.cmd("Step");

    var username = firstname[0] + lastname.slice(0, 7);
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_5_ID, "uname = first[0] + last[:7]");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_5_ID, "uname = " + firstname[0] + " " + lastname.slice(0, 7));
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_5_ID, "uname = " + username);
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
    this.cmd("Step");

    return this.commands;
}

Book_8.prototype.reset = function() {
    this.top = 0;
    this.nextIndex = this.initialIndex;
}

Book_8.prototype.clearCallback = function(event) {
    this.implementAction(this.clearData.bind(this), "");
}

Book_8.prototype.clearData = function(ignored) {
    this.commands = new Array();
    this.clearAll();
    return this.commands;
}

Book_8.prototype.clearAll = function() {
    this.commands = new Array();
    for (var i = 0; i < this.top; i++) {
        this.cmd("SetText", this.arrayID[i], "");
    }
    this.top = 0;
    this.cmd("SetText", this.topID, "0");
    return this.commands;
}

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new Book_8(animManag, canvas.width, canvas.height);
}