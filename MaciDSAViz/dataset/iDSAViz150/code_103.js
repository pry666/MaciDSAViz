function Book_19(am, w, h) {
    this.init(am, w, h);
}

Book_19.prototype = new Algorithm();
Book_19.prototype.constructor = Book_19;
Book_19.superclass = Algorithm.prototype;

Book_19.prototype.init = function(am, w, h) {
    Book_19.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
}

Book_19.prototype.addControls = function() {
    this.controls = [];

    this.pushFieldA = addControlToAlgorithmBar("Text", "");
    this.pushFieldA.placeholder = "Enter coefficient a";  // 提示文本
    this.pushFieldA.style.width = "120px";
    this.pushFieldA.onkeydown = this.returnSubmit(this.pushFieldA, this.checkCallback.bind(this), 6);

    this.pushFieldB = addControlToAlgorithmBar("Text", "");
    this.pushFieldB.placeholder = "Enter coefficient b";  // 提示文本
    this.pushFieldB.style.width = "120px";
    this.pushFieldB.onkeydown = this.returnSubmit(this.pushFieldB, this.checkCallback.bind(this), 6);

    this.pushFieldC = addControlToAlgorithmBar("Text", "");
    this.pushFieldC.placeholder = "Enter coefficient c";  // 提示文本
    this.pushFieldC.style.width = "120px";
    this.pushFieldC.onkeydown = this.returnSubmit(this.pushFieldC, this.checkCallback.bind(this), 6);

    this.pushButton = addControlToAlgorithmBar("Button", "Execute");
    this.pushButton.onclick = this.checkCallback.bind(this);

    this.controls.push(this.pushFieldA);
    this.controls.push(this.pushFieldB);
    this.controls.push(this.pushFieldC);
    this.controls.push(this.pushButton);
}

Book_19.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
}

Book_19.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
}

Book_19.prototype.setup = function() {
    /*
    t b l r 代表上下左右
     */
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
    this.conditionLabel_5b_ID = this.nextIndex++;
    this.conditionLabel_6_ID = this.nextIndex++;
    this.conditionLabel_6b_ID = this.nextIndex++;
    this.conditionLabel_7_ID = this.nextIndex++;

    this.conditionLabel_8_ID = this.nextIndex++;
    this.conditionLabel_8b_ID = this.nextIndex++;
    this.conditionLabel_9_ID = this.nextIndex++;
    this.conditionLabel_9b_ID = this.nextIndex++;
    this.conditionLabel_10_ID = this.nextIndex++;

    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "a", 50, 50, 250, 50);
    this.cmd("CreateLabel", this.conditionLabel_1b_ID, "", 250, 75);

    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "b", 50, 50, 350, 50);
    this.cmd("CreateLabel", this.conditionLabel_2b_ID, "", 350, 75);

    this.cmd("CreateRectangle", this.conditionLabel_3_ID, "c", 50, 50, 450, 50);
    this.cmd("CreateLabel", this.conditionLabel_3b_ID, "", 450, 75);

    this.cmd("CreateRectangle", this.conditionLabel_4_ID, "discrim", 300, 50, 350, 150);
    this.cmd("CreateLabel", this.conditionLabel_4b_ID, "", 350, 175);

    this.cmd("CreateRectangle", this.conditionLabel_8_ID, "else", 175, 50, 225, 250);
    this.cmd("CreateLabel", this.conditionLabel_8b_ID, "", 225, 275);

    this.cmd("CreateRectangle", this.conditionLabel_9_ID, "if discrim < 0: ", 175, 50, 475, 250);
    this.cmd("CreateLabel", this.conditionLabel_9b_ID, "", 475, 270);
    this.cmd("CreateRectangle", this.conditionLabel_10_ID, "The equation has no real roots!", 150, 50, 475, 350);

    this.cmd("CreateRectangle", this.conditionLabel_5_ID, "root1", 125, 50, 150, 350);
    this.cmd("CreateLabel", this.conditionLabel_5b_ID, "", 150, 375);
    this.cmd("CreateRectangle", this.conditionLabel_6_ID, "root2", 125, 50, 300, 350);
    this.cmd("CreateLabel", this.conditionLabel_6b_ID, "", 300, 375);
    this.cmd("CreateRectangle", this.conditionLabel_7_ID, "solutions", 250, 50, 225, 450);

    this.cmd("Connect", this.conditionLabel_1b_ID, this.conditionLabel_4_ID);
    this.cmd("Connect", this.conditionLabel_2b_ID, this.conditionLabel_4_ID);
    this.cmd("Connect", this.conditionLabel_3b_ID, this.conditionLabel_4_ID);

    this.cmd("Connect", this.conditionLabel_4b_ID, this.conditionLabel_8_ID);
    this.cmd("Connect", this.conditionLabel_4b_ID, this.conditionLabel_9_ID);

    this.cmd("Connect", this.conditionLabel_8b_ID, this.conditionLabel_5_ID);
    this.cmd("Connect", this.conditionLabel_8b_ID, this.conditionLabel_6_ID);

    this.cmd("Connect", this.conditionLabel_9b_ID, this.conditionLabel_10_ID);

    this.cmd("Connect", this.conditionLabel_5b_ID, this.conditionLabel_7_ID);
    this.cmd("Connect", this.conditionLabel_6b_ID, this.conditionLabel_7_ID);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}

