( function( document, window ) {

  "use strict";
  // Wait for impress.js to be initialized
  document.addEventListener( "impress:init", function( event ) {

    var api = event.detail.api;

    // Mousewheel support for zooming
    var passiveSupported = false;
    try {
      window.addEventListener( "test", null, Object.defineProperty({}, "passive", { get: function() { passiveSupported = true; } }));
    } catch(err) {}
    var impress_element = document.getElementById( 'impress' );
    document.addEventListener( 'wheel', function( evt ) {
      var pos = { x:0, y:0 };
      var zoom_point = { x:0, y:0 };
      var zoom_target = { x:0, y:0 };

      var computed_style = window.getComputedStyle( impress_element );
      var transition_state_keep = impress_element.style.transition;
      impress_element.style.transition = "";

      var matrix_transform = computed_style.transform.split( '(' )[1].split( ')' )[0].split( ',' );
      var current_scale = { x:( parseFloat( matrix_transform[0] ) ), y:( parseFloat( matrix_transform[3] ) ) };
      var scale_factor = evt.deltaY / -300;
      var new_scale = { x:( current_scale.x + scale_factor ), y:( current_scale.x + scale_factor ) };
      new_scale.x = Math.min( Math.max( new_scale.x, 0.1) , 3.0 );
      new_scale.y = Math.min( Math.max( new_scale.y, 0.1) , 3.0 );

      zoom_point.x = evt.clientX - ( document.body.clientWidth / 2 );
      zoom_point.y = evt.clientY - ( document.body.clientHeight / 2 );
      zoom_target.x = ( zoom_point.x - parseFloat( matrix_transform[4] ) ) / current_scale.x;
      zoom_target.y = ( zoom_point.y - parseFloat( matrix_transform[5] ) ) / current_scale.y;
      pos.x = -zoom_target.x * new_scale.x + zoom_point.x;
      pos.y = -zoom_target.y * new_scale.y + zoom_point.y;

      matrix_transform[4] = pos.x;
      matrix_transform[5] = pos.y;
      matrix_transform[0] = new_scale.x;
      matrix_transform[3] = new_scale.y;

      impress_element.style.transform = "matrix(" + matrix_transform.join() + ")";
      impress_element.style.transition = transition_state_keep;
      setState( true );
    }, passiveSupported ? { passive: false } : false );

    // Mousemove support for panning
    var pos_memo = { x:0, y:0 };
    var mousemove_handler = function( evt ) {
      var d = { x:( evt.clientX - pos_memo.x ), y:( evt.clientY - pos_memo.y ) };
      pos_memo = { x:( evt.clientX ), y:( evt.clientY ) };

      var computed_style = window.getComputedStyle( impress_element );
      var transition_state_keep = impress_element.style.transition;
      impress_element.style.transition = "";

      var matrix_transform = computed_style.transform.split( '(' )[1].split( ')' )[0].split( ',' );
      var scale_x = parseFloat( matrix_transform[0] );
      var move_speed = 2 + scale_x/2;

      var t = { x:( parseFloat( matrix_transform[4] ) + ( d.x * move_speed ) ), y:( parseFloat( matrix_transform[5] ) + ( d.y * move_speed ) ) };

      matrix_transform[4] = t.x;
      matrix_transform[5] = t.y;

      impress_element.style.transform = "matrix(" + matrix_transform.join() + ")";
      impress_element.style.transition = transition_state_keep;
      setState( true );
    }

    var setState = function( panzoomed ) {
      var active_element = document.querySelector( ".step.active" );
      if( panzoomed ) {
        active_element.classList.add( "panzoomed" );
      } else {
        active_element.classList.remove( "panzoomed" );
      }
    }

    // Timely register and unregister to listen to mousemove events
    document.addEventListener( 'mousedown', function( evt ) {
      // This is kind of a hack to allow the toolbar plugin to function
      if ( evt.target.tagName != "SELECT" ) {
        evt.preventDefault();
      };
      pos_memo.x = evt.clientX;
      pos_memo.y = evt.clientY;
      document.addEventListener( 'mousemove', mousemove_handler );
    });
    document.addEventListener( 'mouseup', function( evt ) {
      document.removeEventListener( 'mousemove', mousemove_handler );
    });

    // Register as PreStepLeavePlugin to cancel next and return to this step
    // if pan or zoom was active.
    var panzoomRefresh = function( event ) {
      if ( ( !event ) || ( !event.target ) ) {
          return;
      }
      var active_element = document.querySelector( ".step.active.panzoomed" );
      if( active_element ) {
        setState( false );
        if( event.detail.reason != "pointto" ) {
          api.goto( active_element, 500 );
          return false;
        }
      }
    }

    window.impress.addPreStepLeavePlugin( panzoomRefresh, 1 );
  });

} )( document, window );
