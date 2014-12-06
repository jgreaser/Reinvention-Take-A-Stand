var App = {
  name: "Take a Stand!",
  game: null,
  me: null,
  opponent: null,
  screen: {
    all: ["index", "chooseArgument", "chooseSources", "debate"],
    current: 0,
    moveTo: function (pos) {
      if (App.screen.all[pos] == undefined) {
        return;
      }
      UI.screens.init(pos);
      $.each(App.screen.all, function (key, val) {
        var current = $("#" + val);
        if (key == pos) {
          App.screen.current = key;
          current.show();
        } else if (key != pos || current.is(":visible")) {
          current.hide();
        }
      });
    }, next: function () {
      App.screen.moveTo(App.screen.current + 1);
    }, prev: function () {
      App.screen.moveTo(App.screen.current - 1);
    }, getScreenName: function (index) {
      return App.screen.all[index];
    }
  }
};
var StanceType = {
  ADVOCATE: "pro",
  ADVERSE: "against",
  getOpposite: function (type) {
    switch (type) {
      case StanceType.ADVOCATE:
        return StanceType.ADVERSE;
      case StanceType.ADVERSE:
        return StanceType.ADVOCATE;
      default:
        throw "Not a valid stance type";
        break;
    }
  }
};
function Participant(stance) {
  this.score = 0;
  this.turns = 0;
  this.stance = stance;
  this.argument = 0;
  this.evidence = [];
  this.sources = [];
  this.addEvidence = function (id) {
    if (this.evidence.indexOf(id) == -1) {
      this.evidence.push(id);
    } else {
      throw "That evidence was already played";
    }
  };
  this.addSource = function (id) {
    if (this.sources.indexOf(id) == -1) {
      this.sources.push(id);
    } else {
      throw "That source was already played";
    }
  };
  this.score = {
    set: function (score) {
      this.score = score;
    }, add: function (score) {
      this.score += score;
    }, substract: function(score) {
      this.score -= score;
    }
  };
}
function Game(file) {
  this.config = file;
  this.players = [];
  this.addPlayer = function (player) {
    if (this.players.indexOf(player) == -1) {
      this.players.push(player);
    } else {
      throw "That player is already in the game";
    }
  };
}