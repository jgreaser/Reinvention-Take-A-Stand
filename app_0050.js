
$(document).ready(function(){	
	//warning message that solar is bad isn't available
	
	
	$("#index").hide();
	$("#chooseArgument").hide();
	$("#chooseSources").hide();
	$("#challengerAppears").hide();
	$("#debate").hide();
	$("#scoringAlert").hide();


	var stanceSide = '';//what side are you on? won't use initially, but will need it later when we can choose either side

	var	mainArgument = '';
	var supportingEvidence = [];
	
	var matchingEvidenceToArgument = [{
		argument: 01,
		matchingEvidence: ("tag_01", "tag_02", "tag_03", "tag_04", "tag05")
		},
		{
		argument: 02,
		matchingEvidence: ("tag_04", "tag_05", "tag_06", "tag_07", "tag08")
		},
		];//list all argument/source combinations here
	var correctSourcesForArgument = [];//populate this array when the argument is picked

    var evidenceCount = 0;
	var maxEvidence = 5;
	
	var currentScreen = "index"; // What is the current screen the app is on?
	
	var winningScore = 80;
	var currentScore = 0;

	// Set the initial Screen to display (function below)
	changeScreen(currentScreen);

//===================================================
// Updates the current screen
function changeScreen(changeTo){
	
	// Hide current screen
	$('#'+currentScreen).hide();
	
	// Show new screen
	currentScreen = changeTo;
	$('#'+currentScreen).show();
	
}

	//INITIATE PROTOTYPE!
	//Initial dialog, show index
	showDialog("Take a Stand!","It's time to debate! Are you ready?","buttons1", "index", 'none');


	//PICK SIDE
	//solar is bad - not allowed - error message
	$('#solarisbad').click(function(){
		alert("Sorry, that hasn't been build yet. But it's also a fascinating argument worthy of explorations. Just not one that has been produced for this prototype.");
		});
	
	//Listen for user to pick stance side
	$('.chooseStanceArgument').click(function(){
		// cache argument
		var stance = $(this).attr("data-stance");
		// Show confirm dialog
		BootstrapDialog.confirm("You have chosen the "+stance+" stance, are you sure?",function(result){
			if(result){
				// If user chooses yes then...
				stanceSide = $(this).data('stance');
				changeScreen("chooseArgument");
			}
		});
		
	});


	//PICK ARGUMENT	
	//listen for click on arguments
	$('.argumentLink').click(function(){
		
		//Add argument text to the varible mainARgument, which is used to populate the argument later
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
	  


	//PICK SOURCES
	//hide sources
	$('#source01').hide();
	$('#source02').hide();
	$('#source03').hide();
	
	//show source when clicked
	$('.sourceLink').click(function(){
		
		var sourceToShow = $(this).data('target');
		
		//hide the other dives (yes I know I could traverse DOM to get the names but don't feel like looking that up right now)
		$('#source01').hide();
		$('#source02').hide();
		$('#source03').hide();
	
		$(sourceToShow).show();		
	}
	);

	
	
	//PICK EVIDENCE FROM SOURCES

    $(".sourceEvidence").click(function(event) {
		//add evidence to supportingEvidence Array, using ID
		
		// Cache selected item
		var item = $(this).attr('id');
		
		// Check if it already exists in he array before adding it.
		if(supportingEvidence.indexOf(item) == -1){
				// Add item to array
				supportingEvidence.push(item);
				//increase evidence count
				evidenceCount++;
		}
	
		
		//add evidence to store       
		//Maybe change this to a loop that redraws the supportingEvidnece span every time ?
		//loop through supporting evidnece array, for each item add li class=supportingEvidenceListehalalal
		
		buildSupportingEvidenceList();
		
	    //$('.supportingEvidenceList').append("<li class='supportingEvidenceListItem'>" + $('#'+$(this).attr('id')).text() + "</li>");
	
		//Determine when to go to CHALLENGER
        if (evidenceCount == maxEvidence) {
		
			BootstrapDialog.confirm("A challenger appears! Are you ready to take this one?",function(result){
				if(result){
					// If user chooses yes then...
					changeScreen("debate");
					// Update the debate Supports so that you can use them...
					buildSupportingEvidenceList();
				}
			});
        }
		
    });
	
	
	
	function buildSupportingEvidenceList(){
		$('.supportingEvidenceList').html('');
		
		$.each( supportingEvidence, function(key, value) {
			// Cache title of source
			var title = $('#'+value).html();
			
			// add list item based on what screen you are on.
			if(currentScreen == "chooseSources"){
  				$('.supportingEvidenceList').append("<li>"+title+" <a href='javascript:void(0);' data-id='"+value+"' class='supportingEvidenceListItem'>[x]</li>");
  				
  			} else if(currentScreen == "debate"){
	  			$('.supportingEvidenceList').append("<li>"+title+" <a href='javascript:void(0);' data-id='"+value+"' class='supportingEvidenceListItemUse'>[Use]</li>");
  			}
  			
  			
		});
		
		// add click event to item
		if(currentScreen == "chooseSources"){
		  		$('.supportingEvidenceListItem').click(function(){
			  		removeSupportingEvidenceItem($(this).attr('data-id'));
		  		});
		 } else {
			 $('.supportingEvidenceListItemUse').click(function(){
			  		addSourcetoDebate($(this).attr('data-id'));
		  		});
			 
		 }
		
	}
	
	function removeSupportingEvidenceItem(id){
		// Remove item from array
		var itemid = supportingEvidence.indexOf(id);
		supportingEvidence.splice(itemid,1);
		if(evidenceCount > 0){
			evidenceCount--;
		}
		buildSupportingEvidenceList();
		
	}
	

    //00600 - adds evidence to panel shown in modal
    $(".argument").click(function(event) {
        $('#stance').append("<p>" + $(this).text() + "</p>");
    });

	
	//THIS IS THE ORIGINAL "throwdown" code - still works for the challenger
	$(".support").click(function(event) {


        //should it be left aligned or right aligned?
        if ($(this).hasClass("counter")) {
            $('#debateArea').append("<p class='alert alert-danger'>" + $(this).text() + "</p>");
           // $('.modal-body').text("Challenger source is valid, you lose 10 points!");
		           //SHOW SCORE DIALOG

        } else {
            $('#debateArea').append("<p class='text-right alert alert-success'>" + $(this).text() + "</p>");
          //  $('.modal-body').text("Bam! Good source! 20 points to you!");
		          //SHOW SCORE DIALOG

        }

        //SHOW SCORE DIALOG
    });
	
	//THIS IS THE NEW THROWDOWN CODE 
	//PLEASE MAKE THIS WORK
	function addSourcetoDebate(id){
		
		// Cache Source
		var source = $('#'+id).html();
		
		// Temp
		$('#debateArea').append("<p class='alert alert-danger'>" + source + "</p>");
		
		/*
        //should it be left aligned or right aligned?
        if ($(this).hasClass("counter")) {
            $('#debateArea').append("<p class='alert alert-danger'>" + $(this).text() + "</p>");
           // $('.modal-body').text("Challenger source is valid, you lose 10 points!");
		           //SHOW SCORE DIALOG

        } else {
            $('#debateArea').append("<p class='text-right alert alert-success'>" + $(this).text() + "</p>");
          //  $('.modal-body').text("Bam! Good source! 20 points to you!");
		          //SHOW SCORE DIALOG

        }
        */

        //SHOW SCORE DIALOG
    }

function calculatePlayerScore(sourceID){
	//does source ID match main argument ID?
}

function calculateChallengerScore(sourceID){
	//does source ID match
}
	

    //1000 confirmation score modal
    $(".btn.scoringConfirmation").click(function(event) {

        $('#scoringConfirmationModal').modal('toggle');

    });


});	
	
	
	


