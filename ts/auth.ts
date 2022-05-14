import { api } from "./api"

export default class Auth {
  __get : Function
  __put : Function
  constructor() {
    this.__get = () : Credential => {
      return JSON.parse((localStorage.getItem("user") || "{}"))
    }
    this.__put = (x: Credential) => localStorage.setItem("user", x.toString())
  }
  /**
   * To check whether user is logon in.
   * @returns Boolean
   */
  check() : Boolean {
    // if `credential === {}`, return `false` because user unlogon
    return !(this.__get() === {})
  }
  /**
   * To toggle user credential between logon and unlogon.
   * @param id User QQ id number.
   * @returns A `Promise` ony with `resolve` to make the process async.
   */
  switch(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // Logon, to unlogin
      if (this.check()) {
        this.__put({})
        resolve()
      } else {
        api.get(`/client/nickname/${id}`)
          .then(
            (result) => this.__put(new Credential(id, result))
          ).then(
            () => resolve()
          )
      }
    })
  }
  get() : Credential {
    return this.__get()
  }
}

export class Credential {
  id : number
  name: string
  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}