import { OrbitControls } from './OrbitControls.js';
import { TrackballControls } from './TrackballControls.js';

var APP = {

    Player: function () {

        var renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.outputEncoding = THREE.sRGBEncoding;

        var loader = new THREE.ObjectLoader();
        var camera, scene;

        var controls;

        var vrButton = VRButton.createButton( renderer );

        var dom = document.createElement( 'div' );
        dom.appendChild( renderer.domElement );

        var rayCaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2(-100, -100);

        var currentTouch = null;

        this.dom = dom;

        this.width = 500;
        this.height = 500;

        document.
            getElementById("rotera").
            addEventListener("click",
                             function() {
                                 rotateUfo(90);
                             }
                            );

        document.
            getElementById("rotera2").
            addEventListener("click",
                             function() {
                                 rotateUfo(-90);
                             }
                            );

        this.load = function ( json ) {

            this.setScene( loader.parse( json.scene ) );
            this.setCamera( loader.parse( json.camera ) );

            controls = new OrbitControls( camera, renderer.domElement );
            controls.enablePan = true;
            controls.enableDamping = true;

            var scriptWrapParams = 'player,renderer,scene,camera';
            var scriptWrapResultObj = {};

            var scriptWrapResult =
                JSON.stringify( scriptWrapResultObj ).replace( /\"/g, '' );

            var object1 = scene.getObjectByName( "a2" );
            var object2 = scene.getObjectByName( "a" );
            var object3 = scene.getObjectByName( "b" );
            var object4 = scene.getObjectByName( "b2" );
            var object5 = scene.getObjectByName( "a3" );
            var object6 = scene.getObjectByName( "b3" );
            var object7 = scene.getObjectByName( "a4" );
            var object8 = scene.getObjectByName( "b4" );
        };

        this.setCamera = function ( value ) {
            camera = value;
            camera.aspect = this.width / this.height;
            camera.updateProjectionMatrix();
        };

        this.setScene = function ( value ) {
            scene = value;
        };

        this.setPixelRatio = function ( pixelRatio ) {
            renderer.setPixelRatio( pixelRatio );
        };

        this.setSize = function ( width, height ) {

            this.width = width;
            this.height = height;

            if ( camera ) {
                camera.aspect = this.width / this.height;
                camera.updateProjectionMatrix();
            }

            if ( renderer ) {
                renderer.setSize( width, height );
            }
        };

        var time, startTime, prevTime;

        function animate() {
            time = performance.now();

            rayCaster.setFromCamera(mouse, camera);

            var o1 = scene.getObjectByName( "touch1" );
            var o2 = scene.getObjectByName( "touch2" );
            var o3 = scene.getObjectByName( "touch3" );
            var o4 = scene.getObjectByName( "touch4" );

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

            prevTime = time;
        }

        this.play = function () {

            if ( renderer.xr.enabled ) dom.append( vrButton );

            startTime = prevTime = performance.now();

            document.addEventListener( 'pointerdown', onPointerDown );
            document.addEventListener( 'pointerup', onPointerUp );
            document.addEventListener( 'pointermove', onPointerMove );

            renderer.setAnimationLoop( animate );
        };

        this.stop = function () {

            if ( renderer.xr.enabled ) vrButton.remove();

            document.removeEventListener( 'pointerdown', onPointerDown );
            document.removeEventListener( 'pointerup', onPointerUp );
            document.removeEventListener( 'pointermove', onPointerMove );

            renderer.setAnimationLoop( null );
        };

        this.dispose = function () {
            renderer.dispose();
            camera = undefined;
            scene = undefined;
        };

        function rotateUfo(degrees) {
            var object1 = scene.getObjectByName( "a2" );
            var object2 = scene.getObjectByName( "a" );
            var object3 = scene.getObjectByName( "b" );
            var object4 = scene.getObjectByName( "b2" );
            var object5 = scene.getObjectByName( "a3" );
            var object6 = scene.getObjectByName( "b3" );
            var object7 = scene.getObjectByName( "a4" );
            var object8 = scene.getObjectByName( "b4" );

            var topMarkers = scene.getObjectByName( "topmarkers" );
            var bottomMarkers = scene.getObjectByName( "bottommarkers" );

            object1.rotation.x += degreesToRadians(degrees);
            object2.rotation.x += degreesToRadians(degrees);
            object3.rotation.x += degreesToRadians(degrees);
            object4.rotation.x += degreesToRadians(degrees);
            object5.rotation.x += degreesToRadians(degrees);
            object6.rotation.x += degreesToRadians(degrees);
            object7.rotation.x += degreesToRadians(degrees);
            object8.rotation.x += degreesToRadians(degrees);

            topMarkers.rotation.x += degreesToRadians(degrees);
        }

        function degreesToRadians(degrees) {
            return degrees * (Math.PI/180);
        }

        function onPointerDown( event ) {
            console.log(currentTouch);
            event.preventDefault();
        }

        function onPointerUp( event ) {
            event.preventDefault();
        }

        function onPointerMove( event ) {
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            event.preventDefault();
        }
    }
};

export { APP };
