const db = require('../utils/db')
const bcrypt = require('bcrypt')

class AuthController {
    async register(req, res) {
        const data = req.body

        const nama = data.nama
        const email = data.email
        const no_hp = data.no_hp
        const password = data.password

        //check data
        const checkNama = await db.promise().query(`SELECT nama FROM user WHERE nama = '${nama}'`);
        const checkEmail = await db.promise().query(`SELECT email FROM user WHERE email = '${email}'`);

        if (checkNama[0].length == 1) {
            return res.json({
                error: 'Maaf nama sudah terdaftar'
            })
        } if (checkEmail[0].length == 1) {
            return res.json({
                error: 'Maaf email sudah terdaftar'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const encyrptPassword = await bcrypt.hash(password, salt);

        const insert = await db.promise().query(`INSERT INTO user (nama, email, no_hp, password) VALUES ('${nama}', '${email}', '${no_hp}', '${encyrptPassword}')`)

        return res.json({
            massage: 'User berhasil dibuat'
        })
    }

    async login(req, res) {
        const data = req.body

        const nama = data.nama
        const email = data.email
        const password = data.password

        // const checkNamaOrEmail = await db.promise().query(`SELECT nama, email, password FROM user WHERE nama = '${nama}' OR email = '${email}'`)
        const checkNamaOrEmail = await db.promise().query(`SELECT * FROM user WHERE nama = '${nama}' OR email = '${email}'`)
        
        // check nama atau password
        if (checkNamaOrEmail[0].length == 0) {
            return res.json({
                massage: 'Maaf email atau nama anda belum terdaftar'
            });
        }

        const checkPassword = await bcrypt.compare(password, checkNamaOrEmail[0][0].password);
        if (!checkPassword) {
            return res.json({
                massage: 'Maaf Password anda salah'
            })
        }

        return res.json({
            success: true,
            massage: 'Selamat anda berhasil login',
            user: {
                nama: checkNamaOrEmail[0][0].nama,
                email: checkNamaOrEmail[0][0].email,
                no_hp: checkNamaOrEmail[0][0].no_hp,
            }
        });
        
    }
}

module.exports = new AuthController()