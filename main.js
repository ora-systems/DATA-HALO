var width = 1400, height = 800;
var colorWheelRadius = 92.5;
var center = [];
var mx, my, mouseDownOnColor = false;
var points = 0, points3day = 0, points8week = 0, pointsLast3day = 0, posts = 0, posts3day = 0, d3Day = 0;
var pointsCounter = 0, points3dayCounter = 0, points8weekCounter = 0, pointsLast3dayCounter = 0, postsCounter = 0, posts3dayCounter = 0;

var mouseDownOnCanvas = false;
var logoTexture, logoGraphic;

var sizeSlider;
var colorSlider;
var rotationSlider;
var wobbleSlider;
var complexitySlider;
var colorRatioSlider;
var ringsSlider;
var wavesSlider;
var waveSpeedSlider;
var speedSlider;
var pilRotationSlider;
var colorSegments;
var logoToggle;

function preload() {

}



var centerColor = [], mainColor = [], waveColor = [];
function setup() {



    /*P5 JS canvas for PIL + HALO render*/
    
    var p5Canvas = createCanvas(800, 800, WEBGL);
    center.x = 0;
    center.y = 0;
    
    centerColor.hue = 0;
    mainColor.hue = 255;
    waveColor.hue = 55;
    
    centerColor.saturation = 55;
    mainColor.saturation = 255;
    waveColor.saturation = 0;

    logoTexture = loadImage("./resources/blueEarth.png");
    //logoGraphic = createGraphics(1000, 400, WEBGL);

    
   
    /*Controls from HTML document*/
    
    //Range sliders
    sizeSlider = document.getElementById("size");
    logoToggle = document.getElementById("logoSwitch")
    radiusSlider = document.getElementById("radius");
    rotationSlider = document.getElementById("rotation");
    wobbleSlider = document.getElementById("wobble");
    complexitySlider = document.getElementById("complexity");
    colorRatioSlider = document.getElementById("colorRatio");
    ringsSlider = document.getElementById("rings");
    wavesSlider = document.getElementById("waves");
    waveSpeedSlider = document.getElementById("waveSpeed");
    speedSlider = document.getElementById("speed");
    colorSegments = document.getElementById("colorSeg");

    console.log(sizeSlider.value)
    console.log(logoToggle.value)
    console.log(radiusSlider.value)
    console.log(rotationSlider.value)
    console.log(wobbleSlider.value)
    console.log(complexitySlider.value)
    console.log(colorRatioSlider.value)
    console.log(ringsSlider.value)
    console.log(wavesSlider.value)
    console.log(waveSpeedSlider.value)
    console.log(speedSlider.value)
    console.log(colorSegments.value)


    //DATA : role
    //Set default colors 
    centerColor.red = 255;
    centerColor.green = 255;
    centerColor.blue = 255;

    mainColor.red = 255;
    mainColor.green = 25;
    mainColor.blue = 0;

    waveColor.red = 255;
    waveColor.green = 0;
    waveColor.blue = 0;
    
    //Canvas color block
    colorCanvas = document.getElementById("colorCanvas");
    colorCanvas.width = colorWheelRadius*2;
    colorCanvas.height = colorWheelRadius*2;
	context = colorCanvas.getContext("2d");
    
    //Mouse coords on color block
    colorCanvas.addEventListener('mousedown', e => {
        mx = e.offsetX - colorWheelRadius;
        my = colorWheelRadius - e.offsetY;
        mouseDownOnColor = true;
    });
    
}

var time = 0.0, radius = 125.0;

var mousePressLoc = [];
var lastYAngle = 0.0, lastXAngle = 0.0, yAngle = 0.0, xAngle = 0.0;

var pilAngle = 0.0;

var size = 0.85, rotation = 0.0, rotationSpeed = 0.01, wobble = 0.25, complexity = 0.5, colorRatio = 0.5, waveSpeed = 0.5, speed = 0.5;

var logo = false;

