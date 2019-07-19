const File = require('../../models/file');

module.exports = {
    allFiles: async () => {
        try {
          const files = await File.find();
            return files.map(file => {
                return {
                    ...file._doc,
                    _id: file.id
                  };
          });
        } catch (err) {
          throw err;
        }
      },
    createFile: async args => {
        try {
            const file = new File({
                title: args.fileInput.title,
                description: args.fileInput.description
            });
  
            const result = await file.save();
            console.log(result);
  
            return { ...result._doc,  _id: result.id };
        } catch (err) {
            throw err;
        }
    },
    deleteFile: async (args) => {
        // if (!req.isAuth) {
        //   throw new Error('Unauthenticated!');
        // }
        try {
            const file = await File.findById(args.fileId).populate('file');
            await File.deleteOne({ _id: args.fileId });
            return {
                ...file._doc,
                _id: file.id
            }
        } catch (err) {
          throw err;
        }
    },
    updateFile: async (args,req) => {
        // if (!req.isAuth) {
        //   throw new Error('Unauthenticated!');
        // }
        try {
            console.log(req);
            const file = await File.findByIdAndUpdate(args.fileId, { title: "sheeet10" },{new: true});
            // console.log(file);
            // await File.deleteOne({ _id: args.fileId });
            return {
                ...file._doc,
                _id: file.id
            }
        } catch (err) {
          throw err;
        }
      }
}