var express = require('express');
const request = require('request');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router({
    strict: true
});

module.exports = router;

const algServiceHeaderOptions = {
     'Content-Type': 'application/json', 
     'X-Api-Key':'12dsf34dsfg2def23rwef23f3234sdf2df23' 
}

//General status request, returns all jobs
router.get('/status/:id', (req, res) => {
    request({
        url : "http://localhost:5000/ml/status?taskId=" + req.params.id,
        method :"get",
        headers : algServiceHeaderOptions,
      },
      function (err, httpResponse, body) {
        res.json(body);
      });
});


//Algorithm Start requests----------------------------------------

router.get('/start/faces/:uid', (req, res) => {
    var bodyContent;
    var username = req.params.uid
    bodyContent = {"inputPath": `/tmp/sisr/images/faces/${username}`,"outputPath": `/output_images/faces/${username}`,"device": "cpu","category": "faces"};
    request({
        url : "http://localhost:5000/ml/create",
        method :"POST",
        headers : algServiceHeaderOptions,
        body: bodyContent,
        json: true
      },
      function (err, httpResponse, body) {
          console.log(body);
          console.log(bodyContent)
          res.status(200).json(body);
      });
});

router.get('/start/vehicles/:uid', (req, res) => {
    var bodyContent;
    var username = req.params.uid
    bodyContent = {"inputPath": `/tmp/sisr/images/vehicles/${username}`,"outputPath": `/output_images/vehicles/${username}`,"device": "cpu","category": "vehicles"};
    request({
        url : "http://localhost:5000/ml/create",
        method :"POST",
        headers : algServiceHeaderOptions,
        body: bodyContent,
        json: true
      },
      function (err, httpResponse, body) {
        res.status(200).json(body);
      });
});

router.get('/start/symbolsflags/:uid', (req, res) => {
    var bodyContent;
    var username = req.params.uid
    bodyContent = {"inputPath": `/tmp/sisr/images/symbolsFlags/${username}`,"outputPath": `/output_images/symbolsFlags/${username}`,"device": "cpu","category": "symbolsFlags"};
    request({
        url : "http://localhost:5000/ml/create",
        method :"POST",
        headers : algServiceHeaderOptions,
        body: bodyContent,
        json: true
      },
      function (err, httpResponse, body) {
        res.status(200).json(body);
      });
});

router.get('/start/general/:uid', (req, res) => {
    var bodyContent;
    var username = req.params.uid
    bodyContent = {"inputPath": `/tmp/sisr/images/general/${username}`,"outputPath": `/output_images/general/${username}`,"device": "cpu","category": "general"};
    request({
        url : "http://localhost:5000/ml/create",
        method :"POST",
        headers : algServiceHeaderOptions,
        body: bodyContent,
        json: true
      },
      function (err, httpResponse, body) {
        res.status(200).json(body);
      });
});

router.get('/start/weapons/:uid', (req, res) => {
    var bodyContent;
    var username = req.params.uid
      bodyContent = {"inputPath": `/tmp/sisr/images/weapons/${username}`,"outputPath": `/output_images/weapons/${username}`,"device": "cpu","category": "weapons"};
      request({
          url : "http://localhost:5000/ml/create",
          method :"POST",
          headers : algServiceHeaderOptions,
          body: bodyContent,
          json: true
        },
        function (err, httpResponse, body) {
            res.status(200).json(body);
        });
});

router.get('/start/text/:uid', (req, res) => {
    var bodyContent;
    var username = req.params.uid
    bodyContent = {"inputPath": `/tmp/sisr/images/text/${username}`,"outputPath": `/output_images/text/${username}`,"device": "cpu","category": "text"};
    request({
        url : "http://localhost:5000/ml/create",
        method :"POST",
        headers : algServiceHeaderOptions,
        body: bodyContent,
        json: true
      },
      function (err, httpResponse, body) {
        res.status(200).json(body);
      });
});

//=========================================Upload Requests=============

 function uploadHelper(uploadType, username, req,res){ 
   

    var storageF = multer.diskStorage({
        destination: function (req, file, cb) {
            var dir = `../input/${uploadType}`;
            var dir2 =`../output/${uploadType}`
            fs.mkdir(path.join(dir2, username), (err) => { 
                if (err) { 
                    return console.error(err); 
                } 
                console.log('Directory created successfully!'); 
            }); 
            
            
            fs.mkdir(path.join(dir, username), (err) => { 
                if (err) { 
                    return console.error(err); 
                } 
                console.log('Directory created successfully!'); 
            }); 
            dir = dir + '/' + username
            cb(null,dir);
           
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    });
    const upload = multer({ storage: storageF }).array('image',100);
    upload(req,res,function(err) {
        if(err) {
            //throw new exception("Failed To Upload File(s)!");
            console.log(err)
        }
        return true;
    });
}

router.post('/addImage/faces/:uid', (req, res) => {
    try{
        
        uploadHelper("faces",req.params.uid,req,res);
        res.status(200).json({message : "File(s) is uploaded"});
    }catch(exception){
        return res.status(500).json({message: exception});
    }
    
});

router.post('/addImage/general/:uid', (req, res) => {
    try{
        uploadHelper("general",req.params.uid,req,res);
    }catch(exception){
        return res.status(500).json({message: exception});
    }
    res.status(200).json({message : "File(s) is uploaded"});
});

router.post('/addImage/symbolsFlags/:uid', (req, res) => {
    try{
        uploadHelper("symbolsFlags",req.params.uid,req,res);
    }catch(exception){
        return res.status(500).json({message: exception});
    }
    res.status(200).json({message : "File(s) is uploaded"});
});

router.post('/addImage/text/:uid', (req, res) => {
    try{
        uploadHelper("text",req.params.uid,req,res);
    }catch(exception){
        return res.status(500).json({message: exception});
    }
    res.status(200).json({message : "File(s) is uploaded"});
});

router.post('/addImage/vehicles/:uid', (req, res) => {
    try{
        uploadHelper("vehicles",req.params.uid,req,res);
    }catch(exception){
        return res.status(500).json({message: exception});
    }
    res.status(200).json({message : "File(s) is uploaded"});
});

router.post('/addImage/weapons/:uid', (req, res) => {
    try{
        uploadHelper("weapons",req.params.uid,req,res);
    }catch(exception){
        return res.status(500).json({message: exception});
    }
    res.status(200).json({message : "File(s) is uploaded"});
});
