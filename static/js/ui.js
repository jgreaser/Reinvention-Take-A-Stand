var UI = {
  setScore: function (score) {
    $("#currentScore").text(score);
  }, setArgument: function (id) {
    //var text = App.game.config[]
    $(".mainArgument p b").text();
  }, dialog: {
    show: function (message, buttons) {
      if (arguments.length == 1) {
        buttons = [
          {
            label: "OK",
            action: function (dialog) {
              dialog.close();
            }
          }
        ];
      }
      BootstrapDialog.show({

        title: App.name,
        message: message,
        buttons: buttons,
      });
    }, continue: function (message) {
      var buttons = [
        {
          label: "Continue",
          action: function (dialog) {
            App.screen.next();
            dialog.close();
          }
        }
      ];
      UI.dialog.show(message, buttons);
    }, confirm: function (message, callback) {
      var buttons = [
        {
          label: "No",
          action: function (dialog) {
            dialog.close();
          }
        },
        {
          label: "Yes",
          cssClass: "btn-primary",
          action: callback
        }
      ];
      UI.dialog.show(message, buttons)
    }, alert: function (message) {
      BootstrapDialog.alert(message);
    }
  }, screens: {
    initialized: [],
    initFunctions: {
      index: function () {
        var stances = App.game.config["stances"];
        var panels = $(".choose-stance");
        $.each(stances, function (key, val) {
          var panel = $(panels[key]);
          var title = panel.find("h3");
          title.text(val["title"]);
          title.slideDown();
          panel.find(".btn").data("stance", val["stance"]);
        });
      }, chooseArgument: function () {
        var arguments = App.game.config["arguments"];
        $.each(arguments, function (key, val) {
          var li = $(document.createElement("li"));
          var btn = $(document.createElement("a"));
          btn.addClass("argumentLink btn btn-primary");
          btn.data("argument", key);
          btn.attr("href", "javascript:void(0);")
          btn.text(val);
          li.append(btn);
          $(".argument-list").append(li);
        });
        var stance = App.me.stance.charAt(0).toUpperCase() + App.me.stance.slice(1);
        $(".stanceStore h4").text(stance);
      }, chooseSources: function () {
        var sources = App.game.config["sources"];
        $.each(sources, function (key, val) {
          $.each(val, function (key, val) {
            var text = key + " by " + val["author"];
            var li = $(document.createElement("li"))
            var btn = $(document.createElement("a"))
            btn.addClass("sourceLink btn btn-primary");
            btn.data("src", key);
            btn.attr("href", "javascript:void(0);");
            btn.text(text);
            li.append(btn);
            $(".source-list").append(li);
          })
        });
      }, debate: function () {
      }
    }, init: function (index) {
      if(UI.screens.initialized.indexOf(index) != -1) {
        return;
      }
      var name = App.screen.getScreenName(index);
      console.log("Initialized " + name);
      UI.screens.initFunctions[name].call();
    }
  }
};