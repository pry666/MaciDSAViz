SPLAYTREE.LINK_COLOR = "#007700";
SPLAYTREE.HIGHLIGHT_CIRCLE_COLOR = "#007700";
SPLAYTREE.FOREGROUND_COLOR = "#007700";
SPLAYTREE.BACKGROUND_COLOR = "#EEFFEE";
SPLAYTREE.PRINT_COLOR = SPLAYTREE.FOREGROUND_COLOR;

SPLAYTREE.WIDTH_DELTA  = 50;
SPLAYTREE.HEIGHT_DELTA = 50;
SPLAYTREE.STARTING_Y = 50;


SPLAYTREE.FIRST_PRINT_POS_X  = 50;
SPLAYTREE.PRINT_VERTICAL_GAP  = 20;
SPLAYTREE.PRINT_HORIZONTAL_GAP = 50;



function SPLAYTREE(am, w, h)
{
	this.init(am, w, h);
}

SPLAYTREE.prototype = new Algorithm();
SPLAYTREE.prototype.constructor = SPLAYTREE;
SPLAYTREE.superclass = Algorithm.prototype;

SPLAYTREE.prototype.init = function(am, w, h)
{
	var sc = SPLAYTREE.superclass;
	this.startingX =  w / 2;
	this.first_print_pos_y  = h - 2 * SPLAYTREE.PRINT_VERTICAL_GAP;
	this.print_max  = w - 10;

	var fn = sc.init;
	fn.call(this,am);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.cmd("CreateLabel", 0, "", 20, 10, 0);
	this.nextIndex = 1;
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();

}

SPLAYTREE.prototype.addControls =  function()
{
	this.insertField = addControlToAlgorithmBar("Text", "");
	this.insertField.onkeydown = this.returnSubmit(this.insertField,  this.insertCallback.bind(this), 4);
	this.insertButton = addControlToAlgorithmBar("Button", "Insert");
	this.insertButton.onclick = this.insertCallback.bind(this);
	this.findField = addControlToAlgorithmBar("Text", "");
	this.findField.onkeydown = this.returnSubmit(this.findField,  this.findCallback.bind(this), 4);
	this.findButton = addControlToAlgorithmBar("Button", "Find");
	this.findButton.onclick = this.findCallback.bind(this);
}

SPLAYTREE.prototype.reset = function()
{
	this.nextIndex = 1;
	this.treeRoot = null;
}

SPLAYTREE.prototype.insertCallback = function(event)
{
	var insertedValue = this.insertField.value;
	insertedValue = this.normalizeNumber(insertedValue, 4);
	if (insertedValue != "")
	{
		this.insertField.value = "";
		this.implementAction(this.insertElement.bind(this), insertedValue);
	}
}

SPLAYTREE.prototype.findCallback = function(event)
{
	var findValue;
	findValue = this.normalizeNumber(this.findField.value, 4);
	this.findField.value = "";
	this.implementAction(this.findElement.bind(this),findValue);
}

SPLAYTREE.prototype.findElement = function(findValue)
{
	this.commands = [];

	this.highlightID = this.nextIndex++;



    var found = this.doFind(this.treeRoot, findValue);

	if (found)
	{
		this.cmd("SetText", 0, "Element " + findValue + " found.");

	}
	else
	{
		this.cmd("SetText", 0, "Element " + findValue + " not found.");

	}


	return this.commands;
}

