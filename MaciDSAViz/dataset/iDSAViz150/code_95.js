function MessageDecoder(am, w, h) {
    this.init(am, w, h);
}

MessageDecoder.prototype = new Algorithm();
MessageDecoder.prototype.constructor = MessageDecoder;
MessageDecoder.superclass = Algorithm.prototype;

MessageDecoder.prototype.init = function(am, w, h) {
    MessageDecoder.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.inString = "";
    this.message = "";
    this.numStrArray = [];
    this.currentIndex = 0;
    this.codeNum = 0;

    this.inputStringID = this.nextIndex++;
    this.messageID = this.nextIndex++;
    this.charLabelID = this.nextIndex++;

    this.setupVisual();
};

MessageDecoder.prototype.addControls = function() {
    this.controls = [];

    this.inputLabel = addLabelToAlgorithmBar("输入编码消息（数字，用空格分隔）：");
    this.inputField = addControlToAlgorithmBar("Text", "");
    this.controls.push(this.inputField);

    this.decodeButton = addControlToAlgorithmBar("Button", "Decode");
    this.decodeButton.onclick = this.decodeCallback.bind(this);
    this.controls.push(this.decodeButton);
};

MessageDecoder.prototype.setupVisual = function() {
    this.commands = [];

    var centerX = 400;
    var inputY = 50;

    this.cmd("CreateLabel", this.inputStringID, "", centerX, inputY);
    this.cmd("SetFontSize", this.inputStringID, 16);

    var messageY = 350;
    this.cmd("CreateLabel", this.messageID, "解码后的消息：", centerX - 100, messageY);
    this.cmd("SetFontSize", this.messageID, 16);

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

MessageDecoder.prototype.decodeCallback = function(event) {
    var inString = this.inputField.value.trim();

    if (inString.length > 0) {
        this.inString = inString;
        this.inputField.value = ""; // 清空输入框
        this.implementAction(this.decodeMessage.bind(this), "");
    } else {
        alert("请输入编码消息！");
    }
};

MessageDecoder.prototype.decodeMessage = function(dummy) {
    this.commands = [];
    this.nextIndex = 3; // 重置nextIndex以避免ID冲突

    this.cmd("SetText", this.inputStringID, "输入的编码消息：" + this.inString);
    this.cmd("Step");

    this.numStrArray = this.inString.split(" ");
    this.currentIndex = 0;
    this.message = "";

    var centerX = 400;
    var arrayStartY = 100;
    var arrayElemWidth = 50;
    var arrayElemHeight = 30;
    var arrayStartX = centerX - (this.numStrArray.length / 2) * arrayElemWidth;

    this.arrayID = [];
    for (var i = 0; i < this.numStrArray.length; i++) {
        var arrayElemID = this.nextIndex++;
        this.arrayID.push(arrayElemID);
        this.cmd("CreateRectangle", arrayElemID, this.numStrArray[i], arrayElemWidth, arrayElemHeight, arrayStartX + i * arrayElemWidth, arrayStartY);
        this.cmd("SetFontSize", arrayElemID, 16);
    }
    this.cmd("Step");

    var messageY = 350;
    var messageValueID = this.nextIndex++;
    this.cmd("CreateRectangle", messageValueID, "", 200, arrayElemHeight, centerX + 50, messageY);
    this.cmd("SetFontSize", messageValueID, 16);

    for (var i = 0; i < this.numStrArray.length; i++) {
        this.cmd("SetHighlight", this.arrayID[i], 1);
        this.cmd("Step");

        this.codeNum = parseInt(this.numStrArray[i]);
        var codeNumID = this.nextIndex++;
        this.cmd("CreateLabel", codeNumID, "codeNum = " + this.codeNum, centerX, arrayStartY + 50);
        this.cmd("SetFontSize", codeNumID, 16);
        this.cmd("Step");

        var char = String.fromCharCode(this.codeNum);
        var charID = this.nextIndex++;
        this.cmd("CreateLabel", charID, "字符 = '" + char + "'", centerX, arrayStartY + 80);
        this.cmd("SetFontSize", charID, 16);
        this.cmd("Step");

        this.message += char;
        this.cmd("SetText", messageValueID, this.message);
        this.cmd("Step");

        this.cmd("SetHighlight", this.arrayID[i], 0);
        this.cmd("Delete", codeNumID);
        this.cmd("Delete", charID);
    }

    var resultID = this.nextIndex++;
    this.cmd("CreateLabel", resultID, "解码后的消息是：" + this.message, centerX, messageY + 50);
    this.cmd("SetFontSize", resultID, 16);
    this.cmd("Step");

    return this.commands;
};

MessageDecoder.prototype.reset = function() {
    this.nextIndex = 0;
    this.animationManager.resetAll();
    this.inString = "";
    this.message = "";
    this.numStrArray = [];
    this.currentIndex = 0;
    this.codeNum = 0;

    this.setupVisual();
};

MessageDecoder.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

MessageDecoder.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MessageDecoder(animManag, canvas.width, canvas.height);
}