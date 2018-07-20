let GameServer = require('./server.js').GameServer
let GameLogic = require('./logic.js').GameLogic


var server =  new GameServer()
var game = new GameLogic(server)

game.start()
server.start()