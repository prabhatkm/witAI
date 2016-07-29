'use strict';

let Wit = null;
try {
  // if running from repo
  Wit = require('../').Wit;
} catch (e) {
  Wit = require('node-wit').Wit;
}

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
        //delete context.missingLocation;
      } else {
        //context.missingLocation = true;
        delete context.forecast;
      }
      return resolve(context);
    });
  } /* ,
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
