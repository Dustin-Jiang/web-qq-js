import Auth from "../auth";
import Records from "../core/records";
import { Friend } from "../core/user";
import { 
  hideChat, 
  navigateButton, 
  sendTextMsg, 
  showChat, 
  toggleMenu
} from "./utils";

(window as any).account = (new Auth).get();
(window as any).chat = []
/**
 * Main Entry Point
 */
export class appIndex {
  constructor() {
    jQuery(() => {
      if ((new Auth).check())
        window.location.assign("/login.html")
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
        (new Auth).switch(
          (window as any).account.id
        ).then(() => {
          window.location.assign("/login.html");
        })
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
      if (localStorage.getItem("chat") != undefined) {
        for (let index in (window as any).chat) {
          if (index == "length") continue;
          $(".user-list")[0].innerHTML += (window as any).chat[index].list(index);
        }
        this.initialize();
      } else {
        //Initialize Friend List
        $.ajax(
          `${(window as any).apiUrl}/user/${(window as any).account.id}/contact`
        ).done( (data) => {
          console.log(data)
          for (let i of data) {
            (window as any).chat.push(
              new Friend(
                i.user_id,
                i.remark,
                new Records(
                  [],
                  function (callback: Function) {
                    //Fetcher for historys
                    $.ajax(
                      `${(window as any).apiUrl}/history/pull/${(window as any).account.id
                      }/friend/${i.user_id}/latest`
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
          setTimeout(this.initialize, 500);
        });
      }
    })
  }

  /**
   * Another Main Entry after ajax
   */
  initialize() {
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
}
