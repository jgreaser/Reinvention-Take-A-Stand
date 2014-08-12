
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

    var evidenceCount = 0;
	var maxEvidence = 5;

	

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
				stanceSide = $(this).data('stance');
			}
		});
		
	});


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
        evidenceCount++;

		//add evidence to supportingEvidence Array, using ID
		supportingEvidence.push($(this).attr('id'));
		
		//add evidence to store       
		//Maybe change this to a loop that redraws the supportingEvidnece span every time ?
		//loop through supporting evidnece array, for each item add li class=supportingEvidenceListehalalal
		
		buildSupportingEvidenceList();
		
	    //$('.supportingEvidenceList').append("<li class='supportingEvidenceListItem'>" + $('#'+$(this).attr('id')).text() + "</li>");
	
		//Determine when to go to CHALLENGER
        if (evidenceCount == maxEvidence) {
		alert('a challenger appears!');
		showDialog("Take a Stand!","A challenger appears! Are you ready to take this one?","confirmArgument", "debate", "chooseSources");
        }
		
    });
	
	
	function buildSupportingEvidenceList(){
		$('.supportingEvidenceList').html('');
		
		$.each( supportingEvidence, function(key, value) 
			{
  			$('.supportingEvidenceList').append("<li class='supportingEvidenceListItem'>" + value + "</li>");
			});
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
	$(".supportingEvidenceListItem").click(function(event) {


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

