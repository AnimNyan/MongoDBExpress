//schema represents the blueprint of your collection it's a plan structure
const express = require('express');
const app = express();

const path = require('path');

const mongoose = require('mongoose');

//package becomes reference to module being exported
//this is the model
const Package = require('./models/package');

//database name is at the end week6db
//why is it 127.0.0.1 instead of localhost not working
const url = "mongodb://127.0.0.1:27017/week6db";





mongoose.connect(url, function(err){
    if(err === null)
    {
        console.log('Connected Successfully');
    }

    // Package.findByIdAndUpdate('630c298d8e094a12242aa160', {maker:"VW"},function(err){
    //     if(err)
    //     console.log("Got error: " + err);
    //     else console.log('Updated Successfully');
    // });
    //

    // let package1 = new Package({sender: 'John Smith', address: '123 Smith Drive', weight:1.2, fragile:true});
    // //save into database
    // package1.save(function(err){
    //     if(err)
    //     {
    //         console.log('Unable to save '+ err.message);
    //     }
    //     else
    //     {
    //         console.log('Saved Successfully to database!');
    //     }
    // });

});

//attach bootstrap
app.use("/css", express.static(path.join(__dirname,"node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname,"node_modules/bootstrap/dist/js")));
app.use(express.static('images'));
app.use(express.static('css'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({extended: true}));

//listening for port for website
app.listen("8080");

app.get("/", function(request, response)
{
    response.sendFile(path.join(__dirname, "views/index.html"));
});


//------------------make path to add parcel through post
app.get("/addparcel", function(request, response){
    response.sendFile(path.join(__dirname, "views/addparcel.html"));
});

//-----------------create parcel through post request
app.post("/addparcel", function(request, response){

    //retrieve values from the query string
    
    let sender = request.body.sender;
    let address = request.body.address; 
    let weight = request.body.weight;
    let fragile = request.body.fragile;
    let cost = request.body.cost;

    console.log(parseFloat(weight)); 

    let isContinue = true;

    //if invalid data is sent then send the error.html file
    if(sender.length < 3 || address.length < 3 ||parseFloat(weight)< 0)
    {
        console.log("Invalid");
        response.sendFile(path.join(__dirname,"views/error.html")); 
        isContinue = false;   
    }

    if (isContinue)
    {
        let package1 = new Package({sender: sender, address: address, weight:weight, fragile:fragile, cost:cost});
        //save into database
        package1.save(function(err){
            if(err)
            {
                console.log('Unable to save '+ err.message);
            }
            else
            {
                console.log('Saved Successfully to database!');
            }

        });

        // db.collection("parcels").insertOne({
        //     sender: sender,
        //     address: address,
        //     weight: weight,
        //     fragile: fragile,
        //     cost: cost
        // });
        

        //show new parcel added to database by showing all pakcages
        let htmlMessage = "1 element was added to the database.<br>"

        //get and concatenate table html string by iterating db array
        

        // console.log(`htmlMessage: ${htmlMessage}`)

        //send html string back as response
        response.send(htmlMessage);
    }
});


//----------------make path to retrieve parcels
//http://localhost:8080/getparcels


//----------------make path to retrieve parcels
//http://localhost:8080/getparcels
app.get("/getparcels", function(request, response){
    Package.find({}, function (err, docs) {
        //docs is an array
        console.log(docs);
        response.render(__dirname + "/views/getparcels.html", {postDocs: docs});
    });  
});


app.post("/getparcelsweight", function(request, response){
    let minWeight = request.body.minWeight;
    let maxWeight = request.body.maxWeight;

    Package.find({$and:[ {weight: { $lte: maxWeight}}, {weight: {$gte: minWeight}}]}, function (err, docs) {
        
        //docs is an array
        console.log(docs);
        response.render(__dirname + "/views/getparcels.html", {postDocs: docs});
    });  
});

app.post("/getparcelsender", function(request, response){
    let sender = request.body.sender;
    
    Package.find({sender: sender}, function (err, docs) {
        
        //docs is an array
        console.log(docs);
        response.render(__dirname + "/views/getparcels.html", {postDocs: docs});
    });  
});




//----------------make path to delete parcels
app.get("/deleteparcel", function(request, response){
    response.sendFile(path.join(__dirname, "views/deleteparcel.html"));
});


//---------------post request to delete parcels
app.post("/deleteparcel", function(request, response){

    //retrieve values from the query string
    let id = request.body._id;
    let sender = request.body.sender;

    console.log(`id:${id}`);

    if (id !=="")
    {
        console.log("I am in id");
        Package.findByIdAndDelete(id, function (err, docs) {
            if (err) {console.log(err)}
            else{
                console.log("This doc has been deleted", docs);
            }
        });

        // db.collection("parcels").deleteMany({ _id: mongodb.ObjectId(id) }, function (err, obj) {
        //     console.log(`obj.n:${obj.n}`);
        // });
    }

    else if (sender !=="")
    {
        console.log("I am in sender");
        Package.deleteOne({ sender: sender }, function (err, doc) {
            console.log(doc);
        
        });
        // db.collection("parcels").deleteMany({$and:[ {weight: weight}, {sender: sender}]} , function (err, obj) {
        //     console.log(`obj.n:${obj.n}`);
        // });
    }

        

    //show new parcel added to database by showing all pakcages
    let htmlMessage = "Elements were deleted from the database.<br>"

    //get and concatenate table html string by iterating db array

    // console.log(`htmlMessage: ${htmlMessage}`)

    //send html string back as response
    response.send(htmlMessage);
    
});

//---------------post request to delete parcels
app.post("/deleteparcelsearch", function(request, response){

    //retrieve values from the query string
    let deletetype = request.body.deletetype;
    let searchcriteria = request.body.searchcriteria;


    if (deletetype =="weight")
    {
        Package.deleteMany({weight:searchcriteria}, function (err, docs) {
            if (err) {console.log(err)}
            else{
                console.log("Docs have been deleted", docs);
            }
        });

        // db.collection("parcels").deleteMany({ _id: mongodb.ObjectId(id) }, function (err, obj) {
        //     console.log(`obj.n:${obj.n}`);
        // });
    }

    else if (deletetype =="address")
    {
        Package.deleteMany({address:searchcriteria}, function (err, docs) {
            if (err) {console.log(err)}
            else{
                console.log("Docs have been deleted", docs);
            }
        });
        // db.collection("parcels").deleteMany({$and:[ {weight: weight}, {sender: sender}]} , function (err, obj) {
        //     console.log(`obj.n:${obj.n}`);
        // });
    }

    else if (deletetype == "fragile")
    {
        Package.deleteMany({fragile:searchcriteria}, function (err, docs) {
            if (err) {console.log(err)}
            else{
                console.log("Docs have been deleted", docs);
            }
        });
    }

        

    //show new parcel added to database by showing all pakcages
    let htmlMessage = "Elements were deleted from the database.<br>"

    //get and concatenate table html string by iterating db array

    // console.log(`htmlMessage: ${htmlMessage}`)

    //send html string back as response
    response.send(htmlMessage);
    
});


//----------------make path to delete parcels
app.get("/updateparcel", function(request, response){
    response.sendFile(path.join(__dirname, "views/updateparcel.html"));
});

app.post("/updateparcel", function(request, response){

    //retrieve values from the query string
    let id = request.body._id;
    let sender = request.body.sender;
    let address = request.body.address; 
    let weight = request.body.weight;
    let fragile = request.body.fragile;
    let cost = request.body.cost;

    console.log(parseFloat(weight)); 

    let isContinue = true;

    //if invalid data is sent then send the error.html file
    if(sender.length < 3 || address.length < 3 ||parseFloat(weight)< 0)
    {
        console.log("Invalid");
        response.sendFile(path.join(__dirname,"views/error.html")); 
        isContinue = false;   
    }

    if (isContinue)
    {
        
        Package.findOneAndUpdate({_id: id}, {sender: sender, address: address, weight:weight, fragile:fragile, cost:cost}, function(err,doc){
            console.log(doc);
        });


        // db.collection("parcels").updateOne({ _id: mongodb.ObjectId(id) },{ $set: {sender: sender, address: address, weight:weight, fragile:fragile, cost:cost } }, { upsert: false }, function (err, result) {
        
        // });

      
        

        //show new parcel added to database by showing all pakcages
        let htmlMessage = "1 element was updated in the database.<br>"

        //get and concatenate table html string by iterating db array
        

        // console.log(`htmlMessage: ${htmlMessage}`)

        //send html string back as response
        response.send(htmlMessage);
    }
    
});








app.get("*", function(request, response){
    response.sendFile(path.join(__dirname, "views/404.html"));
})


function generateHTMLTable() {
    let tableHTML = '';
    
    db.collection("parcels").find({}).toArray(function (err, result) {
        dbResult = result;
         //use an array so it is easier to iterate over
        let tableHeadingsArray= ["ID", "Sender", "Address", "Weight", "Fragile"];

        tableHTML += `<table>
                            <tr>`;


        //--------------------create table headings
        //iterate over tableHeadingsArray
        for(let i=0; i<tableHeadingsArray.length; i++)
        {
            //concatenate string
            tableHTML +=    `<th>${tableHeadingsArray[i]}</th>`;
        }
        tableHTML +=       "</tr>";

        // console.log(`dbResult.length: ${dbResult.length}`);
        // console.log(`dbResult[0]._id: ${dbResult[0].sender}`);
        //-------------------create table body
        //iterate over database creating each row
        for (let i = 0; i < dbResult.length; i++) {
            tableHTML += `<tr>
                            <td>${dbResult[i]._id}</td>
                            <td>${dbResult[i].sender}</td>
                            <td>${dbResult[i].address}</td>
                            <td>${dbResult[i].weight}</td>
                            <td>${dbResult[i].fragile}</td>
                        </tr>`;
        }
        tableHTML += "</table>";
        
    });
    
}