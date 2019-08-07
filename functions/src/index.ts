import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from "body-parser";



// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));



admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const contactsCollection = 'contacts';
//main.use('/api/v1', app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// type Contact = {
//   firstName: string;
//   lastName: string;
// }


// Here are some useful object available in each REQUEST ("req" variable), which can be used to provide dynamic response based on input value.
//  * Query Data Object:  req.query
//  * Post Data Object:   req.body
//  * Path parameter:     req.params
//  * Header Data Object: req.headers

// Add new contact
app.post('/contacts', async (req, res) => {
  try {
      // const contact: Contact = {
      //     firstName: req.body['firstName'],
      //     lastName: req.body['lastName']
      // }

      if(!req.body.hasOwnProperty('firstName')) {
        return res.status(400)
              .json({"message":"The `firstName` is required."});
      }

      const newDoc = await db.collection(contactsCollection).add(req.body);
      //const newDoc = await db.collection(contactsCollection).add(contact);
      return res.status(201).send(`Created a new contact: ${newDoc.id}`);
      
  } catch (error) {
      //return res.status(400).send(`Contact should only contains firstName, lastName and email!!!`)
      return res.status(400).send(error)
  }        
})

// View a contact
app.get('/contacts/:contactId', async (req, res) => {
  try{
    const docRef = db.collection(contactsCollection).doc(req.params.contactId);
    const doc = await docRef.get();
    if (doc.exists) {
      res.status(200).send(doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        res.status(200).send("No such document!");
    }
    
  } catch (error) {
    res.status(400).send(`Cannot get contact: ${error}`);
  }
})

// Update new contact
app.patch('/contacts/:contactId', async (req, res) => {
  // const updatedDoc = await firebaseHelper.firestore
  //     .updateDocument(db, contactsCollection, req.params.contactId, req.body);
  // res.status(204).send(`Update a new contact: ${updatedDoc}`);
})


// View all contacts
app.get('/contacts', async (req, res) => {
  try{
    let collectionRef = db.collection(contactsCollection);
    
    let docSnapshot = await collectionRef.get();

    let arrayR = docSnapshot.docs.map(doc => {
      return doc.data();
    });

    if(arrayR != null && arrayR.length >=0 ){
      res.status(200).send(arrayR);
    }else{
      console.log("No such document!");
      res.status(200).send("No document!");
    }
  } catch (error) {
    res.status(400).send(`Cannot get contact: ${error}`);
  }
})

// Delete a contact 
app.delete('/contacts/:contactId', async (req, res) => {
  try{
    let delRet = await db.collection(contactsCollection).doc(req.params.contactId).delete();
    res.status(204).send(`${delRet}`);
  } catch (error){
    res.status(400).send(`${error}`);
  }
})



// webApi is your functions name, and you will pass main as 
// a parameter
export const webApi = functions.https.onRequest(app);