$(document).ready(function(){
	$("#exposeMask").hide();

	/*$("#logIn").click(function(){
		$("#modalLogIn").overlay({
			// some mask tweaks suitable for modal dialogs
		  	mask: {
			    color: '#ebecff',
			    loadSpeed: 200,
			    opacity: 0.9
			},
	
			closeOnClick: true,
			load: true
		});
	});*/
	$("#logIn").click(function(){
		$("#exposeMask").fadeIn(200);
	});
	
	var trigger = $(".modalInput").overlay({
 
      // some mask tweaks suitable for modal dialogs
      mask: 'darkred',
      closeOnClick: true
  });
  $("#logInBtns").click(function(){
		trigger.overlay().close();
		$("#exposeMask").fadeOut(200);
	});

});