Book_19.prototype.checkCallback = function(event) {
    if (this.pushFieldA.value != "" && this.pushFieldB.value != "" && this.pushFieldC.value != "") {
        var a = parseFloat(this.pushFieldA.value);
        var b = parseFloat(this.pushFieldB.value);
        var c = parseFloat(this.pushFieldC.value);
        this.pushFieldA.value = "";
        this.pushFieldB.value = "";
        this.pushFieldC.value = "";
        this.implementAction(this.checkCondition.bind(this), [a, b, c]);
    }
}

Book_19.prototype.checkCondition = function(values) {
    this.commands = [];
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_7_ID, "#000000");
    var a = values[0];
    var b = values[1];
    var c = values[2];


    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_1_ID, "a = " + a);
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_2_ID, "b = " + b);
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_3_ID, "c = " + c);
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("Step");

    this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#FF0000");
    this.cmd("Step");
    var discriminant = b * b - 4 * a * c;
    this.cmd("SetText", this.conditionLabel_4_ID, "discrim = b * b -4* a* c");
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_4_ID, "discrim = "+b+" * "+b+"- 4 * "+a+" * "+c);
    this.cmd("Step");
    this.cmd("SetText", this.conditionLabel_4_ID, "discrim = "+discriminant);
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
    this.cmd("Step");


    if (discriminant >= 0){
        this.cmd("SetForegroundColor", this.conditionLabel_8_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_8_ID, "discRoot = math.sqrt(b * b -4 * a * c) ");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_8_ID, "discRoot = math.sqrt("+b+" * "+b+" - 4 * "+a+" * "+c+")");
        this.cmd("Step");
        discriminant = Math.sqrt(discriminant)
        this.cmd("SetText", this.conditionLabel_8_ID, "discRoot = " + discriminant);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_8_ID, "#000000");
        this.cmd("Step");

        var root1 = (-b + discriminant) / (2 * a);
        var root2 = (-b - discriminant) / (2 * a);
        this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_5_ID, "root1 = (-b + discriminant) / (2 * a)");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_5_ID, "root1 = ("+(-1)*b+" + "+discriminant+") / (2 * "+a+")");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_5_ID, "root1 = " + root1);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
        this.cmd("Step");

        this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_6_ID, "root2 = (-b - discriminant) / (2 * a)");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_6_ID, "root2 = ("+(-1)*b+" + "+discriminant+") / (2 * "+a+")");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_6_ID, "root2 = " + root2);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#000000");
        this.cmd("Step");

        this.cmd("SetForegroundColor", this.conditionLabel_7_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.conditionLabel_7_ID, "The solutions are: " + root1 + ", " + root2);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_7_ID, "#000000");
        this.cmd("Step");
    }
    else{
        this.cmd("SetForegroundColor", this.conditionLabel_9_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_9_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_10_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_10_ID, "#000000");
        this.cmd("Step");

    }

    this.cmd("Step");
    return this.commands;
}

Book_19.prototype.reset = function() {
    this.top = 0;
    this.nextIndex = this.initialIndex;
}

Book_19.prototype.clearCallback = function(event) {
    this.implementAction(this.clearData.bind(this), "");
}

Book_19.prototype.clearData = function(ignored) {
    this.commands = new Array();
    this.clearAll();
    return this.commands;
}

Book_19.prototype.clearAll = function() {
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
    currentAlg = new Book_19(animManag, canvas.width, canvas.height);
}