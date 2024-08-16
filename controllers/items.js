const Item = require("../models/Item");

const { StatusCodes } = require("http-status-codes");

const { BadRequestError, NotFoundError } = require("../errors");

///////////////////////////////////////////////
const getAllItems = async (req, res) => {
    const items = await Item.find({
        createdBy: req.user.userId,
    }).sort("createdAt");

    res.status(StatusCodes.OK).json({ count: items.length, items });
};

const getItem = async (req, res) => {
    res.send("Get Item");
};

const createItem = async (req, res) => {
    // console.log(req.body);
    // console.log(req.user);

    req.body.createdBy = req.user.userId;

    // console.log(req.body);

    const item = await Item.create(req.body);

    res.status(StatusCodes.CREATED).json({ item });
};

const updateItem = async (req, res) => {
    res.send("Update Item");
};

const deleteItem = async (req, res) => {
    res.send("Delete Item");
};
///////////////////////////////////////////////
module.exports = {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
};
