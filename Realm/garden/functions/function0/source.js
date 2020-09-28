exports = function(arg){
  /*
    Accessing application's values:
    var x = context.values.get("value_name");

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
    var doc = collection.findOne({owner_id: context.user.id});

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);

    Try running in the console below.
  */
  const id = BSON.ObjectId(); // BSON.ObjectId("59cf1860a95168b8f685e378")
  const s =   "{\"relays\": [{\"relay\": 0, \"state\": 0}, {\"relay\": 1, \"state\": 0}, {\"relay\": 2, \"state\": 0}, {\"relay\": 3, \"state\": 1}], \"timestamp\": \"2020-09-22 14:32:07.127981\"}";
  const j = JSON.parse( s );
  
  let r = j.relays;
  
  return {id: r};
};