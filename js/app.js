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

        var topPart  = [];
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

            topPart = [scene.getObjectByName("a2"),
                       scene.getObjectByName("a"),
                       scene.getObjectByName("b"),
                       scene.getObjectByName("b2"),
                       scene.getObjectByName("a3"),
                       scene.getObjectByName("b3"),
                       scene.getObjectByName("a4"),
                       scene.getObjectByName("b4")];

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

            for(var i = 0; i < topPart.length; i ++) {
                topPart[i].rotation.x += degreesToRadians(degrees);
            }

            topMarkers.rotation.x += degreesToRadians(degrees);
        }

        function degreesToRadians(degrees) {
            return degrees * (Math.PI/180);
        }

        function onPointerDown(event) {
            if(currentTouch==null) {
                return;
            }
            console.log(currentTouch);
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
