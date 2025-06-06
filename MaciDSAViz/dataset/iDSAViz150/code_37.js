﻿function DPMatrixMultiply(am, w, h)
{
	this.init(am, w, h);

}

DPMatrixMultiply.prototype = new Algorithm();
DPMatrixMultiply.prototype.constructor = DPMatrixMultiply;
DPMatrixMultiply.superclass = Algorithm.prototype;

DPMatrixMultiply.TABLE_ELEM_WIDTH = 40;
DPMatrixMultiply.TABLE_ELEM_HEIGHT = 30;

DPMatrixMultiply.TABLE_START_X = 500;
DPMatrixMultiply.TABLE_START_Y = 80;


DPMatrixMultiply.TABLE_DIFF_X = 100;

DPMatrixMultiply.CODE_START_X = 10;
DPMatrixMultiply.CODE_START_Y = 10;
DPMatrixMultiply.CODE_LINE_HEIGHT = 14;

DPMatrixMultiply.RECURSIVE_START_X = 20;
DPMatrixMultiply.RECURSIVE_START_Y = 120;
DPMatrixMultiply.RECURSIVE_DELTA_Y = 14;
DPMatrixMultiply.RECURSIVE_DELTA_X = 15;
DPMatrixMultiply.CODE_HIGHLIGHT_COLOR = "#FF0000";
DPMatrixMultiply.CODE_STANDARD_COLOR = "#000000";
DPMatrixMultiply.MAX_SEQUENCE_LENGTH = 15;

DPMatrixMultiply.TABLE_INDEX_COLOR = "#0000FF"
DPMatrixMultiply.CODE_RECURSIVE_1_COLOR = "#339933";
DPMatrixMultiply.CODE_RECURSIVE_2_COLOR = "#0099FF";



DPMatrixMultiply.MAX_VALUE = 20;

DPMatrixMultiply.MESSAGE_ID = 0;

DPMatrixMultiply.prototype.init = function(am, w, h)
{
	DPMatrixMultiply.superclass.init.call(this, am, w, h);
	this.nextIndex = 0;
	this.addControls();
	this.code = [["def ","MatrixMultiply(x, y, P)",":"],
				 ["     if (","(x >= y)", ")" ],
				 ["          return 0"],
				 ["     best = -1"],
				 ["     for i in range(x, y)"],
				 ["         left = ", "MatrixMultiply(x, i, P)"],
				 ["         right = ", "MatrixMultiply(i+1, y, P)"],
				 ["         total = left + right + P[x] * P[i+1] * P[y]"],
				 ["         if (", "best == -1", " or ", "best > total", ")"],
				 ["             best = total"],
				 ["     return best"]];

	this.codeID = Array(this.code.length);
	var i, j;
	for (i = 0; i < this.code.length; i++)
	{
		this.codeID[i] = new Array(this.code[i].length);
		for (j = 0; j < this.code[i].length; j++)
		{
			this.codeID[i][j] = this.nextIndex++;
			this.cmd("CreateLabel", this.codeID[i][j], this.code[i][j], DPMatrixMultiply.CODE_START_X, DPMatrixMultiply.CODE_START_Y + i * DPMatrixMultiply.CODE_LINE_HEIGHT, 0);
			this.cmd("SetForegroundColor", this.codeID[i][j], DPMatrixMultiply.CODE_STANDARD_COLOR);
			if (j > 0)
			{
				this.cmd("AlignRight", this.codeID[i][j], this.codeID[i][j-1]);
			}
		}


	}

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	this.initialIndex = this.nextIndex;
	this.oldIDs = [];
	this.commands = [];
}


