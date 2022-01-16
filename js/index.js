window.account = JSON.parse(localStorage.getItem("user"));
window.chat = new Client([
  new Friend(2752805684, "Siunaus", new Records([
    new TextMessage("self", "WebQQ写嘛"),
    new TextMessage("Siunaus", "开始了"),
    new TextMessage("self", "WebQQ写好了嘛")
  ])),
  new Group(id = 872957249, name = "Minecraft小服务器", new Records([
    new TextMessage("self", "WebQQ写嘛"),
    new TextMessage("Siunaus", "开始了"),
    new TextMessage("Harry", "WebQQ写好了嘛")
  ]))
]);
/**
 * Main Entry Point
 */
$(document).ready(function () {
  if (localStorage.getItem("user") == "" || localStorage.getItem("user") == undefined) window.location = "/login.html";
  //Navigation Button Icon
  navigateButton();
  //Navigation Button to back
  $(".navigator").click(hideChat);

  //Display ID
  $(".account-name")[0].innerHTML = window.account.name;
  $(".account-id")[0].innerHTML = window.account.id;

  //Display flyout menu
  $(".IconButton.avator").click(toggleMenu);
  $("actions button#exit-login").click(function () {
    localStorage.removeItem("user");
    window.location = "/login.html";
  });

  //Handle Send Message
  $(".SendButton").click(sendTextMsg);
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey) {
      console.log("Ctrl");
    }
    else {
      if (event.keyCode == 13) {
        sendTextMsg();
      }
    }
  });

  //Have cache, draw content before loading
  if (localStorage.getItem("chat") != undefined && localStorage.getItem != "") {
    for (index in window.chat) {
      if (index == "length") continue;
      $(".user-list")[0].innerHTML += window.chat[index].list(index);
    }
    initialize();
  }
  else {
    //Initialize Friend List
    $.ajax(`http://localhost:5000/user/${window.account.id}/list/friend`).done(function (data) {
      for (i of data) {
        window.chat.push(new Friend(i[0], i[1].remark, new Records([], function (callback) {
          //Fetcher for historys
          $.ajax(`http://localhost:5000/history/pull/${window.account.id}/friend/${i[0]}/latest`).done(callback);
        }, window.chat.length)));
      }
      //Then initialize Group List
      $.ajax(`http://localhost:5000/user/${window.account.id}/list/group`).done(function (data) {
        for (i of data) {
          //Also Fetcher
          window.chat.push(new Group(i[0], i[1].group_name, new Records([], function (callback) {
            $.ajax(`http://localhost:5000/history/pull/${window.account.id}/group/${i[0]}/latest`).done(callback);
          }, window.chat.length)));
        }
        // Finish Loading, now initialize lists
        // To avoid using async and Promise, using a timer
        setTimeout(initialize, 500);
      });
    });
  }
});

/**
 * Another Main Entry after ajax
 */
function initialize() {
  //Display Users
  for (i of $(".avator img")) i.src = `http://q1.qlogo.cn/g?b=qq&s=640&nk=${window.account.id}`;
  showChat();

  //Show chat and Change navigation button icons
  window.addEventListener("hashchange", () => {
    navigateButton();
    if (location.hash.split("/")[1] === undefined) {
      hideChat();
    }
    else showChat();
  });

  //Display Chat List
  $(".user-list").delegate(".user", "click", function (event) {
    index = event.currentTarget.dataset.index;
    location.hash = `chat/${index}`;
    showChat();
  });

  //10 seconds after load, cache everything.
  setTimeout(function () {
    localStorage.setItem("chat", JSON.stringify(window.chat));
  }, 10000);
}