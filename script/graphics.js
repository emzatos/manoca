"use strict";
var Graphics = {
	//The HTML5 Canvas element used for output
	canvas: null,

	//The Pixi Stage which contains game objects
	stage: null,

	//The Pixi Renderer used to draw the stage
	renderer: null,

	//For dynamic bloom
	bloomTexture: null,
	bloomSprite: null,

	//Dimensions used for rendering
	width: 1200,
	height: 700,

	//Pixi Textures stored for re-use
	texture: {
		engineFire: PIXI.Texture.fromImage("img/fire10.png"),
		engineFireLight: PIXI.Texture.fromImage("img/fire10light.png")
	},

	/**
	 * Initialize Pixi and canvases.
	 * This method sizes and positions the canvas.
	 */
	init: function() {
		Graphics.canvas = document.getElementById("display");
		Graphics.canvas.width = Graphics.width;
		Graphics.canvas.height = Graphics.height;
		Graphics.canvas.style.marginLeft = ~~(-Graphics.width/2) + "px";
		Graphics.canvas.style.marginTop = ~~(-Graphics.height/2) + "px";
		Graphics.canvas.style.left = Graphics.canvas.style.top = "50%";

		Graphics.stage = new PIXI.Stage(0x000000);

		Graphics.renderer = PIXI.autoDetectRenderer(
			Graphics.width,
			Graphics.height,
			Graphics.canvas
		);

		//barely-noticeable bloom
		//fuck yeah!
		Graphics.bloomTexture = new PIXI.RenderTexture(Graphics.width, Graphics.height);
		Graphics.bloomSprite = new PIXI.Sprite(Graphics.bloomTexture);
		Graphics.bloomSprite.blendMode = PIXI.blendModes.ADD;
		var bloomBlur = new PIXI.BlurFilter();
		bloomBlur.blurX = bloomBlur.blurY = 16;
		Graphics.bloomSprite.filters = [bloomBlur];
		Graphics.bloomSprite.depth = 1;
		Graphics.bloomSprite.alpha = 0.9;
		Graphics.stage.addChild(Graphics.bloomSprite);

		window.addEventListener("resize", Graphics.resize, false);
	},

	/**
	 * Render a frame.
	 * This method should only be called once, in Game.init.
	 * Subsequent calls are made by requestAnimationFrame()
	 */
	frame: function() {
		Game.step();
		Starfield.frame();

		Graphics.stage.children.sort(function(a,b){
			if (!a.depth) {a.depth = 0;}
			if (!b.depth) {b.depth = 0;}
			return a.depth<b.depth ? -1 : a.depth>b.depth ? 1 : 0;
		});

		Graphics.bloomTexture.render(Graphics.stage);
		Graphics.renderer.render(Graphics.stage);

		requestAnimationFrame(Graphics.frame);
	},

	resize: function(event) {
		/*Graphics.width = window.innerWidth;
		Graphics.height = window.innerHeight;
		Graphics.renderer.view.width = Graphics.width;
		Graphics.renderer.view.height = Graphics.height;*/
	},

	getBounds: function() {
		return {
			"x1": 0,
			"y1": 0,
			"x2": Graphics.width,
			"y2": Graphics.height
		};
	},

	addEngineFire: function(ship, textureName) {
		ship.engineFire = {
			sprite: new PIXI.Sprite(Graphics.texture[textureName]),
			light: new PIXI.Sprite(Graphics.texture[textureName+"Light"]),
			scale: 1,
			updateSprite: function() {
				var rv = new Random().next(0.8,1.1);
				ship.engineFire.sprite.scale = new PIXI.Point(1,ship.engineFire.scale*rv);
				ship.engineFire.light.scale = new PIXI.Point(ship.engineFire.scale*rv,ship.engineFire.scale*rv);
			}
		};

		ship.engineFire.sprite.anchor = new PIXI.Point(0.5,0);
		ship.engineFire.sprite.position = new PIXI.Point(0,ship.sprite.height/2);
		ship.engineFire.sprite.blendMode = PIXI.blendModes.ADD;

		ship.engineFire.light.anchor = new PIXI.Point(0.5,0.2);
		ship.engineFire.light.position = new PIXI.Point(0,ship.sprite.height/2);
		ship.engineFire.light.alpha = 0.5;
		ship.engineFire.light.blendMode = PIXI.blendModes.ADD;

		ship.sprite.addChild(ship.engineFire.sprite);
		ship.sprite.addChild(ship.engineFire.light);
	}
};