DPMatrixMultiply.prototype.addControls =  function()
{
	this.controls = [];
	addLabelToAlgorithmBar("S1:");
	this.S1Field = addControlToAlgorithmBar("Text", "");
	this.S1Field.onkeydown = this.returnSubmit(this.S1Field,  this.emptyCallback.bind(this), DPMatrixMultiply.MAX_SEQUENCE_LENGTH, false);
	this.controls.push(this.S1Field);

	addLabelToAlgorithmBar("S2:");
	this.S2Field = addControlToAlgorithmBar("Text", "");
	this.S2Field.onkeydown = this.returnSubmit(this.S2Field,  this.emptyCallback.bind(this), DPMatrixMultiply.MAX_SEQUENCE_LENGTH, false);
	this.controls.push(this.S2Field);

	this.recursiveButton = addControlToAlgorithmBar("Button", "LCS Recursive");
	this.recursiveButton.onclick = this.recursiveCallback.bind(this);
	this.controls.push(this.recursiveButton);

	this.tableButton = addControlToAlgorithmBar("Button", "LCS Table");
	this.tableButton.onclick = this.tableCallback.bind(this);
	this.controls.push(this.tableButton);

	this.memoizedButton = addControlToAlgorithmBar("Button", "LCS Memoized");
	this.memoizedButton.onclick = this.memoizedCallback.bind(this);
	this.controls.push(this.memoizedButton);

}



