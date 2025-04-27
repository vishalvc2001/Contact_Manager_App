const asyncHandler = require("express-async-handler");
const Contact = require("../models/conatctModel");

module.exports.getAllContacts = asyncHandler(async(req, res)=>{
    // Now req.user is available from token middleware
    const userId = req.user.id;
    let allContacts = await Contact.find({user_id: userId});
    if(!allContacts || allContacts.length === 0){
        res.status(400);
        throw new Error("No contacts found");
    }
    res.status(200).json({message: "contacts fetched successfully", data: allContacts, count: allContacts.length});
})

module.exports.createContact = asyncHandler(async(req, res)=>{
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("Please provide all the fields");
    }
    let nameExist = await Contact.findOne({name});
    if(nameExist){
        res.status(400);
        throw new Error("Contact name already exists");
    }
    const contact = await Contact.create({user_id: req.user.id, name, email, phone});
    res.status(200).json({ message: "Contact created", data: contact });
})

module.exports.getContact = asyncHandler(async(req, res)=>{
    let findById = await Contact.findById(req.params.id); 
    if(!findById){
        res.status(400);
        throw new Error("Contact not found");
    }
    res.status(200).json({message: "contact fetched successfully by it's id", data: findById});
})

module.exports.updateContact = asyncHandler(async(req, res)=>{
    let findById = await Contact.findById(req.params.id); 
    if(!findById){
        res.status(400);
        throw new Error("Contact not found");
    }
    const updatedData = await Contact.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json({message: "data updated successfully", data: updatedData});
})

module.exports.deleteContact =asyncHandler(async(req, res)=>{
    let deleteContact = await Contact.findByIdAndDelete(req.params.id);
    if(!deleteContact){
        res.status(400);
        throw new Error("Contact not found");
    }
    res.status(200).json({message: "data deleted successfully", data: deleteContact});
})
