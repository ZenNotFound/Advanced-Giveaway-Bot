const config = require('../config.json')
const mongoose = require('mongoose');
module.exports = (client) => {

    client.on('debug', (info) => {
        client.logger(String(info).grey);
    })

    client.on("ready", () => {
        const stringlength = 69;
        console.log("\n")
        console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
        console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
        console.log(`     ┃ `.bold.brightGreen + `Discord Bot is online!`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `Discord Bot is online!`.length) + "┃".bold.brightGreen)
        console.log(`     ┃ `.bold.brightGreen + ` /--/ ${client.user.tag} /--/ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - ` /--/ ${client.user.tag} /--/ `.length) + "┃".bold.brightGreen)
        console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
        console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
        mongoose.connect(config.database, {
            //useFindAndModify: false,
            useUnifiedTopology: true,
            useNewUrlParser: true,
          }).then(() => {
          
            client.logger("Mongoose databases connected successfully!")
          
          }).catch(err => {
          
            console.log(err)
          })
          
    })

    client.on('shardReady', (id) => {
        client.logger(`Shard #${id} Ready`.brightGreen);
    })

    client.on('shardDisconnect', (event, id) => {
        client.logger(`Shard #${id} Disconnected`.brightRed);
    })

    client.on('shardReconnecting', (id) => {
        client.logger(`Shard #${id} Reconnecting`.brightMagenta);
    })
    client.on('shardError', (error, id) => {
        client.logger(`Shard #${id} errored`.brightRed);
    })

    client.on('shardResume', (replayedEvents, id) => {
        client.logger(`Shard #${id} Resumed`.green)
    })
}