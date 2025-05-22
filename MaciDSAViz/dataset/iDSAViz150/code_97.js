function DateConverter(am, w, h) {
    this.init(am, w, h);
}

DateConverter.prototype = new Algorithm();
DateConverter.prototype.constructor = DateConverter;
DateConverter.superclass = Algorithm.prototype;

DateConverter.prototype.init = function(am, w, h) {
    DateConverter.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.dateStr = "";
    this.monthStr = "";
    this.dayStr = "";
    this.yearStr = "";
    this.months = ["January", "February", "March", "April",
                   "May", "June", "July", "August",
                   "September", "October", "November", "December"];

    this.dateInputID = this.nextIndex++;
    this.splitIDs = []; // 存储拆分后的组件ID
    this.monthNameID = this.nextIndex++;
    this.resultID = this.nextIndex++;
    this.monthsArrayID = []; // 存储月份数组元素的ID

    this.setupVisual();
};

DateConverter.prototype.addControls = function() {
    this.controls = [];

    this.dateLabel = addLabelToAlgorithmBar("输入日期 (mm/dd/yyyy): ");
    this.dateField = addControlToAlgorithmBar("Text", "");
    this.controls.push(this.dateField);

    this.convertButton = addControlToAlgorithmBar("Button", "Convert");
    this.convertButton.onclick = this.convertCallback.bind(this);
    this.controls.push(this.convertButton);
};

DateConverter.prototype.setupVisual = function() {
    this.commands = [];

    this.animationManager.resetAll();

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

DateConverter.prototype.convertCallback = function(event) {
    var dateStr = this.dateField.value.trim();

    var datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (datePattern.test(dateStr)) {
        this.dateStr = dateStr;
        this.dateField.value = ""; // 清空输入框
        this.implementAction(this.convertDate.bind(this), "");
    } else {
        alert("请输入正确的日期格式 (mm/dd/yyyy)。");
    }
};

DateConverter.prototype.convertDate = function(dummy) {
    this.commands = [];
    this.nextIndex = 0; // 重置索引

    var centerX = 400;
    var inputY = 50;
    var splitY = 100;
    var monthsArrayY = 200;
    var resultY = 400;

    this.dateInputID = this.nextIndex++;
    this.cmd("CreateLabel", this.dateInputID, "输入的日期: " + this.dateStr, centerX, inputY);
    this.cmd("SetFontSize", this.dateInputID, 16);
    this.cmd("Step");

    var components = this.dateStr.split("/");
    this.monthStr = components[0];
    this.dayStr = components[1];
    this.yearStr = components[2];

    var labels = ["monthStr", "dayStr", "yearStr"];
    var values = [this.monthStr, this.dayStr, this.yearStr];
    this.splitIDs = [];

    for (var i = 0; i < 3; i++) {
        var labelID = this.nextIndex++;
        var valueID = this.nextIndex++;
        var xPos = centerX - 150 + i * 150;

        this.cmd("CreateLabel", labelID, labels[i] + " =", xPos - 60, splitY);
        this.cmd("SetFontSize", labelID, 16);
        this.cmd("CreateRectangle", valueID, values[i], 60, 30, xPos, splitY);
        this.cmd("SetFontSize", valueID, 16);

        this.splitIDs.push({labelID: labelID, valueID: valueID});
    }
    this.cmd("Step");

    var monthsArrayX = 100;
    this.monthsArrayID = [];

    for (var i = 0; i < this.months.length; i++) {
        var monthID = this.nextIndex++;
        var row = Math.floor(i / 6); // 0 或 1
        var col = i % 6;
        var xPos = monthsArrayX + col * 100;
        var yPos = monthsArrayY + row * 50;
        this.cmd("CreateRectangle", monthID, this.months[i], 90, 30, xPos, yPos);
        this.cmd("SetFontSize", monthID, 14);
        this.monthsArrayID.push(monthID);

        var indexID = this.nextIndex++;
        this.cmd("CreateLabel", indexID, i, xPos, yPos + 25);
        this.cmd("SetFontSize", indexID, 12);
    }
    this.cmd("Step");

    var monthIndex = parseInt(this.monthStr) - 1;
    var monthName = this.months[monthIndex];

    var movingMonthID = this.nextIndex++;
    var monthStrValueID = this.splitIDs[0].valueID;

    this.cmd("SetHighlight", monthStrValueID, 1);
    this.cmd("Step");

    var monthStrX = this.cmd("GetX", monthStrValueID);
    var monthStrY = this.cmd("GetY", monthStrValueID);
    this.cmd("CreateLabel", movingMonthID, this.monthStr, monthStrX, monthStrY);
    this.cmd("SetFontSize", movingMonthID, 16);

    var targetRow = Math.floor(monthIndex / 6);
    var targetCol = monthIndex % 6;
    var targetX = monthsArrayX + targetCol * 100;
    var targetY = monthsArrayY + targetRow * 50 - 40;

    this.cmd("Move", movingMonthID, targetX, targetY);
    this.cmd("Step");

    this.cmd("SetHighlight", this.monthsArrayID[monthIndex], 1);
    this.cmd("Step");

    this.cmd("Delete", movingMonthID);
    this.cmd("SetHighlight", monthStrValueID, 0);

    this.cmd("SetText", monthStrValueID, monthName);
    this.cmd("Step");

    this.cmd("SetHighlight", this.monthsArrayID[monthIndex], 0);

    var resultText = "转换后的日期是: " + monthName + " " + this.dayStr + ", " + this.yearStr;
    this.resultID = this.nextIndex++;
    this.cmd("CreateLabel", this.resultID, resultText, centerX, resultY);
    this.cmd("SetFontSize", this.resultID, 16);
    this.cmd("Step");

    return this.commands;
};

DateConverter.prototype.reset = function() {
    this.nextIndex = 0;
    this.animationManager.resetAll();
    this.dateStr = "";
    this.monthStr = "";
    this.dayStr = "";
    this.yearStr = "";
    this.setupVisual();
};

DateConverter.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

DateConverter.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new DateConverter(animManag, canvas.width, canvas.height);
}
