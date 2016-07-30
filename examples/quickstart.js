'use strict';

let Wit = null;
try {
  // if running from repo
  Wit = require('../').Wit;
} catch (e) {
  Wit = require('node-wit').Wit;
}
var intent, cuisine, product, veg;
var location;
const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/quickstart.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    console.log( request );
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  getForecast({context, entities}) {
    //console.log(entities);
    console.log("forecast",context, entities);
    return new Promise(function(resolve, reject) {
      var location = firstEntityValue(entities, 'location')
      console.log("location",location);
      if (location) {
        context.forecast = 'sunny in ' + location; // we should call a weather API here
        delete context.missingLocation;
      } else {
        context.missingLocation = true;
        delete context.forecast;
      }
      return resolve(context);
    });
  },
  getOrder({context,entities}){
    //console.log("getOrder", context, entities);
    return new Promise(function(resolve, reject){
      intent=(firstEntityValue(entities, 'intent'))?firstEntityValue(entities, 'intent'):intent;
      veg=(firstEntityValue(entities, 'veg_nonveg'))?firstEntityValue(entities, 'veg_nonveg'):veg;
      product=(firstEntityValue(entities, 'product'))?firstEntityValue(entities, 'product'): product;

      cuisine=(firstEntityValue(entities, 'cuisine'))?firstEntityValue(entities, 'cuisine'):cuisine;
      console.log("entities-> entity",intent, cuisine, veg, product );

      if(veg) {delete context.missingVeg;}
      if(cuisine) {delete context.missingCuisine;}
      
      console.log("getOrder", context, entities);
    

      if(intent === 'order'){
        if(product === 'food'){
          if(cuisine && veg){
            context.orderNo = 123; 
            console.log("Ordered for "+cuisine+" "+veg+" "+product);
            delete context.missingVeg;
            delete context.missingCuisine;
            veg=null;
            cuisine=null;
            product=null;
            intent=null;
            location =null;
            return resolve(context);
          }//cuisine and veg
          else if (cuisine){
            delete context.orderNo;
            delete context.missingCuisine;
            context.missingVeg = true;
            return resolve(context);
          }//cuisine and !veg
          else if (veg){
           // zomato.getCuisines(context.coords,function(cuisineOptions){
              var cuisineOptions = ["punjabi","gujarati","chiniese","maxican"];
              context.cuisineOptions = cuisineOptions;//.join(',').substr(0,317) + "...";
              delete context.orderNo;
              delete context.missingVeg;
              context.missingCuisine = true;
              context.quickreplies = cuisineOptions;
              
              var tempMessage = {};
              tempMessage.text = 'select cuisine';
              tempMessage.quick_replies = [];
              cuisineOptions.forEach(function(cuisine) {
                tempMessage.quick_replies.push ({"content_type":"text", "title":cuisine,"payload":cuisine});

                return resolve(tempMessage);
              }, this);
              


               
          //  });             
          }// !cuisine and veg
          else{
            delete context.orderNo;
            context.missingCuisine = true;
            context.missingVeg = true;
             return resolve(context);
          } //!cuisine and !veg
        }//product
        else {
          delete context.orderNo;
          delete context.missingVeg;
          delete context.missingCuisine;
          return resolve(context);
        }
      }//intent
      else if(intent === 'weather'){
        delete context.orderNo;
        delete context.missingVeg;
        delete context.missingCuisine;
        //getForecast({context, entities});
        return resolve(context);
      }
     
    });

  }
  
  
  
  
   /* ,
  getText({context}) {
    console.log("tead");
    return new Promise(function(resolve, reject) {
        context.text = 'sunny'; // we should call a weather API here
      return resolve(context);
    });
  },
   getText1({context,entities}) {
    console.log("teadjdhj");

    return new Promise(function(resolve, reject) {
      var veg= null;
      var intent = null;
      var product = null;
      var cuisine = null;
      intent=firstEntityValue(entities, 'intent');
      veg=firstEntityValue(entities, 'veg_nonveg');
      product=firstEntityValue(entities, 'product');
      cuisine=firstEntityValue(entities, 'cuisine');
     
      console.log(intent,cuisine,veg,product);
      context.text = intent; // we should call a weather API here

      if(intent === 'order' )
      {
     // console.log("entered if");
        //if(product === 'food'){
          if(veg != 'veg' && veg != 'nonveg' ){
            context.text = "Veg or NonVeg ?";
            //return reject(context); 
          }
          else if(cuisine === null ){
            context.text = "Cuisine? "; 
            //return reject(context);
          }
          else {
              //delete context.entities;
              context.text = "Your order will be placed for "+veg+" "+cuisine+" "+product;
              
          }
          return resolve(context);
        //}


      } 
       
       
       
       /* 
        if(intent=="order" && veg==null )
        {
          
          context.text="veg or non-veg";
          console.log(context.text);
        }
        if(veg!=null)
        {
          if(veg=="veg")
          {
            context.text="Restro1 , Restro2...";
          }
          else if(veg=="nonveg")
          {
            context.text="Restro 3, Restro 4";
          }
          else{
            context.text="Ramdom restro";
          }
          //delete context.entities.veg_nonveg;
        } /
      //entities = null;
      
    });
  } */
};

const client = new Wit({accessToken, actions});
client.interactive();
