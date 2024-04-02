// config template engin
const express = require('express')
const path = require('path')
const configViewEngine = (app) => {
    // chuyển trang html sẽ dùng được thẻ div
    app.set("views", path.join('./src', 'views'));
    app.set('view engine', 'ejs')

    // config img sẽ dùng được trong trang html 
    app.use(express.static(path.join('./src', 'public')))
}

module.exports = configViewEngine