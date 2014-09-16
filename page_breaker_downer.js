$(document).ready(function() {
    //warning message that solar is bad isn't available


    $("#index").show();
    $("#chooseArgument").show();
    $("#chooseSources").show();
    $("#challengerAppears").show();
    $("#debate").show();
    $("#debateEnds").show();
    $("#scoringAlert").show();

	$('div').mousedown(function(){
		var text = $(this).text();
		alert("Look at all this stuff the tool is about to pull down into our database of stuff, while also entering metadata in the corresponding fields:" + text);
		});	
		
	$('div').mouseenter(function(){
	$(this).addClass('frameit');
	$(this).parents().removeClass('frameit');
	});
	
	$('div').mouseleave(function(){
	$(this).removeClass('frameit');
	});
	

    var stanceSide = ''; //what side are you on? won't use initially, but will need it later when we can choose either side

    var mainArgument = '';
    var supportingEvidence = [];

    var matchingEvidenceToArgument = [{
        argument: 01,
        matchingEvidence: ["tag_01", "tag_02", "tag_03"],
        matchingCounterEvidence: ["tag_11", "tag_12", "tag_13"]
    }, {
        argument: 02,
        matchingEvidence: ["tag_04", "tag_05", "tag_06"],
        matchingCounterEvidence: ["tag_11", "tag_12", "tag_13"]
    }, ]; //list all argument/source combinations here
    var correctSourcesForArgument = []; //populate this array when the argument is picked
    var counterEvidenceSourcesForArgument = [];



    var evidenceCount = 0;
    var maxEvidence = 3;

    var currentScreen = "index"; // What is the current screen the app is on?

    var throwDownSourcesPlayed = 0;

    var winningScore = 20;
    var currentScore = 0;

    var scoreMatchingStanceMatchingArgument = 20;
    var scoreMatchingStance = 10;
    var scoreCounteringStance = -10;

    var debateThrowdownPlayerArray = [];
    var debateThrowdownChallengerArray = [];

    var challengerIsHere = false; //this is for treating screens differently depending on whether debate has started

    var delay;



    // Set the initial Screen to display (function below)
    changeScreen(currentScreen);

    //===================================================
    // Updates the current screen
    function changeScreen(changeTo) {

        // Hide current screen
        $('#' + currentScreen).hide();

        // Show new screen
        currentScreen = changeTo;
        $('#' + currentScreen).show();

    }

    //INITIATE PROTOTYPE!
    //Initial dialog, show index
    showDialog("Take a Stand!", "It's time to debate! Are you ready?", "buttons1", "index", 'none');


    //PICK SIDE
    //solar is bad - not allowed - error message
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
                // If user chooses yes then...
                stanceSide = $(this).data('stance');
                changeScreen("chooseArgument");
            }
        });

    });


    //PICK ARGUMENT	
    //listen for click on arguments
    $('.argumentLink').click(function() {

        //Add argument text to the varible mainARgument, which is used to populate the argument later

        mainArgumentID = parseInt($(this).data('argumentid'));




        var counterEvidenceSourcesForArgument = matchingEvidenceToArgument[mainArgumentID].matchingCounterEvidence; //populate argument&counterargument arrays


        mainArgument = $(this).text();
        $('.mainArgument').html("<p><b>" + mainArgument + "</b></p>").hide();
		$('.mainArgument').fadeIn(400);
		
		
		setTimeout(callDialogNow, 800);
    
		
		function callDialogNow(){
			
			 BootstrapDialog.confirm("Your main argument is: " + mainArgument + ", are you sure?", function(result) {
            if (result) {
                // If user chooses yes then...
                stanceSide = $(this).data('stance');
                changeScreen("chooseSources");
            }
        });
				
		
		}

        //ADD HERE: Need to allow student to chose another argument. Just add a "yes need to change it" button that closes the dialog, but doesn't do anything else.
       

    });



    //PICK SOURCES
    //hide sources
    $('#source01').hide();
    $('#source02').hide();
    $('#source03').hide();

    //show source when clicked
    $('.sourceLink').click(function() {

        var sourceToShow = $(this).data('target');

        //hide the other dives (yes I know I could traverse DOM to get the names but don't feel like looking that up right now)
        $('#source01').hide();
        $('#source02').hide();
        $('#source03').hide();

        $(sourceToShow).show();
    });



    //PICK EVIDENCE FROM SOURCES

    $(".sourceEvidence").click(function(event) {
        //add evidence to supportingEvidence Array, using ID

        // Cache selected item
        var item = $(this).attr('id');

        // Check if it already exists in he array before adding it.
        if (supportingEvidence.indexOf(item) == -1) {
            // Add item to array
            supportingEvidence.push(item);
            //increase evidence count
            evidenceCount++;
        }


        //add evidence to store       
    
        buildSupportingEvidenceList();


        //Determine when to go to CHALLENGER
        if (evidenceCount == maxEvidence) {

            BootstrapDialog.confirm("A challenger appears! But you can only bring " + maxEvidence + " sources to the debate. Are you comfortable with your choices?", function(result) {
                if (result) {
                    // If user chooses yes then...
                    changeScreen("debate");
                    // Update the debate Supports so that you can use them...
                    buildSupportingEvidenceList();
                    buildCounterSupportingEvidenceList(); //and don't forget to add the countersupportingevidence	
                }
            });
        }

    });



    function buildSupportingEvidenceList() {


        $('.supportingEvidenceList').html('');

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




    function removeSupportingEvidenceItem(id) {
        // Remove item from array
        var itemid = supportingEvidence.indexOf(id);
        supportingEvidence.splice(itemid, 1);
        if (evidenceCount > 0) {
            evidenceCount--;
        }
        buildSupportingEvidenceList();

    }




    //HROWDOWN CODE 
    function addSourcetoDebate(id) {


        //check debateThrowdownPlayerArray to see if id exists, if not alert (you cant do that sucka!)

        var isInArray = debateThrowdownPlayerArray.indexOf(id); //cache isInArray -1 means it isn't in array

        if (isInArray == -1) //ie, if evidence isn't already in the 'stuff you've played' array, aka debateThrowDownPlayerArray
        {

            throwDownSourcesPlayed++;
            calculatePlayerScore(id);

            addPlayerEvidence(id); //adds player evidence, 
            updateScore();
            
        } else {
            showDialog("Take a Stand!", "You have already played that source.", "justContinue");

        }
       
    }
    
    function updateChallengerEvidence(){
	   	
    }

    function updateScore() {
        $('#currentScore').text(currentScore);
        $('#winningScore').text(winningScore);

    }

    //trigger opponent action
    function addPlayerEvidence(id) {

        debateThrowdownPlayerArray.push(id);

        var source = $('#' + id).html(); // Cache Source

        $('#debateArea').append("<p class='text-right alert alert-success'>" + source + "</p>"); // add text to debate area

    }

    // player throwdown - adds text, updateds array, etc.
    function addChallengerEvidence() {

		//DELAY HERE

        //add the first counter evidence source to the screen
        var challengerSourceID = matchingEvidenceToArgument[mainArgumentID].matchingCounterEvidence[throwDownSourcesPlayed - 1]; //cache challenger source ID

		//make challenger image flash somehow
		$('.challengerImage').fadeTo("fast", 0.25);
		$('.challengerImage').fadeTo("fast", 0.75);
		$('.challengerImage').fadeTo("fast", 0.0);
		$('.challengerImage').fadeTo("fast", 0.75);
		$('.challengerImage').fadeTo("fast", 0.5);
		$('.challengerImage').fadeTo("fast", 1);

        var source = $('#' + challengerSourceID).html(); // Cache Source Text
        $('#debateArea').append("<p class='alert alert-danger'>" + source + "</p>").hide().fadeIn();

	
        calculateChallengerScore(challengerSourceID);
		
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


    function isDebateOver() {

        if (throwDownSourcesPlayed == maxEvidence) {
            changeScreen("debateEnds");
            provideFeedback();
        }

    }

//Feedback in debate scoring window
    function provideFeedback() {
        if (currentScore > winningScore) {
            $('#finalCurrentScore').html(currentScore);
            $('#finalWinningScore').html(winningScore);
            $('#finalFeedback').html("That's great, you won.");
            $('#restartLink').html('Play again if you want.');
        } else if (currentScore == winningScore) {
            $('#finalCurrentScore').html(currentScore);
            $('#finalWinningScore').html(winningScore);
            $('#finalFeedback').html("It's a tie!");
            $('#restartLink').html('That was close! Improve your score!');

        } else if (currentScore < winningScore) {
            $('#finalCurrentScore').html(currentScore);
            $('#finalWinningScore').html(winningScore);
            $('#finalFeedback').html("Not the winning condition, unfortunately. You should keep trying.");
            $('#restartLink').html('Improve your score, take down this challenger.');

        }


    }
    
    
    function showScore(message, score,isPerson){
			// Is person means that the score is for the person playing
		
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