$(function(){

	$("#iban").val("");
	$("#bic").val("");

	var socket = io.connect(window.location.hostname);

	socket.on('progress', function (response) {
		if(response.percentage !== undefined)
			$("#progressbar").css("width", response.percentage*100 + "%");

		if(response.iban !== undefined){
			$("#iban").val( $("#iban").val() + response.iban + "\n");
		}

		if(response.bic !== undefined){
			$("#bic").val( $("#bic").val() + response.bic + "\n");
		}
	});

	$("#convert").click(function(event){
		$("#progressbar").css("width", "0%");
		$("#iban").val("");
		$("#bic").val("");

		$.post("/rest/convert", {bban: $("#bban").val(), socketid: socket.socket.sessionid}, function(response){
			if(response.err)
				alert(response.err)
			else{
				$("#iban").val(response.iban.join('\n'));
				$("#bic").val(response.bic.join('\n'));
				$("#progressbar").css("width", "100%");
			}
		});
	});


	// samen scrollen:

	$('#bban').scroll(function() {
		var scrollValue = $('#bban').scrollTop();
		$('#iban').scrollTop(scrollValue);
		$('#bic').scrollTop(scrollValue);
	});

	$('#iban').scroll(function() {
		var scrollValue = $('#iban').scrollTop();
		$('#bban').scrollTop(scrollValue);
		$('#bic').scrollTop(scrollValue);
	});

	$('#bic').scroll(function() {
		var scrollValue = $('#bic').scrollTop();
		$('#iban').scrollTop(scrollValue);
		$('#bban').scrollTop(scrollValue);
	});

});