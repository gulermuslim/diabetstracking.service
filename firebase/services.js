const admin = require('firebase-admin');
const serviceAccount = require('./diabetstracking-56a4aca2b82f');
const fs = require('fs')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function postData() {

    //firestore post
    const jsonFile = fs.readFileSync('./heroes.json')
    const heroes = JSON.parse(jsonFile);

    return db.collection('dota').doc('heroes')
        .set(heroes).then(() => {
            console.log("Fresh Meat!!");
        });
};

postData();

function getDataFirestore() {

    try {

        //firestore get document
        const docRef = db.doc("dota/heroes");

        docRef.get().then((data) => {
            if (data && data.exists) {
                const responseData = data.data();
                console.log(JSON.stringify(responseData, null, "  "));
            }
        })
    } catch (error) {}

}

getDataFirestore();