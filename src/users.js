const Realm = require("realm");

const config = require("./config");



const app = new Realm.App(config.realmAppId);
/*  Change the logLevel to increase or decrease the
    amount of messages you see in the console.
    Valid options are:
    fatal, error, warn, info, detail, debug, and trace
*/
Realm.App.Sync.setLogLevel(app, "error");


async function logIn() {

    try {
        const credentials = Realm.Credentials.emailPassword(
            config.realm_user,
            config.realm_pwd
        );

        const user = await app.logIn(credentials);
        if (user) {
            console.log(`You have successfully logged in as '${config.realm_user}'. User ID: ${app.currentUser.id}`);
            return 0;
        } else {
            console.error("There was an error logging you in");
            return logIn();
        }
    } catch (err) {
        console.error(err.message);
        return 1;
    }
}

async function logOut() {
    user = app.currentUser;
    await user.logOut();
    await index.closeRealm();
    return !user.isLoggedIn;
}

function getAuthedUser() {
    return app.currentUser;
}

exports.getAuthedUser = getAuthedUser;
exports.logIn = logIn;
exports.logOut = logOut;
