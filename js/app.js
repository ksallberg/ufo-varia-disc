import { TrackballControls } from './TrackballControls.js';

var APP = {

    Player: function () {

        var renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding;
        document.body.appendChild(renderer.domElement);

        var loader = new THREE.ObjectLoader();
        var camera, scene;
        var controls;
        var rayCaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2(-100, -100);
        var currentTouch = null;

        var topPart  = new Set();
        var rotater1 = [];
        var rotater2 = [];
        var rotater3 = [];
        var rotater4 = [];

        this.width  = 500;
        this.height = 500;

        document.getElementById("rotera").
            addEventListener("click", function() { rotateUfo(90); });

        document.getElementById("rotera2").
            addEventListener("click", function() { rotateUfo(-90); });

        this.load = function(json) {
            this.setScene(loader.parse(json.scene));
            this.setCamera(loader.parse(json.camera));
        };

        this.setCamera = function(value) {
            camera = value;
            camera.aspect = this.width / this.height;
            camera.updateProjectionMatrix();
        };

        this.setScene = function(value) {
            scene = value;
        };

        this.setPixelRatio = function(pixelRatio) {
            renderer.setPixelRatio( pixelRatio );
        };

        this.setSize = function (width, height) {

            this.width = width;
            this.height = height;

            if(camera) {
                camera.aspect = this.width / this.height;
                camera.updateProjectionMatrix();
            }

            if(renderer) {
                renderer.setSize(width, height);
            }
        };

        function animate() {
            requestAnimationFrame(animate);

            rayCaster.setFromCamera(mouse, camera);

            var o1 = scene.getObjectByName("touch1");
            var o2 = scene.getObjectByName("touch2");
            var o3 = scene.getObjectByName("touch3");
            var o4 = scene.getObjectByName("touch4");

            var touches = [o1, o2, o3, o4];
            var intersects = rayCaster.intersectObjects(touches);

            for(var i = 0; i < intersects.length; i++) {
                currentTouch = intersects[i].object.name;
            }

            if(intersects.length == 0) {
                currentTouch = null;
            }

            controls.update();
            renderer.render(scene, camera);
        }

        this.play = function() {

            topPart.add(scene.getObjectByName("a2"));
            topPart.add(scene.getObjectByName("a"));
            topPart.add(scene.getObjectByName("b"));
            topPart.add(scene.getObjectByName("b2"));
            topPart.add(scene.getObjectByName("a3"));
            topPart.add(scene.getObjectByName("b3"));
            topPart.add(scene.getObjectByName("a4"));
            topPart.add(scene.getObjectByName("b4"));

            rotater1 = [scene.getObjectByName("a"),
                        scene.getObjectByName("b"),
                        scene.getObjectByName("c"),
                        scene.getObjectByName("d")];

            rotater2 = [scene.getObjectByName("a2"),
                        scene.getObjectByName("b2"),
                        scene.getObjectByName("c2"),
                        scene.getObjectByName("d2")];

            rotater3 = [scene.getObjectByName("a3"),
                        scene.getObjectByName("b3"),
                        scene.getObjectByName("c3"),
                        scene.getObjectByName("d3")];

            rotater4 = [scene.getObjectByName("a4"),
                        scene.getObjectByName("b4"),
                        scene.getObjectByName("c4"),
                        scene.getObjectByName("d4")];

            document.addEventListener('pointerdown', onPointerDown);
            document.addEventListener('pointerup', onPointerUp);
            document.addEventListener('pointermove', onPointerMove);

            controls = new TrackballControls(camera, renderer.domElement);

            controls.rotateSpeed = 2.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;

            scene.rotation.z = degreesToRadians(90);

            controls.keys = ['KeyA', 'KeyS', 'KeyD'];
            animate();
        };

        this.stop = function() {

            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('pointermove', onPointerMove);

            renderer.setAnimationLoop(null);
        };

        this.dispose = function () {
            renderer.dispose();
            camera = undefined;
            scene = undefined;
        };

        function rotateUfo(degrees) {

            var topMarkers = scene.getObjectByName("topmarkers");
            var bottomMarkers = scene.getObjectByName("bottommarkers");

            topPart.forEach(function(knob) {
                knob.rotation.x += degreesToRadians(degrees);
            });

            topMarkers.rotation.x += degreesToRadians(degrees);
            // console.log(getTopLevelKnobs());

            // counter clock wise
            if(degrees == 90) {
                var tmp1 = rotater4[0];
                var tmp2 = rotater4[1];

                rotater4[0] = rotater3[0];
                rotater4[1] = rotater3[1];

                rotater3[0] = rotater2[0];
                rotater3[1] = rotater2[1];

                rotater2[0] = rotater1[0];
                rotater2[1] = rotater1[1];

                rotater1[0] = tmp1;
                rotater1[1] = tmp2;

            // clock wise
            } else if(degrees == -90) {
                var tmp1 = rotater4[0];
                var tmp2 = rotater4[1];

                rotater4[0] = rotater1[0];
                rotater4[1] = rotater1[1];

                rotater1[0] = rotater2[0];
                rotater1[1] = rotater2[1];

                rotater2[0] = rotater3[0];
                rotater2[1] = rotater3[1];

                rotater3[0] = tmp1;
                rotater3[1] = tmp2;
            }
        }

        function degreesToRadians(degrees) {
            return degrees * (Math.PI/180);
        }

        function radiansToDegrees(radians) {
            return (radians * 180) / Math.PI;
        }

        /*
          Expected input, an array of touch pads
         */
        function spinRotater(rotater) {
            rotater.forEach(function (knob) {
                knob.rotation.y += degreesToRadians(-90);
            });

            // The idea is to remove the first current
            // knob in the rotater. Then put it at the end of
            // the array, the third knob is to join the topPart

            // This depends on the order the knobs happen to be
            // placed in the 3d model.
            var firstKnob = rotater[0];
            topPart.delete(firstKnob);
            topPart.add(rotater[2]);

            var toRemove = rotater.shift();
            rotater.push(toRemove);
        }

        function onPointerDown(event) {
            if(currentTouch==null) {
                return;
            }
            switch(currentTouch) {
            case "touch1":
                spinRotater(rotater1);
                break;
            case "touch2":
                spinRotater(rotater2);
                break;
            case "touch3":
                spinRotater(rotater3);
                break;
            case "touch4":
                spinRotater(rotater4);
                break;
            default:
            }
            event.preventDefault();
        }

        function onPointerUp(event) {
            event.preventDefault();
        }

        function onPointerMove(event) {
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            event.preventDefault();
        }
    }
};

export { APP };
