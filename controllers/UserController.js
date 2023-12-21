const db = require('../utils/db')

class UserController {
    async index(req, res) {
        const data = await db.promise().query(`SELECT * FROM user`)

        return res.json({
            data: data[0],
        });
    }

    async getRumah(req, res) {
        const data = await db.promise().query(`SELECT * FROM data_rumah`)

        return res.json({
            data: data[0],
        });
    }

    async editRumah(req, res) {
        const rumah_id = req.params.rumah_id
        const data = await db.promise().query(`SELECT * FROM data_rumah WHERE rumah_id = '${rumah_id}'`)

        return res.json({
            data: data[0],
        });
    }

    async fotoRumah(req, res) {
        const rumah_id = req.params.rumah_id
        const fotoRumah = await db.promise().query(`SELECT foto_rumah.foto_id, foto_rumah.rumah_id, foto_rumah.foto FROM (foto_rumah JOIN data_rumah USING (rumah_id)) WHERE rumah_id = '${rumah_id}'`)

        console.log(fotoRumah);

        return res.json({
            data: fotoRumah[0]
        });
    }
}

module.exports = new UserController()