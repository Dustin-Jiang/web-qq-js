import Auth from "../auth";
import Records from "../core/records";
import { Friend } from "../core/user";
import {
  sendTextMsg, 
  showChat
} from "./utils";

import {
  NavigateButton,
  FlyoutMenu
} from "./components"

import { api } from "../api"

(window as any).account = (new Auth).get();
(window as any).chat = []
/**
 * Main Entry Point
 */
export class appIndex {
  constructor() {
    jQuery(() => {
      //Navigation Button Icon
      let n = new NavigateButton();
      let flyoutMenu = new FlyoutMenu(
        [{
          target: (
              document.querySelector("actions button#exit-login")
            ) as HTMLElement,
          action: (event) => {
            (new Auth).switch(
              (window as any).account.id
            ).then(() => {
              window.location.assign("/login.html");
            })
          }
        }],
        (document.querySelector(".IconButton.avator")) as HTMLElement
      )
  
      //Display ID
      $(".account-name")[0].innerHTML = (window as any).account.name;
      $(".account-id")[0].innerHTML = (window as any).account.id;
  
      // //Display flyout menu
      // $(".IconButton.avator").on("click", toggleMenu);
      // $("actions button#exit-login").on("click", function () {
        
      // });
  
      //Handle Send Message
      $(".SendButton").on("click", sendTextMsg);
      document.addEventListener("keydown", function (event) {
        if (event.ctrlKey) {
          console.log("Ctrl");
        } else {
          if (event.key === "Enter") {
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
        api.get(`/user/${(window as any).account.id}/contact`)
        .then((data) => {
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
            )
          }
        }).then(() => {
          this.initialize()
        })
      }
    })
  }

  initialize() {
    //Display Users
    for (let i of $(".avator img") as any)
      i.src = `http://q1.qlogo.cn/g?b=qq&s=640&nk=${(window as any).account.id}`;
    showChat();

    //Display Chat List
    $(".user-list").on(".user", "click", function (event) {
      let index = event.currentTarget.dataset.index;
      location.hash = `chat/${index}`;
      showChat();
    });

    this.cacheStatus()
  }

  cacheStatus() {
    //10 seconds after load, cache everything.
    setTimeout(function () {
      localStorage.setItem("chat", JSON.stringify((window as any).chat));
    }, 10000);
  }
}
