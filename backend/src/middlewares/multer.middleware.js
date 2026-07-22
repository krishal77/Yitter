import multer from "multer";

const storage= multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname) // better to use  Date.now() + "-" + file.originalname so that file name dont collide and get overridden

    }
})

export const upload=multer({storage,})