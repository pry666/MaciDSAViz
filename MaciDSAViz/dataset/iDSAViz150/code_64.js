function RedBlack(am, w, h)
{
	this.init(am, w, h);

}

RedBlack.prototype = new Algorithm();
RedBlack.prototype.constructor = RedBlack;
RedBlack.superclass = Algorithm.prototype;

RedBlack.prototype.init = function(am, w, h)
{
	var sc = RedBlack.superclass;
	var fn = sc.init;
	fn.call(this,am);
	this.addControls();
	this.nextIndex = 1;
	this.commands = [];
	this.startingX = w / 2;
	this.print_max  = w - PRINT_HORIZONTAL_GAP;
	this.first_print_pos_y  = h - 2 * PRINT_VERTICAL_GAP;


	this.cmd("CreateLabel", 0, "", EXPLANITORY_TEXT_X, EXPLANITORY_TEXT_Y, 0);
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();

}

RedBlack.prototype.addControls =  function()
{
	this.insertField = addControlToAlgorithmBar("Text", "");
	this.insertField.onkeydown = this.returnSubmit(this.insertField,  this.insertCallback.bind(this), 4);
	this.insertButton = addControlToAlgorithmBar("Button", "Insert");
	this.insertButton.onclick = this.insertCallback.bind(this);

	this.showNullLeaves = addCheckboxToAlgorithmBar("Show Null Leaves");
	this.showNullLeaves.onclick = this.showNullLeavesCallback.bind(this);
	this.showNullLeaves.checked = false;;

}

RedBlack.prototype.reset = function()
{
	this.nextIndex = 1;
	this.treeRoot = null;
}

var FIRST_PRINT_POS_X = 50;
var PRINT_VERTICAL_GAP = 20;
var PRINT_HORIZONTAL_GAP = 50;


var FOREGROUND_RED = "#AA0000";
var BACKGROUND_RED = "#FFAAAA";

var FOREGROUND_BLACK =  "#000000"
var BACKGROUND_BLACK = "#AAAAAA";
var BACKGROUND_DOUBLE_BLACK = "#777777";




var HIGHLIGHT_LABEL_COLOR = "#FF0000"
var HIGHLIGHT_LINK_COLOR = "#FF0000"

var BLUE = "#0000FF";

var LINK_COLOR = "#000000"
var BACKGROUND_COLOR = BACKGROUND_BLACK;
var HIGHLIGHT_COLOR = "#007700";
var FOREGROUND_COLOR = FOREGROUND_BLACK;
var PRINT_COLOR = FOREGROUND_COLOR

var widthDelta  = 50;
var heightDelta = 50;
var startingY = 50;


var FIRST_PRINT_POS_X  = 40;
var PRINT_VERTICAL_GAP  = 20;
var PRINT_HORIZONTAL_GAP = 50;
var EXPLANITORY_TEXT_X = 10;
var EXPLANITORY_TEXT_Y = 10;

RedBlack.prototype.insertCallback = function(event)
{
	var insertedValue = this.insertField.value;
	insertedValue = this.normalizeNumber(insertedValue, 4);
	if (insertedValue != "")
	{
		this.insertField.value = "";
		this.implementAction(this.insertElement.bind(this), insertedValue);
	}
}

RedBlack.prototype.blackLevel = function(tree)
{
	if (tree == null)
	{
		return 1;
	}
	else
	{
		return tree.blackLevel;
	}
}


RedBlack.prototype.attachLeftNullLeaf = function(node)
{
	var treeNodeID = this.nextIndex++;
	this.cmd("CreateCircle", treeNodeID, "NULL\nLEAF",  node.x, node.y);
	this.cmd("SetForegroundColor", treeNodeID, FOREGROUND_BLACK);
	this.cmd("SetBackgroundColor", treeNodeID, BACKGROUND_BLACK);
	node.left = new RedBlackNode("", treeNodeID, this.startingX, startingY);
	node.left.phantomLeaf = true;
	this.cmd("SetLayer", treeNodeID, 1);
	node.left.blackLevel = 1;
	this.cmd("Connect",node.graphicID, treeNodeID, LINK_COLOR);
}

