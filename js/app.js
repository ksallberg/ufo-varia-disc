var APP = {

    Player: function () {

        var renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.outputEncoding = THREE.sRGBEncoding;

        var loader = new THREE.ObjectLoader();
        var camera, scene;

        var vrButton = VRButton.createButton( renderer );

        var events = {};

        var dom = document.createElement( 'div' );
        dom.appendChild( renderer.domElement );

        var mouseDown = false;
        var mouseX = 0;
        var mouseY = 0;

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

            var project = json.project;

            if ( project.vr !== undefined ) {
                renderer.xr.enabled = project.vr;
            }
            if ( project.shadows !== undefined ) {
                renderer.shadowMap.enabled = project.shadows;
            }
            if ( project.shadowType !== undefined ) {
                renderer.shadowMap.type = project.shadowType;
            }
            if ( project.toneMapping !== undefined ) {
                renderer.toneMapping = project.toneMapping;
            }
            if ( project.toneMappingExposure !== undefined ) {
                renderer.toneMappingExposure = project.toneMappingExposure;
            }
            if ( project.physicallyCorrectLights !== undefined ) {
                renderer.physicallyCorrectLights =
                    project.physicallyCorrectLights;
            }

            this.setScene( loader.parse( json.scene ) );
            this.setCamera( loader.parse( json.camera ) );

            events = {
                init: [],
                start: [],
                stop: [],
                keydown: [],
                keyup: [],
                pointerdown: [],
                pointerup: [],
                pointermove: [],
                update: []
            };

            var scriptWrapParams = 'player,renderer,scene,camera';
            var scriptWrapResultObj = {};

            for ( var eventKey in events ) {

                scriptWrapParams += ',' + eventKey;
                scriptWrapResultObj[ eventKey ] = eventKey;

            }

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

            object1.addEventListener("mouseover", function(e) {
                e.target.style.cursor='pointer';
            });

            dispatch(events.init, arguments);
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

        function dispatch( array, event ) {
            for ( var i = 0, l = array.length; i < l; i ++ ) {
                array[ i ]( event );
            }
        }

        var time, startTime, prevTime;

        function animate() {

            time = performance.now();

            try {
                dispatch(events.update,
                         { time: time - startTime, delta: time - prevTime } );

            } catch ( e ) {

                console.error( ( e.message || e ), ( e.stack || '' ) );

            }

            // scene.rotation.x = 0.1;
            // scene.rotation.z = 1;

            renderer.render( scene, camera );

            prevTime = time;
        }

        this.play = function () {

            if ( renderer.xr.enabled ) dom.append( vrButton );

            startTime = prevTime = performance.now();

            document.addEventListener( 'keydown', onKeyDown );
            document.addEventListener( 'keyup', onKeyUp );
            document.addEventListener( 'pointerdown', onPointerDown );
            document.addEventListener( 'pointerup', onPointerUp );
            document.addEventListener( 'pointermove', onPointerMove );

            dispatch( events.start, arguments );

            renderer.setAnimationLoop( animate );
        };

        this.stop = function () {

            if ( renderer.xr.enabled ) vrButton.remove();

            document.removeEventListener( 'keydown', onKeyDown );
            document.removeEventListener( 'keyup', onKeyUp );
            document.removeEventListener( 'pointerdown', onPointerDown );
            document.removeEventListener( 'pointerup', onPointerUp );
            document.removeEventListener( 'pointermove', onPointerMove );

            dispatch( events.stop, arguments );
            renderer.setAnimationLoop( null );
        };

        this.render = function ( time ) {
            dispatch( events.update, { time: time * 1000, delta: 0 } );
            renderer.render( scene, camera );
        };

        this.dispose = function () {
            renderer.dispose();
            camera = undefined;
            scene = undefined;
        };

        function rotateScene(deltaX, deltaY) {
            scene.rotation.y += deltaX / 100;
            scene.rotation.x += deltaY / 100;
        }

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

        function onKeyDown( event ) {
            dispatch( events.keydown, event );
        }

        function onKeyUp( event ) {
            dispatch( events.keyup, event );
        }

        function onPointerDown( event ) {
            dispatch( events.pointerdown, event );
            event.preventDefault();
            mouseDown = true;
        }

        function onPointerUp( event ) {
            dispatch( events.pointerup, event );
            event.preventDefault();
            mouseDown = false;
        }

        function onPointerMove( event ) {
            dispatch( events.pointermove, event );
            if(!mouseDown) {
                return
            }
            event.preventDefault();
            var deltaX = event.clientX - mouseX;
            var deltaY = event.clientY - mouseY;
            mouseX = event.clientX;
            mouseY = event.clientY;
            rotateScene(deltaX, deltaY);
        }
    }
};

export { APP };
