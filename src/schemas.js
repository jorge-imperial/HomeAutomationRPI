const CommandsSchema = {
    name: 'Commands',
    properties: {
        // required
        _id: 'objectId',
        _partition: 'string',
        command: 'string',
        timestamp: 'int',
        // not required '?'
        status: 'int?'
    },
    primaryKey: '_id',
};


const StatusSchema = {
    name: 'Status',
    properties: {
        // required
        _id: 'objectId',
        _partition: 'string',
        relays: 'string',       // <-- sending a json with the state
        timestamp: 'int',
        // not required '?'
        status: 'int?'
    },
    primaryKey: '_id',
};

exports.StatusSchema = StatusSchema;
exports.CommandsSchema = CommandsSchema;