RedBlack.prototype.attachRightNullLeaf = function(node)
{
	treeNodeID = this.nextIndex++;
	this.cmd("CreateCircle", treeNodeID, "NULL\nLEAF",  node.x, node.y);
	this.cmd("SetForegroundColor", treeNodeID, FOREGROUND_BLACK);
	this.cmd("SetBackgroundColor", treeNodeID, BACKGROUND_BLACK);
	node.right = new RedBlackNode("", treeNodeID, this.startingX, startingY);
	this.cmd("SetLayer", treeNodeID, 1);

	node.right.phantomLeaf = true;
	node.right.blackLevel = 1;
	this.cmd("Connect", node.graphicID, treeNodeID, LINK_COLOR);

}
RedBlack.prototype.attachNullLeaves = function(node)
{
	this.attachLeftNullLeaf(node);
	this.attachRightNullLeaf(node);
}

RedBlack.prototype.insertElement = function(insertedValue)
{
	this.commands = new Array();
	this.cmd("SetText", 0, " Inserting "+insertedValue);
	this.highlightID = this.nextIndex++;
	var treeNodeID;
	if (this.treeRoot == null)
	{
		treeNodeID = this.nextIndex++;
		this.cmd("CreateCircle", treeNodeID, insertedValue,  this.startingX, startingY);
		this.cmd("SetForegroundColor", treeNodeID, FOREGROUND_BLACK);
		this.cmd("SetBackgroundColor", treeNodeID, BACKGROUND_BLACK);
		this.treeRoot = new RedBlackNode(insertedValue, treeNodeID, this.startingX, startingY);
		this.treeRoot.blackLevel = 1;

		this.attachNullLeaves(this.treeRoot);
		this.resizeTree();

	}
	else
	{
		treeNodeID = this.nextIndex++;

		this.cmd("CreateCircle", treeNodeID, insertedValue, 30, startingY);
		this.cmd("SetForegroundColor", treeNodeID, FOREGROUND_RED);
		this.cmd("SetBackgroundColor", treeNodeID, BACKGROUND_RED);
		this.cmd("Step");
		var insertElem = new RedBlackNode(insertedValue, treeNodeID, 100, 100)

		this.cmd("SetHighlight", insertElem.graphicID, 1);
		insertElem.height = 1;
		this.insert(insertElem, this.treeRoot);
	}
	this.cmd("SetText", 0, " ");
	return this.commands;
}

