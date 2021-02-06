const express=require('express');
const fetch = require('node-fetch');
const path=require('path');
const app=express();
const cors=require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname, '/public')));
let url='http://127.0.0.1:5500/api/get/partitions';
const jsonData={
    "number":5,
    "polygon":[
            {"x":0,"y":0}, 
            {"x":10,"y":0}, 
            {"x":10,"y":10}, 
            {"x":0,"y":10},
            {"x":0,"y":0}
        ]
    };
    fetch(url,{
        method:'POST',
        body:JSON.stringify(jsonData),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(json=> {
        console.log(json);
    })
    .catch(err => console.log(err))

app.get('/', (req, res)=>{
    res.sendFile('index.html');
});

const port=process.env.PORT || 5100;

app.listen(port, ()=>{
    console.log(`server listening on port: ${port}`);
})