SPLAYTREE.prototype.doFind = function(tree, value)
{
	this.cmd("SetText", 0, "Searching for "+value);
	if (tree != null)
	{
		this.cmd("SetHighlight", tree.graphicID, 1);
		if (tree.data == value)
		{
			this.cmd("SetText", 0, "Searching for "+value+" : " + value + " = " + value + " (Element found!)");
			this.cmd("Step");
			this.cmd("SetText", 0, "Splaying found node to root of tree");
			this.cmd("Step");
			this.cmd("SetHighlight", tree.graphicID, 0);
		    this.splayUp(tree);
			return true;
		}
		else
		{
			if (tree.data > value)
			{
				this.cmd("SetText", 0, "Searching for "+value+" : " + value + " < " + tree.data + " (look to left subtree)");
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
				if (tree.left!= null)
				{
					this.cmd("CreateHighlightCircle", this.highlightID, SPLAYTREE.HIGHLIGHT_CIRCLE_COLOR, tree.x, tree.y);
					this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
					this.cmd("Step");
					this.cmd("Delete", this.highlightID);
					return this.doFind(tree.left, value);
				}
				else
				{
					this.splayUp(tree);
					return false;
				}
			}
			else
			{
				this.cmd("SetText", 0, "Searching for "+value+" : " + value + " > " + tree.data + " (look to right subtree)");
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
				if (tree.right!= null)
				{
					this.cmd("CreateHighlightCircle", this.highlightID, SPLAYTREE.HIGHLIGHT_CIRCLE_COLOR, tree.x, tree.y);
					this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
					this.cmd("Step");
					this.cmd("Delete", this.highlightID);
					return this.doFind(tree.right, value);
				}
				else
				{
					this.splayUp(tree);
					return false;

				}
			}

		}

	}
	else
	{
		this.cmd("SetText", 0, "Searching for "+value+" : " + "< Empty Tree > (Element not found)");
		this.cmd("Step");
		this.cmd("SetText", 0, "Searching for "+value+" : " + " (Element not found)");
		return false;
	}
}

SPLAYTREE.prototype.insertElement = function(insertedValue)
{
	this.commands = new Array();
	this.cmd("SetText", 0, "Inserting "+insertedValue);
	this.highlightID = this.nextIndex++;

	if (this.treeRoot == null)
	{
		this.cmd("CreateCircle", this.nextIndex, insertedValue,  this.startingX, SPLAYTREE.STARTING_Y);
		this.cmd("SetForegroundColor", this.nextIndex, SPLAYTREE.FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.nextIndex, SPLAYTREE.BACKGROUND_COLOR);
		this.cmd("Step");
		this.treeRoot = new BSTNode(insertedValue, this.nextIndex, this.startingX, SPLAYTREE.STARTING_Y)
		this.nextIndex += 1;
	}
	else
	{
		this.cmd("CreateCircle", this.nextIndex, insertedValue, 100, 100);
		this.cmd("SetForegroundColor", this.nextIndex, SPLAYTREE.FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.nextIndex, SPLAYTREE.BACKGROUND_COLOR);
		this.cmd("Step");
		var insertElem = new BSTNode(insertedValue, this.nextIndex, 100, 100)


		this.nextIndex += 1;
		this.cmd("SetHighlight", insertElem.graphicID, 1);
		this.insert(insertElem, this.treeRoot)
		this.resizeTree();
		this.cmd("SetText", 0 , "Splay inserted element to root of tree");
		this.cmd("Step");
		this.splayUp(insertElem);

	}
	this.cmd("SetText", 0, "");
	return this.commands;
}

