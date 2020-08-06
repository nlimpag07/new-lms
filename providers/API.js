import axios from 'axios'

var API = axios.create({
	baseURL: process.env.apiBaseUrl,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}
})

export { API }