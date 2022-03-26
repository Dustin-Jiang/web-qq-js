import Client from "../core";
import Records from "../core/records";
import { Friend, Group } from "../core/user";
import { TextMessage } from "../core/message";
import { hideChat, navigateButton, sendTextMsg, showChat, toggleMenu } from "./utils";

(window as any).account = JSON.parse(localStorage.getItem("user") as string);
(window as any).apiUrl = "http://localhost:5000";
(window as any).chat = []
/**
 * Main Entry Point
 */
$(document).ready(function () {
  if (
    localStorage.getItem("user") == "" ||
    localStorage.getItem("user") == undefined
  )
    window.location.href = "/login.html";
  //Navigation Button Icon
  navigateButton();
  //Navigation Button to back
  $(".navigator").click(hideChat);

  //Display ID
  $(".account-name")[0].innerHTML = (window as any).account.name;
  $(".account-id")[0].innerHTML = (window as any).account.id;

  //Display flyout menu
  $(".IconButton.avator").click(toggleMenu);
  $("actions button#exit-login").click(function () {
    localStorage.removeItem("user");
    window.location.href = "/login.html";
  });

  //Handle Send Message
  $(".SendButton").click(sendTextMsg);
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey) {
      console.log("Ctrl");
    } else {
      if (event.keyCode == 13) {
        sendTextMsg();
      }
    }
  });

  //Have cache, draw content before loading
  if (localStorage.getItem("chat") != undefined && localStorage.getItem) {
    for (let index in (window as any).chat) {
      if (index == "length") continue;
      $(".user-list")[0].innerHTML += (window as any).chat[index].list(index);
    }
    initialize();
  } else {
    //Initialize Friend List
    $.ajax(
      `${(window as any).apiUrl}/user/${(window as any).account.id}/contact`
    ).done(function (data) {
      console.log(data)
      for (let i of data) {
        (window as any).chat.push(
          new Friend(
            i[0],
            i[1].remark,
            new Records(
              [],
              function (callback : Function) {
                //Fetcher for historys
                $.ajax(
                  `${(window as any).apiUrl}/history/pull/${
                    (window as any).account.id
                  }/friend/${i[0]}/latest`
                  //@ts-ignore
                ).done(callback);
              },
              (window as any).chat.length
            )
          )
        );
      }
      // Finish Loading, now initialize lists
      // To avoid using async and Promise, using a timer
      setTimeout(initialize, 500);
    });
  }
});

/**
 * Another Main Entry after ajax
 */
function initialize() {
  //Display Users
  for (let i of $(".avator img") as any)
    i.src = `http://q1.qlogo.cn/g?b=qq&s=640&nk=${(window as any).account.id}`;
  showChat();

  //Show chat and Change navigation button icons
  window.addEventListener("hashchange", () => {
    navigateButton();
    if (location.hash.split("/")[1] === undefined) {
      hideChat();
    } else showChat();
  });

  //Display Chat List
  $(".user-list").delegate(".user", "click", function (event) {
    let index = event.currentTarget.dataset.index;
    location.hash = `chat/${index}`;
    showChat();
  });

  //10 seconds after load, cache everything.
  setTimeout(function () {
    localStorage.setItem("chat", JSON.stringify((window as any).chat));
  }, 10000);
}
