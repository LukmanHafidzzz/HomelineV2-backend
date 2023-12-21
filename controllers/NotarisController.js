const db = require('../utils/db')

class NotarisController {
    async jasaNotaris(req, res) {
        const data = await db.promise().query(`SELECT * FROM notaris`)

        return res.json({
            data: data[0],
        });
    }

    async detailNotaris(req, res) {
        const notaris_id = req.params.notaris_id
        const data = await db.promise().query(`SELECT * FROM notaris WHERE notaris_id = '${notaris_id}'`)

        return res.json({
            data: data[0],
        });
    }

    async postNotaris(req, res) {
        const data = await db.promise().query(`INSERT INTO xxx, xxx values()`)
    }
}

module.exports = new NotarisController()