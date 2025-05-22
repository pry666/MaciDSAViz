function RacquetballSimulationDetailedOptimized(am, w, h) {
    this.init(am, w, h);
}

RacquetballSimulationDetailedOptimized.prototype = new Algorithm();
RacquetballSimulationDetailedOptimized.prototype.constructor = RacquetballSimulationDetailedOptimized;
RacquetballSimulationDetailedOptimized.superclass = Algorithm.prototype;

RacquetballSimulationDetailedOptimized.prototype.init = function(am, w, h) {
    RacquetballSimulationDetailedOptimized.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.probA = 0;
    this.probB = 0;
    this.nGames = 0;
    this.winsA = 0;
    this.winsB = 0;

    this.variableIDs = {};
    this.gameScoreIDs = []; // 存储每局游戏的分数显示ID

    this.setupVisual();
};

RacquetballSimulationDetailedOptimized.prototype.addControls = function() {
    this.controls = [];

    this.probALabel = addLabelToAlgorithmBar("Prob A Wins Serve: ");
    this.probAField = addControlToAlgorithmBar("Text", "");
    this.probAField.value = "0.5";
    this.controls.push(this.probAField);

    this.probBLabel = addLabelToAlgorithmBar("Prob B Wins Serve: ");
    this.probBField = addControlToAlgorithmBar("Text", "");
    this.probBField.value = "0.5";
    this.controls.push(this.probBField);

    this.nGamesLabel = addLabelToAlgorithmBar("Number of Games: ");
    this.nGamesField = addControlToAlgorithmBar("Text", "");
    this.nGamesField.value = "10";
    this.controls.push(this.nGamesField);

    this.simulateButton = addControlToAlgorithmBar("Button", "Simulate Games");
    this.simulateButton.onclick = this.simulateCallback.bind(this);
    this.controls.push(this.simulateButton);
};

