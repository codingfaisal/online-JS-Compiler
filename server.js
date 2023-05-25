const express = require("express");
const compiler = require("compilex");

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


var option = {stats: true};
compiler.init(option);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/compileCode", function(req, res){
    const code = req.body.code;
    const input = req.body.input;
    const inputRadio = req.body.inputRadio;
    const lang = req.body.lang;
    if(lang==="C" || lang==="C++"){
        if(inputRadio===true){
            var envData = { OS : "windows" , cmd : "g++" , options: {timeout:10000}};
            compiler.compileCPPWithInput(envData , code , input , function (data) {
                if(data.error){
                    res.send(data.error);
                }
                else{
                    res.send(data.output);
                }
            });
        }
        else{
            var envData = { OS : "windows" , cmd : "g++" , options: {timeout:10000}};
            compiler.compileCPP(envData , code , function (data) {
                res.send(data);
            });
        }
    }
    if(lang==="Python"){
        if(inputRadio===true){
            var envData = { OS : "windows"};
            compiler.compilePythonWithInput(envData , code , input , function (data) {
                if(data.error){
                    res.send(data.error);
                }
                else{
                    res.send(data.output);
                }
            });
        }
        else{
            var envData = { OS : "windows"};
            compiler.compilePython(envData , code , function (data) {
                res.send(data);
            });
        }
    }
});

app.get("/fullStat", function(req, res){
    compiler.fullStat(function(data){
        res.send(data);
    });
});

app.listen(8080);

compiler.flush(function(){
    console.log("All temporary files flushed");
});