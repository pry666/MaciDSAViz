Ternary.NODE_WIDTH = 30;

Ternary.CENTER_LINK_COLOR = "#007700";
Ternary.SIDE_LINK_COLOR = "#8888AA";
Ternary.HIGHLIGHT_CIRCLE_COLOR = "#007700";
Ternary.FOREGROUND_COLOR = "#007700";
Ternary.BACKGROUND_COLOR = "#CCFFCC";
Ternary.TRUE_COLOR = "#CCFFCC";
Ternary.PRINT_COLOR = Ternary.FOREGROUND_COLOR;
Ternary.FALSE_COLOR = "#FFFFFF"
Ternary.WIDTH_DELTA  = 50;
Ternary.HEIGHT_DELTA = 50;
Ternary.STARTING_Y = 20;
Ternary.LeftMargin = 300;
Ternary.NEW_NODE_Y = 100
Ternary.NEW_NODE_X = 50;
Ternary.FIRST_PRINT_POS_X  = 50;
Ternary.PRINT_VERTICAL_GAP  = 20;
Ternary.PRINT_HORIZONTAL_GAP = 50;



function Ternary(am, w, h)
{
        this.init(am, w, h);
}

Ternary.prototype = new Algorithm();
Ternary.prototype.constructor = Ternary;
Ternary.superclass = Algorithm.prototype;

Ternary.prototype.init = function(am, w, h)
{
    var sc = Ternary.superclass;
    this.startingX =  w / 2;
    this.first_print_pos_y  = h - 2 * Ternary.PRINT_VERTICAL_GAP;
    this.print_max  = w - 10;

    var fn = sc.init;
    fn.call(this,am);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.cmd("CreateLabel", 0, "", 20, 10, 0);
    this.cmd("CreateLabel", 1, "", 20, 10, 0);
    this.cmd("CreateLabel", 2, "", 20, 30, 0);
    this.nextIndex = 3;
    this.root = null;
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}


Ternary.prototype.addControls =  function()
{
    this.insertField = addControlToAlgorithmBar("Text", "");
    this.insertField.onkeypress = this.returnSubmit(this.insertField,  this.insertCallback.bind(this), 12,false);
    this.insertButton = addControlToAlgorithmBar("Button", "Insert");
    this.insertButton.onclick = this.insertCallback.bind(this);
}

Ternary.prototype.reset = function()
{
    this.nextIndex = 3;
    this.root = null;
}

Ternary.prototype.insertCallback = function(event)
{
    var insertedValue = this.insertField.value.toUpperCase()
    insertedValue = insertedValue.replace(/[^a-z]/gi,'');

    if (insertedValue != "")
    {
        this.insertField.value = "";
        this.implementAction(this.add.bind(this), insertedValue);
    }
}

Ternary.prototype.insertElement = function(insertedValue)
{
    this.cmd("SetText", 0, "");
    return this.commands;
}

Ternary.prototype.resizeTree = function()
{
    this.resizeWidths(this.root);
    if (this.root != null)
    {
	var startingPoint = Ternary.LeftMargin;
	if (this.root.left == null)
	{
	    startingPoint += Ternary.NODE_WIDTH / 2;
	}
	else
	{
	    startingPoint += this.root.left.width;
	}

        this.setNewPositions(this.root, startingPoint, Ternary.STARTING_Y);
        this.animateNewPositions(this.root);
        this.cmd("Step");
    }

}

