var StanceType = {
    
    ADVOCATE: "pro",
    ADVERSE: "against",
    getOpposite: function(type) {
    
        switch(type) {
            case StanceType.ADVOCATE:
                return StanceType.ADVERSE;
            case StanceType.ADVERSE:
                return StanceType.ADVOCATE;
            default:
                throw "Not a valid type";
                break;
        }
        
    }
    
};

function Participant(stance) {

    this.score = 0;
    this.turns = 0;
    this.stance = stance;
    this.evidence = [];
    this.argument = "";
    this.argumentID = 0;
    this.debateThrowdown = [];
    
    this.calculateScore = function(sourceID) {
        if ($.inArray(sourceID, App.game.matchingEvidenceToArgument[this.argumentID].matchingEvidence) > -1) {
            added = App.game.scoring.matchingArgumentStance;
            App.me.score += added;
            UI.showScore('This source supports your stance, and it matches your argument.', App.me.score, true);
        } else if ($.inArray(sourceID, App.game.matchingEvidenceToArgument[App.me.argumentID].matchingCounterEvidence) > -1) {
            added = App.game.scoring.countering;
            App.me.score += added;
            UI.showScore('This is a counter-argument to your stance!', App.me.score, true);
        } else {
            added = App.game.scoring.matchingStance;
            App.me += added;
            UI.showScore('This source supports your stance, but it doesn\'t doesn\'t match argument.', App.me.score, true);
        }
    }
    
    this.addSource = function(id) {
        var isInArray = this.debateThrowdown.indexOf(id);
        if (isInArray == -1) {
            this.calculateScore(id);
            App.game.addPlayerEvidence(id, this.debateThrowdown.length);
            UI.updateScore(App.me);
        } else {
            showDialog('Take a Stand!', 'You have already played that source.', 'justContinue');
        }
    }

};

function Game(advocate, adversary) {

    this.advocate = advocate;
    this.adversary = adversary;
    this.challengerArrived = false;
    
    this.evidence = {
        max: 3
    };
    
    this.scoring = {
        "max": 20,
        "matchingStanceAndArgument": 20,
        "matchingStance": 10,
        "countering": -10,
    };
    
    this.matchingEvidenceToArgument = [
        {
            argument: 1,
            matchingEvidence: [
                'tag_01',
                'tag_02',
                'tag_03'
            ],
            matchingCounterEvidence: [
                'tag_11',
                'tag_12',
                'tag_13'
            ]
        },
        {
            argument: 2,
            matchingEvidence: [
                'tag_04',
                'tag_05',
                'tag_06'
            ],
            matchingCounterEvidence: [
                'tag_11',
                'tag_12',
                'tag_13'
            ]
        }
    ];
    
    this.provideFeedback = function() {
    
        ga('send', 'event', 'Navigation', 'Final Screen', 'Final Screen Loaded');
        
        var str = "You scored " + App.me.score + " points, and needed " + App.game.scoring.max + " points to win.<br><a id=\"restartLink\" href=\"index.html\">Debate again?</a>";

        if (App.me.score > App.game.scoring.max) {

            showDialog('You won!', str);

        } else if (App.me.score == App.game.scoring.max) {

            showDialog('You tied', str);

        } else if (App.me.score < App.game.scoring.max) {

            showDialog('You lost', str);

        }
        
    }
    
    this.calculateChallengerScore = function(sourceID) {
        setTimeout(callDialogBox, 800);
        function callDialogBox() {
            if ($.inArray(sourceID, App.game.matchingEvidenceToArgument[App.me.argumentID].matchingEvidence) > -1) {
                added = App.game.scoring.matchingStanceAndArgument;
                App.other.score += added;
                UI.showScore('The challenger\'s source supports your stance, and it matches your argument.', App.other.score, false);
            } else if ($.inArray(sourceID, App.game.matchingEvidenceToArgument[App.me.argumentID].matchingCounterEvidence) > -1) {
                added = App.game.scoring.countering;
                App.other.score += added;
                UI.showScore('The challenger played a strong counter-argument to your stance!', App.other.score, false);
            } else {
                added = App.game.scoring.matchingStance;
                App.other.score += added;
                UI.showScore('This source supports your stance, but it doesn\'t doesn\'t match argument.', App.other.score, false);
            }
        }
    }
    
    this.addChallengerEvidence = function() {
        var challengerSourceID = App.game.matchingEvidenceToArgument[App.me.argumentID].matchingCounterEvidence[App.me.turns - 1];
        $('.challengerImage').fadeIn();
        var source = $('#' + challengerSourceID).html();
        $('#debateArea').append('<p class=\'alert alert-danger\'>' + source + '</p>').hide().fadeIn();
        App.game.calculateChallengerScore(challengerSourceID);
    }
    
    this.addPlayerEvidence = function(id, sourceplayed) {
        ga('send', 'event', 'Debate', 'add evidence to debate', sourceplayed);
        App.me.debateThrowdown.push(id);
        var source = $('#' + id).html();
        $('#debateArea').append('<p class=\'text-right alert alert-success\'>' + source + '</p>');
    }
    
    this.isOver = function() {
    
        function isDebateOver() {
            
            if (App.me.debateThrowdown.length == App.game.evidence.max) {//yes its over! do this stuff!
            
                var str = "You scored " + App.me.score + " points, and needed " + App.game.scoring.max + " points to win.";
                str += "<br><a id=\"restartLink\" href=\"index.html\">Debate again?</a>"

                if(App.me.score > winningScore) {

                    showDialog("You won!", str);

                } else if(App.me.score == winningScore) {

                    showDialog("You tied", str);

                } else if(App.me.score < winningScore) {

                    showDialog("You lost", str);

                }
            }
                
        }
    }

};