SPLAYTREE.prototype.insert = function(elem, tree)
{
	this.cmd("SetHighlight", tree.graphicID , 1);
	this.cmd("SetHighlight", elem.graphicID , 1);

	if (elem.data < tree.data)
	{
		this.cmd("SetText", 0,  elem.data + " < " + tree.data + ".  Looking at left subtree");
	}
	else
	{
		this.cmd("SetText",  0, elem.data + " >= " + tree.data + ".  Looking at right subtree");
	}
	this.cmd("Step");
	this.cmd("SetHighlight", tree.graphicID, 0);
	this.cmd("SetHighlight", elem.graphicID, 0);

	if (elem.data < tree.data)
	{
		if (tree.left == null)
		{
			this.cmd("SetText", 0,"Found null tree, inserting element");

			this.cmd("SetHighlight", elem.graphicID, 0);
			tree.left=elem;
			elem.parent = tree;
			this.cmd("Connect", tree.graphicID, elem.graphicID, SPLAYTREE.LINK_COLOR);
		}
		else
		{
			this.cmd("CreateHighlightCircle", this.highlightID, SPLAYTREE.HIGHLIGHT_CIRCLE_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			this.insert(elem, tree.left);
		}
	}
	else
	{
		if (tree.right == null)
		{
			this.cmd("SetText",  0, "Found null tree, inserting element");
			this.cmd("SetHighlight", elem.graphicID, 0);
			tree.right=elem;
			elem.parent = tree;
			this.cmd("Connect", tree.graphicID, elem.graphicID, SPLAYTREE.LINK_COLOR);
			elem.x = tree.x + SPLAYTREE.WIDTH_DELTA/2;
			elem.y = tree.y + SPLAYTREE.HEIGHT_DELTA
			this.cmd("Move", elem.graphicID, elem.x, elem.y);
		}
		else
		{
			this.cmd("CreateHighlightCircle", this.highlightID, SPLAYTREE.HIGHLIGHT_CIRCLE_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			this.insert(elem, tree.right);
		}
	}


}

SPLAYTREE.prototype.singleRotateRight = function(tree)
{
	var B = tree;
	var t3 = B.right;
	var A = tree.left;
	var t1 = A.left;
	var t2 = A.right;

	this.cmd("SetText", 0, "Zig Right");
	this.cmd("SetEdgeHighlight", B.graphicID, A.graphicID, 1);
	this.cmd("Step");


	if (t2 != null)
	{
		this.cmd("Disconnect", A.graphicID, t2.graphicID);
		this.cmd("Connect", B.graphicID, t2.graphicID, SPLAYTREE.LINK_COLOR);
		t2.parent = B;
	}
	this.cmd("Disconnect", B.graphicID, A.graphicID);
	this.cmd("Connect", A.graphicID, B.graphicID, SPLAYTREE.LINK_COLOR);
	A.parent = B.parent;
	if (B.parent == null)
	{
		this.treeRoot = A;
	}
	else
	{
		this.cmd("Disconnect", B.parent.graphicID, B.graphicID, SPLAYTREE.LINK_COLOR);
		this.cmd("Connect", B.parent.graphicID, A.graphicID, SPLAYTREE.LINK_COLOR)
		if (B.isLeftChild())
		{
			B.parent.left = A;
		}
		else
		{
			B.parent.right = A;
		}
	}
	A.right = B;
	B.parent = A;
	B.left = t2;
	this.resizeTree();
}

SPLAYTREE.prototype.zigZigRight = function(tree)
{
	var C = tree;
	var B = tree.left;
	var A = tree.left.left;
	var t1 = A.left;
	var t2 = A.right;
	var t3 = B.right;
	var t4 = C.right;

	this.cmd("SetText", 0, "Zig-Zig Right");
	this.cmd("SetEdgeHighlight", C.graphicID, B.graphicID, 1);
	this.cmd("SetEdgeHighlight", B.graphicID, A.graphicID, 1);
	this.cmd("Step");
	this.cmd("SetEdgeHighlight", C.graphicID, B.graphicID, 0);
	this.cmd("SetEdgeHighlight", B.graphicID, A.graphicID, 0);


	if (C.parent != null)
	{
		this.cmd("Disconnect", C.parent.graphicID, C.graphicID);
		this.cmd("Connect", C.parent.graphicID, A.graphicID, SPLAYTREE.LINK_COLOR);
		if (C.isLeftChild())
		{
			C.parent.left = A;
		}
		else
		{
			C.parent.right = A;
		}
	}
	else
	{
		this.treeRoot = A;
	}

	if (t2 != null)
	{
		this.cmd("Disconnect", A.graphicID, t2.graphicID);
		this.cmd("Connect", B.graphicID, t2.graphicID, SPLAYTREE.LINK_COLOR);
		t2.parent = B;
	}
	if (t3 != null)
	{
		this.cmd("Disconnect", B.graphicID, t3.graphicID);
		this.cmd("Connect", C.graphicID, t3.graphicID, SPLAYTREE.LINK_COLOR);
		t3.parent = C;
	}
	this.cmd("Disconnect", B.graphicID, A.graphicID);
	this.cmd("Connect", A.graphicID, B.graphicID, SPLAYTREE.LINK_COLOR);
	this.cmd("Disconnect", C.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, C.graphicID, SPLAYTREE.LINK_COLOR);

	A.right = B;
	A.parent = C.parent;
	B.parent = A;
	B.left = t2;
	B.right = C;
	C.parent = B;
	C.left = t3;
	this.resizeTree();
}

SPLAYTREE.prototype.zigZigLeft = function(tree)
{
	var A = tree;
	var B = tree.right;
	var C = tree.right.right;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = C.left;
	var t4 = C.right;

	this.cmd("SetText", 0, "Zig-Zig Left");
	this.cmd("SetEdgeHighlight", A.graphicID, B.graphicID, 1);
	this.cmd("SetEdgeHighlight", B.graphicID, C.graphicID, 1);
	this.cmd("Step");
	this.cmd("SetEdgeHighlight", A.graphicID, B.graphicID, 0);
	this.cmd("SetEdgeHighlight", B.graphicID, C.graphicID, 0);



	if (A.parent != null)
	{
		this.cmd("Disconnect", A.parent.graphicID, A.graphicID);
		this.cmd("Connect", A.parent.graphicID, C.graphicID, SPLAYTREE.LINK_COLOR);
		if (A.isLeftChild())
		{
			A.parent.left = C;
		}
		else
		{
			A.parent.right = C;
		}
	}
	else
	{
		this.treeRoot = C;
	}

	if (t2 != null)
	{
		this.cmd("Disconnect", B.graphicID, t2.graphicID);
		this.cmd("Connect", A.graphicID, t2.graphicID, SPLAYTREE.LINK_COLOR);
		t2.parent = A;
	}
	if (t3 != null)
	{
		this.cmd("Disconnect", C.graphicID, t3.graphicID);
		this.cmd("Connect", B.graphicID, t3.graphicID, SPLAYTREE.LINK_COLOR);
		t3.parent = B;
	}
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Disconnect", B.graphicID, C.graphicID);
	this.cmd("Connect", C.graphicID, B.graphicID, SPLAYTREE.LINK_COLOR);
	this.cmd("Connect", B.graphicID, A.graphicID, SPLAYTREE.LINK_COLOR);
	C.parent = A.parent;
	A.right = t2;
	B.left = A;
	A.parent = B;
	B.right = t3;
	C.left = B;
	B.parent = C;

	this.resizeTree();

}

SPLAYTREE.prototype.singleRotateLeft = function(tree)
{
	var A = tree;
	var B = tree.right;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;

	this.cmd("SetText", 0, "Zig Left");
	this.cmd("SetEdgeHighlight", A.graphicID, B.graphicID, 1);
	this.cmd("Step");

	if (t2 != null)
	{
		this.cmd("Disconnect", B.graphicID, t2.graphicID);
		this.cmd("Connect", A.graphicID, t2.graphicID, SPLAYTREE.LINK_COLOR);
		t2.parent = A;
	}
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, SPLAYTREE.LINK_COLOR);
	B.parent = A.parent;
	if (A.parent == null)
	{
		this.treeRoot = B;
	}
	else
	{
		this.cmd("Disconnect", A.parent.graphicID, A.graphicID, SPLAYTREE.LINK_COLOR);
		this.cmd("Connect", A.parent.graphicID, B.graphicID, SPLAYTREE.LINK_COLOR)

		if (A.isLeftChild())
		{
			A.parent.left = B;
		}
		else
		{
			A.parent.right = B;
		}
	}
	B.left = A;
	A.parent = B;
	A.right = t2;

	this.resizeTree();
}

SPLAYTREE.prototype.splayUp = function(tree)
{
	if (tree.parent == null)
	{
		return;
	}
	else if (tree.parent.parent == null)
	{
		if (tree.isLeftChild())
		{
			this.singleRotateRight(tree.parent);

		}
		else
		{
			this.singleRotateLeft(tree.parent);
		}
	}
	else if (tree.isLeftChild() && !tree.parent.isLeftChild())
	{
		this.doubleRotateLeft(tree.parent.parent);
		this.splayUp(tree);

	}
	else if (!tree.isLeftChild() && tree.parent.isLeftChild())
	{
		this.doubleRotateRight(tree.parent.parent);
		this.splayUp(tree);
	}
	else if (tree.isLeftChild())
	{
		this.zigZigRight(tree.parent.parent);
		this.splayUp(tree);
	}
	else
	{
		this.zigZigLeft(tree.parent.parent);
		this.splayUp(tree);
	}
}

SPLAYTREE.prototype.doubleRotateRight = function(tree)
{
	this.cmd("SetText", 0, "Zig-Zag Right");
	var A = tree.left;
	var B = tree.left.right;
	var C = tree;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;
	var t4 = C.right;

	this.cmd("SetEdgeHighlight", C.graphicID, A.graphicID, 1);
	this.cmd("SetEdgeHighlight", A.graphicID, B.graphicID, 1);

	this.cmd("Step");

	if (t2 != null)
	{
		this.cmd("Disconnect",B.graphicID, t2.graphicID);
		t2.parent = A;
		A.right = t2;
		this.cmd("Connect", A.graphicID, t2.graphicID, SPLAYTREE.LINK_COLOR);
	}
	if (t3 != null)
	{
		this.cmd("Disconnect",B.graphicID, t3.graphicID);
		t3.parent = C;
		C.left = t2;
		this.cmd("Connect", C.graphicID, t3.graphicID, SPLAYTREE.LINK_COLOR);
	}
	if (C.parent == null)
	{
		B.parent = null;
		this.treeRoot = B;
	}
	else
	{
		this.cmd("Disconnect",C.parent.graphicID, C.graphicID);
		this.cmd("Connect",C.parent.graphicID, B.graphicID, SPLAYTREE.LINK_COLOR);
		if (C.isLeftChild())
		{
			C.parent.left = B
		}
		else
		{
			C.parent.right = B;
		}
		B.parent = C.parent;
		C.parent = B;
	}
	this.cmd("Disconnect", C.graphicID, A.graphicID);
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, SPLAYTREE.LINK_COLOR);
	this.cmd("Connect", B.graphicID, C.graphicID, SPLAYTREE.LINK_COLOR);
	B.left = A;
	A.parent = B;
	B.right=C;
	C.parent=B;
	A.right=t2;
	C.left = t3;

	this.resizeTree();


}

