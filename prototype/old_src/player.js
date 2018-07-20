

class Player {

    constructor(login) {
        this.login = login
    }

    static createFromDB(dbPlayer) {
        let p = new Player(dbPlayer.login)

        p.coins = dbPlayer.coins || 0,
        p.gems = dbPlayer.gems || 0,
        p.plants = dbPlayer.plants || []
        p.tiles = dbPlayer.tiles || []

        return p
    }
}

exports.Player = Player
