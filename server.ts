import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import https from 'https';
import { IncomingMessage } from 'http';
import path from 'path';

dotenv.config()
const app = express()
const port = process.env.PORT
const apiKey = process.env.APIKEY

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request: express.Request, response: express.Response) => {
    response.sendFile(path.join(__dirname, '..', '/src/index.html'))
})

app.post('/', (request: express.Request, response: express.Response) => {
    const query = request.body.query
    const unit = 'metric'
    const lang = 'th'
    const endpoint = 'https://api.openweathermap.org/data/2.5/weather'
    const url = `${endpoint}?q=${query}&units=${unit}&langs=${lang}&appid=${apiKey}`
    https.get(url, (res: IncomingMessage) => {
        console.log(res.statusCode)
        res.on('data', (data) => {
            const resData = JSON.parse(data)
            response.write(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>My First WebApp</title>
            </head><body>`)
            console.log(resData)
            if (resData.cod === '404') {
                response.write(`<h1>Search(city) : ${query}</h1>`)
                response.write(`<h2>${resData.message}</h2>`)
            } else {
                response.write(`<h1>สภาพอากาศใน ${resData.name} </h1>`)
                response.write(`<h2>อุณหภูมิ=>${resData.main.temp} degrees</h2>`)
                response.write(`<h2>เมฆ=>${resData.weather[0].main}</h2>`) 
                response.write(`<h3>รายละเอียด=>${resData.weather[0].description}</h3>`)
            }
            console.log(resData)
            response.write(`<a href='/'>Back</a>`)
            response.write('<body')
            response.send()
        })
    })
})
app.listen(port, () => {
    console.log(`⚡️[SERVER]: Server is running on port: ${port}`)
})
