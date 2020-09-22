const Realm  = require("realm");
const config = require("./config");
const schemas = require("./schemas");
const net = require('net');

const STATUS_TIMEOUT = config.status_timeout;
const HOST = config.daemon_host;
const PORT = config.daemon_port;
const CONTROLLER_ID = config.controller_id;
const REALM_APP_ID = config.realmAppId;
const USER = config.realm_user;
const PWD = config.realm_pwd;

const appConfig = {
    id: REALM_APP_ID,
    timeout: 10000,
};
const app = new Realm.App(appConfig);

Realm.Sync.setLogLevel("debug")

async function  getSprinklerStatus(realm) {

    const sprinklers = net.connect({port: PORT, host: HOST},
        function () {
             console.log('Connected to sprinklers!')
        });
    sprinklers.write('{"get":"config"}');
    sprinklers.on('data', function(data) {
        console.log(data.toString());
        sprinklers.end();

        // Upsert
        try {
            const timeNow = Date.now();
            realm.write( () => {
                const newStatus = realm.create( "Status", {
                    _id: CONTROLLER_ID,
                    _partition: CONTROLLER_ID,
                    relays:  data.toString(),   // TODO: if this string did not have a timestamp and if the 
                    timestamp: timeNow,         // timestamp is zero, the sync is much more efficient. 
                    status: 0                   // Traffic would be only when something changed in the relays.
                }, 
                "modified"); 
                console.log('Wrote status');
            });
        }
        catch (e) {
            console.error('Could not send/parse data from sprinklers.');
        }
    });
    sprinklers.on('end', function() {
        console.log('Disconnected from sprinklers.')
    });
}



async function  sendCommandToSprinkler(command) {

    const sprinklers = net.connect({port: PORT, host: HOST},
        function () {
             console.log('Connected to sprinklers!')
        });
    sprinklers.write(command);
    sprinklers.on('data', function(data) {
        console.log(data.toString());
        sprinklers.end();
    });
    sprinklers.on('end', function() {
        console.log('Disconnected from sprinklers.')
    });
}


async function logIn(email, password) {

    try {
        console.log('Authenticating')
        const credentials = Realm.Credentials.emailPassword(email, password);
        const user = await app.logIn(credentials);
        if (user) {
            console.log("You have successfully logged in as " + app.currentUser.id);
            return 0;
        } else {
            console.error("There was an error logging you in");
            return 1;
        }
    } catch (err) {
        console.error(JSON.stringify(err, null, 2));
        return 2;
    }
}


function listener(commands, changes) {

    // Only care about newly inserted commands
    changes.insertions.forEach((index) => {
        let insertedCmd = commands[index];
        const t = insertedCmd.timestamp
        const c = insertedCmd.command

        sendCommandToSprinkler(insertedCmd.command)

        console.log(c)
    });
}

async function  run() {

    await logIn(USER, PWD);
    const realm = await Realm.open({
        schema: [schemas.StatusSchema, schemas.CommandsSchema],
        sync: {
            user: app.currentUser,
            partitionValue: CONTROLLER_ID,
        },
    });

    setInterval(getSprinklerStatus, STATUS_TIMEOUT, realm);

    // New commands?
    const commands = realm.objects("Commands");
    commands.addListener(listener);

}


run().catch(err => {
    console.error("Failed to open realm:", err)
});