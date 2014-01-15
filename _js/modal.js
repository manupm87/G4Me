$(document).ready(function(){
	$("#logIn").click(function(){
		$("#modalLogIn").overlay({
			// some mask tweaks suitable for modal dialogs
		  	mask: {
			    color: '#ebecff',
			    loadSpeed: 200,
			    opacity: 0.9
			},
	
			closeOnClick: false,
			load: true
		});
	});

});

