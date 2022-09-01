const mongoose = require('mongoose');

//uppercase camelcase a class
//lower case is variable
const packageSchema = mongoose.Schema({
    //mongoose provides it
    //_id: mongoose.Schema.Types.ObjectId,
    // _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    sender:
    {
        type:String,
        required:true
    },

    address:
    {
        type:String,
        required:true
    },

    
    weight:
    {
        type: Number,
        validate: 
        {
            validator:function(aWeight){
                return (aWeight >0);
            },
            message:'Invalid Weight, must be above 0!!'
        },
        required:true
    },

    fragile:
    {
        type:Boolean,
        required:true
    },

    cost:
    {
        type: Number,
        validate: 
        {
            validator:function(aCost){
                return (aCost >0);
            },
            message:'Invalid Cost, must be above 0!!'
        },
        required:true
    }


    // created:{
    //     type: Date,
    //     default: Date.now
    // },

    // model:String,
    //default value usually for timestamps
    // model:
    // {
    //     type:String,
    //     default:'735'
    // },

    // author:{
    //     type: mongoose.Schema.Types.ObjectId,
    //  //second is name of collection it is plural form of ref
        //for Author it will be Authors
    //     ref:'Author'
    // },

    // year:
    // {
    //     type: Number,
    //     validate: 
    //     {
    //         validator:function(aYear){
    //             return (aYear >=1990 & aYear<=2023);
    //         },
    //         message:'Invalid Year!!'
    //     }
    // }
    //_v:0 version key helps see update
});

//why is it one to one because redundancy
//no square brackets one book one author
//square brackets mean it is one to many

//need to provide model which is instance of class
//need to export from car.js file
//(CollectionName)
//model gets collection name Cars which uses this schema carSchema
module.exports= mongoose.model('Package', packageSchema)