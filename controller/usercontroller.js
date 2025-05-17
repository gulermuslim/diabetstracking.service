const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const asyncHandler = require("express-async-handler");
const { sendMessageModel } = require('../models/sendMessageModel');
const { check, validationResult } = require('express-validator');
const serviceAccount = require('../diabetstracking-firebase-adminsdk-fbsvc-71fdc2a459.json');

const uuid = require('uuid');
const logger = require("../logger");
async function createUser(username) {
    try {

    } catch (err) {
        console.error('Kullanıcı eklenirken hata:', err);
    }
}

router.post('/create',
    check('username').exists().isLength({ min: 1 }).trim().withMessage('Kullanıcı AdıBoş olmamalı'),
    check('measurement').exists().isLength({ min: 1 }).trim().withMessage('Ölçüm AdıBoş olmamalı'),


    asyncHandler(async (req, res) => {
        const message = new sendMessageModel();

        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                message.isOk = false;
                message.errors = errors.mapped();
                return res.status(400).json(message);
            }
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: cert(serviceAccount)
                });
            }
            const { username, measurement } = req.body;
            const db = getFirestore();
            const userRef = db.collection('measurements');
            const userSnap = await userRef.where("username", '==', username).get();

            req.body.id = uuid.v1();
            req.body.measurement = Number(measurement);
            req.body.createddate = Timestamp.fromDate(new Date());

            const userDoc = userRef.doc();
            const result = await userDoc.set(req.body);
            console.log('Kullanıcı başarıyla eklendi.');

            message.isOk = true;
            req.body.createddate = new Timestamp(req.body.createddate._seconds, req.body.createddate._nanoseconds).toDate();
            message.result = req.body;
            res.status(201).json(message);
        } catch (error) {
            message.isOk = false;
            message.errors = error;
            console.log(error);


            res.status(400).json(message);
        }


    }));


router.post('/all',

    asyncHandler(async (req, res) => {
        const message = new sendMessageModel();

        try {

            let array = [];
            let length = 0;
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: cert(serviceAccount)
                });
            }
            const { username } = req.body;
            const db = getFirestore();
            const measurementRef = db.collection('measurements');
            const measurementSnap = await measurementRef
                .where("username", '==', username)
                .orderBy("createddate", "desc")
                .get()
            length = measurementSnap._size;
            if (length > 0) {
                measurementSnap.forEach(async element => {
                    const measurement = element.data();

                    if (measurement.createddate != null)
                        measurement.createddate = new admin.firestore.Timestamp(measurement?.createddate._seconds, measurement?.createddate._nanoseconds).toDate();

                    array.push(measurement);
                    if (array.length == length) {
                        message.isOk = true;
                        message.result = array;
                        return res.status(200).json(message);
                    }
                });
            } else {
                message.isOk = true;
                message.result = array;
                return res.status(200).json(message);
            }
        } catch (error) {
            message.isOk = false;
            message.errors = error;
            res.status(400).json(message);
        }
    }));

module.exports = router;