var waveOffset = 0.0;
var ringCount = 55, waveCount = 3;
var colorToggle = -1;
function draw() {
    randomSeed(0);
    background(0);

    
    /*Set Parameters*/
    
    //vertices to be data-driven
    size = 0.5 + sizeSlider.value/100.0; // DATA : weeks of activity
    radius = radiusSlider.value/100.0;
    logo = (logoToggle.value == 0) ? false : true;
    rotationSpeed = (rotationSlider.value/100.0 - 0.5)*0.05; // DATA : 3 day point derivative
    wobble = wobbleSlider.value/100.0;
    complexity = 0.25 + complexitySlider.value/100.0; // DATA : 3 day posts
    colorRatio = (colorRatioSlider.value/50.0)-1; // DATA : 3 day point toal
    ringCount = 12 + floor(ringsSlider.value);
    waveCount = floor(wavesSlider.value/10.0*ringCount/100); // DATA : 3 day responses
    waveSpeed = waveSpeedSlider.value/100.0;
    speed = speedSlider.value/1000.0 + 0.05;
    colorToggle = colorSegments.value;


    
    /* UNCOMMENT THIS TO CHANGE INPUTS 

    size = 0.0;            
    radius = 0.0;           
    logo = 0.0;             //(1 or 0 for on/off)      
    rotationSpeed = 0.0;   
    wobble = 0.0;           
    complexity = 0.0;      
    colorRatio = 0.0;       
    ringCount = 0.0;        
    waveCount = 0.0;
    waveSpeed = 0.0;
    speed = 0.0;
    colorToggle = 0.0;      // 0, 1, or 2 for center color, main color, and wave color

*/



    //calculate HSV color from mouse coords on color block
    var mag = sqrt(mx*mx+my*my);
    
    if (mouseDownOnColor) {

        //Calculate RGB from HSV

        //Center Color
        var colorFromHSV = [];
    
        if (colorToggle == 0) {
            centerColor.hue = (my < 0) ? (acos(mx/mag))/PI/2*360 : (PI*2 - acos(mx/mag))/PI/2*360;
            centerColor.saturation = (mag/colorWheelRadius*2.0)*255;
            centerColor.value = (1.0-0.5*mag/(1.0*colorWheelRadius));

            colorFromHSV = hsv_to_rgb(centerColor.hue, centerColor.saturation, centerColor.value);
            centerColor.red = colorFromHSV.red;
            centerColor.green = colorFromHSV.green;
            centerColor.blue = colorFromHSV.blue;

        } else if (colorToggle == 1) {
            mainColor.hue = (my < 0) ? (acos(mx/mag))/PI/2*360 : (PI*2 - acos(mx/mag))/PI/2*360;
            mainColor.saturation = (mag/colorWheelRadius*2.0)*255;
            mainColor.value = (1.0-0.5*mag/(1.0*colorWheelRadius));

            colorFromHSV = hsv_to_rgb(mainColor.hue, mainColor.saturation, mainColor.value);
            mainColor.red = colorFromHSV.red;
            mainColor.green = colorFromHSV.green;
            mainColor.blue = colorFromHSV.blue;

        } else if (colorToggle == 2) {
            waveColor.hue = (my < 0) ? (acos(mx/mag))/PI/2*360 : (PI*2 - acos(mx/mag))/PI/2*360;
            waveColor.saturation = (mag/colorWheelRadius*2.0)*255;
            waveColor.value = (1.0-0.5*mag/colorWheelRadius);
            
            colorFromHSV = hsv_to_rgb(waveColor.hue, waveColor.saturation, waveColor.value);
            waveColor.red = colorFromHSV.red;
            waveColor.green = colorFromHSV.green;
            waveColor.blue = colorFromHSV.blue;
        }

    }
    mouseDownOnColor = false;


    var centerColorDot = document.getElementById("centerColorDot");
    var mainColorDot = document.getElementById("mainColorDot");
    var waveColorDot = document.getElementById("waveColorDot");
    centerColorDot.style.fill = 'rgb(' + centerColor.red + ',' + centerColor.green + ',' + centerColor.blue + ')';
    mainColorDot.style.fill = 'rgb(' + mainColor.red + ',' + mainColor.green + ',' + mainColor.blue + ')';
    waveColorDot.style.fill = 'rgb(' + waveColor.red + ',' + waveColor.green + ',' + waveColor.blue + ')';
    
    
    
    /* sample color
         context.fillStyle = 'hsl(' + mainColor.hue + ', 100%, ' + ((1.0-mainColor.saturation/255)*50+50) + '%)';
        context.beginPath();
         context.rect(colorWheelRadius/2, colorWheelRadius/2, 25, 25);
         context.closePath();
         context.fill();
         
         */
    
    
    
    /*Increment*/
    
    time += speed;
    
    waveOffset += 0.03*waveSpeed;
    if (waveOffset > 1.0) waveOffset--;
    
    rotation += rotationSpeed;
    //if (rotation > PI*2) rotation -= PI*2;
    
    
    background(0, 0, 0);

    //Logo

    
    /*HALO
        Rings with two scales of perlin noise (wobble and complexity), wave effects, and color gradient
        Parameters :
        RING COUNT
        COLOR GRADIENT (CENTER AND OUTER COLOR)
        COLOR RATIO (balance between colors)
        TILT (axis rotation)
        ROTATION (radial rotation)
        SPEED
        WOBBLE (large scale perlin)
        COMPLEXITY (small scale perlin)
        WAVE COUNT
        WAVE INTENSITY
        WAVE COLOR
    */
    
    
    if (radius > 0.05 && logo == true) {

    stroke(125);
    strokeWeight(3);
    noFill();
    var w = radius*180*1.5;
    //circle(0, 0, w*1.1);
   //image(logoTexture, -w/2, -w*0.2, w, w*0.4);
    }
    fill(0);
    noStroke();
    var w = radius*180*1.8;
    circle(0, 0, w*1.1);
    //image(logoTexture, -width/6.4, -height/6.4, width/3.2, height/3.2);
   
    //texture(logoTexture);

    rotateY(yAngle);
    rotateX(xAngle);


    blendMode(SCREEN);
    //blendMode(BLEND);

    colorMode(RGB);
    noFill();
    strokeWeight(2);
    
  for (var i = 0; i < 1.0; i += 1.0/ringCount) {
      //stroke(mainColor.saturation - (mainColor.saturation - centerColor.saturation)*(1-i)*colorRatio, 255, 255);
      //stroke(mainColor.hue - (mainColor.hue - centerColor.hue)*(1-i + colorRatio/2)*colorRatio, mainColor.saturation - (mainColor.saturation - centerColor.saturation)*(1-i + colorRatio/2)*colorRatio, 255);
      stroke(
            mainColor.red*(i-colorRatio) + centerColor.red*(1.0-i+colorRatio),
            mainColor.green*(i-colorRatio) + centerColor.green*(1.0-i+colorRatio),
            mainColor.blue*(i-colorRatio) + centerColor.blue*(1.0-i+colorRatio), 5);
      
            //Wave ring case
      if (waveCount > 0 && floor((i-waveOffset) * ringCount) % floor(ringCount/waveCount) == 0) {
          strokeWeight(2);
          stroke(
            waveColor.red*(0.7) + mainColor.red*(0.3),
            waveColor.green*(0.7) + mainColor.green*(0.3),
            waveColor.blue*(0.7) + mainColor.blue*(0.3));
            stroke(
              waveColor.red*sqrt(1-i) + mainColor.red*sq(i),
              waveColor.green*sqrt(1-i) + mainColor.green*sq(i),
              waveColor.blue*sqrt(1-i) + mainColor.blue*sq(i));
      }
      
      beginShape();
      for (var t = 0; t < 1.0; t += 0.01) {
          var rNoise = complexity*i*300*(noise(3 + time/5 - 3*i + 5*cos(t*PI*2), 3 + time/5 - 3*i + 5*sin(t*PI*2), i*5*complexity)-0.5);
          var xNoise = complexity*i*0*(noise(25 + time/5 + 155*cos(t*PI*2), 25 + time/5 + 155*sin(t*PI*2), i*1-time/5)-0.5);
          var yNoise = complexity*i*0*(noise(15 + time/5 + 155*cos(t*PI*2), 15 + time/5 + 155*sin(t*PI*2), i*1-time/5)-0.5);
          var zNoise = complexity*i*100*(noise(3 + time/5 + 155*cos(t*PI*2), 3 + time/5 + 155*sin(t*PI*2), i*1-time/5)-0.5);
          var xWobble = wobble*i*300*(noise(3 + time/5 + 0.5*cos(t*PI*2), 3 + time/5 + 0.5*sin(t*PI*2), i*1+time/5)-0.5);
          var yWobble = wobble*i*300*(noise(8 + time/5 + 0.5*cos(t*PI*2), 8 + time/5 + 0.5*sin(t*PI*2), i*1+time/5)-0.5);
          
          var x = (radius*180 + (i)*150*size + rNoise + xWobble)*cos(t*PI*2 + rotation) + xNoise;
          var y = (radius*180 + (i)*150*size + rNoise + yWobble)*sin(t*PI*2 + rotation) + yNoise;
          var z = zNoise;
          vertex(x, y, z);
      }
      endShape(CLOSE);
      strokeWeight(1);
  }
    
    
    //Draw FX
    

    translate(-center.x, -center.y, 200);
    
}