DPMatrixMultiply.prototype.buildTable  = function(S1, S2)
{
	var x = S1.length;
	var y = S2.length;
	this.tableID = new Array(x+1);
	this.tableVals = new Array(x + 1);
	this.tableXPos = new Array(x + 1);
	this.tableYPos = new Array(x + 1);

	var i, j;
	var sequence1ID = new Array(x);
	var sequence2ID = new Array(y);

	this.S1TableID = new Array(x);
	for (i = 0; i <=x; i++)
	{
		if (i > 0)
		{
			this.S1TableID[i-1] = this.nextIndex++;
			this.cmd("CreateLabel", this.S1TableID[i-1], S1.charAt(i-1),DPMatrixMultiply.TABLE_START_X + i*DPMatrixMultiply.TABLE_ELEM_WIDTH, DPMatrixMultiply.TABLE_START_Y - 2 * DPMatrixMultiply.TABLE_ELEM_HEIGHT);
			this.oldIDs.push(this.S1TableID[i-1]);
		}
		var index = this.nextIndex++;
		this.oldIDs.push(index);
		this.cmd("CreateLabel", index, i - 1,DPMatrixMultiply.TABLE_START_X + i*DPMatrixMultiply.TABLE_ELEM_WIDTH, DPMatrixMultiply.TABLE_START_Y - 1 * DPMatrixMultiply.TABLE_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", index, "#0000FF");

	}


	this.S2TableID = new Array(y);
	for (i = 0; i <=y; i++)
	{
		if (i > 0)
		{
			this.S2TableID[i-1] = this.nextIndex++;
			this.cmd("CreateLabel", this.S2TableID[i-1], S2.charAt(i-1),DPMatrixMultiply.TABLE_START_X - 2 * DPMatrixMultiply.TABLE_ELEM_WIDTH, DPMatrixMultiply.TABLE_START_Y + i * DPMatrixMultiply.TABLE_ELEM_HEIGHT);
			this.oldIDs.push(this.S2TableID[i-1]);
		}
		var index = this.nextIndex++;
		this.oldIDs.push(index);
		this.cmd("CreateLabel", index, i - 1, DPMatrixMultiply.TABLE_START_X  - 1 * DPMatrixMultiply.TABLE_ELEM_WIDTH, DPMatrixMultiply.TABLE_START_Y +  i * DPMatrixMultiply.TABLE_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", index, "#0000FF");
	}


	for (i = 0; i <= x; i++)
	{
		this.tableID[i] = new Array(y+1);
		this.tableVals[i] =new Array(y+1);
		this.tableXPos[i] = new Array(y+1);
		this.tableYPos[i] = new Array(y+1);

		for (j = 0; j <= y; j++)
		{
			this.tableID[i][j] = this.nextIndex++;
			this.tableVals[i][j] = -1;
			this.oldIDs.push(this.tableID[i][j]);

			this.tableXPos[i][j] =DPMatrixMultiply.TABLE_START_X + i * DPMatrixMultiply.TABLE_ELEM_WIDTH;
			this.tableYPos[i][j] =  DPMatrixMultiply.TABLE_START_Y + j * DPMatrixMultiply.TABLE_ELEM_HEIGHT;

			this.cmd("CreateRectangle", this.tableID[i][j],
					 "",
					 DPMatrixMultiply.TABLE_ELEM_WIDTH,
					 DPMatrixMultiply.TABLE_ELEM_HEIGHT,
					 this.tableXPos[i][j],
					 this.tableYPos[i][j]);

		}

	}
}

DPMatrixMultiply.prototype.clearOldIDs = function()
{
	for (var i = 0; i < this.oldIDs.length; i++)
	{
		this.cmd("Delete", this.oldIDs[i]);
	}
	this.oldIDs =[];
	this.nextIndex = this.initialIndex;

}


DPMatrixMultiply.prototype.reset = function()
{
	this.oldIDs =[];
	this.nextIndex = this.initialIndex;
}



DPMatrixMultiply.prototype.emptyCallback = function(event)
{
	this.implementAction(this.helpMessage.bind(this), "");

}

DPMatrixMultiply.prototype.recursiveCallback = function(event)
{
	var fibValue;

	if (this.S1Field.value != "" && this.S2Field.value != "" )
	{
		this.implementAction(this.recursiveLCS.bind(this),this.S1Field.value + ";" + this.S2Field.value);
	}
	else
	{
		this.implementAction(this.helpMessage.bind(this), "");
	}
}


DPMatrixMultiply.prototype.tableCallback = function(event)
{
	var fibValue;


	if (this.S1Field.value != "" && this.S2Field.value != "" )
	{
		this.implementAction(this.tableLCS.bind(this),this.S1Field.value + ";" + this.S2Field.value);
	}
	else
	{
		this.implementAction(this.helpMessage.bind(this), "");
	}

}


DPMatrixMultiply.prototype.memoizedCallback = function(event)
{
	var fibValue;


	if (this.S1Field.value != "" && this.S2Field.value != "" )
	{
		this.implementAction(this.memoizedLCS.bind(this), this.S1Field.value + ";" + this.S2Field.value);
	}
	else
	{
		this.implementAction(this.helpMessage.bind(this), "");
	}

}

DPMatrixMultiply.prototype.helpMessage = function(value)
{
	this.commands = [];

	this.clearOldIDs();

	var messageID = this.nextIndex++;
	this.oldIDs.push(messageID);
	this.cmd("CreateLabel", messageID,
			 "Enter two sequences in the text fields.\n" +
			 "Then press the LCS Recursive, LCS Table, or LCS Memoized button",
			 DPMatrixMultiply.RECURSIVE_START_X, DPMatrixMultiply.RECURSIVE_START_Y, 0);
	return this.commands;


}


DPMatrixMultiply.prototype.recursiveLCS = function(value)
{
	this.commands = [];

	var sequences=value.split(";");



	this.clearOldIDs();

	this.currentY = DPMatrixMultiply.RECURSIVE_START_Y;

	var functionCallID = this.nextIndex++;
	this.oldIDs.push(functionCallID);
	var final = this.LCS(sequences[0], sequences[1], sequences[0].length - 1, sequences[1].length - 1, DPMatrixMultiply.RECURSIVE_START_X, functionCallID);
	this.cmd("SetText", functionCallID, "LCS(" + sequences[0] + ", " + sequences[1] + ", " +  String(sequences[0].length - 1) + ", " +  String(sequences[1].length - 1) + ") = " + String(final));
	return this.commands;
}


DPMatrixMultiply.prototype.LCS = function(S1, S2, x, y, xPos, ID)
{
	var ID2 = this.nextIndex++;
	this.cmd("CreateLabel", ID, "LCS(" + S1 + ", " + S2 + ", " + String(x) + ", "+ String(y) + ")", xPos, this.currentY, 0);
	this.cmd("CreateLabel", ID2,   "        [LCS(" +  S1.substring(0,x + 1)+ "," +  S2.substring(0,y + 1) + ")]");
	this.cmd("SetForegroundColor", ID2, "#3333FF");
	this.cmd("AlignRight", ID2, ID);
	this.cmd("SetForegroundColor", this.codeID[0][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
	this.cmd("Step");
	this.cmd("SetForegroundColor", this.codeID[0][1], DPMatrixMultiply.CODE_STANDARD_COLOR);

	if (x == -1 || y == -1)
	{
		if (x == -1)
		{
			this.cmd("SetForegroundColor", this.codeID[1][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);

		}
		if (y == -1)
		{
			this.cmd("SetForegroundColor", this.codeID[1][3], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);

		}
		this.cmd("Step");
		if (x == -1)
		{
			this.cmd("SetForegroundColor", this.codeID[1][1], DPMatrixMultiply.CODE_STANDARD_COLOR);

		}
		if (y == -1)
		{
			this.cmd("SetForegroundColor", this.codeID[1][3], DPMatrixMultiply.CODE_STANDARD_COLOR);
		}
		this.cmd("SetForegroundColor", this.codeID[2][0], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("SetText", ID, 0);
		this.cmd("Delete", ID2);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[2][0], DPMatrixMultiply.CODE_STANDARD_COLOR);
		return 0;
	}
	this.cmd("SetForegroundColor", this.codeID[3][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
	this.cmd("Step");
	this.cmd("SetForegroundColor", this.codeID[3][1], DPMatrixMultiply.CODE_STANDARD_COLOR);

	if (S1.charAt(x) == S2.charAt(y))
	{

		this.cmd("SetForegroundColor", this.codeID[4][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[4][1], DPMatrixMultiply.CODE_STANDARD_COLOR);

		var nextID = this.nextIndex++;
		this.currentY += DPMatrixMultiply.RECURSIVE_DELTA_Y;
		var subProb = this.LCS(S1, S2, x-1, y-1, xPos + DPMatrixMultiply.RECURSIVE_DELTA_X, nextID);


		this.cmd("SetForegroundColor", this.codeID[4][0], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[4][0], DPMatrixMultiply.CODE_STANDARD_COLOR);


		this.cmd("Delete", nextID);
		this.cmd("SetText", ID, subProb + 1);
		this.cmd("Delete", ID2);
		this.cmd("step");
		this.currentY -= DPMatrixMultiply.RECURSIVE_DELTA_Y;
		return subProb + 1
	}
	else
	{
		var firstID = this.nextIndex++;
		var secondID = this.nextIndex++;
		this.currentY += DPMatrixMultiply.RECURSIVE_DELTA_Y;
		this.cmd("SetForegroundColor", this.codeID[6][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[6][1], DPMatrixMultiply.CODE_STANDARD_COLOR);

		var subProb1 = this.LCS(S1, S2, x-1, y, xPos + DPMatrixMultiply.RECURSIVE_DELTA_X, firstID);
		this.currentY += DPMatrixMultiply.RECURSIVE_DELTA_Y;
		this.cmd("SetForegroundColor", this.codeID[6][3], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[6][3], DPMatrixMultiply.CODE_STANDARD_COLOR);

		var subProb2 = this.LCS(S1, S2, x, y-1, xPos + DPMatrixMultiply.RECURSIVE_DELTA_X, secondID);

		this.cmd("SetForegroundColor", this.codeID[6][0], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("SetForegroundColor", this.codeID[6][2], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("SetForegroundColor", this.codeID[6][4], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[6][0], DPMatrixMultiply.CODE_STANDARD_COLOR);
		this.cmd("SetForegroundColor", this.codeID[6][2], DPMatrixMultiply.CODE_STANDARD_COLOR);
		this.cmd("SetForegroundColor", this.codeID[6][4], DPMatrixMultiply.CODE_STANDARD_COLOR);
		this.cmd("Delete", firstID);
		this.cmd("Delete", secondID);
		this.currentY -= 2*DPMatrixMultiply.RECURSIVE_DELTA_Y;
		var best = Math.max(subProb1, subProb2);
		this.cmd("SetText", ID, best);
		this.cmd("Delete", ID2);
		this.cmd("step");
		return best;
	}
}




DPMatrixMultiply.prototype.tableLCS = function(value)
{
	this.commands = [];
	this.clearOldIDs();

	var sequences=value.split(";");

	this.buildTable(sequences[0], sequences[1]);

	var moveID = this.nextIndex++;
	var x = sequences[0].length;
	var y = sequences[1].length;
	var i, j;

	for (i = 0; i <= x; i++)
	{
		this.cmd("SetText", this.tableID[i][0], "0");
		this.tableVals[i][0] = 0;
	}
	for (i = 0; i <= y; i++)
	{
		this.cmd("SetText", this.tableID[0][i], "0");
		this.tableVals[0][i] = 0;
	}
	this.cmd("Step");
	for (j = 0; j < y; j++)
	{
		for (i = 0; i < x; i++)
		{
			this.cmd("SetHighlight", this.tableID[i+1][j+1], 1);
			this.cmd("SetHighlight", this.S1TableID[i], 1);
			this.cmd("SetHighlight", this.S2TableID[j], 1);
			this.cmd("SetForegroundColor", this.codeID[3][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
			this.cmd("Step")
			this.cmd("SetHighlight", this.S1TableID[i], 0);
			this.cmd("SetHighlight", this.S2TableID[j], 0);
			this.cmd("SetForegroundColor", this.codeID[3][1], DPMatrixMultiply.CODE_STANDARD_COLOR);
			if (sequences[0].charAt(i) == sequences[1].charAt(j))
			{
				this.cmd("SetForegroundColor", this.codeID[4][0], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
				this.cmd("SetForegroundColor", this.codeID[4][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
				this.cmd("SetHighlight", this.tableID[i+1-1][j+1-1], 1);
				this.cmd("Step");
				this.cmd("CreateLabel",  moveID, this.tableVals[i][j] + 1, this.tableXPos[i][j], this.tableYPos[i][j]);
				this.cmd("Move", moveID, this.tableXPos[i+1][j+1], this.tableYPos[i+1][j+1]);
				this.cmd("Step");
				this.cmd("Delete", moveID);
				this.cmd("SetForegroundColor", this.codeID[4][0], DPMatrixMultiply.CODE_STANDARD_COLOR);
				this.cmd("SetForegroundColor", this.codeID[4][1], DPMatrixMultiply.CODE_STANDARD_COLOR);
				this.cmd("SetHighlight", this.tableID[i+1-1][j+1-1], 0);
				this.tableVals[i+1][j+1] = this.tableVals[i][j] + 1;
				this.cmd("SetText", this.tableID[i+1][j+1], this.tableVals[i+1][j+1]);
			}
			else
			{
				this.cmd("SetForegroundColor", this.codeID[6][0], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
				this.cmd("SetForegroundColor", this.codeID[6][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
				this.cmd("SetForegroundColor", this.codeID[6][2], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
				this.cmd("SetForegroundColor", this.codeID[6][3], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
				this.cmd("SetForegroundColor", this.codeID[6][4], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);

				this.cmd("SetHighlight", this.tableID[i][j+1], 1);
				this.cmd("SetHighlight", this.tableID[i+1][j], 1);
				this.cmd("Step");
				this.cmd("SetForegroundColor", this.codeID[6][0], DPMatrixMultiply.CODE_STANDARD_COLOR);
				this.cmd("SetForegroundColor", this.codeID[6][2], DPMatrixMultiply.CODE_STANDARD_COLOR);
				this.cmd("SetForegroundColor", this.codeID[6][4], DPMatrixMultiply.CODE_STANDARD_COLOR);

				if (this.tableVals[i][j+1] > this.tableVals[i+1][j])
				{
					this.cmd("SetHighlight", this.tableID[i+1][j], 0);
					this.cmd("SetForegroundColor", this.codeID[6][3], DPMatrixMultiply.CODE_STANDARD_COLOR);

					this.tableVals[i+1][j+1] = this.tableVals[i][j+1];
					this.cmd("CreateLabel", moveID, this.tableVals[i][j+1], this.tableXPos[i][j+1], this.tableYPos[i][j+1]);

				}
				else
				{
					this.cmd("SetForegroundColor", this.codeID[6][1], DPMatrixMultiply.CODE_STANDARD_COLOR);
					this.cmd("SetHighlight", this.tableID[i][j+1], 0);
					this.tableVals[i+1][j+1] = this.tableVals[i+1][j];
					this.cmd("CreateLabel", moveID, this.tableVals[i+1][j], this.tableXPos[i+1][j], this.tableYPos[i+1][j]);
				}
				this.cmd("Move", moveID, this.tableXPos[i+1][j+1], this.tableYPos[i+1][j+1]);
				this.cmd("Step");
				this.cmd("SetText", this.tableID[i+1][j+1], this.tableVals[i+1][j+1]);
				this.cmd("Delete", moveID);
				if (this.tableVals[i][j+1] > this.tableVals[i+1][j])
				{
					this.cmd("SetForegroundColor", this.codeID[6][1], DPMatrixMultiply.CODE_STANDARD_COLOR);
					this.cmd("SetHighlight", this.tableID[i][j+1], 0);
				}
				else
				{
					this.cmd("SetForegroundColor", this.codeID[6][3], DPMatrixMultiply.CODE_STANDARD_COLOR);
					this.cmd("SetHighlight", this.tableID[i+1][j], 0);
				}

			}
			this.cmd("SetHighlight", this.tableID[i+1][j+1], 0);

		}
	}
	return this.commands;
}



DPMatrixMultiply.prototype.LCSMem = function(S1, S2, x, y, xPos, ID)
{
	var ID2 = this.nextIndex++;
	this.cmd("CreateLabel", ID, "LCS(" + S1 + ", " + S2 + ", " + String(x) + ", "+ String(y) + ")", xPos, this.currentY, 0);
	this.cmd("CreateLabel", ID2,   "        [LCS(" +  S1.substring(0,x + 1)+ "," +  S2.substring(0,y + 1) + ")]");
	this.cmd("SetForegroundColor", ID2, "#3333FF");
	this.cmd("AlignRight", ID2, ID);
	this.cmd("SetForegroundColor", this.codeID[0][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
	this.cmd("Step");
	this.cmd("SetForegroundColor", this.codeID[0][1], DPMatrixMultiply.CODE_STANDARD_COLOR);

	if (this.tableVals[x+1][y+1] != -1)
	{
		var movingLabel = this.nextIndex++;
		this.cmd("CreateLabel", movingLabel, this.tableVals[x+1][y+1], this.tableXPos[x+1][y+1], this.tableYPos[x+1][y+1]);
		this.cmd("Move", movingLabel, xPos, this.currentY);
		this.cmd("SetText", ID, "");
		this.cmd("Step");
		this.cmd("Delete", movingLabel);


		this.cmd("SetText", ID, this.tableVals[x+1][y+1]);
		this.cmd("Delete", ID2);
		this.cmd("Step");
		return this.tableVals[x+1][y+1];
	}


	if (x == -1 || y == -1)
	{
		if (x == -1)
		{
			this.cmd("SetForegroundColor", this.codeID[1][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);

		}
		if (y == -1)
		{
			this.cmd("SetForegroundColor", this.codeID[1][3], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);

		}
		this.cmd("Step");
		if (x == -1)
		{
			this.cmd("SetForegroundColor", this.codeID[1][1], DPMatrixMultiply.CODE_STANDARD_COLOR);

		}
		if (y == -1)
		{
			this.cmd("SetForegroundColor", this.codeID[1][3], DPMatrixMultiply.CODE_STANDARD_COLOR);
		}
		this.cmd("SetForegroundColor", this.codeID[2][0], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("SetText", ID, 0);
		this.cmd("Delete", ID2);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[2][0], DPMatrixMultiply.CODE_STANDARD_COLOR);


		var movingLabel = this.nextIndex++;
		this.cmd("CreateLabel", movingLabel,0,  xPos, this.currentY);
		this.cmd("Move", movingLabel, this.tableXPos[x+1][y+1], this.tableYPos[x+1][y+1]);
		this.cmd("Step");
		this.cmd("Delete", movingLabel);

		this.tableVals[x+1][y+1] = 0;
		this.cmd("SetText", this.tableID[x+1][y+1], 0);


		return 0;
	}
	this.cmd("SetForegroundColor", this.codeID[3][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
	this.cmd("Step");
	this.cmd("SetForegroundColor", this.codeID[3][1], DPMatrixMultiply.CODE_STANDARD_COLOR);

	if (S1.charAt(x) == S2.charAt(y))
	{

		this.cmd("SetForegroundColor", this.codeID[4][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[4][1], DPMatrixMultiply.CODE_STANDARD_COLOR);

		var nextID = this.nextIndex++;
		this.currentY += DPMatrixMultiply.RECURSIVE_DELTA_Y;
		var subProb = this.LCSMem(S1, S2, x-1, y-1, xPos + DPMatrixMultiply.RECURSIVE_DELTA_X, nextID);


		this.cmd("SetForegroundColor", this.codeID[4][0], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[4][0], DPMatrixMultiply.CODE_STANDARD_COLOR);


		this.cmd("Delete", nextID);
		this.cmd("SetText", ID, subProb + 1);
		this.cmd("Delete", ID2);
		this.cmd("step");
		this.currentY -= DPMatrixMultiply.RECURSIVE_DELTA_Y;



		var movingLabel = this.nextIndex++;
		this.cmd("CreateLabel", movingLabel, subProb + 1,  xPos, this.currentY);
		this.cmd("Move", movingLabel, this.tableXPos[x+1][y+1], this.tableYPos[x+1][y+1]);
		this.cmd("Step");
		this.cmd("Delete", movingLabel);



		this.tableVals[x+1][y+1] = subProb + 1;
		this.cmd("SetText", this.tableID[x+1][y+1], subProb + 1);

		return subProb + 1
	}
	else
	{
		var firstID = this.nextIndex++;
		var secondID = this.nextIndex++;
		this.currentY += DPMatrixMultiply.RECURSIVE_DELTA_Y;
		this.cmd("SetForegroundColor", this.codeID[6][1], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[6][1], DPMatrixMultiply.CODE_STANDARD_COLOR);

		var subProb1 = this.LCSMem(S1, S2, x-1, y, xPos + DPMatrixMultiply.RECURSIVE_DELTA_X, firstID);
		this.currentY += DPMatrixMultiply.RECURSIVE_DELTA_Y;
		this.cmd("SetForegroundColor", this.codeID[6][3], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[6][3], DPMatrixMultiply.CODE_STANDARD_COLOR);

		var subProb2 = this.LCSMem(S1, S2, x, y-1, xPos + DPMatrixMultiply.RECURSIVE_DELTA_X, secondID);

		this.cmd("SetForegroundColor", this.codeID[6][0], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("SetForegroundColor", this.codeID[6][2], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("SetForegroundColor", this.codeID[6][4], DPMatrixMultiply.CODE_HIGHLIGHT_COLOR);
		this.cmd("Step");
		this.cmd("SetForegroundColor", this.codeID[6][0], DPMatrixMultiply.CODE_STANDARD_COLOR);
		this.cmd("SetForegroundColor", this.codeID[6][2], DPMatrixMultiply.CODE_STANDARD_COLOR);
		this.cmd("SetForegroundColor", this.codeID[6][4], DPMatrixMultiply.CODE_STANDARD_COLOR);
		this.cmd("Delete", firstID);
		this.cmd("Delete", secondID);
		this.currentY -= 2*DPMatrixMultiply.RECURSIVE_DELTA_Y;
		var best = Math.max(subProb1, subProb2);
		this.cmd("SetText", ID, best);
		this.cmd("Delete", ID2);



		var movingLabel = this.nextIndex++;
		this.cmd("CreateLabel", movingLabel, best,  xPos, this.currentY);
		this.cmd("Move", movingLabel, this.tableXPos[x+1][y+1], this.tableYPos[x+1][y+1]);
		this.cmd("Step");
		this.cmd("Delete", movingLabel);



		this.tableVals[x+1][y+1] = best;
		this.cmd("SetText", this.tableID[x+1][y+1], best);



		this.cmd("step");
		return best;
	}
}


DPMatrixMultiply.prototype.memoizedLCS = function(value)
{
	this.commands = [];

	this.clearOldIDs();
	var sequences=value.split(";");

	this.buildTable(sequences[0], sequences[1]);


	var functionCallID = this.nextIndex++;
	this.currentY = DPMatrixMultiply.RECURSIVE_START_Y;

	this.oldIDs.push(functionCallID);


	var final = this.LCSMem(sequences[0], sequences[1], sequences[0].length - 1, sequences[1].length - 1, DPMatrixMultiply.RECURSIVE_START_X, functionCallID);

	this.cmd("SetText", functionCallID, "LCS(" + sequences[0] + ", " + sequences[1] + ", " +  String(sequences[0].length - 1) + ", " +  String(sequences[1].length - 1) + ") = " + String(final));

	return this.commands;
}

DPMatrixMultiply.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}


}
DPMatrixMultiply.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}




var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new DPMatrixMultiply(animManag, canvas.width, canvas.height);
}


