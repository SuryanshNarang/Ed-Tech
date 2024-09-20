const cloudinary = require("cloudinary").v2;
//is it for image only? NO as we have passed File so anytype is accepted.
exports.uploadImageToCloudinary = async (file,folder,height,quality)=>{
    const options= {folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;
    }
    options.resource_type="auto";
    return await cloudinary.uploader.upload(file.tempFilePath,options);
};
