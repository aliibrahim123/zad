//view attributes
//custom element attributes

var attrs = {
	$subInd (el) { 
		var curNode = el.$subEl ? el.$subEl : el;
		while (!curNode.$comp && !curNode.$isSub) {
			curNode = curNode.parentElement
		}
		if (curNode.$comp) return -1;
		el.$subEl = curNode;
		return [].indexOf.call(curNode.parentElement.children, curNode)
	}
};

export { attrs }