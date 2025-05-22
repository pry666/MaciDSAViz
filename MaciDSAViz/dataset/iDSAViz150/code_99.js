function BirthdaySongVisualizer(am, w, h) {
    this.init(am, w, h);
}

BirthdaySongVisualizer.prototype = new Algorithm();
BirthdaySongVisualizer.prototype.constructor = BirthdaySongVisualizer;
BirthdaySongVisualizer.superclass = Algorithm.prototype;

BirthdaySongVisualizer.prototype.init = function(am, w, h) {
    BirthdaySongVisualizer.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.persons = ["Fred", "Lucy", "Elmer"];

    this.personLabelIDs = [];
    this.personImageIDs = [];
    this.lyricsLabelIDs = [];

    this.leftX = 100;
    this.centerX = canvas.width / 2;
    this.rightX = canvas.width - 100;
    this.topY = 50;
    this.lineHeight = 30;

    this.setupVisual();
};

BirthdaySongVisualizer.prototype.addControls = function() {
    this.controls = [];

    this.startButton = addControlToAlgorithmBar("Button", "Start");
    this.startButton.onclick = this.startCallback.bind(this);
    this.controls.push(this.startButton);
};

BirthdaySongVisualizer.prototype.setupVisual = function() {
    this.commands = [];

    var personY = this.topY;

    for (var i = 0; i < this.persons.length; i++) {
        var personLabelID = this.nextIndex++;
        var personImageID = this.nextIndex++;

        var positionX;
        if (i === 0) {
            positionX = this.leftX;
        } else if (i === 1) {
            positionX = this.centerX-50;
        } else {
            positionX = this.rightX-100;
        }

        this.cmd("CreateLabel", personLabelID, this.persons[i], positionX, personY);
        this.cmd("SetFontSize", personLabelID, 18);
        this.personLabelIDs.push(personLabelID);

    }

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

BirthdaySongVisualizer.prototype.startCallback = function(event) {
    this.startButton.disabled = true;
    this.implementAction(this.startAnimation.bind(this), "");
};

BirthdaySongVisualizer.prototype.startAnimation = function(dummy) {
    this.commands = [];
    this.nextIndex = Math.max(...this.personLabelIDs.concat(this.personImageIDs)) + 1;

    for (this.currentPersonIndex = 0; this.currentPersonIndex < this.persons.length; this.currentPersonIndex++) {
        var person = this.persons[this.currentPersonIndex];
        this.processPerson(person);
    }

    this.startButton.disabled = false; // 动画结束后重新启用开始按钮

    return this.commands;
};

BirthdaySongVisualizer.prototype.processPerson = function(person) {
    var codeLines = [
        'lyrics = happy() * 2 + "Happy birthday, dear " + person + ".\\n" + happy()',
        'happy() * 2',
        '"Happy birthday, dear " + person + ".\\n"',
        'happy()'
    ];

    var codeYStart = this.topY + 200;
    var valueYStart = codeYStart;

    var codeLabelIDs = [];
    for (var i = 0; i < codeLines.length; i++) {
        var codeLabelID = this.nextIndex++;
        this.cmd("CreateLabel", codeLabelID, codeLines[i], this.leftX, codeYStart + i * this.lineHeight, 0);
        this.cmd("SetFontSize", codeLabelID, 16);
        this.cmd("SetTextAlign", codeLabelID, "left");
        codeLabelIDs.push(codeLabelID);
    }

    var valueLabelIDs = [];
    for (var i = 0; i < codeLines.length; i++) {
        var valueLabelID = this.nextIndex++;
        this.cmd("CreateLabel", valueLabelID, "", this.centerX, valueYStart + i * this.lineHeight, 0);
        this.cmd("SetFontSize", valueLabelID, 16);
        this.cmd("SetTextAlign", valueLabelID, "left");
        valueLabelIDs.push(valueLabelID);
    }

    this.cmd("SetHighlight", codeLabelIDs[1], 1);
    this.cmd("Step");
    var happyResult = this.happy();
    var happyTimesTwo = happyResult + happyResult;
    this.cmd("SetText", valueLabelIDs[1], JSON.stringify(happyTimesTwo));
    this.cmd("SetHighlight", codeLabelIDs[1], 0);
    this.cmd("Step");

    this.cmd("SetHighlight", codeLabelIDs[2], 1);
    this.cmd("Step");
    var middleLine = "Happy birthday, dear " + person + ".\n";
    this.cmd("SetText", valueLabelIDs[2], JSON.stringify(middleLine));
    this.cmd("SetHighlight", codeLabelIDs[2], 0);
    this.cmd("Step");

    this.cmd("SetHighlight", codeLabelIDs[3], 1);
    this.cmd("Step");
    var happyOnce = this.happy();
    this.cmd("SetText", valueLabelIDs[3], JSON.stringify(happyOnce));
    this.cmd("SetHighlight", codeLabelIDs[3], 0);
    this.cmd("Step");

    this.cmd("SetHighlight", codeLabelIDs[0], 1);
    this.cmd("Step");
    var lyrics = happyTimesTwo + middleLine + happyOnce;
    this.cmd("SetText", valueLabelIDs[0], JSON.stringify(lyrics));
    this.cmd("SetHighlight", codeLabelIDs[0], 0);
    this.cmd("Step");

    var lyricsLines = lyrics.trim().split("\n");
    var lyricsLabelIDs = [];
    var lyricsYStart = this.topY + 50;
    var positionX;
    if (this.currentPersonIndex === 0) {
        positionX = this.leftX;
    } else if (this.currentPersonIndex === 1) {
        positionX = this.centerX-50;
    } else {
        positionX = this.rightX-100;
    }

    for (var i = 0; i < lyricsLines.length; i++) {
        var lyricsLineID = this.nextIndex++;
        this.cmd("CreateLabel", lyricsLineID, lyricsLines[i], positionX, lyricsYStart + i * this.lineHeight, 0);
        this.cmd("SetFontSize", lyricsLineID, 16);
        this.cmd("SetTextAlign", lyricsLineID, "center");
        lyricsLabelIDs.push(lyricsLineID);
    }
    this.lyricsLabelIDs.push(lyricsLabelIDs);
    this.cmd("Step");

    for (var i = 0; i < codeLabelIDs.length; i++) {
        this.cmd("Delete", codeLabelIDs[i]);
        this.cmd("Delete", valueLabelIDs[i]);
    }

};

BirthdaySongVisualizer.prototype.happy = function() {
    return "Happy Birthday to you!\n";
};

BirthdaySongVisualizer.prototype.reset = function() {
    this.nextIndex = 0;
    this.animationManager.resetAll();
    this.lyricsLabelIDs = [];
    this.setupVisual();
};

BirthdaySongVisualizer.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

BirthdaySongVisualizer.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new BirthdaySongVisualizer(animManag, canvas.width, canvas.height);
}