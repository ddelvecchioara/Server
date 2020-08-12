var express = require('express');
const request = require('request');
const multer = require('multer');
var path = require('path');
var app = express();
var fs = require('fs');
var rimraf = require("rimraf");
const imageGetRouter = express.Router({
    strict: true
});

module.exports = imageGetRouter;

const algServiceHeaderOptions = {
     'Content-Type': 'application/json', 
     'X-Api-Key':'12dsf34dsfg2def23rwef23f3234sdf2df23' 
}

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};


    imageGetRouter.delete('/cleandirs/:uid', (req, res) => {
        try{
            //Clean Input Directories
            rimraf.sync("./../input/faces/"+ req.params.uid);
            rimraf.sync("./../input/vehicles/"+ req.params.uid);
            rimraf.sync("./../input/weapons/"+ req.params.uid);
            rimraf.sync("./../input/text/"+ req.params.uid);
            rimraf.sync("./../input/symbolsFlags/"+ req.params.uid);
            rimraf.sync("./../input/general/"+ req.params.uid);
    
            //Clean Output Directories
            rimraf.sync("./../output/faces/"+ req.params.uid);
            rimraf.sync("./../output/vehicles/"+ req.params.uid);
            rimraf.sync("./../output/weapons/"+ req.params.uid);
            rimraf.sync("./../output/text/"+ req.params.uid);
            rimraf.sync("./../output/symbolsFlags/"+ req.params.uid);
            rimraf.sync("./../output/general/"+ req.params.uid);
        }catch(exception){
            console.log(exception.toString());
            return res.status(500).json({message: exception});
        }
        res.status(200).json({message : "Image directories cleared, Ready for next run."});
    });
    

imageGetRouter.post('/image', function (req, res) {
    var username = req.body.username
    var outputFileName = req.body.path + '_output.png';
    var dir = '/home/azureuser/output/'+ req.body.type + '/' + username

    
    //dir = dir + '/' + username

    var file = path.join(dir, outputFileName);
    console.log(file);
    console.log("seeing file")
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found jerk');
    });
});