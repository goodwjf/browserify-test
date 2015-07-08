/* main.js */
var foo = require('./foo.js');
var bar = require('./bar.js');
var rt = require('./rt.js');
 require('../css/header.css');
var tpl = require('../templates/header.html');

window.onload = function(){
var data = { 
        name: 'al', 
        isAdmin: true
    };
    document.body.innerHTML = rt.template(tpl,data);  
} 
