function Book_14(am, w, h){
    this.init(am, w, h);
}

Book_14.prototype = new Algorithm();
Book_14.prototype.constructor = Book_14;
Book_14.superclass = Algorithm.prototype;

Book_14.prototype.init = function(am, w, h) {
    Book_14.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
}

Book_14.prototype.addControls = function() {
    this.controls = [];

    this.pushButton = addControlToAlgorithmBar("Button", "开唱");
    this.pushButton.onclick = this.checkCallback.bind(this);
    this.controls.push(this.pushButton);
}

Book_14.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
}

Book_14.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
}

Book_14.prototype.setup = function() {
    this.nextIndex = 0;

    this.mainTitle_ID = this.nextIndex++;
    this.mainLabel_1_ID = this.nextIndex++;
    this.mainLabel_2_ID = this.nextIndex++;
    this.mainLabel_3_ID = this.nextIndex++;
    this.mainLabel_4_ID = this.nextIndex++;
    this.mainLabel_5_ID = this.nextIndex++;

    this.singTitle_ID = this.nextIndex++;
    this.singLabel_1_ID = this.nextIndex++;
    this.singLabel_2_ID = this.nextIndex++;
    this.singLabel_3_ID = this.nextIndex++;
    this.singLabel_4_ID = this.nextIndex++;

    this.happyTitle_ID = this.nextIndex++;
    this.happyLabel_1_ID = this.nextIndex++;


    this.cmd("CreateLabel", this.mainTitle_ID, "Main()", 100, 50);
    this.cmd("CreateRectangle", this.mainLabel_1_ID, "sing(\"Fred\")", 100, 50, 100, 100);
    this.cmd("CreateRectangle", this.mainLabel_2_ID, "print()", 100, 50, 100, 150);
    this.cmd("CreateRectangle", this.mainLabel_3_ID, "sing(\"Lucy\")", 100, 50, 100,200);
    this.cmd("CreateRectangle", this.mainLabel_4_ID, "print()", 100, 50, 100,250);
    this.cmd("CreateRectangle", this.mainLabel_5_ID, "sing(\"Elmer\")", 100, 50, 100, 300);

    this.cmd("CreateLabel", this.singTitle_ID, "sing()", 300, 50);
    this.cmd("CreateRectangle", this.singLabel_1_ID, "happy()", 100, 50, 300, 100);
    this.cmd("CreateRectangle", this.singLabel_2_ID, "happy()", 100, 50, 300, 175);
    this.cmd("CreateRectangle", this.singLabel_3_ID, "Happy birthday,dear.", 150, 50, 300, 250);
    this.cmd("CreateRectangle", this.singLabel_4_ID, "happy()", 100, 50, 300, 325);

    this.cmd("CreateLabel", this.happyTitle_ID, "happy()", 500, 50);
    this.cmd("CreateRectangle", this.happyLabel_1_ID, "Happy Birthday to you!", 150, 50, 500, 200);

    this.lyricsDisplay_ID = this.nextIndex++;
    this.cmd("CreateLabel", this.lyricsDisplay_ID, "", 700, 50);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}

Book_14.prototype.checkCallback = function(event) {
    this.implementAction(this.checkCondition.bind(this));
}

Book_14.prototype.checkCondition = function(values) {
    this.commands = [];

    this.currentLyrics = "";

    const labels = [
        this.mainLabel_1_ID, this.mainLabel_2_ID, this.mainLabel_3_ID,
        this.mainLabel_4_ID, this.mainLabel_5_ID,
        this.singLabel_1_ID, this.singLabel_2_ID, this.singLabel_3_ID,
        this.singLabel_4_ID, this.happyLabel_1_ID
    ];

    labels.forEach(labelID => this.cmd("SetForegroundColor", labelID, "#000000"));

    const singSong = (person, mainLabelID) => {
        this.cmd("SetForegroundColor", mainLabelID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.singLabel_1_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", mainLabelID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.happyLabel_1_ID, "#FF0000");
        this.cmd("Step");
        this.currentLyrics += "Happy Birthday to you!\n";
        this.cmd("SetText", this.lyricsDisplay_ID, this.currentLyrics);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.singLabel_1_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.happyLabel_1_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.singLabel_2_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.happyLabel_1_ID, "#FF0000");
        this.cmd("Step");
        this.currentLyrics += "Happy Birthday to you!\n";
        this.cmd("SetText", this.lyricsDisplay_ID, this.currentLyrics);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.singLabel_2_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.happyLabel_1_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.singLabel_3_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetText", this.singLabel_3_ID, `"Happy birthday, dear", ${person} + "."`);
        this.cmd("Step");
        this.cmd("SetText", this.singLabel_3_ID, `Happy birthday, dear, person ${person}.`);
        this.cmd("Step");
        this.currentLyrics += `Happy birthday, dear ${person}.\n`;
        this.cmd("SetText", this.lyricsDisplay_ID, this.currentLyrics);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.singLabel_3_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.singLabel_4_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.happyLabel_1_ID, "#FF0000");
        this.cmd("Step");
        this.currentLyrics += "Happy Birthday to you!\n";
        this.cmd("SetText", this.lyricsDisplay_ID, this.currentLyrics);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.singLabel_4_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.happyLabel_1_ID, "#000000");
        this.cmd("Step");
    };

    singSong("Fred", this.mainLabel_1_ID);
    this.cmd("SetForegroundColor", this.mainLabel_2_ID, "#FF0000");
    this.cmd("Step");
    this.currentLyrics += "\n";
    this.cmd("SetText", this.lyricsDisplay_ID, this.currentLyrics);
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.mainLabel_2_ID, "#000000");
    this.cmd("Step");

    singSong("Lucy", this.mainLabel_3_ID);
    this.cmd("SetForegroundColor", this.mainLabel_4_ID, "#FF0000");
    this.cmd("Step");
    this.currentLyrics += "\n";
    this.cmd("SetText", this.lyricsDisplay_ID, this.currentLyrics);
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.mainLabel_4_ID, "#000000");
    this.cmd("Step");

    singSong("Elmer", this.mainLabel_5_ID);

    return this.commands;
};


Book_14.prototype.reset = function() {
    this.top = 0;
    this.nextIndex = this.initialIndex;
}

Book_14.prototype.clearCallback = function(event) {
    this.implementAction(this.clearData.bind(this), "");
}

Book_14.prototype.clearData = function(ignored) {
    this.commands = new Array();
    this.clearAll();
    return this.commands;
}

Book_14.prototype.clearAll = function() {
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
    currentAlg = new Book_14(animManag, canvas.width, canvas.height);
}