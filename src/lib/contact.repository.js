"use strict";

const Contact = require("../models/contacts");

async function createContact(data) {

  const contact = new Contact(data);

  return await contact.save();

}

async function getAllContacts() {

  return await Contact.find().sort({ postedDate: -1 });

}
async function toggleRead(id){

  const contact = await Contact.findById(id);

  if(!contact) return null;

  contact.isRead = !contact.isRead;

  return contact.save();
}

async function deleteContact(id){

  return Contact.findByIdAndDelete(id);

}

async function getContactById(id){

  return Contact.findById(id);

}

async function updateContact(id, data){

  return Contact.findByIdAndUpdate(id, data);

}

module.exports = {
  createContact,
  getAllContacts,
  toggleRead,
  deleteContact,
  getContactById,
  updateContact
};