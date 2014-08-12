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

// used when you want to confirm something
function showConfirmDialog(title,message){
	
	BootstrapDialog.confirm({
		title:title,
		message:message,
		type:'type-default',
		buttons:[{
			label:"No",
			action:function(dialog){
				dialog.close();
			}
			},
			{
			label:"Yes",
			action:function(dialog){
				dialog.close();
			}
		}]
	});
	
	
}
