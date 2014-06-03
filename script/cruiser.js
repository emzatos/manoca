"use strict";

var Cruiser = Hostile.extend(function(props){
	this.sprite.depth = 1000.5;
	Graphics.stage.addChild(this.sprite);
	this.health = 100;
	this.pointValue = 2500;
	this.xs = either(props.xs, Random.next(-1,-2));
	this.ys = either(props.ys, 0);
	Graphics.addEngineFire(this, "engineFire", new PIXI.Point(18,0), 0xFF8844);

	this.angle = Math.PI;

	this.leftGun = new GunMount(this, new PIXI.Point(0.5,0.1));
	this.rightGun = new GunMount(this, new PIXI.Point(0.5,0.9));
	this.guns = new GunCycler([this.leftGun, this.rightGun], CruiserLaser.delay/2);
})
.statics({
	texture: PIXI.Texture.fromImage("img/enemyRed4.png")
})
.methods({
	updateSprite: function() {
		this.supr();
		this.engineFire.updateSprite();
	},
	step: function() {
		this.supr();
		this.guns.fire(CruiserLaser);
		this.updateSprite();
	}
});