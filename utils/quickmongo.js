const config = require('../config.json')
const { Database } = require('quickmongo');

const quickmongo = new Database(config.database);
quickmongo.connect()
quickmongo.on('ready', () => {
    console.log(`[QDB] Database Connected successfully!`.cyan)
})

//console.log(`[QDB] Database Connected successfully!`.cyan)

module.exports = quickmongo;



