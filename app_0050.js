
$(document).ready(function(){	
	//warning message that solar is bad isn't available
	
	
	$("#index").hide();
	$("#chooseArgument").hide();
	$("#chooseSources").hide();
	$("#challengerAppears").hide();
	$("#debate").hide();
	$("#scoringAlert").hide();


	var	mainArgument = '';
	var supportingEvidence = [];

    var evidenceCount = 0;
	var maxEvidence = 5;

	//DIALOG STUFF HERE, YO!   
        function showDialog(title,message,buttons,targetDivName,leavingDivName){
       	 	var okButtons = [];
        	if(buttons == "buttons1"){
			
			okButtons = [{
	                label: 'Continue',
	                action: function(dialog) {
	                    dialog.close();
						$("#" + targetDivName).show();
	                }
	            }];
	         }
			 if(buttons == "confirmArgument"){
			
			okButtons = [{
	                label: 'Continue',
	                action: function(dialog) {
	                    dialog.close();
						$("#" + targetDivName).show();
						$("#" + leavingDivName).hide();
	                }
	            }];
	         }
       
	        BootstrapDialog.show({
	            title: title,
	            message: message,
	            buttons: okButtons
	        });
	        
        }
        function showScore(score){
	        BootstrapDialog.show({
	            title: 'Score',
	            message: 'Your score is' + score + '!',
	            buttons: [{
	                label: 'Thanks!',
	                action: function(dialog) {
	                    dialog.close();
	                }
	            }]
	        });
        }


	//INITIATE PROTOTYPE!
	//Initial dialog, show index
	showDialog("Take a Stand!","It's time to debate! Are you ready?","buttons1", "index", 'none');


	//PICK SIDE
	//solar is bad - not allowed - error message
	$('#solarisbad').click(function(){
		alert("Sorry, that hasn't been build yet. But it's also a fascinating argument worthy of explorations. Just not one that has been produced for this prototype.");
		});
	
	//Listen for user to pick argument
	$('.chooseStanceArgument').click(function(){
			
		showDialog("Take a Stand!","You have chosen to defend solar!","confirmArgument", "chooseArgument", "index");
		
	}
	);


	//PICK ARGUMENT	
	//listen for click on arguments
		$('.arguments').click(function(){
		
		//Add argument text to the varible mainARgument, which is used to populate the argument later
		mainArgument = $(this).text();
		$('.mainArgument').html("<p><b>" + mainArgument + "</b></p>");
		
//ADD HERE: Need to allow student to chose another argument. Just add a "yes need to change it" button that closes the dialog, but doesn't do anything else.
		showDialog("Take a Stand!","Your main argument is: " + mainArgument,"confirmArgument", "chooseSources", "chooseArgument");
		
	
	}
	);
	  


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
		//increase evidence count
        evidenceCount++

		//add evidence to store       
	    $('.supportingEvidence').append("<li>" + $(this).text() + "</li>");
		
		
		//add evidnece to supportingEvidence Array
		supportingEvidence.push($(this).text());
	
		//Determine when to go to CHALLENGER
        if (evidenceCount == maxEvidence) {
		alert('a challenger appears!');
		showDialog("Take a Stand!","A challenger appears! Are you ready to take this one?","confirmArgument", "debate", "chooseSources");

        }
    });
	
	


    //00600 - adds evidence to panel shown in modal
    $(".argument").click(function(event) {
        $('#stance').append("<p>" + $(this).text() + "</p>");
    });

	
	

	

	
	



	
	

	
		
		
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


    //1000 confirmation score modal
    $(".btn.scoringConfirmation").click(function(event) {

        $('#scoringConfirmationModal').modal('toggle');

    });


	});	

