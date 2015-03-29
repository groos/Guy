/*
Javascript practice

---Mouse Pointer Particle Generator---

*/

/*
Maps every function of math into the window object? 

I think this basically adds all of the math properties to the window. 

Tutorial comment:
/* compact way of setting PI = Math.PI & so on... 
*/
Object.getOwnPropertyNames(Math).map(function (p) {
    window[p] = Math[p];
});


/*
Globals
*/
var NUMBER_OF_PARTICLES = 20,
 c,	// gets canvas element from html doc.
 w, // width
 h, //height
 confettis = [],
 context, // get 2d context from canvas
particles = [],
source = {}, // particle fountain source
t = 0,
req_id = null;


function initPage() {
     c = document.querySelector('.c');
    context = c.getContext("2d");

    loadConfetti();
};

/*

Objects

*/

function Particle(i) {
    var confetti, // current confetti piece
	pos, // current particle position
	v, // current particle velocity
	a, // current particle acceleration
	c_angle, // confetti particle angle
	angle_v, // angle velocity

	/*
		delay when shooting up, so that particles don't all 
		go at the same time (random)
	*/
	delay = rand(NUMBER_OF_PARTICLES, 0, 1);

    // active = was already shot up, but hasnt landed yet
    this.active = false;

    // makes particle active and gives it a velocity so that it starts moving
    this.shoot = function (context) {
        var angle, angle_var, val,
			hue = rand(360, 0, 1);

        // check if it is time to shot this particle
        if (t - delay >= 0) {
            this.active = true;

            // get a random confetti
            confetti = confettis[floor(random() * confettis.length)];

            // position it at the source (mouse pointer), but a bit lower
            // depending on its radius
            pos = { 'x': source.x + rand(-10, 10), 'y': source.y };

            // give it acceleration
            // account for gravity and uniform friction (depends on its radius just like position)
            a = { 'x': 0, 'y': .4 };

            // generates random angle form which to shoot
            // the object property mapping we did above allows us to call PI just like this
            angle = rand(PI / 8, -PI / 8) - PI / 2;

            c_angle = 0;
            angle_v = rand(-30, 30);

            // generates random velocity absolute value (V-A-L)
            val = rand(h / 21, h / 60);

            // comput initial velocity components
            v = {
                'x': val * cos(angle),
                'y': val * sin(angle)
            };
        }
    };

    /*
		if particle is in motion update its velocity
	*/
    this.motionUpdate = function () {
        /*
        ---From Tutorial:
        
         * velocity_incr = acceleration * time_incr
         * position_incr = velocity * time_incr
         * but time_incr = 1 in our case
         * (see the t++ line in drawOnCanvas)
         * so compute new velocity and position components
         * based on this
         */

        v.x += a.x;
        v.y += a.y;
        pos.x += round(v.x);
        pos.y += round(v.y);
        c_angle += angle_v;

        // get rid of it if it falls below canvas edge
        // pipe is bitwise or aka .5 becomes 0 becomes false
        if (pos.y > h | pos.x < 0 | pos.x > w) {

            pos = { 'x': source.x, 'y': source.y }; // source is mouse pointer

            this.active = false;
        }
    };

    this.draw = function (context) {
        context.save();

        context.translate(pos.x, pos.y);
        context.rotate(c_angle * Math.PI / 180);

        context.drawImage(confetti, -(confetti.width / 2), -(confetti.height / 2));

        context.restore();

        // update its velocity and position
        this.motionUpdate();
    };
};


/*
	Functions
*/


function rand(max, min, _int) {
    max = (max === 0 || max) ? max : 1;
    min = min || 0;
    gen = min + (max - min) * random();

    return (_int) ? round(gen) : gen;
};



//create some confetti
function loadConfetti() {

    var guy_1 = new Image();
    guy_1.src = "guy-png.png";
    confettis.push(guy_1);
    


    
/*	
	confetti_orange = new Image;
	// confetti_orange.src = ENTER PATH TO SOURCE IMAGE
	confettis.push(confetti_orange);
	
	
	// add more images if i want.
	confetti_blue = new Image;
	//confetti_blue.src = 
	confettis.push(confetti_blue);
	
	confetti_purple = new Image;
	//confetti_purple.src = 
	confettis.push(confetti_purple);
	*/

    // and i can add the rest later.
};


/*
	Initialize a bunch of stuff
*/
function initCanvas() {
    var s = getComputedStyle(c);

    // tutorial says "stop animataion if any got started"
    if (req_id) {
        particles = [];
        cancelAnimationFrame(req_id);
        req_id = null;
        t = 0;
    }

    w = c.width = ~~s.width.split('px')[0];
    h = c.height = ~~s.height.split('px')[0];

    source = { 'x': round(w / 2), y: h };

    // create particles and add to particle array
    for (var i = 0; i < NUMBER_OF_PARTICLES; i++) {
        particles.push(new Particle(i));
    }

    drawOnCanvas();
};


function drawOnCanvas() {
    context.clearRect(0, 0, w, h);

    for (var i = 0; i < NUMBER_OF_PARTICLES; i++) {
        if (particles[i].active) {
            particles[i].draw(context);
        }
        else {
            particles[i].shoot(context);
        }
    }

    t++;

    req_id = requestAnimationFrame(drawOnCanvas);
};

function wtf() {

    var x = document.getElementById("testObject");
    x.innerHTML = "Yo!";
};


/*
	Start it
    moving this to onLoad()
*/
//loadConfetti();

setTimeout(function () {
    //initCanvas();

    addEventListener('resize', initCanvas, false);

    c.addEventListener('mousemove', function (e) {
        context.clearRect(0, 0, w, h);

        source.x = e.clientX;
        source.y = e.clientY;
    }, false);
}, 15);




























