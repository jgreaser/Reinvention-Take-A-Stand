
$(document).ready(function(){	
	//warning message that solar is bad isn't available
	
//PICK ARGUMENT	
	//listen for click on arguments
	$('.argumentLink').click(function(){
		
		//Add argument text to the varible mainARgument, which is used to populate the argument later
	
		mainArgumentID = parseInt($(this).data('argumentid'));
		//alert ("Evidence is " + counterEvidenceSourcesForArgument);
	
		var counterEvidenceSourcesForArgument = matchingEvidenceToArgument[mainArgumentID].matchingCounterEvidence;//populate argument&counterargument arrays
		alert ("Counter evidence is " + counterEvidenceSourcesForArgument);

		
		mainArgument = $(this).text();
		$('.mainArgument').html("<p><b>" + mainArgument + "</b></p>");
		
		//ADD HERE: Need to allow student to chose another argument. Just add a "yes need to change it" button that closes the dialog, but doesn't do anything else.
		BootstrapDialog.confirm("Your main argument is: "+mainArgument+", are you sure?",function(result){
			if(result){
				// If user chooses yes then...
				stanceSide = $(this).data('stance');
				changeScreen("chooseSources");
			}
		});
		
	});

	  // JavaScript Document
	  