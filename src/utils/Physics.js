import { Matrix4, Vector3, Raycaster, Plane, Vector2, Quaternion, Euler } from 'three';
import Constants from './Constants';

var planeIntersect = new Vector3(); // point of intersection with the plane
var shift = new Vector3()
var plane = new Plane();
var mouse = new Vector2()
var raycaster = new Raycaster()
var pIntersect = new Vector3(); // point of intersection with an object (plane's point)

var pNormal = new Vector3(0, -16, 0); // plane's normal
var dragObject

function pocketed(ballRef) {
  ballRef.current.speed.x = 0;
  ballRef.current.speed.y = 0;
  
  if(ballRef.current.id == 38){
	  ballRef.current.position.set(0, -16, 0);
	  return
  }
  ballRef.current.position.set(0, 28, 0);
}

function shoot(force, ref, e, camera, zero) {
  //Only shoots if the white ball is stopped
  
  if(ref.current.speed.y > 0.003 || ref.current.speed.y < -0.003){
	//return
  }
  
  console.log(ref);
  console.log(camera);
  
  ref.current.rotation.set(0, 0, 0);   
  
  let x = e.clientX || e.targetTouches[0].clientX
  let y = e.clientY || e.targetTouches[0].clientY  
  
  //x = x / ref.current.position.x || 0
  //y = ((y / ref.current.position.y) - ref.current.position.y) * -1
  
  
	x = ( x  / window.innerWidth ) * 2 - 1
	y = - (y / window.innerHeight ) * 2 + 1
    
    
    	const a = {
		x: ref.current.position.x,
		y: ref.current.position.y
	};

  
	var vector = new Vector3(x, y, 0.5);	

	console.log(camera);
	
	vector.unproject( camera );
	
	
	var dir = vector.sub( camera.position ).normalize();
	var distance = - camera.position.z / dir.z;
	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
	

	const p = {
		x: pos.x,
		y: pos.y
	};

	const angle = Math.atan2(p.y - a.y, p.x - a.x);
  
  
  
  const speedX = Math.cos(angle) * force;
  const speedY = Math.sin(angle) * force;
  ref.current.speed.x = speedX;
  ref.current.speed.y = speedY;
}

function checkBallCollision(ball1, ball2) {
  const dx = ball2.current.position.x - ball1.current.position.x;
  const dy = ball2.current.position.y - ball1.current.position.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 1) {
    // Collision!
    // Play sound
    //sound.play();
    const angle1 = Math.atan2(ball1.current.speed.y, ball1.current.speed.x);
    const angle2 = Math.atan2(ball2.current.speed.y, ball2.current.speed.x);

    const vel1 = Math.sqrt(
      ball1.current.speed.x * ball1.current.speed.x +
        ball1.current.speed.y * ball1.current.speed.y
    );
    const vel2 = Math.sqrt(
      ball2.current.speed.x * ball2.current.speed.x +
        ball2.current.speed.y * ball2.current.speed.y
    );

    const collisionAngle = Math.atan2(dy, dx);

    const aSpeedX =
      ((2 * vel2 * Math.cos(angle2 - collisionAngle)) / 2) *
        Math.cos(collisionAngle) +
      vel1 *
        Math.sin(angle1 - collisionAngle) *
        Math.cos(collisionAngle + Math.PI / 2);
    const aSpeedY =
      ((2 * vel2 * Math.cos(angle2 - collisionAngle)) / 2) *
        Math.sin(collisionAngle) +
      vel1 *
        Math.sin(angle1 - collisionAngle) *
        Math.sin(collisionAngle + Math.PI / 2);

    const bSpeedX =
      ((2 * vel1 * Math.cos(angle1 - collisionAngle)) / 2) *
        Math.cos(collisionAngle) +
      vel2 *
        Math.sin(angle2 - collisionAngle) *
        Math.cos(collisionAngle + Math.PI / 2);
    const bSpeedY =
      ((2 * vel1 * Math.cos(angle1 - collisionAngle)) / 2) *
        Math.sin(collisionAngle) +
      vel2 *
        Math.sin(angle2 - collisionAngle) *
        Math.sin(collisionAngle + Math.PI / 2);

    // Reset position outside of collision bounds.
    ball1.current.position.x =
      ball2.current.position.x -
      Math.round(Math.cos(collisionAngle) * 1000) / 1000;
    ball1.current.position.y =
      ball2.current.position.y -
      Math.round(Math.sin(collisionAngle) * 1000) / 1000;

    ball1.current.speed.x = aSpeedX;
    ball1.current.speed.y = aSpeedY;
    ball2.current.speed.x = bSpeedX;
    ball2.current.speed.y = bSpeedY;
  }
}

function checkTableCollision(ballRef) {
  const dimensions = Constants.tableDimensions;

  if (
    ballRef.current.position.x + 1 > dimensions.topRight.x ||
    ballRef.current.position.x - 1 < dimensions.topLeft.x
  ) {
    ballRef.current.speed.x *= -1;
  }
  if (
    ballRef.current.position.y + 1 > dimensions.topRight.y ||
    ballRef.current.position.y - 1 < dimensions.bottomRight.y
  ) {
    ballRef.current.speed.y *= -1;
  }

  if (
    (ballRef.current.position.x - 1.3 < dimensions.topLeft.x &&
      ballRef.current.position.y + 1.3 > dimensions.topLeft.y) ||
    (ballRef.current.position.x + 1.3 > dimensions.topRight.x &&
      ballRef.current.position.y + 1.3 > dimensions.topRight.y) ||
    (ballRef.current.position.x - 1.3 < dimensions.bottomLeft.x &&
      ballRef.current.position.y - 1.3 < dimensions.bottomLeft.y) ||
    (ballRef.current.position.x + 1.3 > dimensions.bottomRight.x &&
      ballRef.current.position.y - 1.3 < dimensions.bottomRight.y) ||
    (ballRef.current.position.x - 0.5 < dimensions.topLeft.x &&
      (ballRef.current.position.y < 1.2 &&
        ballRef.current.position.y > -1.2)) ||
    (ballRef.current.position.x + 0.5 > dimensions.topRight.x &&
      (ballRef.current.position.y < 1.2 && ballRef.current.position.y > -1.2))
  ) {
    pocketed(ballRef);
  }
}

function moveBall(ballRef, delta, coeff) {
  // Setting rolling resistance.
  ballRef.current.speed.x *= 1 - coeff * delta;
  ballRef.current.speed.y *= 1 - coeff * delta;

  // Set new position according to x/y speed.
  const stepX = ballRef.current.speed.x * delta;
  const stepY = ballRef.current.speed.y * delta;

  ballRef.current.position.set(
    ballRef.current.position.x + stepX,
    ballRef.current.position.y + stepY,
    0
  );

  let tempMat = new Matrix4();
  tempMat.makeRotationAxis(new Vector3(0, 1, 0), stepX / 0.5);
  tempMat.multiply(ballRef.current.matrix);
  ballRef.current.matrix = tempMat;
  tempMat = new Matrix4();
  tempMat.makeRotationAxis(new Vector3(1, 0, 0), -stepY / 0.5);
  tempMat.multiply(ballRef.current.matrix);
  ballRef.current.matrix = tempMat;
  ballRef.current.rotation.setFromRotationMatrix(ballRef.current.matrix);
}

export default { shoot, checkBallCollision, checkTableCollision, moveBall };