function hsv_to_hsl(h, s, v) {
    // both hsv and hsl values are in [0, 1]
    var l = (2 - s) * v / 2;

    if (l != 0) {
        if (l == 1) {
            s = 0
        } else if (l < 0.5) {
            s = s * v / (l * 2)
        } else {
            s = s * v / (2 - l * 2)
        }
    }

    return [h, s, l]
}

function hsv_to_rgb(h, s, v) {

    var color = [];

    var c = s/255;
    var x = c*(1-abs((h/60) % 2 - 1));
    var m = 1.0 - c;
    var rgb = [];
    if (h < 60) {
        rgb.r = c;
        rgb.g = x;
        rgb.b = 0;
    } else if (h < 120) {
        rgb.r = x;
        rgb.g = c;
        rgb.b = 0;
    } else if (h < 180) {
        rgb.r = 0;
        rgb.g = c;
        rgb.b = x;
    } else if (h < 240) {
        rgb.r = 0;
        rgb.g = x;
        rgb.b = c;
    } else if (h < 300) {
        rgb.r = x;
        rgb.g = 0;
        rgb.b = c;
    } else if (h < 360) {
        rgb.r = c;
        rgb.g = 0;
        rgb.b = x;
    }

    color.red = (rgb.r+m)*255*v;
    color.green = (rgb.g+m)*255*v;
    color.blue = (rgb.b+m)*255*v;

    return color;
}



function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        mouseDownOnCanvas = true;
        mousePressLoc.x = mouseX;
        mousePressLoc.y = mouseY;
    }
}

function mouseDragged() {
    if (mouseDownOnCanvas) {
        yAngle = lastYAngle + (mouseX - mousePressLoc.x)/255;
        xAngle = lastXAngle - (mouseY - mousePressLoc.y)/255;
    }
    
}

function mouseReleased() {

    if (mouseDownOnCanvas) {
        lastYAngle = yAngle;
        lastXAngle = xAngle;
    }

    mouseDownOnCanvas = false;
}


/*Old color function

    stroke(colorA.x*i*colorRatio*2 + colorB.x*(1.0-i)*(1.0-colorRatio)*2, colorA.y*i*colorRatio*2 + colorB.y*(1.0-i)*(1.0-colorRatio)*2, colorA.z*i*colorRatio*2 + colorB.z*(1.0-i)*(1.0-colorRatio)*2);*/