var layoutInfo = {
    startTab: "none",
	showTree: true,

    treeLayout: ""//{ 0: [{layer: "pmg", position: 0}, {layer: "amg", position: 1}] , 1: [{layer: "fmg", position: 0}, {layer: "smg", position: 1}] }

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]]
})