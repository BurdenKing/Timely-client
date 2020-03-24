import axios from 'axios';

/**
 * Define the base axios URL. 
 */
axios.defaults.baseURL = "http://localhost:8080/timely/api/";

/**
 * Contains the data of the response body 
 * @param {any} response 
 */
const resBody = (response) => response.data;

const token = localStorage.getItem("token");

/**
 * Defines HTTP functions for CRUD functionality. 
 */
const requests = {
  get: (url) => axios.get(url, {
    headers: {
      'Authorization': token
    }
  }).then(resBody),
  post: (url, body) => axios.post(url, body, {
    headers: {
      'Authorization': token
    }
  }).then(resBody),
  put: (url, body) => axios.put(url, body, {
    headers: {
      'Authorization': token
    }
  }).then(resBody),
  del: (url) => axios.delete(url, {
    headers: {
      'Authorization': token
    }
  }).then(resBody) 
}

/**
 * Prototype to get employee information. Not Currently used. 
 */
const employeeInfo = {
  getCurrentUser: (id) => requests.get(`/employees/${id}`), 
}

const projects = {
  getProjectsForUser: (id) => requests.get(`/projects/emp/${id}`),
  createProject: (data) => requests.post(`/projects/createProject`, data),
  getById: (id) => requests.get(`/projects/${id}`)
}

/**
 * API request for current login.  
 */
const authorization = {
  login: (data) => requests.post('/tokens', data)
}

export default {
  employeeInfo,
  authorization,
  projects
}