RacquetballSimulationDetailedOptimized.prototype.setupVisual = function() {
    this.commands = [];

    this.leftStartX = 100;
    this.leftStartY = 100;
    this.leftSpacing = 50;

    this.rightStartX = 400;
    this.rightStartY = 100;
    this.rightSpacing = 30;

    this.gameScoresStartX = 700;
    this.gameScoresStartY = 100;
    this.gameScoresSpacing = 30;

    let leftLabels = ["probA", "probB", "nGames", "Wins A", "Wins B"];
    let leftPositions = [
        {x: this.leftStartX, y: this.leftStartY},
        {x: this.leftStartX, y: this.leftStartY + this.leftSpacing},
        {x: this.leftStartX, y: this.leftStartY + 2 * this.leftSpacing},
        {x: this.leftStartX, y: this.leftStartY + 3 * this.leftSpacing},
        {x: this.leftStartX, y: this.leftStartY + 4 * this.leftSpacing},
    ];

    leftLabels.forEach((label, index) => {
        this.variableIDs[label + "Label"] = this.nextIndex++;
        this.cmd("CreateLabel", this.variableIDs[label + "Label"], label, leftPositions[index].x, leftPositions[index].y);
        this.cmd("SetFontSize", this.variableIDs[label + "Label"], 16);

        this.variableIDs[label + "Box"] = this.nextIndex++;
        this.cmd("CreateRectangle", this.variableIDs[label + "Box"], "", 80, 30, leftPositions[index].x + 100, leftPositions[index].y);
        this.cmd("SetFontSize", this.variableIDs[label + "Box"], 16);
    });

    let rightLabels = ["Current Game", "Current Server", "Random Number", "Round", "Score A", "Score B"];
    let rightPositions = [
        {x: this.rightStartX, y: this.rightStartY},
        {x: this.rightStartX, y: this.rightStartY + this.rightSpacing},
        {x: this.rightStartX, y: this.rightStartY + 2 * this.rightSpacing},
        {x: this.rightStartX, y: this.rightStartY + 3 * this.rightSpacing},
        {x: this.rightStartX, y: this.rightStartY + 4 * this.rightSpacing},
        {x: this.rightStartX, y: this.rightStartY + 5 * this.rightSpacing},
    ];

    rightLabels.forEach((label, index) => {
        this.variableIDs[label + "Label"] = this.nextIndex++;
        this.cmd("CreateLabel", this.variableIDs[label + "Label"], label, rightPositions[index].x, rightPositions[index].y);
        this.cmd("SetFontSize", this.variableIDs[label + "Label"], 16);

        this.variableIDs[label + "Box"] = this.nextIndex++;
        this.cmd("CreateRectangle", this.variableIDs[label + "Box"], "", 120, 30, rightPositions[index].x + 150, rightPositions[index].y);
        this.cmd("SetFontSize", this.variableIDs[label + "Box"], 16);
    });

    this.cmd("SetText", this.variableIDs['Current ServerBox'], "");
    this.cmd("SetText", this.variableIDs['Random NumberBox'], "");
    this.cmd("SetText", this.variableIDs['RoundBox'], "");
    this.cmd("SetText", this.variableIDs['Score ABox'], "0");
    this.cmd("SetText", this.variableIDs['Score BBox'], "0");

    this.gameScoresTitleID = this.nextIndex++;
    this.cmd("CreateLabel", this.gameScoresTitleID, "Game Scores:", this.gameScoresStartX, this.gameScoresStartY - 30);
    this.cmd("SetFontSize", this.gameScoresTitleID, 16);

    this.summaryLine1ID = this.nextIndex++;
    this.summaryLine2ID = this.nextIndex++;
    this.summaryLine3ID = this.nextIndex++;
    this.cmd("CreateLabel", this.summaryLine1ID, "", this.gameScoresStartX, 400);
    this.cmd("SetFontSize", this.summaryLine1ID, 16);
    this.cmd("CreateLabel", this.summaryLine2ID, "", this.gameScoresStartX, 430);
    this.cmd("SetFontSize", this.summaryLine2ID, 16);
    this.cmd("CreateLabel", this.summaryLine3ID, "", this.gameScoresStartX, 460);
    this.cmd("SetFontSize", this.summaryLine3ID, 16);

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

RacquetballSimulationDetailedOptimized.prototype.simulateCallback = function(event) {
    var probAInput = parseFloat(this.probAField.value);
    var probBInput = parseFloat(this.probBField.value);
    var nGamesInput = parseInt(this.nGamesField.value);

    if (!isNaN(probAInput) && !isNaN(probBInput) && !isNaN(nGamesInput)) {
        if (probAInput < 0 || probAInput > 1 || probBInput < 0 || probBInput > 1 || nGamesInput <= 0) {
            alert("请确保概率在0到1之间，游戏数为正整数！");
            return;
        }

        this.probA = probAInput;
        this.probB = probBInput;
        this.nGames = nGamesInput;
        this.winsA = 0;
        this.winsB = 0;

        this.disableUI();

        this.implementAction(this.simulateGames.bind(this), "");
    } else {
        alert("请输入有效的数值！");
    }
};

RacquetballSimulationDetailedOptimized.prototype.simulateGames = function(dummy) {
    this.commands = [];
    let currentGame = 1;

    this.cmd("SetText", this.variableIDs['probABox'], this.probA.toFixed(2));
    this.cmd("SetText", this.variableIDs['probBBox'], this.probB.toFixed(2));
    this.cmd("SetText", this.variableIDs['nGamesBox'], this.nGames);
    this.cmd("SetText", this.variableIDs['Wins ABox'], this.winsA);
    this.cmd("SetText", this.variableIDs['Wins BBox'], this.winsB);
    this.cmd("Step");

    for (let i = 0; i < this.nGames; i++) {
        this.cmd("SetText", this.variableIDs['Current GameBox'], currentGame);
        this.cmd("Step");

        this.cmd("SetText", this.variableIDs['Current ServerBox'], "A"); // 玩家 A 总是开始发球
        this.cmd("SetText", this.variableIDs['RoundBox'], "1");
        this.cmd("SetText", this.variableIDs['Random NumberBox'], "");
        this.cmd("SetText", this.variableIDs['Score ABox'], "0");
        this.cmd("SetText", this.variableIDs['Score BBox'], "0");
        this.cmd("Step");

        this.simulateOneGameDetailed(currentGame);

        currentGame += 1;
    }

    let totalGames = this.winsA + this.winsB;
    let summaryLine1 = "Games simulated: " + totalGames;
    let summaryLine2 = "Wins for A: " + this.winsA + " (" + ((this.winsA / totalGames) * 100).toFixed(1) + "%)";
    let summaryLine3 = "Wins for B: " + this.winsB + " (" + ((this.winsB / totalGames) * 100).toFixed(1) + "%)";
    this.cmd("SetText", this.summaryLine1ID, summaryLine1);
    this.cmd("SetText", this.summaryLine2ID, summaryLine2);
    this.cmd("SetText", this.summaryLine3ID, summaryLine3);
    this.cmd("Step");

    this.cmd("Step");
    this.enableUI();

    return this.commands;
};

RacquetballSimulationDetailedOptimized.prototype.simulateOneGameDetailed = function(gameNumber) {
    let serving = "A";
    let scoreA = 0;
    let scoreB = 0;
    let round = 1;

    while (!this.gameOver(scoreA, scoreB)) {
        this.cmd("SetText", this.variableIDs['Current ServerBox'], serving);
        this.cmd("SetText", this.variableIDs['RoundBox'], round.toString());
        this.cmd("Step");

        let rand = Math.random();
        this.cmd("SetText", this.variableIDs['Random NumberBox'], rand.toFixed(2));
        this.cmd("Step");

        if (serving === "A") {
            if (rand < this.probA) {
                scoreA += 1;
                this.cmd("SetText", this.variableIDs['Score ABox'], scoreA.toString());
                this.cmd("SetText", this.variableIDs['Score BBox'], scoreB.toString());
                this.cmd("Step");
            } else {
                serving = "B";
                this.cmd("SetText", this.variableIDs['Current ServerBox'], serving);
                this.cmd("Step");
            }
        } else { // serving === "B"
            if (rand < this.probB) {
                scoreB += 1;
                this.cmd("SetText", this.variableIDs['Score ABox'], scoreA.toString());
                this.cmd("SetText", this.variableIDs['Score BBox'], scoreB.toString());
                this.cmd("Step");
            } else {
                serving = "A";
                this.cmd("SetText", this.variableIDs['Current ServerBox'], serving);
                this.cmd("Step");
            }
        }

        round += 1;
    }

    this.currentGameScoreA = scoreA;
    this.currentGameScoreB = scoreB;

    let posY = this.gameScoresStartY + (gameNumber - 1) * this.gameScoresSpacing;
    let gameScoreText = "Game " + gameNumber + " - A: " + scoreA + " | B: " + scoreB;
    let scoreLabelID = this.nextIndex++;
    this.cmd("CreateLabel", scoreLabelID, gameScoreText, this.gameScoresStartX, posY);
    this.cmd("SetFontSize", scoreLabelID, 16);
    this.gameScoreIDs.push(scoreLabelID);
    this.cmd("Step");

    if (scoreA > scoreB) {
        this.winsA += 1;
        this.cmd("SetText", this.variableIDs['Wins ABox'], this.winsA);
    } else {
        this.winsB += 1;
        this.cmd("SetText", this.variableIDs['Wins BBox'], this.winsB);
    }
    this.cmd("Step");
};

RacquetballSimulationDetailedOptimized.prototype.gameOver = function(a, b) {
    return a === 15 || b === 15;
};

RacquetballSimulationDetailedOptimized.prototype.reset = function() {
    this.nextIndex = 0;
    this.probA = 0;
    this.probB = 0;
    this.nGames = 0;
    this.winsA = 0;
    this.winsB = 0;
    this.variableIDs = {};
    this.gameScoreIDs = [];
    this.animationManager.resetAll();
    this.setupVisual();
    this.probAField.disabled = false;
    this.probBField.disabled = false;
    this.nGamesField.disabled = false;
    this.simulateButton.disabled = false;
};

RacquetballSimulationDetailedOptimized.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

RacquetballSimulationDetailedOptimized.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new RacquetballSimulationDetailedOptimized(animManag, canvas.width, canvas.height);
}