



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

{
  "title": "status",
   "required": [
    "_partition",
    "relays",
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
          "type": {
            "bsonType": "string"
          },
          "state": {
            "bsonType": "int"
          },
          "use": {
            "bsonType": "string"
          }
        }
      }
    },
    "status": {
      "bsonType": "string"
    },
    "timestamp": {
      "bsonType": "int"
    }
  }
}


*/

const StatusSchema = {
    name : "Status",
    properties : {
        _id: "objectId",
        _partition: "string",
        relays : "Relay[]",
        timestamp: "int",
        status: "string?"
    },
    primaryKey: '_id',
};


const RelaysSchema = {
    name: "Relay",
    embedded: true,
    properties: {
        gpio: "int?",
        pin: "int?",
        type: "string?",
        state: "int?",
        use: "string?",
        name: "string?"
    }
};


exports.StatusSchema = StatusSchema;
exports.RelaySchema = RelaysSchema;
 
