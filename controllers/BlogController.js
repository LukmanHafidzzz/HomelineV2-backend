const db = require('../utils/db')
const path = require('path');
const fs = require('fs');

class NotarisController {
    async postBlog(req, res) {
        try {
            const data = req.body;
            const judul = data.judul;
            const isi_blog = data.isi_blog;
            
            const [blogResult] = await db.promise().query(`INSERT INTO blog (judul, isi_blog) VALUES ('${judul}', '${isi_blog}')`);
            
            const blogId = blogResult.insertId;
            
            if (blogId) {
                const foto_blogFiles = data.foto_blog;
                
                if (foto_blogFiles && foto_blogFiles.length > 0 && foto_blogFiles.length <= 3) {
                    for (const foto_blogFile of foto_blogFiles) {
                        const foto_blog = foto_blogFile.filename;
                        const base64Data = foto_blogFile.data;
            
                        if (base64Data) {
                            // Decode data base64 dan simpan ke file atau database sesuai kebutuhan Anda
                            const decodedImage = Buffer.from(base64Data, 'base64');
            
                            // Simpan file di direktori yang diinginkan
                            const filePath = path.join(__dirname, '../../public/img_data/blog', foto_blog);
                            fs.writeFileSync(filePath, decodedImage);
            
                            await db.promise().query(`INSERT INTO foto_blog (blog_id, foto_blog) VALUES (?, ?)`, [blogId, foto_blog]);
                        } else {
                            console.error('Data base64 tidak valid atau tidak ditemukan.');
                        }
                    }
                    
                    return res.json({
                        message: 'Blog dan foto berhasil diupload'
                    });
                } else {
                    return res.status(400).json({
                        message: 'Mohon unggah maksimal 3 foto.'
                    });
                }
            } else {
                return res.status(500).json({
                    message: 'Gagal mendapatkan blog_id setelah operasi INSERT pada tabel blog'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Terjadi kesalahan saat menyimpan data'
            });
        }
    }

    async getBlog(req, res) {
        const data = await db.promise().query(`SELECT blog_id, judul, isi_blog, DATE_FORMAT(tgl_publikasi, '%e %M %Y') AS tgl_publikasi FROM blog`)

        return res.json({
            data: data[0],
        });
    }

    async editBlog(req, res) {
        const blog_id = req.params.blog_id
        const data = await db.promise().query(`SELECT * FROM blog WHERE blog_id = '${blog_id}'`)

        return res.json({
            data: data[0],
        });
    }

    async fotoBlog(req, res) {
        const blog_id = req.params.blog_id
        const fotoBlog = await db.promise().query(`SELECT foto_blog.foto_blog_id, foto_blog.blog_id, foto_blog.foto_blog FROM (foto_blog JOIN blog USING (blog_id)) WHERE blog_id = '${blog_id}'`)

        console.log(fotoBlog);

        return res.json({
            data: fotoBlog[0]
        });
    }

    async updateBlog(req, res) {
        const blog_id = req.params.blog_id
        const data = req.body
        const judul = data.judul;
        const isi_blog = data.isi_blog;

        await db.promise().query(`UPDATE blog SET judul = '${judul}', isi_blog = '${isi_blog}' WHERE blog_id = '${blog_id}'`)
        return res.json({
            message: 'Data berhasil diupdate',
        });
    }

    async deleteBlog(req, res) {
        const blog_id = req.params.blog_id
        
        await db.promise().query(`DELETE FROM blog WHERE blog_id = '${blog_id}'`)
        return res.json({
            message: 'Data berhasil dihapus',
        });
    }
}

module.exports = new NotarisController()