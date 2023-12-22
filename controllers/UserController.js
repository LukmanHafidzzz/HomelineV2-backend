const db = require('../utils/db')
const fs = require('fs');
const path = require('path');

class UserController {
    async index(req, res) {
        const data = await db.promise().query(`SELECT * FROM user`)

        return res.json({
            data: data[0],
        });
    }

    async postRumah(req, res) {
        try {
            const data = req.body
            const user_id = data.user_id
            const kategori_properti = data.kategori_properti
            const nama_properti = data.nama_properti
            const domisili = data.domisili
            const foto_thumbnail = data.foto_thumbnail
            const link_maps = data.link_maps
            const sertifikat = data.sertifikat
            const luas_tanah = data.luas_tanah
            const luas_bangunan = data.luas_bangunan
            const listrik = data.listrik
            const harga = data.harga
            const deskripsi = data.deskripsi

            const fotoPath = path.join(__dirname, '../../public/img_data/thumbnail', foto_thumbnail);
            fs.writeFileSync(fotoPath, foto_thumbnail, 'base64');

            const sertifikatPath = path.join(__dirname, '../../public/files/sertifikat', sertifikat);
            fs.writeFileSync(sertifikatPath, sertifikat, 'base64');

            const [rumahResult] = await db.promise().query(`INSERT INTO data_rumah (user_id, kategori_properti, nama_properti, domisili, foto_thumbnail, link_maps, sertifikat, luas_tanah, luas_bangunan, listrik, harga, deskripsi) VALUES ('${user_id}', '${kategori_properti}', '${nama_properti}', '${domisili}', '${foto_thumbnail}', '${link_maps}', '${sertifikat}', '${luas_tanah}', '${luas_bangunan}', '${listrik}', '${harga}', '${deskripsi}')`)

            const rumahId = rumahResult.insertId;

            if (rumahId) {
                const fotoFiles = data.foto
                if (fotoFiles && fotoFiles.length > 0 && fotoFiles.length <= 4) {
                    for(const fotoFile of fotoFiles) {
                        const foto = fotoFile.filename;
                        const base64Data = fotoFile.data

                        if (base64Data) {
                            const decodedImage = Buffer.from(base64Data, 'base64');

                            const filePath = path.join(__dirname, '../../public/img_data/properti', foto);
                            fs.writeFileSync(filePath, decodedImage);

                            await db.promise().query(`INSERT INTO foto_rumah (rumah_id, foto) VALUES ('${rumahId}', '${foto}')`);
                        } else {
                            console.error('Data base64 tidak valid atau tidak ditemukan.');
                        }
                    }
                    
                    return res.json({
                        message: 'Upload berhasil'
                    });
                } else {
                    return res.json({
                        message: 'Mohon unggah maksimal 4 foto.'
                    });
                }
            } else {
                return res.json({
                    message: 'Gagal mendapatkan rumah_id setelah operasi INSERT pada tabel data_rumah'
                });
            }
        } catch (error) {
            console.error(error);
            return res.json({
                message: 'Terjadi kesalahan saat menyimpan data'
            });
        }
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