RedBlack.prototype.singleRotateRight = function(tree)
{
	var B = tree;
	var t3 = B.right;
	var A = tree.left;
	var t1 = A.left;
	var t2 = A.right;

	this.cmd("SetText", 0, "Single Rotate Right");
	this.cmd("SetEdgeHighlight", B.graphicID, A.graphicID, 1);
	this.cmd("Step");


	if (t2 != null)
	{
		this.cmd("Disconnect", A.graphicID, t2.graphicID);
		this.cmd("Connect", B.graphicID, t2.graphicID, LINK_COLOR);
		t2.parent = B;
	}
	this.cmd("Disconnect", B.graphicID, A.graphicID);
	this.cmd("Connect", A.graphicID, B.graphicID, LINK_COLOR);

	A.parent = B.parent;
	if (this.treeRoot == B)
	{
		this.treeRoot = A;
	}
	else
	{
		this.cmd("Disconnect", B.parent.graphicID, B.graphicID, LINK_COLOR);
		this.cmd("Connect", B.parent.graphicID, A.graphicID, LINK_COLOR)
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
	this.resetHeight(B);
	this.resetHeight(A);
	this.resizeTree();
	return A;
}

RedBlack.prototype.singleRotateLeft = function(tree)
{
	var A = tree;
	var B = tree.right;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;

	this.cmd("SetText", 0, "Single Rotate Left");
	this.cmd("SetEdgeHighlight", A.graphicID, B.graphicID, 1);
	this.cmd("Step");

	if (t2 != null)
	{
		this.cmd("Disconnect", B.graphicID, t2.graphicID);
		this.cmd("Connect", A.graphicID, t2.graphicID, LINK_COLOR);
		t2.parent = A;
	}
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, LINK_COLOR);
	B.parent = A.parent;
	if (this.treeRoot == A)
	{
		this.treeRoot = B;
	}
	else
	{
		this.cmd("Disconnect", A.parent.graphicID, A.graphicID, LINK_COLOR);
		this.cmd("Connect", A.parent.graphicID, B.graphicID, LINK_COLOR)

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
	this.resetHeight(A);
	this.resetHeight(B);

	this.resizeTree();
	return B;
}

RedBlack.prototype.getHeight = function(tree)
{
	if (tree == null)
	{
		return 0;
	}
	return tree.height;
}

RedBlack.prototype.resetHeight = function(tree)
{
	if (tree != null)
	{
		var newHeight = Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1;
		if (tree.height != newHeight)
		{
			tree.height = Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1
		}
	}
}

RedBlack.prototype.insert = function(elem, tree)
{
	this.cmd("SetHighlight", tree.graphicID, 1);
	this.cmd("SetHighlight", elem.graphicID, 1);

	if (elem.data < tree.data)
	{
		this.cmd("SetText", 0, elem.data + " < " + tree.data + ".  Looking at left subtree");
	}
	else
	{
		this.cmd("SetText",  0, elem.data + " >= " + tree.data + ".  Looking at right subtree");
	}
	this.cmd("Step");
	this.cmd("SetHighlight", tree.graphicID , 0);
	this.cmd("SetHighlight", elem.graphicID, 0);

	if (elem.data < tree.data)
	{
		if (tree.left == null || tree.left.phantomLeaf)
		{
			this.cmd("SetText", 0, "Found null tree (or phantom leaf), inserting element");
			if (tree.left != null)
			{
				this.cmd("Delete", tree.left.graphicID);
			}
			this.cmd("SetHighlight", elem.graphicID, 0);
			tree.left=elem;
			elem.parent = tree;
			this.cmd("Connect", tree.graphicID, elem.graphicID, LINK_COLOR);

			this.attachNullLeaves(elem);
			this.resizeTree();




			this.resizeTree();

			this.fixDoubleRed(elem);

		}
		else
		{
			this.cmd("CreateHighlightCircle", this.highlightID, HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			this.insert(elem, tree.left);

		}
	}
	else
	{
		if (tree.right == null  || tree.right.phantomLeaf)
		{
			this.cmd("SetText",  0, "Found null tree (or phantom leaf), inserting element");
			if (tree.right != null)
			{
				this.cmd("Delete", tree.right.graphicID);
			}

			this.cmd("SetHighlight", elem.graphicID, 0);
			tree.right=elem;
			elem.parent = tree;
			this.cmd("Connect", tree.graphicID, elem.graphicID, LINK_COLOR);
			elem.x = tree.x + widthDelta/2;
			elem.y = tree.y + heightDelta
			this.cmd("Move", elem.graphicID, elem.x, elem.y);


			this.attachNullLeaves(elem);
			this.resizeTree();


			this.resizeTree();
			this.fixDoubleRed(elem);
		}
		else
		{
			this.cmd("CreateHighlightCircle", this.highlightID, HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			this.insert(elem, tree.right);
		}
	}


}

RedBlack.prototype.fixDoubleRed = function(tree)
{
	if (tree.parent != null)
	{
		if (tree.parent.blackLevel > 0)
		{
			return;
		}
		if (tree.parent.parent == null)
		{
			this.cmd("SetText", 0, "Tree root is red, color it black.");
			this.cmd("Step");
			tree.parent.blackLevel = 1;
			this.cmd("SetForegroundColor", tree.parent.graphicID, FOREGROUND_BLACK);
			this.cmd("SetBackgroundColor", tree.parent.graphicID, BACKGROUND_BLACK);
			return;
		}
		var uncle = this.findUncle(tree);
		if (this.blackLevel(uncle) == 0)
		{
			this.cmd("SetText", 0, "Node and parent are both red.  Uncle of node is red -- push blackness down from grandparent");
			this.cmd("Step");

			this.cmd("SetForegroundColor", uncle.graphicID, FOREGROUND_BLACK);
			this.cmd("SetBackgroundColor",uncle.graphicID, BACKGROUND_BLACK);
			uncle.blackLevel = 1;

			tree.parent.blackLevel = 1;
			this.cmd("SetForegroundColor", tree.parent.graphicID, FOREGROUND_BLACK);
			this.cmd("SetBackgroundColor",tree.parent.graphicID, BACKGROUND_BLACK);

			tree.parent.parent.blackLevel = 0;
			this.cmd("SetForegroundColor", tree.parent.parent.graphicID, FOREGROUND_RED);
			this.cmd("SetBackgroundColor",tree.parent.parent.graphicID, BACKGROUND_RED);
			this.cmd("Step");
			this.fixDoubleRed(tree.parent.parent);
		}
		else
		{
			if (tree.isLeftChild() &&  !tree.parent.isLeftChild())
			{
				this.cmd("SetText", 0, "Node and parent are both red.  Node is left child, parent is right child -- rotate");
				this.cmd("Step");

				this.singleRotateRight(tree.parent);
				tree=tree.right;

			}
			else if (!tree.isLeftChild() && tree.parent.isLeftChild())
			{
				this.cmd("SetText", 0, "Node and parent are both red.  Node is right child, parent is left child -- rotate");
				this.cmd("Step");

				this.singleRotateLeft(tree.parent);
				tree=tree.left;
			}

			if (tree.isLeftChild())
			{
				this.cmd("SetText", 0, "Node and parent are both red.  Node is left child, parent is left child\nCan fix extra redness with a single rotation");
				this.cmd("Step");

				this.singleRotateRight(tree.parent.parent);
				tree.parent.blackLevel = 1;
				this.cmd("SetForegroundColor", tree.parent.graphicID, FOREGROUND_BLACK);
				this.cmd("SetBackgroundColor",tree.parent.graphicID, BACKGROUND_BLACK);

				tree.parent.right.blackLevel = 0;
				this.cmd("SetForegroundColor", tree.parent.right.graphicID, FOREGROUND_RED);
				this.cmd("SetBackgroundColor",tree.parent.right.graphicID, BACKGROUND_RED);


			}
			else
			{
				this.cmd("SetText", 0, "Node and parent are both red.  Node is right child, parent is right child\nCan fix extra redness with a single rotation");
				this.cmd("Step");

				this.singleRotateLeft(tree.parent.parent);
				tree.parent.blackLevel = 1;
				this.cmd("SetForegroundColor", tree.parent.graphicID, FOREGROUND_BLACK);
				this.cmd("SetBackgroundColor",tree.parent.graphicID, BACKGROUND_BLACK);

				tree.parent.left.blackLevel = 0;
				this.cmd("SetForegroundColor", tree.parent.left.graphicID, FOREGROUND_RED);
				this.cmd("SetBackgroundColor",tree.parent.left.graphicID, BACKGROUND_RED);

			}
		}

	}
	else
	{
		if (tree.blackLevel == 0)
		{
			this.cmd("SetText", 0, "Root of the tree is red.  Color it black");
			this.cmd("Step");

			tree.blackLevel = 1;
			this.cmd("SetForegroundColor", tree.graphicID, FOREGROUND_BLACK);
			this.cmd("SetBackgroundColor", tree.graphicID, BACKGROUND_BLACK);
		}
	}

}

RedBlack.prototype.fixLeftNull = function(tree)
{
	var treeNodeID = this.nextIndex++;
	var nullLeaf;
	this.cmd("SetText", 0, "Coloring 'Null Leaf' double black");

	this.cmd("CreateCircle", treeNodeID, "NULL\nLEAF",  tree.x, tree.y);
	this.cmd("SetForegroundColor", treeNodeID, FOREGROUND_BLACK);
	this.cmd("SetBackgroundColor", treeNodeID, BACKGROUND_DOUBLE_BLACK);
	nullLeaf = new RedBlackNode("NULL\nLEAF", treeNodeID, tree.x, tree.x);
	nullLeaf.blackLevel = 2;
	nullLeaf.parent = tree;
	nullLeaf.phantomLeaf = true;
	tree.left = nullLeaf;
	this.cmd("Connect", tree.graphicID, nullLeaf.graphicID, LINK_COLOR);

	this.resizeTree();
	this.fixExtraBlackChild(tree, true);
	this.cmd("SetLayer", nullLeaf.graphicID, 1);
	nullLeaf.blackLevel = 1;
	this.fixNodeColor(nullLeaf);
}


RedBlack.prototype.fixRightNull = function(tree)
{
	var treeNodeID = this.nextIndex++;
	var nullLeaf;
	this.cmd("SetText", 0, "Coloring 'Null Leaf' double black");

	this.cmd("CreateCircle", treeNodeID, "NULL\nLEAF",  tree.x, tree.y);
	this.cmd("SetForegroundColor", treeNodeID, FOREGROUND_BLACK);
	this.cmd("SetBackgroundColor", treeNodeID, BACKGROUND_DOUBLE_BLACK);
	nullLeaf = new RedBlackNode("NULL\nLEAF", treeNodeID, tree.x, tree.x);
	nullLeaf.parent = tree;
	nullLeaf.phantomLeaf = true;
	nullLeaf.blackLevel = 2;
	tree.right = nullLeaf;
	this.cmd("Connect", tree.graphicID, nullLeaf.graphicID, LINK_COLOR);

	this.resizeTree();

	this.fixExtraBlackChild(tree, false);

	this.cmd("SetLayer", nullLeaf.graphicID, 1);
	nullLeaf.blackLevel = 1;
	this.fixNodeColor(nullLeaf);

}

RedBlack.prototype.fixExtraBlackChild = function(parNode, isLeftChild)
{
	var sibling;
	var doubleBlackNode;
	if (isLeftChild)
	{
		sibling = parNode.right;
		doubleBlackNode = parNode.left;
	}
	else
	{
		sibling = parNode.left;
		doubleBlackNode = parNode.right;
	}
	if (this.blackLevel(sibling) > 0 && this.blackLevel(sibling.left) > 0 && this.blackLevel(sibling.right) > 0)
	{
		this.cmd("SetText", 0, "Double black node has black sibling and 2 black nephews.  Push up black level");
		this.cmd("Step");
		sibling.blackLevel = 0;
		this.fixNodeColor(sibling);
		if (doubleBlackNode != null)
		{
			doubleBlackNode.blackLevel = 1;
			this.fixNodeColor(doubleBlackNode);

		}
		if (parNode.blackLevel == 0)
		{
			parNode.blackLevel = 1;
			this.fixNodeColor(parNode);
		}
		else
		{
			parNode.blackLevel = 2;
			this.fixNodeColor(parNode);
			this.cmd("SetText", 0, "Pushing up black level created another double black node.  Repeating ...");
			this.cmd("Step");
			this.fixExtraBlack(parNode);
		}
	}
	else if (this.blackLevel(sibling) == 0)
	{
		this.cmd("SetText", 0, "Double black node has red sibling.  Rotate tree to make sibling black ...");
		this.cmd("Step");
		if (isLeftChild)
		{
			var newPar = this.singleRotateLeft(parNode);
			newPar.blackLevel = 1;
			this.fixNodeColor(newPar);
			newPar.left.blackLevel = 0;
			this.fixNodeColor(newPar.left);
			this.cmd("Step"); // TODO:  REMOVE
			this.fixExtraBlack(newPar.left.left);

		}
		else
		{
			newPar  = this.singleRotateRight(parNode);
			newPar.blackLevel = 1;
			this.fixNodeColor(newPar);
			newPar.right.blackLevel = 0;
			this.fixNodeColor(newPar.right);
			this.cmd("Step"); // TODO:  REMOVE

			this.fixExtraBlack(newPar.right.right);
		}
	}
	else if (isLeftChild && this.blackLevel(sibling.right) > 0)
	{
		this.cmd("SetText", 0, "Double black node has black sibling, but double black node is a left child, \nand the right nephew is black.  Rotate tree to make opposite nephew red ...");
		this.cmd("Step");

		var newSib = this.singleRotateRight(sibling);
		newSib.blackLevel = 1;
		this.fixNodeColor(newSib);
		newSib.right.blackLevel = 0;
		this.fixNodeColor(newSib.right);
		this.cmd("Step");
		this.fixExtraBlackChild(parNode, isLeftChild);
	}
	else if (!isLeftChild && this.blackLevel(sibling.left) > 0)
	{
		this.cmd("SetText", 0, "Double black node has black sibling, but double black node is a right child, \nand the left nephew is black.  Rotate tree to make opposite nephew red ...");
		this.cmd("Step");
		newSib = this.singleRotateLeft(sibling);
		newSib.blackLevel = 1;
		this.fixNodeColor(newSib);
		newSib.left.blackLevel = 0;
		this.fixNodeColor(newSib.left);
		this.cmd("Step");
		this.fixExtraBlackChild(parNode, isLeftChild);
	}
	else if (isLeftChild)
	{
		this.cmd("SetText", 0, "Double black node has black sibling, is a left child, and its right nephew is red.\nOne rotation can fix double-blackness.");
		this.cmd("Step");

		var oldParBlackLevel  = parNode.blackLevel;
		newPar = this.singleRotateLeft(parNode);
		if (oldParBlackLevel == 0)
		{
			newPar.blackLevel = 0;
			this.fixNodeColor(newPar);
			newPar.left.blackLevel = 1;
			this.fixNodeColor(newPar.left);
		}
		newPar.right.blackLevel = 1;
		this.fixNodeColor(newPar.right);
		if (newPar.left.left != null)
		{
			newPar.left.left.blackLevel = 1;
			this.fixNodeColor(newPar.left.left);
		}
	}
	else
	{
		this.cmd("SetText", 0, "Double black node has black sibling, is a right child, and its left nephew is red.\nOne rotation can fix double-blackness.");
		this.cmd("Step");

		oldParBlackLevel  = parNode.blackLevel;
		newPar = this.singleRotateRight(parNode);
		if (oldParBlackLevel == 0)
		{
			newPar.blackLevel = 0;
			this.fixNodeColor(newPar);
			newPar.right.blackLevel = 1;
			this.fixNodeColor(newPar.right);
		}
		newPar.left.blackLevel = 1;
		this.fixNodeColor(newPar.left);
		if (newPar.right.right != null)
		{
			newPar.right.right.blackLevel = 1;
			this.fixNodeColor(newPar.right.right);
		}
	}
}

RedBlack.prototype.fixExtraBlack = function(tree)
{
	if (tree.blackLevel > 1)
	{
		if (tree.parent == null)
		{
			this.cmd("SetText", 0, "Double black node is root.  Make it single black.");
			this.cmd("Step");

			tree.blackLevel = 1;
			this.cmd("SetBackgroundColor", tree.graphicID, BACKGROUND_BLACK);
		}
		else if (tree.parent.left == tree)
		{
			this.fixExtraBlackChild(tree.parent, true);
		}
		else
		{
			this.fixExtraBlackChild(tree.parent, false);
		}

	}
	else
	{
	}
}

RedBlack.prototype.fixNodeColor = function(tree)
{
	if (tree.blackLevel == 0)
	{
		this.cmd("SetForegroundColor", tree.graphicID, FOREGROUND_RED);
		this.cmd("SetBackgroundColor", tree.graphicID, BACKGROUND_RED);
	}
	else
	{
		this.cmd("SetForegroundColor", tree.graphicID, FOREGROUND_BLACK);
		if (tree.blackLevel > 1)
		{
			this.cmd("SetBackgroundColor",tree.graphicID, BACKGROUND_DOUBLE_BLACK);
		}
		else
		{
			this.cmd("SetBackgroundColor",tree.graphicID, BACKGROUND_BLACK);
		}
	}
}

RedBlack.prototype.resizeTree = function()
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
		this.setNewPositions(this.treeRoot, startingPoint, startingY, 0);
		this.animateNewPositions(this.treeRoot);
		this.cmd("Step");
	}

}

RedBlack.prototype.setNewPositions = function(tree, xPosition, yPosition, side)
{
	if (tree != null)
	{
		tree.y = yPosition;
		if (side == -1)
		{
			xPosition = xPosition - tree.rightWidth;
			tree.heightLabelX = xPosition - 20;
		}
		else if (side == 1)
		{
			xPosition = xPosition + tree.leftWidth;
			tree.heightLabelX = xPosition + 20;
		}
		else
		{
			tree.heightLabelX = xPosition - 20;
		}
		tree.x = xPosition;
		tree.heightLabelY = tree.y - 20;
		this.setNewPositions(tree.left, xPosition, yPosition + heightDelta, -1)
		this.setNewPositions(tree.right, xPosition, yPosition + heightDelta, 1)
	}

}
RedBlack.prototype.animateNewPositions = function(tree)
{
	if (tree != null)
	{
		this.cmd("Move", tree.graphicID, tree.x, tree.y);
		this.animateNewPositions(tree.left);
		this.animateNewPositions(tree.right);
	}
}

RedBlack.prototype.resizeWidths = function(tree)
{
	if (tree == null)
	{
		return 0;
	}
	tree.leftWidth = Math.max(this.resizeWidths(tree.left), widthDelta / 2);
	tree.rightWidth = Math.max(this.resizeWidths(tree.right), widthDelta / 2);
	return tree.leftWidth + tree.rightWidth;
}


RedBlack.prototype.disableUI = function(event)
{
	this.insertField.disabled = true;
	this.insertButton.disabled = true;
}

RedBlack.prototype.enableUI = function(event)
{
	this.insertField.disabled = false;
	this.insertButton.disabled = false;
}

function RedBlackNode(val, id, initialX, initialY)
{
	this.data = val;
	this.x = initialX;
	this.y = initialY;
	this.blackLevel = 0;
	this.phantomLeaf = false;
	this.graphicID = id;
	this.left = null;
	this.right = null;
	this.parent = null;
	this.height = 0;
	this.leftWidth = 0;
	this.rightWidth = 0;
}

RedBlackNode.prototype.isLeftChild = function()
{
	if (this.parent == null)
	{
		return true;
	}
	return this.parent.left == this;
}





var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new RedBlack(animManag, canvas.width, canvas.height);
}