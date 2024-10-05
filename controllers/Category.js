//Course bnane s phle there is an option in the form to mention the tagname.
//only admin can make the course now how will we authorize it that only admin can make the course not student or instructor?
//using AUTH MIDDLEWARE>>
//SO: whenever im hitting a createcourse API then we have to make sure a tag is there.
const Category = require("../models/Category");
const Tag = require("../models/Category");
//we will write an API in tag. write an handler function
exports.createCategory = async (req, res) => {
  try {
    //check if tag is there
    //take data from req.body
    const { name, description } = req.body;
    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //create entry in DB
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);
    //return response
    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating tag",
    });
  }
};
//getAlltags handler function
exports.showAllCategory = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true }); //second {} is for making sure that they both are presnt
    res.status(200).json({
      success: true,
      message: "All tags retrieved successfully",
      allTags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while getting ALLL tags",
    });
  }
};
//both apis written

//categoryPageDetails Handler
exports.categoryPageDetails = async (req, res) => {
  try {
    //frequently purchased courses show hre hai , sometimes sameCategory, sometimes TopSelling
    //will require categoryID
    const { categoryId } = req.body;

    //get courses for that specificID
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses") //category collection m on the basis of categoryID jo bhi courses ka data aaya it is stored in selectedCategory variable.
      .exec();

    //validation
    //getcourses for different categories
    //get TopSelling curses
    //return response
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while getting category details",
      error: error.message,
    });
  }
};
