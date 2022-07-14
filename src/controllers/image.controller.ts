import multer from 'multer';
import { extname } from 'path';

export const Upload = async (req: any, res: any) => {
    const storage = multer.diskStorage({
        destination: 'uploads',
        filename(_, file, callback) {
            const randomName = Math.random().toString(20).substr(2, 12);
            return callback(null, `${randomName}${extname(file.originalname)}`)
        }
    })

    const upload = multer({ storage }).single('image')
    upload(req, res, (error: any) => {
        if (error) {
            res.status(500).send(error);
        }
        res.send({
            url: `http://localhost:8000/api/uploads/${req.file.filename}`
        })
    })

}