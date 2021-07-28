const schemas = require("./schemas");
const users = require("./users");
const config = require("./config");

const http = require("http");
const BSON = require("bson");
const Realm = require("realm")

let realm = 0;

async function  getSprinklerStatus() {
    const options = {
        hostname: config.daemon_host,
        port: config.daemon_port,
        path: '/status',
        method: 'GET'
    }

    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {

            try {
                const timeNow = Date.now();
                console.log(`Got status: ${d.toString()}`);

                const obj = JSON.parse(d.toString());

                realm.write(() => {

                    relay_array = [];
                    obj.forEach(element => {
                        const r =   {
                            gpio: element.gpio,
                            pin: element.pin,
                            type: element.type,
                            state: element.state,
                            use: element.use,
                            name: element.name
                        };
                        relay_array = relay_array.concat(r);
                    });

                    const current_status = realm.create("Status", {
                        _partition: config.controller_id,
                        timestamp: timeNow,
                        relays: relay_array,
                        _id: new BSON.ObjectID,
                        status: 0
                    });
                });
 
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
            partitionValue: config.controller_id,
        },
    };

    realm = await Realm.open(Realm_Config);

    setInterval(getSprinklerStatus, config.status_timeout, Realm);

    // New commands?
    //const commands = realm.objects("Commands");
    //commands.addListener(listener);
}


run().catch((err) => {
    console.error(err.message);
});
