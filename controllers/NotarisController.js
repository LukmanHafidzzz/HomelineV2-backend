const db = require('../utils/db')
const fs = require('fs');
const path = require('path');

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
        try {
            const data = req.body;
            const nama = data.nama
            const alamat = data.alamat
            const email = data.email
            const no_hp = data.no_hp
            const foto = data.foto
            const notaris_sertifikat = data.notaris_sertifikat
            const deskripsi_notaris = data.deskripsi_notaris

            const checkNama = await db.promise().query(`SELECT nama FROM notaris WHERE nama = '${nama}'`)
            const checkEmail = await db.promise().query(`SELECT email FROM notaris WHERE email = '${email}'`)

            if (checkNama[0].length == 1) {
                return res.json({
                    message: "Maaf Nama sudah terdaftar"
                })
            } if (checkEmail[0].length == 1) {
                return res.json({
                    message: "Maaf Email sudah terdaftar"
                })
            }

            const fotoPath = path.join(__dirname, '../../public/img_data/notaris', foto);
            fs.writeFileSync(fotoPath, foto, 'base64');

            const sertifikatPath = path.join(__dirname, '../../public/files/notaris', notaris_sertifikat);
            fs.writeFileSync(sertifikatPath, notaris_sertifikat, 'base64');

            await db.promise().query(`INSERT INTO notaris (nama, alamat, email, no_hp, foto, notaris_sertifikat, deskripsi_notaris) VALUES ('${nama}', '${alamat}', '${email}', '${no_hp}', '${foto}', '${notaris_sertifikat}', '${deskripsi_notaris}')`)

            return res.json({
                message: 'Anda berhasil melakukan pendaftaran'
            });
        } catch (error) {
            return res.json({
                message: 'Gagal melakukan pendaftaran'
            });
        }
    }
}

module.exports = new NotarisController()