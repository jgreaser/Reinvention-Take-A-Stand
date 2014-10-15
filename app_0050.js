$(document).ready(function() {
    //need to insert warning message that solar is bad isn't available
	

	//hide all sections on load
    $("#index").hide();
    $("#chooseArgument").hide();
    $("#chooseSources").hide();
    $("#challengerAppears").hide();
    $("#debate").hide();
    $("#debateEnds").hide();
    $("#scoringAlert").hide();


    var stanceSide = ''; //what side are you on? won't use initially, but will need it later when we can choose either side

    var mainArgument = '';//initializing main argument - where your main argument is stored.
    var supportingEvidence = []; //this will be the array storing the supporting evidence

    var matchingEvidenceToArgument = [{
        argument: 01, 
		//should add "argument text" here, instead of storing it in the html file
        matchingEvidence: ["tag_01", "tag_02", "tag_03"], //evidence  with these tags counts as supporting evidence
        matchingCounterEvidence: ["tag_11", "tag_12", "tag_13"] //evidence with these tags counts as counter evidence
    }, {
        argument: 02,
        matchingEvidence: ["tag_04", "tag_05", "tag_06"],
        matchingCounterEvidence: ["tag_11", "tag_12", "tag_13"]
    }, ]; //list all argument/source combinations here
    var correctSourcesForArgument = []; //populate this array when the argument is picked
    var counterEvidenceSourcesForArgument = [];



    var evidenceCount = 0; //initial evidence count - used in the learner's list of supporting evidence
    var maxEvidence = 3; //tota number of sources learner can keep

    var currentScreen = "index"; // What is the current screen the app is on?

    var throwDownSourcesPlayed = 0; //count for sources played in the debate portion - compared to "maxEvidence" to determine if play continues

    var winningScore = 20; //score required to win
    var currentScore = 0; //tracks learner's current score

    var scoreMatchingStanceMatchingArgument = 20; //if a piece of evidence matches both the stance and the argument, it is worth this much
    var scoreMatchingStance = 10; //if a piece of evidence matches ONLY the argument, it is worth this much
    var scoreCounteringStance = -10; //if a piece of evidnece is COUNTER evidence for your argument, it is worth this much

    var debateThrowdownPlayerArray = []; //for debate; initiatialize array tracking sources on the player side
    var debateThrowdownChallengerArray = []; //for debate; initialize array tracking sources on the challenger side

    var challengerIsHere = false; //this is for treating screens differently depending on whether debate has started

    var delay; //not currently used; we were going to use this to setup delay between player/challenger actions in debate.



    // Set the initial Screen to display (function below)
    changeScreen(currentScreen); //currentScreen == "index"

    //===================================================
    // Updates the current screen
    function changeScreen(changeTo) {

        // Hide current screen
        $('#' + currentScreen).hide();

        // Show new screen
        currentScreen = changeTo;
        $('#' + currentScreen).show();
		
		ga('send', 'event', 'Navigation', 'Forward', currentScreen);//reports current screen


    }

    //Initial dialog, show index
	//These dialogs essentially control navigation through the app - check out the code in js/dialog.js
    showDialog("Take a Stand!", "It's time to debate! Are you ready?", "buttons1", "index", 'none');


    //PICK SIDE
    //solar is bad - not allowed - error message - need to add to button also
    $('#solarisbad').click(function() {
        alert("Sorry, that hasn't been built yet. But it's also a fascinating argument worthy of explorations. Just not one that has been produced for this prototype.");
    });

    //Listen for user to pick stance side
    $('.chooseStanceArgument').click(function() {
        // cache argument
        var stance = $(this).attr("data-stance");
        // Show confirm dialog
        BootstrapDialog.confirm("You have chosen the " + stance + " stance, are you sure?", function(result) {
            if (result) {
                // If user confirms their stance,  then...
                stanceSide = $(this).data('stance'); //pulls data from HTML page - need to put that in JS/XML instead
                changeScreen("chooseArgument"); //change screen to chooseArgument
            }
        });

    });


    //PICK ARGUMENT	
    //listen for click on arguments
    $('.argumentLink').click(function() {

        //Add argument text to the varible mainARgument, which is used to populate the argument later
        mainArgumentID = parseInt($(this).data('argumentid')); //Another example of storing information in HTML instead of js/xml

		//populate argument&counterargument arrays
        //I dont' think this line actually does anything...was previously used for an alert or console log
		var counterEvidenceSourcesForArgument = matchingEvidenceToArgument[mainArgumentID].matchingCounterEvidence; 

        mainArgument = $(this).text();//gets main argument from HTMl
        $('.mainArgument').html("<p><b>" + mainArgument + "</b></p>").hide();
		$('.mainArgument').fadeIn(400);
		
		//report	
		ga('send', 'event', 'Choices', 'Choose argument', mainArgument);
		
		
		setTimeout(callDialogNow, 800);//a timeout before calling callDialogNow
    
		
		function callDialogNow(){
			
			 BootstrapDialog.confirm("<b>Main argument:</b><br /><i> " + mainArgument + "</i> <br /><br />Are you sure you want to use this as your main argument?", function(result) {
            if (result) {
                // If user chooses yes then...
                stanceSide = $(this).data('stance');//gets stance text from HTML
                changeScreen("chooseSources");//go to chooseSource screen
            }
        });
		}
    });



    //PICK SOURCES
    //hides sources on page load - should move up with other hides() or be otherwise refactored...
    $('#source01').hide();
    $('#source02').hide();
    $('#source03').hide();

    //show source when clicked
    $('.sourceLink').click(function() {

        var sourceToShow = $(this).data('target');//which source to show
		var sourceTextForTracking = $(this).text();	//gets text of source to send to google analytics
	
		//report	
		ga('send', 'event', 'Build stance', 'Choose source', sourceTextForTracking);


        //hide the other divs (yes I know I could traverse DOM to get the names but don't feel like looking that up right now)
        $('#source01').hide();
        $('#source02').hide();
        $('#source03').hide();

        $(sourceToShow).show();//show the source that was clicked on
    });



    //PICK EVIDENCE FROM SOURCES
	//add evidence to supportingEvidence Array, using ID
    $(".sourceEvidence").click(function(event) {

        // Cache selected item
        var item = $(this).attr('id'); //gets id of evidence from html - to match against the evidence arrays
		

        // Check if it already exists in he array before adding it.
        if (supportingEvidence.indexOf(item) == -1) {
            // Add item to array
            supportingEvidence.push(item);
            //increase evidence count
            evidenceCount++;
		
			//report	
			ga('send', 'event', 'Build stance', 'Choose evidence', item);
        }


        //add evidence to list of supporting evidence on html page       
        buildSupportingEvidenceList();


        //Determine when to go to CHALLENGER - fires when the max evidence is reached
        if (evidenceCount == maxEvidence) {

			//report	
			ga('send', 'event', 'Challenger', 'Challenger appears', 'challenger appears');

            BootstrapDialog.confirm("<img src='images/challenger.jpg' /><br />A challenger appears! But you can only bring " + maxEvidence + " sources to the debate. Are you comfortable with your choices?", function(result) {
                if (result) {
                    // If user chooses yes then...
					
					//report
					ga('send', 'event', 'Challenger', 'Challenge accepted', 'challenge accepted');

					
                    changeScreen("debate");//GO DEBATE
					
                    // Update the debate Supports so that you can use them...
                    buildSupportingEvidenceList();
                    buildCounterSupportingEvidenceList(); //and don't forget to add the countersupportingevidence	
                }
            });
        }

    });



    function buildSupportingEvidenceList() {

        $('.supportingEvidenceList').html('');//clears our supportingevidencelist

		//loop through array to build supportingevidence list
        $.each(supportingEvidence, function(key, value) {
            // Cache title of source
            var title = $('#' + value).html();

            // add list item based on what screen you are on.
            if (currentScreen == "chooseSources") {
                $('.supportingEvidenceList').append("<li>" + title + " <a href='javascript:void(0);' data-id='" + value + "' class='supportingEvidenceListItem'>[x]</li>");

            } else if (currentScreen == "debate") {
                $('.supportingEvidenceList').append("<li>" + title + " <a href='javascript:void(0);' data-id='" + value + "' class='supportingEvidenceListItemUse'>[Use]</li>");
            }
        });



        // add click event to item in list
        if (currentScreen == "chooseSources") {
            $('.supportingEvidenceListItem').click(function() {
                removeSupportingEvidenceItem($(this).attr('data-id'));
            });
        } else {
            $('.supportingEvidenceListItemUse').click(function() {
                addSourcetoDebate($(this).attr('data-id'));
            });
        }
    }

   
    function buildCounterSupportingEvidenceList() {
        $('.counterSupportingEvidenceList').html('');

        $.each(matchingEvidenceToArgument[mainArgumentID].matchingCounterEvidence, function(key, value) {
            // Cache title of source
            var title = $('#' + value).html();

            // add list item based on what screen you are on.
            $('.counterSupportingEvidenceList').append("<li>" + title + "</li>");

        });
    }



        // Remove item from array
    function removeSupportingEvidenceItem(id) {

        var itemid = supportingEvidence.indexOf(id);
        supportingEvidence.splice(itemid, 1);
        if (evidenceCount > 0) {
            evidenceCount--;
        }
        buildSupportingEvidenceList();

    }




    //THROWDOWN CODE 
    function addSourcetoDebate(id) {


        //check debateThrowdownPlayerArray to see if id exists, if not alert (you cant do that sucka!)

        var isInArray = debateThrowdownPlayerArray.indexOf(id); //cache isInArray -1 means it isn't in array

        if (isInArray == -1) //ie, if evidence isn't already in the 'stuff you've played' array, aka debateThrowDownPlayerArray
        {
            throwDownSourcesPlayed++;
            calculatePlayerScore(id);

            addPlayerEvidence(id, throwDownSourcesPlayed); //adds player evidence, 
            updateScore();
            
        } else {
            showDialog("Take a Stand!", "You have already played that source.", "justContinue");//error message if you try to play source twice

        }
       
    }
    
    function updateChallengerEvidence(){
	   	//BLANK DOESNT DO ANYTHING
    }

	//Update score
    function updateScore() {
        $('#currentScore').text(currentScore);
        $('#winningScore').text(winningScore);

    }

	//add player evidence
    function addPlayerEvidence(id, sourceplayed) {
		//report
		ga('send', 'event', 'Debate', 'add evidence to debate', sourceplayed);

        debateThrowdownPlayerArray.push(id);

        var source = $('#' + id).html(); // Cache Source

        $('#debateArea').append("<p class='text-right alert alert-success'>" + source + "</p>"); // add text to debate area
    }

    // player throwdown - adds text, updates array, etc.
    function addChallengerEvidence() {



        //add the first counter evidence source to the screen
        var challengerSourceID = matchingEvidenceToArgument[mainArgumentID].matchingCounterEvidence[throwDownSourcesPlayed - 1]; //cache challenger source ID

		//make challenger image flash somehow
		$('.challengerImage').fadeTo("fast", 0.25);
		$('.challengerImage').fadeTo("fast", 0.75);
		$('.challengerImage').fadeTo("fast", 0.0);
		$('.challengerImage').fadeTo("fast", 0.75);
		$('.challengerImage').fadeTo("fast", 0.5);
		$('.challengerImage').fadeTo("fast", 1);

        var source = $('#' + challengerSourceID).html(); // Cache Source Text - stored in html
        $('#debateArea').append("<p class='alert alert-danger'>" + source + "</p>").hide().fadeIn(); //add challenger text / fade in

	
        calculateChallengerScore(challengerSourceID); //update score
		
    }



    function calculatePlayerScore(sourceID) {
        //showscore has to handle text, score, and the function to call after - if it's player, it will call the challenger. If it's challenger, it doesn't have followup function
        if ($.inArray(sourceID, matchingEvidenceToArgument[mainArgumentID].matchingEvidence) > -1) {
            currentScore += scoreMatchingStanceMatchingArgument;
            showScore('This source supports your stance, and it matches your argument.', scoreMatchingStanceMatchingArgument,true);

        } else if ($.inArray(sourceID, matchingEvidenceToArgument[mainArgumentID].matchingCounterEvidence) > -1) {
            currentScore += scoreCounteringStance;
            showScore('This is a counter-argument to your stance!', scoreCounteringStance,true);
        } else {
            currentScore += scoreMatchingStance;
            showScore("This source supports your stance, but it doesn't doesn't match argument.", scoreMatchingStance,true);
        }
    }


    function calculateChallengerScore(sourceID) {
		        //showscore has to handle text, score, and the function to call after - if it's player, it will call the challenger. If it's challenger, it doesn't have followup function

		setTimeout(callDialogBox, 800);
		
		function callDialogBox(){
		
        if ($.inArray(sourceID, matchingEvidenceToArgument[mainArgumentID].matchingEvidence) > -1) {
            currentScore += scoreMatchingStanceMatchingArgument;
            showScore("The challenger's source supports your stance, and it matches your argument.", scoreMatchingStanceMatchingArgument,false);
        } else if ($.inArray(sourceID, matchingEvidenceToArgument[mainArgumentID].matchingCounterEvidence) > -1) {
            currentScore += scoreCounteringStance;
            showScore('The challenger played a strong counter-argument to your stance!', scoreCounteringStance,false);
        } else {
            currentScore += scoreMatchingStance;
            showScore("This source supports your stance, but it doesn't doesn't match argument.", scoreMatchingStance,false);
        }
		}
		
    }

	//is the debate over? just checking. 
    function isDebateOver() {

        if (throwDownSourcesPlayed == maxEvidence) {//yes its over! do this stuff!
            
            var str = "You scored " + currentScore + " points, and needed " + winningScore + " points to win.";
            str += "<br><a id=\"restartLink\" href=\"index.html\">Debate again?</a>"
            
            if(currentScore > winningScore) {
            
                showDialog("You won!", str);
                
            } else if(currentScore == winningScore) {
            
                showDialog("You tied", str);
                
            } else if(currentScore < winningScore) {
            
                showDialog("You lost", str);
                
            }
        }

    }

//Feedback in debate scoring window
    function provideFeedback() {
		
		//report they made it to final screen
		ga('send', 'event', 'Navigation', 'Final Screen', 'Final Screen Loaded');

		
        if (currentScore > winningScore) {
            $('#finalCurrentScore').html(currentScore);
            $('#finalWinningScore').html(winningScore);
            $('#finalFeedback').html("That's great, you won.");
            //$('#restartLink').html('Play again if you want.');
        } else if (currentScore == winningScore) {
            $('#finalCurrentScore').html(currentScore);
            $('#finalWinningScore').html(winningScore);
            $('#finalFeedback').html("It's a tie!");
            //$('#restartLink').html('That was close! Improve your score!');

        } else if (currentScore < winningScore) {
            $('#finalCurrentScore').html(currentScore);
            $('#finalWinningScore').html(winningScore);
            $('#finalFeedback').html("Not the winning condition, unfortunately. You should keep trying.");
           // $('#restartLink').html('Improve your score, take down this challenger.');

        }


    }
    
    
    function showScore(message, score,isPerson){
			// isPerson ==  the person playing
		
			if(isPerson){
				BootstrapDialog.confirm(message + '<br /> Points: ' + score + '!', function(result) {
		            
		                // If user chooses yes then...
		               		setTimeout(addChallengerEvidence, 800);
						   updateScore();
		        });
			} else {
		        BootstrapDialog.show(
				{
		            title: 'Score',
		            message: message + '<br /> Points: ' + score + '!',
		            buttons: [{
		                label: 'Thanks!',
		                action: function(dialog) {
						    dialog.close();
						    isDebateOver();
						    
		                }
		            }]
		        });
	        }
}



});