
const CommandsSchema = {
    name: 'Commands',
    properties: {
        // required
        _partition: 'string',
        command: 'string',
        timestamp: 'int',
        // not required '?'
        _id: 'objectId?',
        status: 'int?'
    },
    primaryKey: '_id',
};


const StatusSchema = {
    name: 'Status',
    properties: {
        // required
        _partition: 'string',
        relays: 'string',       // <-- sending a json with the state
        timestamp: 'int',
        // not required '?'
        _id: 'string?',
        status: 'int?'
    },
    primaryKey: '_id',
};


const StatusHistorySchema = {
    name: 'StatusHistory',
    properties: {
        // required
        _partition: 'string',
        relays: 'string',       // <-- sending a json with the state
        timestamp: 'int',
        // not required '?'
        _id: 'objectId?',
        status: 'int?'
    },
    primaryKey: '_id',
};



exports.StatusSchema = StatusSchema;
exports.CommandsSchema = CommandsSchema;
exports.StatusHistorySchema = StatusHistorySchema;
