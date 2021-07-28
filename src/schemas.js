



/*
The structures in Python look like this:

# Pins and GPIO
RELAYS = [
    {'gpio': 2, 'relay': LED(2), 'pin': 3, 'state': False, 'use': 'valve', 'name': 'sprinkler0'},
    {'gpio': 3, 'relay': LED(3), 'pin': 5, 'state': False, 'use': 'valve', 'name': 'sprinkler1'},
    {'gpio': 4, 'relay': LED(4), 'pin': 7, 'state': False, 'use': 'valve', 'name': 'sprinkler2'},
    {'gpio': 5, 'relay': LED(5), 'pin': 29, 'state': False, 'use': 'valve', 'name': 'sprinkler3'},
    {'gpio': 6, 'relay': LED(6), 'pin': 31, 'state': False, 'use': '', 'name': '', 'notes': ''},
    {'gpio': 7, 'relay': LED(7), 'pin': 26, 'state': False, 'use': '', 'name': '', 'notes': ''},
    {'gpio': 8, 'relay': LED(8), 'pin': 24, 'state': False, 'use': '', 'name': '', 'notes': ''},
    {'gpio': 9, 'relay': LED(9), 'pin': 21, 'state': False, 'use': '', 'name': '', 'notes': ''}
]

*/


/**
 *  The status schema defined in Realm
 {
  "title": "Status",
  "required": [
    "_id",
    "_partition",
    "timestamp"
  ],
  "properties": {
    "_id": {
      "bsonType": "objectId"
    },
    "_partition": {
      "bsonType": "string"
    },
    "relays": {
      "bsonType": "array",
      "items": {
        "title": "Relay",
        "bsonType": "object",
        "properties": {
          "gpio": {
            "bsonType": "int"
          },
          "name": {
            "bsonType": "string"
          },
          "pin": {
            "bsonType": "int"
          },
          "state": {
            "bsonType": "bool"
          },
          "type": {
            "bsonType": "string"
          },
          "usage": {
            "bsonType": "string"
          } 
        }
      }
    },
    "status": {
      "bsonType": "int"
    },
    "timestamp": {
      "bsonType": "int"
    }
  }
}



*/



const RelaySchema= {
  name: "Relay",
  embedded: true,
  properties: {
      gpio: "int?",
      pin: "int?",
      type: "string?",
      state: "bool?",
      usage: "string?",
      name: "string?"
  }
};

const StatusSchema = {
    name : "Status",
    properties : {
        _id: "objectId",
        _partition: "string",
        relays : { type: "list", objectType: "Relay" }, 
        timestamp: "int",
        status: "int?"
    },
    primaryKey: '_id',
};


 
exports.RelaySchema = RelaySchema;
exports.StatusSchema = StatusSchema;

 
