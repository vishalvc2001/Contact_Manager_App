const express = require('express');
const router = express.Router();
const {getAllContacts, createContact, getContact, updateContact, deleteContact} = require('../controllers/contactController');
const {validateToken} = require('../middleware/validateTokenHandler');

// if you want to user "validateToken" for all route or we can use in middle of the route for specific.
// router.use(validateToken); // Apply token validation to all routes
router.get('/', validateToken,  getAllContacts);
router.post('/', validateToken, createContact);
router.get('/:id', validateToken, getContact);
router.put('/:id', validateToken, updateContact);
router.delete('/:id', validateToken, deleteContact);
module.exports=router;