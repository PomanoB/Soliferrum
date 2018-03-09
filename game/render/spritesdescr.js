
var kTilesetDescription = {
	image: '/images/tiles.png',
	sprites: {
		stoneOld: {
			x: 0,
			y: 0,
			width: 60,
			height: 52
		},
		water: {
			x: 60,
			y: 0,
			width: 60,
			height: 52
		},
		grass: {
			x: 120,
			y: 0,
			width: 60,
			height: 52
		}
	}
};
var kTilesetDescription2 = {
	image: '/images/hexagon.png',
	sprites: {
		stone: {
			x: 0,
			y: 0,
			width: 60,
			height: 52
		},
		lightHexOverlay: {
			x: 60,
			y: 0,
			width: 60,
			height: 52
		},
		darkHexOverlay: {
			x: 120,
			y: 0,
			width: 60,
			height: 52
		}
	}
};
var kBackgroundLava = {
	image: '/images/lava2.png',
	sprites: {
		lavaBackground: {
			x: 0,
			y: 0,
			width: 420,
			height: 571
		}
	}
};

var kAnimatedBlood = {
	image: '/images/blood.png',
	sprites: {
		animatedBlood: {
			x: 0,
			y: 0,
			width: 32,
			height: 32,
			anim: {
				frameCount: 16,
				frameTime: 60,
				cycle: true
			}
		}
	}
};

var kUISprite = {
	image: '/images/ui.png',
	sprites: {
		activeWindowBg: {x: 74, y: 82, width: 128, height: 128},
		activeWindowL: {x: 73, y: 44, width: 6, height: 1},
		activeWindowR: {x: 185, y: 44, width: 6, height: 1},
		activeWindowT: {x: 100, y: 27, width: 1, height: 6},
		activeWindowB: {x: 85, y: 51, width: 1, height: 6},
		activeWindowTL: {x: 88, y: 47, width: 10, height: 10},
		activeWindowTR: {x: 99, y: 47, width: 10, height: 10},
		activeWindowBL: {x: 73, y: 47, width: 10, height: 10},
		activeWindowBR: {x: 181, y: 47, width: 10, height: 10},

		decoButtonNormalTL: {x: 0, y: 491, width: 9, height: 9},
		decoButtonNormalT: {x: 10, y: 491, width: 1, height: 3},
		decoButtonNormalTR: {x: 12, y: 491, width: 9, height: 9},
		decoButtonNormalR: {x: 18, y: 501, width: 3, height: 1},
		decoButtonNormalBR: {x: 12, y: 503, width: 9, height: 9},
		decoButtonNormalB: {x: 10, y: 509, width: 1, height: 3},
		decoButtonNormalBL: {x: 0, y: 503, width: 9, height: 9},
		decoButtonNormalL: {x: 0, y: 501, width: 3, height: 1},
		decoButtonNormalBg: {x: 205, y: 82, width: 128, height: 128},

		decoButtonHoverTL: {x: 25, y: 491, width: 9, height: 9},
		decoButtonHoverT: {x: 35, y: 491, width: 1, height: 7},
		decoButtonHoverTR: {x: 37, y: 491, width: 9, height: 9},
		decoButtonHoverR: {x: 39, y: 501, width: 7, height: 1},
		decoButtonHoverBR: {x: 37, y: 503, width: 9, height: 9},
		decoButtonHoverB: {x: 35, y: 505, width: 1, height: 7},
		decoButtonHoverBL: {x: 25, y: 503, width: 9, height: 9},
		decoButtonHoverL: {x: 25, y: 501, width: 7, height: 1},
		decoButtonHoverBg: {x: 205, y: 82, width: 128, height: 128},

		hDecoScrollbarLeftNormal: {x: 82, y: 354, width: 15, height: 14},
		hDecoScrollbarLeftHover: {x: 82, y: 369, width: 15, height: 14},
		hDecoScrollbarRightNormal: {x: 64, y: 354, width: 15, height: 14},
		hDecoScrollbarRightHover: {x: 64, y: 369, width: 15, height: 14}
	}
};

/**
 * @param {SpriteManager} manager
 */
module.exports.loadSprites = function(manager)
{
	manager.load(kUISprite);
	manager.load(kTilesetDescription);
	manager.load(kTilesetDescription2);
	manager.load(kBackgroundLava);
	manager.load(kAnimatedBlood);
};
