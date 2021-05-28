addLayer("q", {
    name: "secret layer", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#0f0f0f", // Can be a function that takes requirement increases into account
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
	resetsNothing(){return true},
	resource: "secrets",
    layerShown(){return (player.t.points.eq(0) && player.f.points.eq(0) && player.p.points.eq(0))},	
	shouldNotify(){return false},
	upgrades: {
    rows: 1,
    cols: 1,
    11: {

	    title: "secret boost",
        description: "Speed up early game",
        cost: new ExpantaNum(0),
    },
	},
}
)
addLayer("t", {
    name: "updates", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
	branches: ["m"],
    color: "#F72C55",
	effectDescription() {
		return ("multiplying developer efficiency by "+(!inChallenge("t",11)?(format(player.t.points.plus(1))):1))
	},
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "TMT updates", // Name of prestige currency
    baseResource: "mods", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
	    if (hasUpgrade("f",12)) mult=mult.times(100)
	    if (hasUpgrade("f",23)) mult=mult.times(player.f.points.plus(1).pow(hasChallenge("f",22)?1.2:1))
	    if (inChallenge("f",31)) mult=new ExpantaNum(0)
	    if (hasUpgrade("l",13)) mult=mult.times(1e18)
if (hasUpgrade("i",21)) mult=mult.times(player.i.points.plus(1))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: TMT update", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	passiveGeneration(){ 
		if (hasUpgrade("i",15)) return 2
		return hasMilestone("t", 5)?1:0},
    layerShown(){return true},
	upgrades: {
    rows: 1,
    cols: 2,
    11: {
	    unlocked(){return (hasUpgrade("t",11)||player.i.points.gte(1)||hasMilestone("d",2))},
	    title: "Challenges",
        description: "Unlock a challenge",
        cost: new ExpantaNum(300)
    },
12: { unlocked() {return hasMilestone("g",4)},
	    title: "2",
        description: "Layer exponent is multiplied by 1.5",
        cost: new ExpantaNum("1e107985255")
    },
	},
	challenges: {
        rows: 2,
        cols: 2,
        11: {
            name: "TMT v1.0",
	challengeDescription: "TMT updates do nothing",
		rewardDescription: "Make mods boost productivity",
		goal: new ExpantaNum(1e5),
		unlocked(){return hasUpgrade("t", 11)}
        },
		12: {
            name: "TMT v2.0",
	challengeDescription: "Point gain is gapplecapped at 1e90",
		rewardDescription: "Boost seconds by log(seconds)",
		goal: new ExpantaNum(2e91),
		unlocked(){return hasChallenge("i", 11)}
        },
		21: {
            name: "TMT v2.2",
	challengeDescription: "You cannot gain mods",
		rewardDescription: "Unlock a new upgrade",
		goal: new ExpantaNum("1e16684046"),
		unlocked(){return hasChallenge("f", 22)}
        },
		

    },
	milestones: {
    1: {
        requirementDescription: "1 TMT update",
        effectDescription: "Keep right column of mod upgrades on row 2 resets",
        done() { return player.t.points.gte(1) }
    },
	2: {
        requirementDescription: "2 TMT updates",
        effectDescription: "Keep left column of mod upgrades on row 2 resets",
        done() { return player.t.points.gte(2) }
	},
	3: {
        requirementDescription: "3 TMT updates",
        effectDescription: "Keep first 4 columns of mod upgrades on row 2 resets",
        done() { return player.t.points.gte(3) }
    },
	4:{
        requirementDescription: "5 TMT updates",
        effectDescription: "unlock a new layer",
        done() { return player.t.points.gte(5) }
	},
		5:{
	unlocked(){return hasMilestone("t",4)},
	requirementDescription: "20 TMT updates",
        effectDescription: "Gain 100% of TMT updates per second",
        done() { return player.t.points.gte(20) }
	},
},
doReset(resettingLayer){if (layers[resettingLayer].row > this.row) {
		player.t.points=new ExpantaNum(0); 
	let keep=[]
	
	if (hasMilestone("f",3)){keep.push("milestones");keep.push("challenges");keep.push("upgrades");}
	layerDataReset(this.layer, keep)
		
	}}	
	
}
)
addLayer("d", {
    name: "despacit mods", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
	branches: ["t","m"],
    color: "#48ba81",
	effectDescription() {
		return ("multiplying mod gain by "+(format(player.d.points.plus(1).pow(0.5).times(ExpantaNum.pow(1e100,getBuyableAmount("d", 11))))))
	},
    requires: new ExpantaNum(100), // Can be a function that takes requirement increases into account
    resource: "unfinished despacit mods", // Name of prestige currency
    baseResource: "mods", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
	    if (player.i.points.gte(1)){mult=player.i.points.plus(1).log(10).plus(1)}
	    if (hasChallenge("i",11)) mult=mult.pow(2)
	    if (hasUpgrade("i",14)) mult=mult.pow(3)
	    if (player.f.points.gte(1)) mult=mult.pow(player.f.points.plus(1).pow(0.5).log10().plus(1))
	    if (hasUpgrade("i",13)) mult=mult.times(10000)
	    if (hasUpgrade("f",13)) mult=mult.times(100)
	    if (hasChallenge("f",11)) mult=mult.times(player.f.points.plus(1))
	if (hasMilestone("b",4)) mult=mult.times(player.l.points.plus(1))
	if (hasUpgrade("b",15)) mult=mult.times(player.b.points.plus(1))
	    if (inChallenge("f",12)) mult=new ExpantaNum(0)
	    if (inChallenge("f",31)) mult=new ExpantaNum(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
	passiveGeneration(){ 
		if (hasUpgrade("i",15)) return 1
		return hasMilestone("d", 2)?0.1:0},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: despacit mod reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player[this.layer].unlocked||(player.t.points.gte(5) || player.d.points.gte(1) || hasMilestone("t", 4) || player.f.points.gte(1)||hasMilestone("p",1))},	
	milestones: {
    1: {
        requirementDescription: "2 despacit mods",
        effectDescription: "Gain 100% of your mod gain per second",
        done() { return player.d.points.gte(2) }
    },
		2:{
	unlocked(){return hasMilestone("d",1)},
	requirementDescription: "10 despacit mods",
        effectDescription: "Gain 10% of despacit mods per second",
        done() { return player.d.points.gte(10) }
	}
	},
buyables: {
    rows: 1,
    cols: 1,
    11: {
	    title: "Start another despacit mod",
        cost() { return new ExpantaNum("1e1e6").pow(getBuyableAmount(this.layer, this.id).plus(1)) },
        display() { return "You have started "+format(getBuyableAmount(this.layer, this.id))+" despacit mods, giving a x"+format(ExpantaNum.pow(1e100,getBuyableAmount(this.layer, this.id)).pow(hasUpgrade("b",12)?1.1:1))+" to unfinished despacit mod effect. Cost: "+format(ExpantaNum.pow("1e1e6",getBuyableAmount(this.layer, this.id).plus(1))) },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
	    unlocked() {return hasUpgrade("l",21)},

    },

},
	upgrades: {
    rows: 2,
    cols: 5,
    11: {
	    title: "Start a despacit mod",
        description: "Boost productivity based on despacit mods.",
        cost: new ExpantaNum(1)
    },
		12: {
	    title: "Give a boost",
        description: "Increase dev efficiency based on mods.",
        cost: new ExpantaNum(5)
    },13: {
	    title: "Hire Despacit",
        description: "Increase base second gain by 100, but reset your unfinished despacit mods",
        cost: new ExpantaNum(25),
	    onPurchase() {player.d.points=new ExpantaNum(0)}
    },
		14: {
	    title: "More Challenges",
        description: "Unlock more feature challenges",
        cost: new ExpantaNum("1e4257390"),
			unlocked(){return hasChallenge("t",21)},
    },
		15: {
	    title: "Features!",
        description: "Square feature gain",
        cost: new ExpantaNum("1e4588525"),
			unlocked(){return hasUpgrade("d",14)},
    },
21: { unlocked() {return hasMilestone("g",4)},
	    title: "7",
        description: "Raise point gain to the 1.001 after all other buffs",
        cost: new ExpantaNum("1e120886670")
    },
	},
	doReset(resettingLayer){if (layers[resettingLayer].row > this.row) {
		player.d.points=new ExpantaNum(0)
	if (!hasMilestone("f",2)) {player.d.upgrades=[]; player.d.milestones=[];player.d.buyables["11"]=new ExpantaNum(0)}
		
	}}
}
)
addLayer("m", {
    name: "mods", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
	passiveGeneration(){ return hasMilestone("d", 1)?1:0},
    color: "#4BDC13",
    requires: new ExpantaNum(600), // Can be a function that takes requirement increases into account
    resource: "mods", // Name of prestige currency
    baseResource: "seconds", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
	mult = mult.times(player.d.points.plus(1).pow(0.5).times(ExpantaNum.pow(1e100,getBuyableAmount("d", 11))).pow(hasUpgrade("b",12)?1.1:1))
	if (hasUpgrade("f",11)) mult=mult.times(100)
	   if (hasUpgrade("f",22)) mult=mult.times(player.f.points.plus(1).pow(hasChallenge("f",22)?1.2:1))
	    if (inChallenge("t",21)) mult=new ExpantaNum(0)
	    if (inChallenge("f",31)) mult=new ExpantaNum(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: mod reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
upgrades: {
    11: {
	    title: "dudcat0507",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	12: {
	    title: "thepaperpilot",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	13: {
	    title: "gapples2",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	21: {
	    title: "pg132",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	22: {
	    title: "holy broly",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	23: {
	    title: "dystopia",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	31: {
	    title: "denisolenison",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	32: {
	    title: "unpingabot",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	33: {
	    title: "emipiplu",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	41: {
	    title: "epicness1582",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	42: {
	    title: "cubedey",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	43: {
	    title: "earth",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	14: {
	    title: "mvbit",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	24: {
	    title: "jacorb",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	34: {
	    title: "pimgd",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	44: {
	    title: "The Modding Tree",
        description: "Give a 2x boost to everyone",
        cost: new ExpantaNum(3)
    },
	51: {
	    title: "vorona",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	52: {
	    title: "harryw!2",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	53: {
	    title: "thefinaluptake",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	54: {
	    title: "Boost",
        description: "Multiply each creator by the number of mods they have",
        cost: new ExpantaNum(3)
    },
	15: {unlocked(){return hasUpgrade("i",11)},
	    title: "luenix",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },25: {unlocked(){return hasUpgrade("i",11)},
	    title: "unpogged",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	35: {unlocked(){return hasUpgrade("i",11)},
	    title: "smiley",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	45: {unlocked(){return hasUpgrade("i",11)},
	    title: "okamii",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	55: {unlocked(){return hasUpgrade("i",11)},
	    title: "The Doubler",
        description: "Double point gain",
        cost: new ExpantaNum(1e18)
    },
	61: {unlocked(){return hasUpgrade("l",21)},
	    title: "five hargreeves",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	62: {unlocked(){return hasUpgrade("l",21)},
	    title: "microwave pizza",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	63: {unlocked(){return hasUpgrade("l",21)},
	    title: "frozendude101",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	64: {unlocked(){return hasUpgrade("l",21)},
	    title: "green jacorb",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	65: {unlocked(){return hasUpgrade("l",21)},
	    title: "themkeyholder",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	71: {unlocked(){return hasUpgrade("p",11)},
	    title: "monkeh42",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	72: {unlocked(){return hasUpgrade("p",11)},
	    title: "ColeLukes",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	73: {unlocked(){return hasUpgrade("p",11)},
	    title: "randomtuba",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	74: {unlocked(){return hasUpgrade("p",11)},
	    title: "Yhvr",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	75: {unlocked(){return hasUpgrade("p",11)},
	    title: "spotky",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	81: {unlocked(){return hasUpgrade("p",11)},
	    title: "loader3229",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	82: {unlocked(){return hasUpgrade("p",11)},
	    title: "\sum_{n=1}^{+\infty}n = -1/12",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	83: {unlocked(){return hasUpgrade("p",11)},
	    title: "Escapee",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	84: {unlocked(){return hasUpgrade("p",11)},
	    title: "User_2.005e220",
        description: "Hire someone to make more mods",
        cost: new ExpantaNum(1)
    },
	
},

	doReset(resettingLayer) {
		
		if (layers[resettingLayer].row > this.row) {
			player.q.upgrades=[]
			if (hasUpgrade("l",21)) player.m.upgrades=player.m.upgrades
			else if (hasMilestone("f",1))player.m.upgrades=[11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54,15,25,35,45,55]
			else if (hasMilestone("t",3)){
				if (hasUpgrade("i",12)) {
					if (hasUpgrade("m", 55)) player.m.upgrades=[11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54,15,25,35,45,55]
					else player.m.upgrades=[11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54,15,25,35,45]
							}
				else player.m.upgrades=[11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54]}
			else if (hasMilestone("t",2)){player.m.upgrades=[11,14,21,24,31,34,41,44,51,54]}
			else if (hasMilestone("t", 1)){
				player.m.upgrades = [14,24,34,44,54]
			} else {player.m.upgrades = []}
			player.m.points = new ExpantaNum(0)
		}
		
	}
}
)
addLayer("i", {
    name: "ideas", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
	branches: ["d","m"],
    color: "#708263",
	canBuyMax(){return hasMilestone("f",1)},
	autoPrestige(){return hasMilestone("f",5)},
	effectDescription() {
		let eff = player.i.points.plus(1).log(10).plus(1)
		if (hasChallenge("i",11)) eff=eff.pow(2)
		if (hasUpgrade("i",14)) eff=eff.pow(3)
		if (player.f.points.gte(1)) eff=eff.pow(player.f.points.plus(1).pow(0.5).log10().plus(1).plus(hasUpgrade("f",31)?player.g.points:0))
		if (hasChallenge("f",11)) eff=eff.times(player.f.points.plus(1))
		if (hasMilestone("b",4)) eff=eff.times(player.l.points.plus(1))
if (hasUpgrade("b",11)) eff=eff.times(player.l.points.plus(1))
		if (inChallenge("i",11)) eff=new ExpantaNum(0)
		return ("increasing despacit mod gain by "+(format(eff))+"x")
	},
    requires: new ExpantaNum(1e5), // Can be a function that takes requirement increases into account
    resource: "ideas", // Name of prestige currency
    baseResource: "mods", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
base: 10,
    exponent: 1.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
	    if (inChallenge("f",31)) mult=new ExpantaNum(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	    let exp = new ExpantaNum(1)
	    if (inChallenge("f",21)) exp=exp.times(0.5)
	    if (hasChallenge("f",21)) exp=exp.times(2)
	    if (hasUpgrade("l",14)) exp=exp.times(1.01)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "i", description: "I: idea reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	resetsNothing(){return hasMilestone("f",5)},
    layerShown(){return player[this.layer].unlocked||(player.m.points.gte(1e5) || player.i.points.gte(1)|| player.f.points.gte(1)||hasUpgrade("i",11) || hasChallenge("t",11)||hasMilestone("p",1))},	
	challenges: {
        rows: 1,
        cols: 1,
        11: {
            name: "Lack of ideas",
	challengeDescription: "Ideas don't work",
		rewardDescription: "Square idea effect",
		goal: new ExpantaNum(1e90),
		unlocked(){return (hasChallenge("i", 11)||player.i.points.gte(12))}
        }

    },
upgrades: {
    rows: 2,
    cols: 5,
    11: {
	    title: "More mod creators!",
        description: "Unlock more mod upgrades",
        cost: new ExpantaNum(3)
    },
	12: {
	    title: "Second boost",
        description: "Boost Boost based on mod upgrades, and keep 5th column upgrades on reset",
        cost: new ExpantaNum(6)
    },
	13: {
	    title: "Unfinished",
        description: "Multiply unfinished despacit mod gain by 1e4",
        cost: new ExpantaNum(9)
    },
	14: {
	    title: "3-dimensional Tree",
        description: "Cube idea effect",
        cost: new ExpantaNum(13)
    },
	15: {
	    title: "100 Percent Done",
        description: "Gain 100% of despacit mod and TMT update gain per second",
        cost: new ExpantaNum(15)
    },
21: { unlocked() {return hasMilestone("g",4)},
	    title: "1",
        description: "Multiply TMT update gain by ideas",
        cost: new ExpantaNum(555968)
    },
},
	doReset(resettingLayer){if (layers[resettingLayer].row > this.row) {
		player.i.points=new ExpantaNum(layers[resettingLayer].row==3?0:2); 
		if (!hasMilestone("f",4)){player.i.upgrades=[];player.i.challenges=[]}
		
	}}	
}
)
addLayer("f", {
    name: "features", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
	branches: ["d"],
    color: "#a4a409",
	resetsNothing(){return hasChallenge("f",31)},
	passiveGeneration(){ 
		if (hasChallenge("f",12)) return 1
		else return 0},
    requires: new ExpantaNum("1e28"), // Can be a function that takes requirement increases into account
    resource: "features", // Name of prestige currency
    baseResource: "unfinished despacit mods", // Name of resource prestige is based on
	effectDescription(){return "raising idea effect to the power of "+format(player.f.points.plus(1).pow(0.5).log10().plus(1).plus(hasUpgrade("f",31)?player.g.points:0))},
    baseAmount() {return player.d.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.05, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(2)
	   if (hasUpgrade("l",11)) mult=mult.times(10)
	   if (hasUpgrade("l",12)) mult=mult.times(10)
if (hasMilestone("b",2)) mult=mult.times(player.b.points.plus(1))
if (hasUpgrade("b",11))mult=mult.times(player.b.points.plus(1))
if (hasUpgrade("l",23)) mult=mult.times(ExpantaNum.pow(10,player.l.points))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	    let e = new ExpantaNum(1)
	    if (hasUpgrade("d",15)) e=e.times(2)
if (hasMilestone("b",3)) e=e.times(1.00001)
if (hasUpgrade("b",11))e=e.times(1.00001)
        return e
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: feature reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player[this.layer].unlocked||(player.points.gte(1e90) || player.f.points.gte(1) || hasChallenge("i",11) || hasMilestone("f",1)||hasMilestone("p",1))},	
	milestones: {
    1: {
        requirementDescription: "1 feature",
        effectDescription: "Keep mod upgrades on feature resets and you can buy max ideas",
        done() { return player.f.points.gte(1) }
    },
		2: {
        requirementDescription: "2 features",
        effectDescription: "Keep despacit upgrades and milestones on feature resets, and you start with 2 ideas on reset",
        done() { return player.f.points.gte(2) }
    },
		3: {
        requirementDescription: "3 features",
        effectDescription: "Keep TMT milestones and challenges on feature reset",
        done() { return player.f.points.gte(3) }
    },
		4: {
        requirementDescription: "4 features",
        effectDescription: "Keep idea upgrades and challenges on feature reset",
        done() { return player.f.points.gte(4) }
    },
		5: {
        requirementDescription: "5 features",
        effectDescription: "Automatically gain ideas and ideas reset nothing",
        done() { return player.f.points.gte(5) }
    },
	},
	upgrades: {
    rows: 3,
    cols: 3,
    11: {
	    title: "Layers",
        description: "Multiply mod gain by 100",
        cost: new ExpantaNum(5),
	    unlocked() {return hasMilestone("f",5)}
    },
		12: {
	    title: "Upgrades",
        description: "Multiply TMT update gain by 100",
        cost: new ExpantaNum(10),
	    unlocked() {return hasUpgrade("f",11)}
    },
		13: {
	    title: "Milestones",
        description: "Multiply unfinished despacit mod gain by 100",
        cost: new ExpantaNum(12),
	    unlocked() {return hasUpgrade("f",12)}
    },
		21: {
	    title: "Balancing",
        description: "Raise point gain to the 1.2",
        cost: new ExpantaNum(15),
	    unlocked() {return hasUpgrade("f",13)}
    },
		22: {
	    title: "Buyables",
        description: "Features boost mod gain",
        cost: new ExpantaNum("1e171631"),
	    unlocked() {return hasUpgrade("f",21)}
    },
		23: {
	    title: "Challenges",
        description: "Features boost TMT updates, and unlock a challenge",
        cost: new ExpantaNum("5e174641"),
	    unlocked() {return hasUpgrade("f",22)}
    },
	31: { unlocked() {return hasMilestone("g",4)},
	    title: "4",
        description: "Game designers add to the feature effect",
        cost: new ExpantaNum("1e11138430")
    },
},
	challenges: {
        rows: 3,
        cols: 2,
        11: {
            name: "Components",
	challengeDescription: "Square root point gain",
		rewardDescription: "Features boost idea effect",
		goal: new ExpantaNum("1e1874740"),
		unlocked(){return hasUpgrade("f", 23)}
        },
		12: {
            name: "Complete",
	challengeDescription: "Enter an alternate reality where despacit actually finishes all his mods",
		rewardDescription: "Gain 100% of features per second",
		goal: new ExpantaNum("1e23825100"),
		unlocked(){return hasChallenge("f", 11)}
        },
		21: {
            name: "Scaling",
	challengeDescription: "Ideas scale faster",
		rewardDescription: "Double idea gain exponent",
		goal: new ExpantaNum("2e27504200"),
		unlocked(){return hasChallenge("f", 12)}
        },
		22: {
            name: "Softcaps",
	challengeDescription: "Point gain above 1e300,000,000 is raised to the 0.5 (Yes, it does nothing. This is intended.)",
		rewardDescription: "Raise second row upgrades to the 1.2, and update TMT to v2.2 (unlocks a new challenge)",
		goal: new ExpantaNum("1e28666860"),
		unlocked(){return hasChallenge("f", 21)}
        },
		31: {
            name: "Utils",
	challengeDescription: "You can't gain any row 1 or 2 resources, but features boost point gain",
		rewardDescription: "Increase Balancing effect to ^1.3 and features reset nothing",
		goal: new ExpantaNum("1e212875"),
		unlocked(){return (hasUpgrade("d", 14)&&hasChallenge("f",22))}
        },

    },
	doReset(resettingLayer){return},
}
)

addLayer("l", {
    name: "layers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
	branches: ["d","f"],
    color: "#4397c4",
	effectDescription(){return "raising point gain to the "+format(player.l.points.plus(9).log10().sub(1).div(90).times(player.l.points).pow(3).plus(1).max(1).min(2))+(player.l.points.plus(9).log10().sub(1).div(90).times(player.l.points).pow(3).plus(1).max(1).min(2).eq(2)?" (hardcapped)":"")},
    requires: new ExpantaNum("1e50000000"), // Can be a function that takes requirement increases into account
    resource: "layers", // Name of prestige currency
    baseResource: "seconds", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
		canBuyMax(){return hasMilestone("l",3)},
	autoPrestige(){return hasMilestone("l",1)},
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 4, // Prestige currency exponent
	base: 10,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	    let e = new ExpantaNum(1)
	   // if (hasUpgrade("l",12)) e=e.times(5071.03)
if (hasUpgrade("t",12)) e=e.times(1.5)
        return e
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "l", description: "L: layer reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player[this.layer].unlocked||(hasChallenge("f",31) || player.l.points.gte(1) || hasMilestone("l",1)||hasMilestone("p",1))},	
	milestones: {
    1: {
        requirementDescription: "1 layer",
        effectDescription: "Automate layers",
        done() { return player.l.points.gte(1) }
    },
		2: {
        requirementDescription: "2 layers",
        effectDescription: "Layers don't reset anything",
        done() { return player.l.points.gte(2) }
    },
		3: {
        requirementDescription: "3 layers",
        effectDescription: "You can buy max layers",
        done() { return player.l.points.gte(3) }
    },
	},
	upgrades: {
    rows: 2,
    cols: 4,
		11: {
	    title: "More features",
        description: "Gain 10x as many features",
        cost: new ExpantaNum(3)
    },
		12: {
	    title: "Even More features",
        description: "Gain 10x as many features",
        cost: new ExpantaNum(4)
    },
		13: {
	    title: "Too Many features",
        description: "Update TMT 1e18x more frequently",
        cost: new ExpantaNum(5)
    },
		14: {
	    title: "Fall asleep",
        description: "Gain a few more ideas",
        cost: new ExpantaNum(6)
    },
		21: {
	    title: "Don't Finish them",
        description: "Unlock a D buyable and 5 more mod creators",
        cost: new ExpantaNum(10)
    },
		22: {
	    title: "More Layers",
        description: "Unlock 2 layers",
        cost: new ExpantaNum(223)
    },
23: { unlocked() {return hasMilestone("g",4)},
	    title: "3",
        description: "Layers increase feature gain",
        cost: new ExpantaNum(256)
    },
	},
	resetsNothing(){return hasMilestone("l",2)},
  doReset(resettingLayer){return},
}
)
addLayer("b", {
    name: "Balancing", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
	branches: ["d","l"],
    color: "#1a27c8",
	requires: new ExpantaNum("1e2.5e9"), // Can be a function that takes requirement increases into account
    resource: "balance updates", // Name of prestige currency
    baseResource: "seconds", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.0001, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	    let e = new ExpantaNum(1)
if (hasUpgrade("b",13)) e=e.times(player.g.points.plus(hasUpgrade("b",14)?(hasUpgrade("g",11)?player.g.points.plus(3):3):2).log10().plus(1).log10().plus(1))
        return e
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: balance update", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player[this.layer].unlocked||(hasUpgrade("l",22)||hasMilestone("p",1))},	
milestones: {
    1: {
        requirementDescription: "Getting into a new prestige layer should speed up the game from the start.",
        effectDescription: "Multiply points by 1e100",
        done() { return player.b.points.gte(1) }
    },
	    2: {
        requirementDescription: "There should usually be something, either an inherent effect or early upgrade, that scales based on the amount of prestige currency",
        effectDescription: "Balance updates multiply feature gain",
        done() { return player.b.points.gte(2) }
    },
  3: {
        requirementDescription: "Exponents are very weak when the value that they are boosting is low",
        effectDescription: "Raise feature gain to the 1.00001",
        done() { return player.b.points.gte(3) }
    },
  4: {
        requirementDescription: "Be careful with upgrades that multiply the effects of things",
        effectDescription: "Multiply idea effect by layers",
        done() { return player.b.points.gte(4) }
    },
	},
passiveGeneration(){return hasMilestone("g",2)?1:0},
	upgrades: {
    rows: 1,
    cols: 5,
		11: {
	    title: "Rebalance the game",
        description: "Square all B milestone effects",
        cost: new ExpantaNum(30)
    },
12: {
	    title: "Anti-balancing",
        description: "Despacit mod buyables are 10% more effective",
        cost: new ExpantaNum(666)
    },
13: {
	    title: "Players",
        description: "Game designers help you make balance updates",
        cost: new ExpantaNum("1e39670")
    },
14: {
	    title: "QoL",
        description: "Buff the left upgrade",
        cost: new ExpantaNum("1e49379")
    },
15: { unlocked() {return hasMilestone("g",4)},
	    title: "6",
        description: "Balance updates multiply despacit mod gain",
        cost: new ExpantaNum("1e54000")
    },
	},
  doReset(resettingLayer){return},
}
)
addLayer("g", {
    name: "Design", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
total: new ExpantaNum(0),
    }},
autoPrestige(){return hasMilestone("g",3)},
resetsNothing() {return hasMilestone("g",3)},
	branches: ["d","b"],
    color: "#49a23a",
	requires: new ExpantaNum("505977"), // Can be a function that takes requirement increases into account
    resource: "game designers", // Name of prestige currency
    baseResource: "ideas", // Name of resource prestige is based on
    baseAmount() {return player.i.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
base: 1.0975,
    exponent: 0.0092, // Prestige currency exponent
canBuyMax(){return hasMilestone("g",2)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	    let e = new ExpantaNum(1)
        return e
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: game designer reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player[this.layer].unlocked||(hasUpgrade("l",22)||hasMilestone("p",1))},	
	milestones: {
    1: {
        requirementDescription: "It’s usually best to base milestones on total currency instead of current currency",
        effectDescription: "G milestones are based on total currency",
        done() { return player.g.total.gte(1) }
    },
	    2: {
        requirementDescription: "Unlock buying max for static layers early on if you need to spend the currency on things",
        effectDescription: "You can buy max game designers and gain 100% of balance updates per second",
        done() { return player.g.total.gte(2) }
    },
  3: {
        requirementDescription: "Use “resets nothing” and auto-prestige for automating static layers",
        effectDescription: "Game designers reset nothing and auto prestige",
        done() { return player.g.total.gte(3) }
    },
  4: {
        requirementDescription: "Upgrades that scale based on the currency that you spend to buy it should still give a bonus at 0",
        effectDescription: "Unlock an upgrade in every layer except mods",
        done() { return player.g.total.gte(4) }
    },
	},
upgrades:{
rows: 1,
cols: 1,
11: { unlocked() {return hasMilestone("g",4)},
	    title: "5",
        description: "Game designers improve QoL",
        cost: new ExpantaNum("5")
    },},
  doReset(resettingLayer){return},
}
)
addLayer("p", {
    name: "Points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
	branches: ["d"],
    color: "#ffffff",
	requires(){
//if (player.c.points.gte(1)) return new ExpantaNum("10^^3")
return new ExpantaNum("1e3000000000")}, // Can be a function that takes requirement increases into account
    resource: "Points", // Name of prestige currency
    baseResource: "seconds", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
getResetGain(){return new ExpantaNum(1)},
getNextAt(){return new ExpantaNum("1e3000000000")},
canReset() {return !hasMilestone("p",1)&&player.points.gte(layers.p.requires())},
prestigeButtonText() {return (!hasMilestone("p",1)?("Gain 1 point. Requires: "+format(layers.p.requires())):"")},
effectDescription() {return "tetrating your second gain by ^^"+format(player.p.points.plus(1))},
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	    let e = new ExpantaNum(1)
        return e
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: point reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player[this.layer].unlocked||(player.points.gte("1e3000000000")||hasMilestone("p",1))},	
	milestones: {
    1: {
        requirementDescription: "1 Point",
        effectDescription: "Tetrate seconds by points+1 and keep row 3 milestones and upgrades",
        done() { return player.p.points.gte(1) }
    },
    2: {
        requirementDescription: "1.79e308 Points",
        effectDescription: "Always have all point milestones and unlock Channels.",
        done() { return player.p.points.gte(1.79e308) }
    },

	},
resetsNothing() {return true},
update(diff){
  if(hasMilestone("c",1))return
let gain = new ExpantaNum(0)
if (hasUpgrade("p",11)) gain=new ExpantaNum(1)
if (hasUpgrade("p",12)) gain=new ExpantaNum(10)
if (hasUpgrade("p",13)) gain=gain.times(player.p.points.plus(1).log10().pow(2))
if (hasUpgrade("p",21)) gain=gain.pow(4)
if (hasUpgrade("p",22)) gain=gain.pow(9)
if (hasUpgrade("p",23)) {gain=player.p.points.times(player.p.points.plus(1).log10().plus(1).log10())}
player.p.points=player.p.points.add(gain.times(diff)).min(Number.MAX_VALUE)
if (hasUpgrade("p",23)&&!hasMilestone("c",1)) {player.p.points=player.p.points.min(Number.MAX_VALUE)}
},
upgrades:{
rows: 2,
cols: 3,
11: { unlocked() {return hasMilestone("p",1)},
	    title: "You",
        description: "Gain 1 Point per second and unlock 9 more mod creators",
        cost: new ExpantaNum("1")
    },
12: { unlocked() {return hasUpgrade("p",11)&&!hasMilestone("c",1)},
	    title: "Have",
        description: "Gain 9 more Points per second",
        cost: new ExpantaNum("10")
    },
13: { unlocked() {return hasUpgrade("p",12)&&!hasMilestone("c",1)},
	    title: "Completed",
        description: "Multiply Point gain by log(Points)^2",
        cost: new ExpantaNum("300")
    },
21: { unlocked() {return hasUpgrade("p",13)&&!hasMilestone("c",1)},
	    title: "Modding",
        description: "Raise Point gain to the 4",
        cost: new ExpantaNum("2000")
    },
22: { unlocked() {return hasUpgrade("p",21)&&!hasMilestone("c",1)},
	    title: "Tree",
        description: "Raise point gain to the number of layers unlocked",
        cost: new ExpantaNum("1e14")
    },
23: { unlocked() {return hasUpgrade("p",22)&&!hasMilestone("c",1)},
	    title: "Tree",
        description: "Points x10 every second but are hardcapped at 1.79e308",
        cost: new ExpantaNum("3e203")
    },
},
  doReset(resettingLayer){
  if (layers[resettingLayer].row > this.row) {
  let keep = []
  keep.push("milestones")
    layerDataReset(this.layer,keep)
  }
  },
tabFormat: [
    "main-display",
    "blank",
    ["prestige-button", "", function (){ return hasMilestone("p",1) ? {'display': 'none'} : {}}],
    "blank",
    "milestones",
    "blank",

    "upgrades"
]
})
addLayer("c", {
    name: "Channels", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
	branches: ["p"],
    color: "#9576ff",
	requires(){
if (player.c.unlocked) return new ExpantaNum("10")
return new ExpantaNum(Number.MAX_VALUE)}, // Can be a function that takes requirement increases into account
    resource: "Channels", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
      if(hasUpgrade("c",13))mult=mult.mul(3)
      if(hasUpgrade("c",21))mult=mult.mul(3)
      if(hasUpgrade("me",13))mult=mult.mul(upgradeEffect("me",13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	    let e = new ExpantaNum(1)
        return e
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: channel reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player[this.layer].unlocked||(hasMilestone("p",2))},	
	milestones: {
    1: {
        requirementDescription: "1 Channel",
        effectDescription: "Remove the last 5 point upgrades, but remove the point hardcap and always have this milestone",
        done() { return player.c.points.gte(1) }
    },
	},
update(diff){// Points gain
if(hasMilestone("c",1)&&!hasUpgrade("p",11)){player.p.upgrades=[11]}
if(hasMilestone("c",1)){
  let gain = EN(1)
  if(hasUpgrade("c",11))gain=gain.mul(upgradeEffect("c",11))
  if(hasUpgrade("c",12))gain=gain.mul(upgradeEffect("c",12))
  if(hasUpgrade("c",14))gain=gain.mul(20.21)
  if(hasUpgrade("c",22))gain=gain.mul(2)
  if(hasUpgrade("me",12))gain=gain.mul(upgradeEffect("me",12))
  if(hasUpgrade("me",22))gain=gain.pow(1.2)
  player.p.points=player.p.points.add(gain.mul(diff))
  
}
},
upgrades:{
11:{
  title:"This isn't the end",
  description(){return "Point gain is boosted by your Channels. Currently: x"+format(this.effect())},
  effect(){return player.c.points.plus(2).pow(1/3)},
  cost: new ExpantaNum(1),
  unlocked(){return true},
},
  12:{
  title:"Begin II",
  description(){return "Point gain is boosted by your Points. Currently: x"+format(this.effect())},
  effect(){return player.p.points.plus(10).ln().pow(hasUpgrade(this.layer,23)?hasUpgrade(this.layer,31)?27:3:1)},
  cost: new ExpantaNum(2),
  unlocked(){return hasUpgrade(this.layer,11)},
},
  13:{
  title:"Now",
  description(){return "Triple Channel gain."},
  cost: new ExpantaNum(5),
  unlocked(){return hasUpgrade(this.layer,12)},
},
  14:{
  title:"2021",
  description(){return "Point gain x20.21"},
  cost: new ExpantaNum(20),
  unlocked(){return hasUpgrade(this.layer,13)},
},
  21:{
  title:"Channels do something",
  description(){return "Channels attract more users which create more mods which cause more channels to exist"},
  cost: new ExpantaNum(300),
  unlocked(){return hasUpgrade(this.layer,14)},
},
  22:{
  title:"Server",
  description(){return "There are enough channels for a server. Unlock members and double point gain."},
  cost: new ExpantaNum(2000),
  unlocked(){return hasUpgrade(this.layer,21)},
},
  23:{
  title:"what",
  description(){return "<b>Begin II</b> is cubed"},
  cost: new ExpantaNum(1e10),
  unlocked(){return hasUpgrade("me",23)},
},
  24:{
  title:"TMTT version > TMT version",
  description(){return "Unlock a second member buyable."},
  cost: new ExpantaNum(1e16),
  unlocked(){return hasUpgrade("c",23)},
},
  31:{
  title:"Pointy Pointy points",
  description(){return "<b>what</b> is cubed"},
  cost: new ExpantaNum(1e20),
  unlocked(){return hasUpgrade("c",24)},
},
},
  passiveGeneration(){return hasMilestone("me",1)},
  doReset(resettingLayer){
  if (layers[resettingLayer].row > this.row) {
  let keep = []
  keep.push("milestones")
    layerDataReset(this.layer,keep)
  }
  },
})

addLayer("me", {
    name: "Members", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ME", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
	branches: ["p"],
    color: "#ff9682",
	requires(){
let r= new ExpantaNum(1e5)
if(hasUpgrade("me",21))r=r.div(upgradeEffect("me",21))
  return r}, // Can be a function that takes requirement increases into account
    resource: "Members", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
      if(hasUpgrade("me",11))mult=mult.mul(4)
      if(hasUpgrade("me",23))mult=mult.mul(buyableEffect("me",11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	    let e = new ExpantaNum(1)
      if(hasUpgrade("c",24))e=e.mul(buyableEffect("me",12))
        return e
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "M", description: "Shift+M: member reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player[this.layer].unlocked||(hasUpgrade("c",22))},	
update(diff){
},
upgrades:{
11:{
  title:"Create a server",
  description(){return "Your new server gains members, which quadruples member gain."},
  cost: new ExpantaNum(1),
  unlocked(){return true},
},
12:{
  title:"Nitro",
  description(){return "Members boost points. Currently: x"+format(this.effect())},
  effect(){return player.me.points.plus(2).sqrt()},
  cost: new ExpantaNum(5),
  unlocked(){return hasUpgrade("me",11)},
},
  13:{
  title:"Level 1 server boost",
  description(){return "The previous upgrade also affects channels."},
  effect(){return player.me.points.plus(2).sqrt()},
  cost: new ExpantaNum(20),
  unlocked(){return hasUpgrade("me",12)},
},
  21:{
  title:"Level 2 server boost",
  description(){return "Each upgrade halves the member requirement"},
  effect(){return EN(2).pow(player.me.upgrades.length)},
  cost: new ExpantaNum(40),
  unlocked(){return hasUpgrade("me",13)},
},
  22:{
  title:"Level 3 server boost",
  description(){return "Point gain ^1.2"},
  cost: new ExpantaNum(150),
  unlocked(){return hasUpgrade("me",13)},
},
  23:{
  title:"Locked",
  description(){return "Unlock a member buyable"},
  cost: new ExpantaNum(500),
  unlocked(){return hasUpgrade("me",13)},
},
  31:{
  title:"Roles",
  description(){return "Your server is big enough, now we can create some roles. (next update)"},
  cost: new ExpantaNum("eee100"),
  unlocked(){return hasUpgrade("c",31)},
},
},
  milestones: {
    1: {
        requirementDescription: "1e1000 members",
        effectDescription: "gain 100% of members and channels on reset per second",
        done() { return player.me.points.gte("1e1000") }
    },
    2: {
        requirementDescription: "ee20 members",
        effectDescription: "Autobuy member buyables",
        done() { return player.me.points.gte("ee20") }
    },
	},
  passiveGeneration(){return hasMilestone("me",1)},
  buyables: {
    11: {unlocked(){return hasUpgrade(this.layer,23)},
        cost() { return new ExpantaNum(10).pow(getBuyableAmount(this.layer,this.id)) },
        display() { return "Pinging everyone to let them know about an update causes "+format(this.cost())+" people to leave, but in return, you gain a x"+format(this.effect())+" multiplier to Member gain." },
      effect(){return EN(4).pow(getBuyableAmount(this.layer,this.id).pow(0.8))},
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
    },
    12: {unlocked(){return hasUpgrade("c",24)},
        cost() { return new ExpantaNum(1e9).times(EN(200).pow(getBuyableAmount(this.layer,this.id).pow(1.25))) },
        display() { return "Allow "+format(this.cost())+" people to advertise your server, which increases member gain by ^"+format(this.effect()) },
      effect(){return EN(1).add(getBuyableAmount(this.layer,this.id).pow(0.8).div(10))},
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
    },
},
  automate(){
    if(hasMilestone("me",2)){
      if(tmp.me.buyables[11].canAfford)setBuyableAmount("me",11,player.me.points.max(1).log10().floor())
      if(tmp.me.buyables[12].canAfford)setBuyableAmount("me",12,player.me.points.div(1e9).max(1).logBase(200).root(1.25).floor())
    }
  },
  doReset(resettingLayer){
  if (layers[resettingLayer].row > this.row) {
  let keep = []
  //keep.push("milestones")
    layerDataReset(this.layer,keep)
  }
  },
})