Ternary.prototype.add = function(word)
{
    this.commands = new Array();
    this.cmd("SetText", 0, "Inserting; ");
    this.cmd("SetText", 1, "\"" + word  + "\"");
    this.cmd("AlignRight", 1, 0);
    this.cmd("Step");
    if (this.root == null)
    {
        this.cmd("CreateCircle", this.nextIndex, " ", Ternary.NEW_NODE_X, Ternary.NEW_NODE_Y);
        this.cmd("SetForegroundColor", this.nextIndex, Ternary.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", this.nextIndex, Ternary.FALSE_COLOR);
        this.cmd("SetWidth", this.nextIndex, Ternary.NODE_WIDTH);
        this.cmd("SetText", 2, "Creating a new root");
        this.root = new TernaryNode(" ", this.nextIndex, Ternary.NEW_NODE_X, Ternary.NEW_NODE_Y)
        this.cmd("Step");
        this.resizeTree();
        this.cmd("SetText", 2, "" );
        this.nextIndex += 1;
        this.highlightID = this.nextIndex++;

    }
    this.addR(word.toUpperCase(), this.root);
    this.cmd("SetText", 0, "");
    this.cmd("SetText", 1, "");
    this.cmd("SetText", 2, "");

    return this.commands;
}

Ternary.prototype.createIfNotExtant = function (tree, child, label)
{
    if (child == null)
    {
        this.cmd("CreateCircle", this.nextIndex, " ", Ternary.NEW_NODE_X, Ternary.NEW_NODE_Y);
        this.cmd("SetForegroundColor", this.nextIndex, Ternary.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", this.nextIndex, Ternary.FALSE_COLOR);
        this.cmd("SetWidth", this.nextIndex, Ternary.NODE_WIDTH);
        this.cmd("SetText", 2, "Creating a new node");
        child = new TernaryNode(" ", this.nextIndex, Ternary.NEW_NODE_X, Ternary.NEW_NODE_Y)
        this.cmd("Step");
        var dir = 0.0001;
        if (label.charAt(0) == '>')
        {
            dir = -0.0001

        }
        var color = Ternary.FOREGROUND_COLOR;
        if (label.charAt(0) == "=")
        {
            color = Ternary.CENTER_LINK_COLOR;
        }
        else
        {
            color = Ternary.SIDE_LINK_COLOR;
        }
        this.cmd("Connect", tree.graphicID, this.nextIndex, color, dir, false, label)
        this.cmd("SetText", 2, "" );
        this.nextIndex++;
        this.highlightID = this.nextIndex++;

    }
    return child;
}

Ternary.prototype.addR = function(s, tree)
{
    this.cmd("SetHighlight", tree.graphicID , 1);

    if (s.length == 0)
    {
            this.cmd("SetText", 2, "Reached the end of the string \nSet current node to true");
            this.cmd("Step");
            this.cmd("SetBackgroundColor", tree.graphicID, Ternary.TRUE_COLOR);
            this.cmd("SetHighlight", tree.graphicID , 0);
            tree.isword = true;
            return;
    }
    else
    {
       this.cmd("SetHighlightIndex", 1, 1);
       if (tree.nextChar == ' ')
       {
           tree.nextChar = s.charAt(0);
           this.cmd("SetText", 2, "No character for this node, setting to " + s.charAt(0));
           this.cmd("SetText", tree.graphicID, s.charAt(0));
           this.cmd("Step");
           if (tree.center == null)
           {
               tree.center = this.createIfNotExtant(tree, tree.center, "="+s.charAt(0));
               tree.center.parent = tree;
               this.resizeTree();

           }
           this.cmd("SetHighlightIndex", 1, -1);
           this.cmd("SetHighlight", tree.graphicID , 0);
           this.cmd("SetText", 1, "\"" + s.substring(1) + "\"");

           this.cmd("CreateHighlightCircle", this.highlightID, Ternary.HIGHLIGHT_CIRCLE_COLOR, tree.x, tree.y);
           this.cmd("SetWidth", this.highlightID, Ternary.NODE_WIDTH);
           this.cmd("Move", this.highlightID, tree.center.x, tree.center.y);
           this.cmd("Step")
           this.cmd("Delete", this.highlightID);

           this.addR(s.substring(1), tree.center)
       }
       else if (tree.nextChar == s.charAt(0))
       {
           this.cmd("CreateHighlightCircle", this.highlightID, Ternary.HIGHLIGHT_CIRCLE_COLOR, tree.x, tree.y);
           this.cmd("SetWidth", this.highlightID, Ternary.NODE_WIDTH);
           this.cmd("SetText", 2, "Making recursive call to center child, passing in \"" + s.substring(1) + "\"");
           this.cmd("Step")
           this.cmd("SetHighlight", tree.graphicID , 0);
           this.cmd("SetHighlightIndex", 1, -1);
           this.cmd("SetText", 1, "\"" + s.substring(1) + "\"");
           this.cmd("Move", this.highlightID, tree.center.x, tree.center.y);
           this.cmd("Step")
           this.cmd("Delete", this.highlightID);
           this.addR(s.substring(1), tree.center)
       }
       else
	{
	    var child = null;
	    var label = "";
	    if (tree.nextChar > s.charAt(0))
	    {
		label = "<" + tree.nextChar;
		this.cmd("SetText", 2, "Next character in stirng is < value stored at current node \n Making recursive call to left child passing in \"" + s+ "\"");
		tree.left = this.createIfNotExtant(tree, tree.left, label);
		tree.left.parent = tree;
 	        this.resizeTree();
		child = tree.left;
	    }
	    else
	    {
		label = ">" + tree.nextChar;
		this.cmd("SetText", 2, "Next character in stirng is > value stored at current node \n Making recursive call to right child passing in \"" + s + "\"");
		tree.right= this.createIfNotExtant(tree, tree.right, label);
		tree.right.parent = tree;
		child = tree.right;
 	        this.resizeTree();

	    }
 	    this.cmd("CreateHighlightCircle", this.highlightID, Ternary.HIGHLIGHT_CIRCLE_COLOR, tree.x, tree.y);
            this.cmd("SetWidth", this.highlightID, Ternary.NODE_WIDTH);
            this.cmd("Step")
            this.cmd("SetHighlight", tree.graphicID , 0);
            this.cmd("SetHighlightIndex", 1, -1);

            this.cmd("Move", this.highlightID, child.x, child.y);
            this.cmd("Step")
 	    this.cmd("Delete", this.highlightID);
	    this.addR(s, child)
	}
    }
}
Ternary.prototype.setNewPositions = function(tree, xLeft, yPosition)
{
	if (tree != null)
	{
            tree.x = xLeft + Ternary.NODE_WIDTH / 2;
   	    tree.y = yPosition;
	    var newYPos = yPosition + Ternary.HEIGHT_DELTA;
	    if (tree.left != null)
            {
		this.setNewPositions(tree.left, xLeft, newYPos);
	    }
	    if (tree.center != null)
            {
		this.setNewPositions(tree.center, xLeft + tree.leftWidth, newYPos);
		tree.x = tree.center.x;
            }
	    if (tree.right != null)
            {
		this.setNewPositions(tree.right, xLeft + tree.leftWidth +  tree.centerWidth, newYPos);
            }

	}

}
Ternary.prototype.animateNewPositions = function(tree)
{
	if (tree != null)
	{
		this.cmd("Move", tree.graphicID, tree.x, tree.y);
                this.animateNewPositions(tree.left)
                this.animateNewPositions(tree.center)
                this.animateNewPositions(tree.right)

	}
}

Ternary.prototype.resizeWidths = function(tree)
{
	if (tree == null)
	{
		return 0;
	}
        tree.leftWidth = (this.resizeWidths(tree.left));
        tree.centerWidth = (this.resizeWidths(tree.center));
        tree.rightWidth = (this.resizeWidths(tree.right));
        tree.width = Math.max(tree.leftWidth + tree.centerWidth+tree.rightWidth, Ternary.NODE_WIDTH  + 4);
        return tree.width;
}

function TernaryNode(val, id, initialX, initialY)
{
    this.nextChar = val;
    this.x = initialX;
    this.y = initialY;
    this.graphicID = id;

    this.left = null;
    this.center = null;
    this.right = null;
    this.leftWidth =  0;
    this.centerWidth =  0;
    this.rightWwidth =  0;
    this.parent = null;
}

Ternary.prototype.disableUI = function(event)
{
    this.insertField.disabled = true;
    this.insertButton.disabled = true;
}

Ternary.prototype.enableUI = function(event)
{
    this.insertField.disabled = false;
    this.insertButton.disabled = false;
}


var currentAlg;

function init()
{
    var animManag = initCanvas();
    currentAlg = new Ternary(animManag, canvas.width, canvas.height);
}