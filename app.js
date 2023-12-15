const express = require("express");
const https=require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require('mongoose');
//mongodb+srv://saksham:<password>@cluster0.0jknj.mongodb.net/?retryWrites=true&w=majority
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let store=[];
app.get("/", function(req, res){
    res.render("home");
  });
  app.get("/input", function(req, res){
    res.render("input");
  });
  app.get("/output", function(req, res){
    res.render("output",{
        store:store
    });
  });
  mongoose.connect("mongodb+srv://saksham:HeLLBoY1234@cluster0.0jknj.mongodb.net/?retryWrites=true&w=majority", {
    //useNewUrlParser: true,
   //useUnifiedTopology: true,
    dbName: 'blog-db'
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})
  const locationSchema = {
    location: String,
    polygon: String
  };
  
  const Loc = mongoose.model("Loc", locationSchema);
  app.post("/input",function(req,res){//'/'=root adress of our web site

    const query=req.body.location;
    async function findLocationsInDelhi() {
        try {
          // Find documents where location is "delhi"
          const locationsInDelhi = await Loc.find({ location: query });
      
          // Output the addresses of locations in Delhi
          locationsInDelhi.forEach(location => {
                const obj={
                        loc:location.location,
                        poly:location.polygon
                }
                store.push(obj);
           });
      
          console.log('Iteration complete');
          res.redirect('/output')
        } catch (error) {
            //res.redirect('/output')
          console.error('Error:', error.message);
        } 
      }
      
     const apiKey="e444b78df65f0b9b6abc084b8ff63a24";
     const apiid="e444b78df65f0b9b6abc084b8ff63a24";
     const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiid+"&Key="+apiKey;
     var lon=0;
     var lat=0;
     https.get(url,function(response){
      // console.log(response.statusCode);
       response.on("data",function(data){//'on'sends data in hexadecimal code
     const weatherdata=JSON.parse(data);
     const temp=weatherdata.main.temp;
     const description=weatherdata.weather[0].description;
      lon=weatherdata.coord.lon;
      lat=weatherdata.coord.lat;
    
//     // const obj={
//     //    // weatherdata:weatherdata,
//     //    location:req.body.location,
//     //     temp:temp,
//     //     description:description
//     //   };
//     //          store.push(obj);
//     //              // store.forEach(function(obj){ 
                    
//     //               //  })
//     //                res.redirect("/output");    
//    // console.log(temp);
       });
     });
     const url1=`https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=cruise&location=${lat}%${lon} &radius=1500 &type=restaurant &key=AIzaSyD8-7Z76zNFljWkDwHtN902FHBL-hNqHuA`
//     //  console.log("post request recieved");
     https.get(url1,function(response){
         console.log(response.statusCode);
         response.on("data",function(data){//'on'sends data in hexadecimal code
       const Data=JSON.parse(data);
       console.log(Data);
                 res.redirect("/output")
         });
       });
});
    
  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
