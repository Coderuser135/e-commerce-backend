import multer from "multer"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file)
        cb(null, "src/uploads")
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now()
        const randomNumber = Math.floor(100 + Math.random()* 99).toString()
        const suffix = uniqueSuffix + randomNumber
        cb(null, suffix + "-" + file.originalname)
    }
})

const upload = multer({
    storage
})
export default upload