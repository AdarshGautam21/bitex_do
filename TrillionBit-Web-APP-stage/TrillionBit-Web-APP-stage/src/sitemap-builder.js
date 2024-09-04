require('babel-register');

const router = require('./router').RouterDom;
const Sitemap = require('../').default;

(
    new Sitemap(router)
        .build('https://www.bitexuae.com')
        .save('./sitemap.xml')
);