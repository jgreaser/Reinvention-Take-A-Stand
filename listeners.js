// All event listeners

$(document).ready(function() {
    
    $('#solarisbad').click(function () {
    
        showDialog("That\'s not available!", "But it\'s also a fascinating argument worthy of explorations.");

    });

    $('.chooseStanceArgument').click(function () {
        var stance = $(this).attr('data-stance');
        BootstrapDialog.confirm('You have chosen the ' + stance + ' stance, are you sure?', function (result) {
            if (result) {
                
                var advocate = new Participant(StanceType.ADVOCATE);
                var adversary = new Participant(StanceType.ADVERSE);
                
                if(stance == StanceType.ADVOCATE) {
                
                    App.me = advocate;
                    App.other = adversary;
                    
                } else if(stance == StanceType.ADVERSE) {
                
                    App.me = adversary;
                    App.other = advocate;
                    
                }
                
                App.game = new Game(advocate, adversary);
                console.log(App.game);
                App.screen.set('chooseArgument');
                
            }
        });
    });

    $('.argumentLink').click(function () {
        App.me.argumentID = parseInt($(this).data('argumentid'), 10);
        var counterEvidenceSourcesForArgument = App.game.matchingEvidenceToArgument[App.me.argumentID].matchingCounterEvidence;
        mainArgument = $(this).text();
        $('.mainArgument').html('<p><b>' + mainArgument + '</b></p>').hide();
        $('.mainArgument').fadeIn(400);
        ga('send', 'event', 'Choices', 'Choose argument', mainArgument);
        setTimeout(callDialogNow, 800);
        function callDialogNow() {
            BootstrapDialog.confirm('<b>Main argument:</b><br /><i> ' + mainArgument + '</i> <br /><br />Are you sure you want to use this as your main argument?', function (result) {
                if (result) {
                    stanceSide = $(this).data('stance');
                    App.screen.set('chooseSources');
                }
            });
        }
    });

    $('.sourceLink').click(function () {
        var sourceToShow = $(this).data('target');
        var sourceTextForTracking = $(this).text();
        ga('send', 'event', 'Build stance', 'Choose source', sourceTextForTracking);
        $('#source01').hide();
        $('#source02').hide();
        $('#source03').hide();
        $(sourceToShow).show();
    });

    $('.sourceEvidence').click(function (event) {
        var item = $(this).attr('id');
        if (App.me.evidence.indexOf(item) == -1) {
            App.me.evidence.push(item);
            ga('send', 'event', 'Build stance', 'Choose evidence', item);
        }
        UI.initEvidenceList();
        if (App.me.evidence.length == App.game.evidence.max) {
            ga('send', 'event', 'Challenger', 'Challenger appears', 'challenger appears');
            BootstrapDialog.confirm('<img src=\'images/challenger.jpg\' /><br />A challenger appears! But you can only bring ' + App.game.evidence.max + ' sources to the debate. Are you comfortable with your choices?', function (result) {
                if (result) {
                    ga('send', 'event', 'Challenger', 'Challenge accepted', 'challenge accepted');
                    App.screen.set('debate');
                    UI.initEvidenceList();
                    UI.initCounterEvidenceList();
                }
            });
        }
    }); 
    
});