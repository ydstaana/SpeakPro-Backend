const moment = require('moment');
const multer = require('multer');
const pify = require('pify');

const File = require('../../../../../../models/FileSchema.js');


/* Upload File Logic */
const uploadFile = async function(req, res){

    //Get timestamp
    const uploadDate = moment();
    
    if(req.headers.author){

        //Get author id from headers
        const authorId = req.headers.author; 

        //Configure multer upload
        const storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, 'uploads/')
            },
            filename: function(req, file, cb) {
                cb(null, generateFilename(file, authorId, uploadDate));
            }
        });
        const upload = multer({ storage: storage });

        //Promisify multer upload
        const uploadFormData = pify(upload.single('selectedFiles'));

        try {
            await uploadFormData(req, res);

            //Process the uploaded file
            if(req.file) {
                const item = req.file;

                //Tokenized the uploaded file's original name
                const tokenized = splitFilename(item.originalname);
                
                if(tokenized){
                    //Filename and file extension
                    const filename = tokenized[0];
                    const fileExtension = tokenized[1];

                    console.log(filename);

                    //Check for duplicate filename in author's files
                    const duplicateFiles = await findAuthorFiles(authorId, filename);

                    //Generating of new display name starts here
                    let newDisplayName = null;

                    console.log(duplicateFiles);
                    
                    if(duplicateFiles.length === 0){ //No filename duplicate in author's files
                        newDisplayName = filename + '.' + fileExtension; //filename.jpg
                    } else if(duplicateFiles.length >= 1){ //There is/are filename duplicate/s in author's files
                        const cnt = getDuplicateCount(duplicateFiles, filename);
                        newDisplayName = `${filename} (${cnt}).${fileExtension}`; //filename (n).jpg
                    }

                    //Uploading of new file information to db starts here
                    const newFile = {
                        fileName: item.filename,
                        displayName: newDisplayName,
                        author: authorId,
                        uploadDate: uploadDate.format(),
                        fileSize: item.size
                    }

                    File.create(newFile, (err, file) => {
                        if(err) {
                            res.status(500).json({
                                code: 500,
                                message: err
                            });
                        }

                        res.status(200).json({
                            code: 200,
                            message: 'Successfully uploaded the file ' + newDisplayName
                        });
                    });
                } else {
                    res.status(500).json({
                        code: 500,
                        message: 'An error occured. Please try again.'
                    });
                } 
            } else {
                res.status(500).json({
                    code: 500,
                    message: 'An error occured. Please try again.'
                });
            }
        } catch (err) {
            res.status(500).json({
                code: 500,
                message: err
            });
        }
    } else {
        res.status(500).json({
            code: 500,
            message: 'An error occured. Please try again.'
        });
    }
}

function findAuthorFiles(authorId, filename){
    return new Promise((resolve, reject) => {

        //Looks for files that might have the same filename
        File.find({author: authorId, displayName: {$regex: `^${escapeRegExp(filename)}`}})
            .sort( { uploadDate: 1 } )
            .exec((err, files) => {
                if(err) reject(null);
                resolve(files);
            });
    });
}

function generateFilename(file, authorId, uploadDate){
    const tokenized = splitFilename(file.originalname);

    if(tokenized){
        const filename = tokenized[0];
        const fileExtension = tokenized[1];

        //Generated filename will use the format: filename-authorid-time_epoch.jpg
        const newFilename = `${filename}-${authorId}-${uploadDate.format('x')}.${fileExtension}`; 
        return newFilename;
    }

    return file.originalname;
}

function splitFilename(filename){
    const token = [];
    const pos = filename.lastIndexOf('.');
    if(pos != -1){ 
        token.push(filename.substring(0, pos));
        token.push(filename.substring(pos+1, filename.length));
        return token;
    }

    return null;
}


function getDuplicateCount(files, originalFilename){
    let arr = files.map((file) => {
        const startPos = file.displayName.lastIndexOf('(');
        const endPos = file.displayName.lastIndexOf(')');
    
        if(startPos !== -1 && endPos !== -1 && file.displayName.substring(0, startPos-1) === originalFilename){
            return file.displayName.substring(startPos+1, endPos);
        }

        return 0;
    });

    for(i = 1;;i++){
        if(!arr.includes(i.toString())){
            return i;
        }
    }
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

module.exports = uploadFile;