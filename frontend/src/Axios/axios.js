import axios from "axios"

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:9090/api"

const instance = axios.create({
  baseURL,
})

export default instance