SPLAYTREE.prototype.doubleRotateLeft = function(tree)
{
	this.cmd("SetText", 0, "Zig-Zag Left");
	var A = tree;
	var B = tree.right.left;
	var C = tree.right;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;
	var t4 = C.right;

	this.cmd("SetEdgeHighlight", A.graphicID, C.graphicID, 1);
	this.cmd("SetEdgeHighlight", C.graphicID, B.graphicID, 1);

	this.cmd("Step");

	if (t2 != null)
	{
		this.cmd("Disconnect",B.graphicID, t2.graphicID);
		t2.parent = A;
		A.right = t2;
		this.cmd("Connect", A.graphicID, t2.graphicID, SPLAYTREE.LINK_COLOR);
	}
	if (t3 != null)
	{
		this.cmd("Disconnect",B.graphicID, t3.graphicID);
		t3.parent = C;
		C.left = t2;
		this.cmd("Connect", C.graphicID, t3.graphicID, SPLAYTREE.LINK_COLOR);
	}


	if (A.parent == null)
	{
		B.parent = null;
		this.treeRoot = B;
	}
	else
	{
		this.cmd("Disconnect",A.parent.graphicID, A.graphicID);
		this.cmd("Connect",A.parent.graphicID, B.graphicID, SPLAYTREE.LINK_COLOR);
		if (A.isLeftChild())
		{
			A.parent.left = B
		}
		else
		{
			A.parent.right = B;
		}
		B.parent = A.parent;
		A.parent = B;

	}
	this.cmd("Disconnect", A.graphicID, C.graphicID);
	this.cmd("Disconnect", C.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, SPLAYTREE.LINK_COLOR);
	this.cmd("Connect", B.graphicID, C.graphicID, SPLAYTREE.LINK_COLOR);
	B.left = A;
	A.parent = B;
	B.right=C;
	C.parent=B;
	A.right=t2;
	C.left = t3;

	this.resizeTree();


}

