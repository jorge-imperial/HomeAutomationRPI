const schemas = require("./schemas");
const users = require("./users");
const config = require('./config');
const http = require("http");
const BSON = require("bson");
const Realm = require('realm')

let realm = 0;

async function  getSprinklerStatus() {
    const options = {
        hostname: config.HOST,
        port: config.PORT,
        path: '/status',
        method: 'GET'
    }



    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {

            try {
                const timeNow = Date.now();
                console.log('Got status' + d.toString());

                const obj = JSON.parse(d.toString());
                const relay_array = [];
                obj.forEach((v) => {
                    // {"gpio":2,"name":"sprinkler0","state":false,"use":"valve"}
                    relay_array.push({
                        gpio: v.gpio,
                        name: v.name,
                        state: (v.state) ? 1 : 0,
                        use: v.use
                    });
                });

                realm.write(() => {
                    const current_status = realm.create("Status", {
                        _partition: config.CONTROLLER_ID,
                        timestamp: timeNow,
                        relays: relay_array,
                        _id: new BSON.ObjectID
                    }, "all");
                } );

/*
                realm.write(() => {
                    const newStatus = realm.create("Status", {
                            _partition: config.CONTROLLER_ID,
                            relays: data.toString(),   // TODO: if this string did not have a timestamp and if the
                            timestamp: timeNow,         // timestamp is zero, the sync is much more efficient.
                            status: 0                   // Traffic would be only when something changed in the relays.
                        },
                        "modified");
                    console.log('Wrote status');
                });
*/
            } catch (e) {
                console.error('Could not send/parse data from sprinklers.');
                console.error(e);
            }
        })
    })

    req.on('error', error => {
        console.error('Could not send/parse data from sprinklers.');
        console.error(error)
    })

    req.end();
}

async function run() {
    await users.logIn();

    const user = await users.getAuthedUser();

    const Realm_Config =  {
        schema: [schemas.StatusSchema, schemas.RelaySchema],
        sync: {
            user: user,
            partitionValue: config.CONTROLLER_ID,
        },
    };

    realm = await Realm.open(Realm_Config);

    setInterval(getSprinklerStatus, config.STATUS_TIMEOUT, Realm);

    // New commands?
    //const commands = realm.objects("Commands");
    //commands.addListener(listener);
}





run().catch((err) => {
    console.error(err.message);
});
