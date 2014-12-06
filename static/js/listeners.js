$(document).ready(function () {
  // Add all topic information
  var url = "https://api.myjson.com/bins/1x62v";
  $.getJSON(url, function (json) {
    App.game = new Game(json);
    UI.screens.init(App.screen.current);
  });
  $.each(App.screen.all, function (key, val) {
    if (key != 0) {
      $("#" + val).hide();
    }
  });
  $(".choose-stance .btn").on("click", function () {
    // TODO: allow user to choose this side of the argument
    if ($(this).parent().hasClass("left")) {
      UI.dialog.alert("You cannot currently choose this stance.");
      return;
    }
    var stance = $(this).data("stance");
    var confirm = function (dialog) {
      App.me = new Participant(stance);
      App.opponent = new Participant(StanceType.getOpposite(stance));
      App.game.addPlayer(App.me);
      App.game.addPlayer(App.opponent);
      dialog.close();
      App.screen.next();
    };
    UI.dialog.confirm("Are you sure you want to choose the " + stance + " stance?", confirm);
  });
  $(document).on("click", ".argument-list li a", function () {
    var id = $(this).data("argument");
    UI.dialog.confirm("Are you sure you would like to choose this argument?", function (dialog) {
      App.me.argument = parseInt(id);
      App.screen.next();
      dialog.close();
    });
  });
});