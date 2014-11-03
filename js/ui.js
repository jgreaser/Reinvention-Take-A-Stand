var UI = {

    dialog: {
    
        show: function(message, buttons) {
        
            if(arguments.length == 1) {
            
                buttons = [{
                    
                    label: "OK",
                    action: function(dialog) {
                    
                        dialog.close();
                        
                    }
                    
                }];
                
            }
            
            BootstrapDialog.show({
                
	            title: App.name,
	            message: message,
	            buttons: buttons,
                
	        });
            
        }, continue: function(message) {
            
            var buttons = [{
                
                label: "Continue",
                action: function(dialog) {
                
                    App.screen.next();
                    dialog.close();
                    
                }
                
            }];
            
            UI.dialog.show(message, buttons);
        
        }, confirm: function(message, callback) {
        
            var buttons = [{
                
                label: "No",
                action: function(dialog) {
                
                    dialog.close();
                    
                }
                
            }, {
            
                label: "Yes",
                cssClass: "btn-primary",
                action: callback
            
            }];
            
            UI.dialog.show(message, buttons)
            
        }, alert: function(message) {
        
            BootstrapDialog.alert(message);
            
        }
            
    }, screens: {
        
        initialized: [],
        initFunctions: {
        
            index: function() {
            
                var stances = App.game.config["stances"];
                var panels = $(".choose-stance");

                $.each(stances, function(key, val) {

                    var panel = $(panels[key]);

                    var title = panel.find("h3");
                    title.text(val["title"]);
                    title.slideDown();

                    panel.find(".btn").data("stance", val["stance"]);

                });
                
            }, chooseArgument: function() {
            
                var arguments = App.game.config["arguments"];

                $.each(arguments, function(key, val) {

                    var li = $(document.createElement("li"));

                    var btn = $(document.createElement("a"));
                    btn.addClass("argumentLink btn btn-primary");
                    btn.data("argument", key);
                    btn.attr("href", "javascript:void(0);")
                    btn.text(val);

                    li.append(btn);
                    $(".argumentList").append(li);

                });

                var stance = App.me.stance.charAt(0).toUpperCase() + App.me.stance.slice(1);
                $(".stanceStore h4").text(stance);
                
            }, chooseSources: function() {
            
                
                
            }, debate: function() {
            
                
                
            }
            
        }, init: function(screen) {
        
            if(UI.screens.initialized.indexOf(screen) == -1) {
            
                UI.screens.initialized.push(screen);
                UI.screens.initFunctions[screen].call();
                
            }
            
        }
    
    }
    
}