const axios = require("axios")

export const apiRoot = "http://localhost:5000"

interface Api {
  get: (path : string) => Promise<any>,
  post: (path : string, options: object) => Promise<any>
  generateUrl: (path: string) => string
}

export const api : Api = {
  get: (path : string) : Promise<any> => {
    return axios.get(`${apiRoot}${path}`)
  },
  post: (path : string, options : object) : Promise<any> => {
    return axios.post(`${apiRoot}${path}`, options)
  },
  generateUrl: (path:  string): string => {
    return `${apiRoot}${path}`
  }
}