SPLAYTREE.prototype.resizeTree = function()
{
	var startingPoint  = this.startingX;
	this.resizeWidths(this.treeRoot);
	if (this.treeRoot != null)
	{
		if (this.treeRoot.leftWidth > startingPoint)
		{
			startingPoint = this.treeRoot.leftWidth;
		}
		else if (this.treeRoot.rightWidth > startingPoint)
		{
			startingPoint = Math.max(this.treeRoot.leftWidth, 2 * startingPoint - this.treeRoot.rightWidth);
		}
		this.setNewPositions(this.treeRoot, startingPoint, SPLAYTREE.STARTING_Y, 0);
		this.animateNewPositions(this.treeRoot);
		this.cmd("Step");
	}

}

SPLAYTREE.prototype.setNewPositions = function(tree, xPosition, yPosition, side)
{
	if (tree != null)
	{
		tree.y = yPosition;
		if (side == -1)
		{
			xPosition = xPosition - tree.rightWidth;
		}
		else if (side == 1)
		{
			xPosition = xPosition + tree.leftWidth;
		}
		tree.x = xPosition;
		this.setNewPositions(tree.left, xPosition, yPosition + SPLAYTREE.HEIGHT_DELTA, -1)
		this.setNewPositions(tree.right, xPosition, yPosition + SPLAYTREE.HEIGHT_DELTA, 1)
	}

}
SPLAYTREE.prototype.animateNewPositions = function(tree)
{
	if (tree != null)
	{
		this.cmd("Move", tree.graphicID, tree.x, tree.y);
		this.animateNewPositions(tree.left);
		this.animateNewPositions(tree.right);
	}
}

