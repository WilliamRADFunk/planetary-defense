/* 
Planetary Defense Engine v1.0.0
Last Updated: 2017-December-28
Author: William R.A.D. Funk - http://WilliamRobertFunk.com 
*/

var GAME =
{
	state: "LOADING",
	updateCounter: 0,
	moveSpeed: 0.007,
	ringSelected: 1,
	RINGMAX: 3,
	ASTROMAX: 35,
	ringChange: false,
	criticalVariables: [],
	player: null,
	asteroids: null,
	renderer: [],
	barriers: [],
	soundFx_1: null,
	soundFx_2: null,
	camera: null,
	scene: null,
	timeoutID: null,
	mouseX: 0 };

GAME.player = { initials: "", score: 0 };
GAME.asteroids = { asteroidField: [] };
GAME.asteroids.createField = function()
{
	for(var i = 0; i < GAME.ASTROMAX; i++) GAME.asteroids.addAsteroid(0.2, GAME.moveSpeed);
};
GAME.asteroids.addAsteroid = function(size, speed)
{
	var asteroid = {
		size: 0.2,
		speed: 0.001,
		x: null,
		y: null,
		directionX: null,
		directionZ: null,
		astro: null
	};
	asteroid.size = size ? size : 0.2;
	asteroid.speed = speed ? speed : 0.001;

	if(Math.random() > 0.5) asteroid.x = Math.floor((Math.random() * 20) + 15);
	else asteroid.x = -Math.floor((Math.random() * 20) + 15);
	if(Math.random() > 0.5) asteroid.z = Math.floor((Math.random() * 20) + 15);
	else asteroid.z = -Math.floor((Math.random() * 20) + 15);
	
	if(Math.random() > 0.5) asteroid.directionX = Math.floor((Math.random() * 20) + 5);
	else asteroid.directionX = -Math.floor((Math.random() * 20) + 5);
	if(Math.random() > 0.5) asteroid.directionZ = Math.floor((Math.random() * 20) + 5);
	else asteroid.directionZ = -Math.floor((Math.random() * 20) + 5);

	var astroGeo = new THREE.SphereGeometry(0.25, 16, 16);
	var astroMat = new THREE.MeshBasicMaterial({color: 'white'});
	asteroid.astro = new THREE.Mesh(astroGeo, astroMat);
	asteroid.astro.position.set(asteroid.x, 0, asteroid.z);
	GAME.scene.add(asteroid.astro);

	GAME.asteroids.asteroidField.push(asteroid);
	//console.log("Added asteroid.");
};
GAME.asteroids.removeAsteroid = function(asteroid)
{
	GAME.scene.remove(GAME.asteroids.asteroidField[asteroid].astro);
	GAME.asteroids.asteroidField[asteroid] = null;
	GAME.asteroids.asteroidField.splice(asteroid, 1);
	//console.log("Removed asteroid.");
};
GAME.asteroids.moveAsteroid = function(asteroid, x, z)
{
	asteroid.position.x += x;
	asteroid.position.z += z;
};
GAME.repairNode =
{
	x: 29,
	z: 29,
	directionX: null,
	directionZ: null,
	size: 0.4,
	node: null,
	speed: 0.007
};
GAME.repairNode.create = function(speed)
{
	GAME.repairNode.speed = speed;
	var nodeGeo = new THREE.SphereGeometry(GAME.repairNode.size, 16, 16);
	var nodeMat = new THREE.MeshBasicMaterial({color: 'blue'});
	GAME.repairNode.node = new THREE.Mesh(nodeGeo, nodeMat);
	GAME.repairNode.node.position.set(GAME.repairNode.node.x, 0, GAME.repairNode.node.z);
	GAME.scene.add(GAME.repairNode.node);
	GAME.repairNode.node.material.visible = false;
};
GAME.repairNode.add = function(speed)
{
	if(Math.random() > 0.5) GAME.repairNode.x = Math.floor((Math.random() * 20) + 15);
	else GAME.repairNode.x = -Math.floor((Math.random() * 20) + 15);
	if(Math.random() > 0.5) GAME.repairNode.z = Math.floor((Math.random() * 20) + 15);
	else GAME.repairNode.z = -Math.floor((Math.random() * 20) + 15);
	
	// if(Math.random() > 0.5) GAME.repairNode.directionX = Math.floor((Math.random() * 20) + 5);
	// else GAME.repairNode.directionX = -Math.floor((Math.random() * 20) + 5);
	// if(Math.random() > 0.5) GAME.repairNode.directionZ = Math.floor((Math.random() * 20) + 5);
	// else GAME.repairNode.directionZ = -Math.floor((Math.random() * 20) + 5);

	GAME.repairNode.directionX = -GAME.repairNode.x;
	GAME.repairNode.directionZ = -GAME.repairNode.z;
	GAME.repairNode.node.position.x = GAME.repairNode.x;
	GAME.repairNode.node.position.z = GAME.repairNode.z;
	GAME.repairNode.speed = speed;
	GAME.repairNode.node.material.visible = true;
};
GAME.repairNode.move = function()
{
	GAME.repairNode.node.position.x += GAME.repairNode.directionX * GAME.repairNode.speed;
	GAME.repairNode.node.position.z += GAME.repairNode.directionZ * GAME.repairNode.speed;
};
GAME.repairNode.remove = function()
{
	GAME.repairNode.node.position.x = 100;
	GAME.repairNode.node.position.z = 100;
	GAME.repairNode.x = 100;
	GAME.repairNode.z = 100;
	GAME.repairNode.directionX = 0;
	GAME.repairNode.directionZ = 0;
	GAME.repairNode.node.material.visible = false;
};
GAME.checkOutOfBounds = function()
{
	for(var i = 0; i < GAME.asteroids.asteroidField.length; i++)
	{
		if(	GAME.asteroids.asteroidField[i].astro.position.x < -30 ||
			GAME.asteroids.asteroidField[i].astro.position.x > 30)
		{
			GAME.asteroids.asteroidField[i].astro.position.x = (-0.95 * GAME.asteroids.asteroidField[i].astro.position.x);
		}
		else if(GAME.asteroids.asteroidField[i].astro.position.z < -30 ||
				GAME.asteroids.asteroidField[i].astro.position.z > 30 )
		{
			GAME.asteroids.asteroidField[i].astro.position.z = (-0.95 * GAME.asteroids.asteroidField[i].astro.position.z);
		}
	}
	if(	GAME.repairNode.node.position.x < -30 || GAME.repairNode.node.position.x > 30)
	{
		GAME.repairNode.node.position.x = (-0.95 * GAME.repairNode.node.position.x);
	}
	else if(GAME.repairNode.node.position.z < -30 || GAME.repairNode.node.position.z > 30 )
	{
		GAME.repairNode.node.position.z = (-0.95 * GAME.repairNode.node.position.z);
	}
};
GAME.restart = function()
{
	Game.state = "LOADING";
	Game.updateCounter = 0;
	Game.moveSpeed = 0.007;
	Game.ringSelected = 1;
	Game.RINGMAX = 3;
	Game.ASTROMAX = 35;
	Game.ringChange = false;
	Game.criticalVariables = [];
	Game.player = null;
	Game.asteroids = null;
	Game.renderer = [];
	Game.barriers = [];
	Game.camera = null;
	Game.scene = null;
	Game.timeoutID = null;
	Game.mouseX = 0;

	GAME.player = { initials: "", score: 0 };
	GAME.asteroids = { asteroidField: [] };

	getScores();					// Retrieves and shows top-ten scores.
	/*************************************************************************/
	GAME.scene = new THREE.Scene();	// Three.js scene (contains universe).
	/*************************************************************************/
	GAME.createRenderers();			// Creates all renderers for the scene.
	/*************************************************************************/
	GAME.scene.add(new THREE.AmbientLight(0x333333));
	/*************************************************************************/
	GAME.attachViewsToHTML();		// Attaches renderers to HTML.
	/*************************************************************************/
	GAME.createPlayerCenter();		// Creates the rotatable player's center.
	/*************************************************************************/
	GAME.createRingsAndBarriers();	// Creates player's defensive barriers.
	/*************************************************************************/
	GAME.loadCameras();				// Top-down viewpoint.
	/*************************************************************************/
	GAME.asteroids.createField();	// Creates initial asteroid belt.
	/*************************************************************************/
	GAME.repairNode.create(GAME.moveSpeed / 4);
	GAME.repairNode.add(GAME.moveSpeed / 4);	// Creates repair node.
	/*************************************************************************/
	render();
};
GAME.setView = function()
{
	GAME.WIDTH = window.innerWidth * 0.99;
	GAME.HEIGHT = window.innerHeight * 0.99;
	if(GAME.WIDTH < GAME.HEIGHT) GAME.HEIGHT = GAME.WIDTH;
	else GAME.WIDTH = GAME.HEIGHT;
	document.getElementById("mainview").style.left = (((window.innerWidth * 0.99) - GAME.WIDTH) / 2) + "px";
	document.getElementById("scoreboard").style.left = (((window.innerWidth * 0.99) - GAME.WIDTH) / 2) + "px";
	document.getElementById("mobile-instructions").style.left = (((window.innerWidth * 0.99) - GAME.WIDTH) / 2) + "px";
	document.getElementById("mobile-instructions").style.width = GAME.WIDTH + "px";
	document.getElementById("desktop-instructions").style.left = (((window.innerWidth * 0.99) - GAME.WIDTH) / 2) + "px";
	document.getElementById("desktop-instructions").style.width = GAME.WIDTH + "px";
	if(window.innerWidth < 767)
	{
		document.getElementById("desktop-instructions").style.display = "none";
		document.getElementById("mobile-instructions").style.display = "block";
	}
	else
	{
		document.getElementById("mobile-instructions").style.display = "none";
		document.getElementById("desktop-instructions").style.display = "block";
	}
	document.getElementById("top-ten").style.right = (((window.innerWidth * 1.01) - GAME.WIDTH) / 2) + "px";
	document.getElementById("mainview").style.top = (((window.innerHeight * 0.99) - GAME.HEIGHT) / 2) + "px";
	document.getElementById("scoreboard").style.top = (((window.innerHeight * 0.99) - GAME.HEIGHT) / 2) + "px";
	document.getElementById("top-ten").style.top = (((window.innerHeight * 0.99) - GAME.HEIGHT) / 2) + "px";
	document.body.style.width = (window.innerWidth ) + "px";
	document.body.style.height = (window.innerHeight) + "px";
	GAME.windowHalfX = window.innerWidth / 2;
};
GAME.populateTopTen = function(scores)
{
	if(scores)
	{
		document.getElementById("name1").innerHTML = scores.scores[0].initials;
		document.getElementById("score1").innerHTML = scores.scores[0].score;
		document.getElementById("name2").innerHTML = scores.scores[1].initials;
		document.getElementById("score2").innerHTML = scores.scores[1].score;
		document.getElementById("name3").innerHTML = scores.scores[2].initials;
		document.getElementById("score3").innerHTML = scores.scores[2].score;
		document.getElementById("name4").innerHTML = scores.scores[3].initials;
		document.getElementById("score4").innerHTML = scores.scores[3].score;
		document.getElementById("name5").innerHTML = scores.scores[4].initials;
		document.getElementById("score5").innerHTML = scores.scores[4].score;
		document.getElementById("name6").innerHTML = scores.scores[4].initials;
		document.getElementById("score6").innerHTML = scores.scores[4].score;
	}
	else
	{
		document.getElementById("name1").innerHTML = "XXX";
		document.getElementById("score1").innerHTML = "000";
		document.getElementById("name2").innerHTML = "XXX";
		document.getElementById("score2").innerHTML = "000";
		document.getElementById("name3").innerHTML = "XXX";
		document.getElementById("score3").innerHTML = "000";
		document.getElementById("name4").innerHTML = "XXX";
		document.getElementById("score4").innerHTML = "000";
		document.getElementById("name5").innerHTML = "XXX";
		document.getElementById("score5").innerHTML = "000";
		document.getElementById("name6").innerHTML = "XXX";
		document.getElementById("score6").innerHTML = "000";
	}
};
GAME.createRenderers = function()
{
	if(window.WebGLRenderingContext) GAME.renderer = new THREE.WebGLRenderer();
	else GAME.renderer = new THREE.CanvasRenderer();
	GAME.renderer.setClearColor( 0x000000, 0 );
	GAME.renderer.setSize( GAME.WIDTH, GAME.HEIGHT );
	GAME.renderer.autoClear = false;
};
GAME.attachViewsToHTML = function()
{
	var container = document.getElementById("mainview");
	container.appendChild( GAME.renderer.domElement );
};
GAME.createPlayerCenter = function()
{
	var circleGeo = new THREE.CylinderGeometry(1, 1, 0.1, 64);
	var circleMat = new THREE.MeshBasicMaterial({color: 0x00FFFF});
	var circle = new THREE.Mesh(circleGeo, circleMat);
	circle.position.set(0, 0, 0);
	circle.name = "Player";
	GAME.criticalVariables.push(circle);
	GAME.scene.add(circle);
};
GAME.createRingsAndBarriers = function()
{
	for(var j = 1; j < GAME.RINGMAX+1; j++)
	{
		var ring = new THREE.Object3D();
		ring.name = "Ring " + j;

		var circleGeometry = new THREE.RingGeometry((j * 2) + 0.25, (j * 2) + 0.5, 120, 0, 0, Math.PI * 2);
		var circle = new THREE.Mesh(circleGeometry, new THREE.MeshBasicMaterial({color: 0xFF69B4, wireframe: true}));
		circle.position.set(0, -5, 0);
		circle.rotation.set(90, 0, 0);
		circle.name = 'ring-frame-' + j;
		ring.add(circle);
		// GAME.scene.add(circle);
		for(var i = 0; i < (4 * j); i++)
		{
			var x_coord = (j * 2) * Math.cos( i * (Math.PI / (2 * j)) );
			var z_coord = (j * 2) * Math.sin( i * (Math.PI / (2 * j)) );

			var barrierGeo = new THREE.BoxGeometry(1, 1, 1);
			var barrierMat = new THREE.MeshBasicMaterial({color: 0x00FF00});
			var barrier = new THREE.Mesh(barrierGeo, barrierMat);
			barrier.position.set(x_coord, 0, z_coord);
			barrier.name = "Barrier " + j + "-" + i;
			ring.add(barrier);
			GAME.barriers.push(barrier);
		}
		GAME.criticalVariables.push(ring);
		GAME.scene.add(ring);
	}
	GAME.changeRingColors();
};
GAME.removeBarrier = function(barrier)
{
	//console.log("Removing: " + GAME.barriers[barrier].name);
	var ring = GAME.barriers[barrier].parent;
	ring.remove(GAME.barriers[barrier]);
	GAME.scene.remove(GAME.barriers[barrier]);
	GAME.barriers.splice(barrier, 1);
};
GAME.enterInitials = function()
{
	var finalScore = (GAME.player.score + (100*GAME.barriers.length));
	var initials = document.getElementById("p-initials").value;
	sendScore(initials, finalScore);
	document.getElementById("player-initials").style.display = "none";
	Game.restart();
};
GAME.registerListeners = function()
{
	window.addEventListener( 'resize', GAME.onWindowResize, false);
	document.addEventListener( 'mousedown', GAME.onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', GAME.onDocumentTouchStart, false );
	document.addEventListener( 'touchend', GAME.onDocumentTouchEnd, false );
};
GAME.onWindowResize = function()
{
	var WIDTH = window.innerWidth * 0.99;
	var HEIGHT = window.innerHeight * 0.99;
	document.getElementById("mainview").style.left = (((window.innerWidth * 0.99) - WIDTH) / 2) + "px";
	document.getElementById("scoreboard").style.left = (((window.innerWidth * 0.99) - WIDTH) / 2) + "px";
	if(WIDTH < HEIGHT) HEIGHT = WIDTH;
	else WIDTH = HEIGHT;
	GAME.renderer.setSize( WIDTH, HEIGHT );
	GAME.camera.aspect = WIDTH / HEIGHT;
	GAME.camera.updateProjectionMatrix();
	document.getElementById("mainview").style.left = (((window.innerWidth * 0.99) - WIDTH) / 2) + "px";
	document.getElementById("scoreboard").style.left = (((window.innerWidth * 0.99) - WIDTH) / 2) + "px";
	document.getElementById("mobile-instructions").style.left = (((window.innerWidth * 0.99) - WIDTH) / 2) + "px";
	document.getElementById("mobile-instructions").style.width = WIDTH + "px";
	document.getElementById("desktop-instructions").style.left = (((window.innerWidth * 0.99) - WIDTH) / 2) + "px";
	document.getElementById("desktop-instructions").style.width = WIDTH + "px";
	if(window.innerWidth < 767)
	{
		document.getElementById("desktop-instructions").style.display = "none";
		document.getElementById("mobile-instructions").style.display = "block";
	}
	else
	{
		document.getElementById("mobile-instructions").style.display = "none";
		document.getElementById("desktop-instructions").style.display = "block";
	}
	document.getElementById("top-ten").style.right = (((window.innerWidth * 1.01) - WIDTH) / 2) + "px";
	document.getElementById("mainview").style.top = (((window.innerHeight * 0.99) - HEIGHT) / 2) + "px";
	document.getElementById("scoreboard").style.top = (((window.innerHeight * 0.99) - HEIGHT) / 2) + "px";
	document.getElementById("top-ten").style.top = (((window.innerHeight * 0.99) - HEIGHT) / 2) + "px";
	document.body.style.width = (window.innerWidth ) + "px";
	document.body.style.height = (window.innerHeight) + "px";
	GAME.windowHalfX = window.innerWidth / 2;
	GAME.WIDTH = WIDTH;
	GAME.HEIGHT = HEIGHT;
};
GAME.loadCameras = function()
{

	GAME.camera =  new THREE.OrthographicCamera( -25, 25, -25, 25, 0.01, 1000 );
	GAME.camera.position.set(0, 40, 0);
	GAME.camera.lookAt(GAME.scene.position);
};
GAME.loadSounds = function()
{
	GAME.soundFx_1 = new Audio("assets/audio/End_Fx.mp3");
	GAME.soundFx_2 = new Audio("assets/audio/Power_Failure.mp3");
	GAME.soundFx_3 = new Audio("assets/audio/Metroid_Door.mp3");
};
GAME.playSound = function(track)
{
	GAME.isMute = false;
	if(!GAME.isMute) {
		GAME.soundFx_1.pause();
		GAME.soundFx_1.currentTime = 0;
		GAME.soundFx_2.pause();
		GAME.soundFx_2.currentTime = 0;
		if(track === 0) GAME.soundFx_2.play();
		else if(track === 1) GAME.soundFx_1.play();
		else if(track === 2) GAME.soundFx_3.play();
	}
};
GAME.onDocumentMouseDown = function( event )
{
	event.preventDefault();
	document.addEventListener( 'mousemove', GAME.onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', GAME.onDocumentMouseUp, false );
};
GAME.onDocumentMouseMove = function( event )
{
	var mouseXBefore = GAME.mouseX;
	GAME.mouseX = event.clientX + (GAME.WIDTH / 2);
	var posOrNeg = (GAME.mouseX > mouseXBefore) ? 1 : -1;
	GAME.criticalVariables[0].rotation.y += (0.05 * posOrNeg); // player center.
	GAME.criticalVariables[GAME.ringSelected].rotation.y += ((0.05 * posOrNeg) / GAME.ringSelected); // defensive ring.
};
GAME.onDocumentMouseUp = function( event )
{
	document.removeEventListener( 'mousemove', GAME.onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', GAME.onDocumentMouseUp, false );
	//console.log("Ring changed");
	GAME.ringSelected++; // player chose a different ring to rotate.
	if(GAME.ringSelected > GAME.RINGMAX) GAME.ringSelected = 1;
	GAME.changeRingColors();
};
GAME.onDocumentTouchStart = function( event )
{
	event.preventDefault();
	if ( event.touches.length === 2 )
	{
		//console.log("Ring changed");
		GAME.ringSelected++; // player chose a different ring to rotate.
		if(GAME.ringSelected > GAME.RINGMAX) GAME.ringSelected = 1;
		GAME.changeRingColors();
	} else {
		GAME.mouseX = event.touches[ 0 ].pageX;
		GAME.timeoutID = window.setInterval(function() {
			GAME.onDocumentTouchMove();
		}, 50);
	}
};
GAME.onDocumentTouchEnd = function( event )
{
	window.clearInterval(GAME.timeoutID);
};
GAME.onDocumentTouchMove = function()
{
	var posOrNeg = (GAME.mouseX > (window.innerWidth / 2)) ? 1 : -1;
	GAME.criticalVariables[0].rotation.y += (0.2 * posOrNeg); // player center.
	GAME.criticalVariables[GAME.ringSelected].rotation.y += ((0.2 * posOrNeg) / GAME.ringSelected); // defensive ring.
};
GAME.changeRingColors = function() {
	for(var i = 1; i < GAME.criticalVariables.length; i++)
	{
		GAME.criticalVariables[i].children[0].material.color.setHex(0xFF69B4);
	}
	GAME.criticalVariables[GAME.ringSelected].children[0].material.color.setHex(0x00FFFF);
};
GAME.collisionCheck = function()
{
	for(var k = 0; k < GAME.asteroids.asteroidField.length; k++)
	{
		if( ((GAME.asteroids.asteroidField[k].astro.position.x >= GAME.criticalVariables[0].position.x-1) &&
			 (GAME.asteroids.asteroidField[k].astro.position.x <= GAME.criticalVariables[0].position.x+1)) &&
			((GAME.asteroids.asteroidField[k].astro.position.z >= GAME.criticalVariables[0].position.z-1) &&
			 (GAME.asteroids.asteroidField[k].astro.position.z <= GAME.criticalVariables[0].position.z+1)) )
		{
			document.getElementById("player-initials").style.display = "block";
			document.getElementById("player-initials").focus();
			GAME.state = "GAME OVER";
			return;
		}
	}
	for(var i = 0; i < GAME.barriers.length; i++)
	{
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition(GAME.barriers[i].matrixWorld);
		if( ((GAME.repairNode.node.position.x >= vector.x-0.8) &&
			(GAME.repairNode.node.position.x <= vector.x+0.8)) &&
			((GAME.repairNode.node.position.z >= vector.z-0.8) &&
			(GAME.repairNode.node.position.z <= vector.z+0.8)) )
		{
			GAME.barriers[i].material.color.setHex(0x00FF00);
			GAME.repairNode.remove();
			GAME.repairNode.add(GAME.moveSpeed / 4);
			GAME.playSound(2);
		}
		for(var j = 0; j < GAME.asteroids.asteroidField.length; j++)
		{
			if( ((GAME.asteroids.asteroidField[j].astro.position.x >= vector.x-0.9) &&
				 (GAME.asteroids.asteroidField[j].astro.position.x <= vector.x+0.9)) &&
				((GAME.asteroids.asteroidField[j].astro.position.z >= vector.z-0.9) &&
				 (GAME.asteroids.asteroidField[j].astro.position.z <= vector.z+0.9)) )
			{
				GAME.asteroids.removeAsteroid(j);
				GAME.asteroids.addAsteroid(0.2, GAME.moveSpeed);
				if(GAME.barriers[i].material.color.getHex() == 0xFFFF00)
				{
					GAME.barriers[i].material.color.setHex(0xFF0000);
					GAME.playSound(1);
				}
				else if(GAME.barriers[i].material.color.getHex() == 0xFF0000)
				{
					GAME.removeBarrier(i);
					GAME.playSound(0);
					return;
				}
				else
				{
					GAME.barriers[i].material.color.setHex(0xFFFF00);
					GAME.playSound(1);
				}
			}
		}
	}
};
function init()
{
	/*************************************************************************/
	GAME.setView();					// Sizes the game window.
	/*************************************************************************/
	getScores();					// Retrieves and shows top-ten scores.
	/*************************************************************************/
	GAME.keyboard = new THREEx.KeyboardState();
	/*************************************************************************/
	GAME.scene = new THREE.Scene();	// Three.js scene (contains universe).
	/*************************************************************************/
	GAME.createRenderers();			// Creates all renderers for the scene.
	/*************************************************************************/
	GAME.scene.add(new THREE.AmbientLight(0x333333));
	/*************************************************************************/
	GAME.attachViewsToHTML();		// Attaches renderers to HTML.
	/*************************************************************************/
	GAME.createPlayerCenter();		// Creates the rotatable player's center.
	/*************************************************************************/
	GAME.createRingsAndBarriers();	// Creates player's defensive barriers.
	/*************************************************************************/
	GAME.registerListeners();		// Registers all Event Listeners.
	/*************************************************************************/
	GAME.loadCameras();				// Top-down viewpoint.
	/*************************************************************************/
	GAME.loadSounds();				// Top-down viewpoint.
	/*************************************************************************/
	GAME.asteroids.createField();	// Creates initial asteroid belt.
	/*************************************************************************/
	GAME.repairNode.create(GAME.moveSpeed / 4);
	GAME.repairNode.add(GAME.moveSpeed / 4);	// Creates repair node.
	/*************************************************************************/
	render();						// The update loop.
}
function render()
{
	GAME.updateCounter++;
	if(GAME.state == "LOADING" && GAME.updateCounter >= 240) GAME.state = "ACTIVE";
	else if(GAME.state == "ACTIVE")
	{
		for(var i = 0; i < GAME.asteroids.asteroidField.length; i++)
		{
			GAME.asteroids.moveAsteroid(
				GAME.asteroids.asteroidField[i].astro,
				GAME.asteroids.asteroidField[i].directionX * GAME.asteroids.asteroidField[i].speed,
				GAME.asteroids.asteroidField[i].directionZ * GAME.asteroids.asteroidField[i].speed);
		}
		GAME.repairNode.move();
		if(GAME.updateCounter % 2 === 0) GAME.collisionCheck();
		if(GAME.updateCounter % 60 === 0)
		{
			GAME.player.score += 10;
			document.getElementById("score").innerHTML = GAME.player.score;
		}
		if(GAME.updateCounter % 120 === 0) GAME.checkOutOfBounds();
		if(GAME.updateCounter % 1800 === 0)
		{
			GAME.moveSpeed += 0.001;
			var delCount = 0;
			for(var j = 0; j < GAME.asteroids.asteroidField[j] && delCount < 6; j++)
			{
				if( GAME.asteroids.asteroidField[j].astro.position.x > 25 ||
					GAME.asteroids.asteroidField[j].astro.position.x < -25 ||
					GAME.asteroids.asteroidField[j].astro.position.z > 25 ||
					GAME.asteroids.asteroidField[j].astro.position.z < -25 )
				{
					GAME.asteroids.removeAsteroid(0);
					j--;
					delCount++;
				}
			}
			for(var k = 0; k < (delCount + 2); k++) GAME.asteroids.addAsteroid(0.02, GAME.moveSpeed);
			if( GAME.repairNode.node.position.x > 25 ||
				GAME.repairNode.node.position.x < -25 ||
				GAME.repairNode.node.position.z > 25 ||
				GAME.repairNode.node.position.z < -25 )
			{
				GAME.repairNode.remove();
				GAME.repairNode.add(GAME.moveSpeed / 4);
			}
		}
		if(GAME.updateCounter % 45000 === 0)
		{
			GAME.updateCounter = 0;
		}
		keyPressed(); // Player presses a keyboard key.
	}
	else if(GAME.state == "GAME OVER")
	{
		var finalScore = (GAME.player.score + (100*GAME.barriers.length));
		document.removeEventListener( 'mousedown', GAME.onDocumentMouseDown );
		document.removeEventListener( 'touchstart', GAME.onDocumentTouchStart );
		document.getElementById("points").innerHTML = GAME.player.score;
		document.getElementById("barriers").innerHTML = GAME.barriers.length;
		document.getElementById("barrier-points").innerHTML = (100 * GAME.barriers.length);
		document.getElementById("final-score").innerHTML = finalScore;
		document.getElementById("score").innerHTML = finalScore;
		return;
	}
	GAME.renderer.render( GAME.scene, GAME.camera );
	requestAnimationFrame( render );
}
function keyPressed()
{
	if( GAME.keyboard.pressed("RIGHT") || GAME.keyboard.pressed("D") )
	{
		GAME.criticalVariables[0].rotation.y += 0.1; // player center.
		GAME.criticalVariables[GAME.ringSelected].rotation.y += (0.1 / GAME.ringSelected); // defensive ring.
	}
	else if( GAME.keyboard.pressed("LEFT") || GAME.keyboard.pressed("A") )
	{
		GAME.criticalVariables[0].rotation.y -= 0.1; // player center.
		GAME.criticalVariables[GAME.ringSelected].rotation.y -= (0.1 / GAME.ringSelected); // defensive ring.
	}
	else if( GAME.keyboard.pressed("SPACE") )
	{
		if(!GAME.ringChange) // player chose a different ring to rotate.
		{
			GAME.ringSelected++;
			GAME.ringChange = true;
		}
		if(GAME.ringSelected > GAME.RINGMAX) GAME.ringSelected = 1;
		GAME.changeRingColors();
	}
	else GAME.ringChange = false;
}