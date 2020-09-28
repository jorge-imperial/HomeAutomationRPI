exports = function(changeEvent) {
  /*
    A Database Trigger will always call a function with a changeEvent.
    Documentation on ChangeEvents: https://docs.mongodb.com/manual/reference/change-events/
 */
    // Access the _id of the changed document:
    const docId = changeEvent.documentKey._id;

    /*
    Access the latest version of the changed document
    (with Full Document enabled for Insert, Update, and Replace operations):
    */
    const fullDocument = changeEvent.fullDocument;
    console.log( fullDocument );

    const status_history = context.services.get("mongodb-atlas").db("irrigation").collection("StatusHistory");
    const status = context.services.get("mongodb-atlas").db("irrigation").collection("Status");
    const query = { "_partition": fullDocument._partition  };
    

    status_history.find(query, {})
      .sort({ timestamp: -1 })
      .toArray()
      .then(statuses => {
             console.log(`Successfully found ${statuses.length} documents.`);
             
             
             if (statuses.length == 0) { // Very first status in history?
                changeEvent.fullDocument._id = new BSON.ObjectId();
                status_history.insertOne(changeEvent.fullDocument);
                console.log(`First status ${changeEvent.fullDocument}`)
             }
             else {

               const last_status = JSON.parse(statuses[0].relays);
               const new_status = JSON.parse(changeEvent.fullDocument.relays);
               
               //console.log(`${last_status.relays}`);
               //console.log(`${new_status.relays}`);
             
               let r1 = JSON.stringify(last_status.relays);
               console.log(r1);
               let r2 = JSON.stringify(new_status.relays);
               console.log(r2);
               
               if (r1 == r2) { // state has not changed.
                  status_history.updateOne( { _id: statuses[0]._id}, { "$set" : { timestamp: changeEvent.fullDocument.timestamp }});
                  console.log(`Updated ${statuses[0]}`);
               } else {
                 changeEvent.fullDocument._id = new BSON.ObjectId();
                 status_history.insertOne(changeEvent.fullDocument);
                 console.log(`Inserted ${changeEvent.fullDocument}`);
               }
               
             }
      })
  .catch(err => { 
    console.error(`Failed to find documents: ${err}`);
  })
    
 
};