var App = {
    
    game: null,
    me: null,
    other: null,
    screen: {
        current: "index",
        all: ["index", "chooseArgument", "chooseSources", "challengerAppears", "debate", "debateEnds", "scoringAlert"],
        set: function(screen) {
        
            $('#' + App.screen.current).hide();
            App.screen.current = screen;
            $('#' + screen).show();
            ga('send', 'event', 'Navigation', 'Forward', screen);
            
        }
    }
    
};

var UI = {

    initEvidenceList: function() {
    
        $('.supportingEvidenceList').html('');//clears our supportingevidencelist

		//loop through array to build supportingevidence list
        $.each(App.me.evidence, function(key, value) {
            // Cache title of source
            var title = $('#' + value).html();

            // add list item based on what screen you are on.
            if (App.screen.current == "chooseSources") {
                $('.supportingEvidenceList').append("<li>" + title + " <a href='javascript:void(0);' data-id='" + value + "' class='supportingEvidenceListItem'>[x]</li>");

            } else if (App.screen.current == "debate") {
                $('.supportingEvidenceList').append("<li>" + title + " <a href='javascript:void(0);' data-id='" + value + "' class='supportingEvidenceListItemUse'>[Use]</li>");
            }
        });



        // add click event to item in list
        if (App.screen.current == "chooseSources") {
            $('.supportingEvidenceListItem').click(function() {
                removeSupportingEvidenceItem($(this).attr('data-id'));
            });
        } else {
            $('.supportingEvidenceListItemUse').click(function() {
                App.me.addSource($(this).attr('data-id'));
            });
        }
        
    }, initCounterEvidenceList: function() {
    
        $('.counterSupportingEvidenceList').html('');
        $.each(App.game.matchingEvidenceToArgument[App.me.argumentID].matchingCounterEvidence, function (key, value) {
            var title = $('#' + value).html();
            $('.counterSupportingEvidenceList').append('<li>' + title + '</li>');
        });
        
    }, updateScore: function(participant) {
        
        $('#currentScore').text(participant.score);
        $('#winningScore').text(App.game.scoring.max);
        
    }, showScore: function(message, score, isPerson) {
        if (isPerson) {
            BootstrapDialog.confirm(message + '<br /> Points: ' + score + '!', function(result) {
                setTimeout(App.game.addChallengerEvidence, 800);
                UI.updateScore(App.me);
            });
        } else {
            BootstrapDialog.show({
                title: 'Score',
                message: message + '<br /> Points: ' + score + '!',
                buttons: [{
                        label: 'Thanks!',
                        action: function (dialog) {
                            dialog.close();
                            App.game.isOver();
                        }
                    }]
            });
        }
    }
    
};

$(document).ready(function() {
    
    App.screen.all.forEach(function(screen) {
    
        if(screen != "index") {
        
            $("#" + screen).hide();
            
        }
        
    });
    
    showDialog('Take a Stand!', 'It\'s time to debate! Are you ready?', 'buttons1', 'index', 'none');
    
    $('#source01').hide();
    $('#source02').hide();
    $('#source03').hide();
    
    function buildSupportingEvidenceList() {
        $('.supportingEvidenceList').html('');
        $.each(supportingEvidence, function (key, value) {
            var title = $('#' + value).html();
            if (App.screen.current == 'chooseSources') {
                $('.supportingEvidenceList').append('<li>' + title + ' <a href=\'javascript:void(0);\' data-id=\'' + value + '\' class=\'supportingEvidenceListItem\'>[x]</li>');
            } else if (App.screen.current == 'debate') {
                $('.supportingEvidenceList').append('<li>' + title + ' <a href=\'javascript:void(0);\' data-id=\'' + value + '\' class=\'supportingEvidenceListItemUse\'>[Use]</li>');
            }
        });
        if (App.screen.current == 'chooseSources') {
            $('.supportingEvidenceListItem').click(function () {
                removeSupportingEvidenceItem($(this).attr('data-id'));
            });
        } else {
            $('.supportingEvidenceListItemUse').click(function () {
                addSourcetoDebate($(this).attr('data-id'));
            });
        }
    }
    
    function buildCounterSupportingEvidenceList() {
        $('.counterSupportingEvidenceList').html('');
        $.each(App.game.matchingEvidenceToArgument[App.me.argumentID].matchingCounterEvidence, function (key, value) {
            var title = $('#' + value).html();
            $('.counterSupportingEvidenceList').append('<li>' + title + '</li>');
        });
    }
    
    function removeSupportingEvidenceItem(id) {
        var itemid = App.me.evidence.indexOf(id);
        App.me.evidence.splice(itemid, 1);
        buildSupportingEvidenceList();
    }
    
    function updateChallengerEvidence() {
    }
    
});