SPLAYTREE.prototype.resizeWidths = function(tree)
{
	if (tree == null)
	{
		return 0;
	}
	tree.leftWidth = Math.max(this.resizeWidths(tree.left), SPLAYTREE.WIDTH_DELTA / 2);
	tree.rightWidth = Math.max(this.resizeWidths(tree.right), SPLAYTREE.WIDTH_DELTA / 2);
	return tree.leftWidth + tree.rightWidth;
}

function BSTNode(val, id, initialX, initialY)
{
	this.data = val;
	this.x = initialX;
	this.y = initialY;
	this.graphicID = id;
	this.left = null;
	this.right = null;
	this.parent = null;
}

BSTNode.prototype.isLeftChild = function()
{
	if (this. parent == null)
	{
		return true;
	}
	return this.parent.left == this;
}


SPLAYTREE.prototype.disableUI = function(event)
{
	this.insertField.disabled = true;
	this.insertButton.disabled = true;
	this.findField.disabled = true;
	this.findButton.disabled = true;
}

SPLAYTREE.prototype.enableUI = function(event)
{
	this.insertField.disabled = false;
	this.insertButton.disabled = false;
	this.findField.disabled = false;
	this.findButton.disabled = false;
}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new SPLAYTREE(animManag, canvas.width, canvas.height);

}