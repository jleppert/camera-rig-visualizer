var THREE             = require('three'),
    TrackballControls = require('three-trackballcontrols'),
    dat               = require('dat-gui');

var gui = new dat.GUI();
var scene = new THREE.Scene();
var axes = new THREE.AxisHelper(200);
//scene.add(axes);

var ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 200;

var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new TrackballControls(camera, renderer.domElement);

var angle = 0, position = 0;
var direction = new THREE.Vector3(1, 0, 0);
var up = new THREE.Vector3(0, 0, 1);
var axis = new THREE.Vector3();

var path = new THREE.Path();
path.absarc(0, 0, 500, -Math.PI, 0, false);

var focalPath = new THREE.Path();
focalPath.absarc(0, 0, 500, Math.PI, 0, true);

var midPoint = focalPath.getPoint(0.5);

// focal length
// aspect ratio
// ground height
// arc size
// imaging height
// overlap

drawPath(path, 0xffffff);
drawPath(focalPath, 0x0000ff);
var cameras = [
  new THREE.PerspectiveCamera(20, 3 / 2, 0.1, 2000),
  new THREE.PerspectiveCamera(20, 3 / 2, 0.1, 2000),
  new THREE.PerspectiveCamera(20, 3 / 2, 0.1, 2000),
  new THREE.PerspectiveCamera(20, 3 / 2, 0.1, 2000)
].forEach(function(camera, index, cameras) {
  var position = (1 / (cameras.length - 1) * index);
  var point = path.getPoint(position);

  camera.position.x = point.x;
  camera.position.y = point.y;
  camera.position.z = 0;

  camera.up = up;
  camera.lookAt(new THREE.Vector3(midPoint.x, midPoint.y, 0));

  scene.add(camera);

  var material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
            shading: THREE.FlatShading
              });
   var geometry = new THREE.BoxGeometry(5, 5, 5);
   var mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

  mesh.position.x = point.x;
  mesh.position.y = point.y;

  var helper = new THREE.CameraHelper(camera);
  scene.add(helper);
 

  var angle = getAngle(position);
  //mesh.quaternion.setFromAxisAngle(up, angle);
  //camera.quaternion.setFromAxisAngle(up, angle);
  //camera.lookAt(new THREE.Vector3(position * 500, position * 500, 0));
});

function getAngle(index) {
  var tangent = path.getTangent(position).normalize();
  angle = -Math.atan(tangent.x / tangent.y);

  return angle;
}

function drawPath(path, color) {
  var vertices = path.getSpacedPoints(20);

  // Change 2D points to 3D points
  for (var i = 0; i < vertices.length; i++) {
    point = vertices[i]
      vertices[i] = new THREE.Vector3(point.x, point.y, 0);
  }
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices = vertices;
  var lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff
  });

  var line = new THREE.Line(lineGeometry, lineMaterial)
  scene.add(line);
}

function draw() {
  requestAnimationFrame(draw);

  controls.update();
  renderer.render(scene, camera);
}
draw();
