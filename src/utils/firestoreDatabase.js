import { useState, useEffect } from "react";
import { collection, getDoc, setDoc, addDoc, getDocs } from "firebase/firestore"
import { db, auth } from "./firebase";
    
export const addCalendar = async (calendarData) => {
    await auth.currentUser?.reload();
    const user = auth.currentUser;
    // Checks if there is a user logged in
    if (!user) return;

    try {
        // This creates a variable that will have all of the calendar data and then attaches the user
        // email.  So, when saved to Firestore, it will have an extra data field attached with the user's email
        const calendarDataWithEmail = {...calendarData, userEmail: user.email};
        // gets a reference to the collection by passing through the database exported variable
        // the name of the collection "calendars", the name of the document being the userID, accesses
        // the sub-collection of "userCalendars", and then accesses the calendar data
        // If there exists no collection, document, or sub-collection then it will simply create it.
        // Otherwise it will just add to it.  The Calendar will also be given a unique ID whenever a new one is created
        const docRef = await addDoc(collection(db, "calendars", user.uid, "userCalendars"), calendarDataWithEmail);
        console.log("Calendars added with ID: " + docRef.id + " to Firestore.");
    } catch (error) {
        console.error("Error adding calendar: ", error);
    }
}

export const fetchUserCalendars = async () => {
    // this will reload Firebase as well as the current user
    await auth.currentUser?.reload();

    // checks if there is a user logged in and if not, so currentUser=Null, it just returns
    if (!auth.currentUser) return

    // Gets the userID of the current signed in user
    const userUid = auth.currentUser.uid;
    // This will get a reference to the userCalendars sub-collection inside the calendars collection
    // under the document named after the user's UID.  
    const calendarsRef = collection(db, "calendars", userUid, "userCalendars");

    try {
        // This will grab a snapshot of all of the documents under that specific user's UID
        const querySnapshot = await getDocs(calendarsRef);
        // querySnapshot.docs will return an array of all retrieved documents
        // the .map() method will extract the document ID from .id(), .data() will spread the rest of the document fields
        // into an object, and stores the results in the calendars array.
        const calendars = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("User's Calendars: ", calendars);
        // returns the calendar variable containing the data for the calendar
        return calendars;
    } catch (error) {
        console.error("Error fetching calendars: ", error);
    }
}

    /* 
    SECTION BELOW WAS CREATED FROM A VIDEO ABOUT HOW TO IMPLEMENT FIRESTORE IN A REACT APP
    THIS SECTION BELOW MAY NOT BE NEEDED ANYMORE AND COULD POSSIBLY BE REMOVED
    THE ABOVE SECTION WILL FOLLOW MORE OF CHATGPT IMPLEMENTATION AND FIRESTORE DOCUMENTATION
    
    // creates a useState
    const [calendars, setCalendars] = useState([]);

    // This useEffect will grab the calendars from the Firestore database
    useEffect(() => {
        getCalendars();
    }, []);

    // creates a function that will get the calendars from Firestore
    async function getCalendars() {
        // This is getting the database reference from the db variable exported from the firebase.js file
        // and finding the collection with the calendars name
        const calendarCollectionRef = collection(db, "calendars")
        // This will attempt to get the document, if it is successful then it will
        getDocs(calendarCollectionRef)
        .then(Response => {
            console.log(Response);
            // This will loop through all of the documents that are present inside of the calendar collection
            // We use the map function to then get an individual document.  Each document also has an id
            // and data
            const cals = Response.docs.map(doc => ({data: doc.data(), id: doc.id}));
            // This now sets the calendars using the setCalendars method from the useState
            // This sets the calendars variable to the data that is coming from the Firestore database
            setCalendars(cals)
        }).catch(error => console.log(error.message));
    }

    async function addCalendars() {
        // Follows the same from the getCalendars method for getting a reference to the collection
        const calendarCollectionRef = await addDoc(collection(db, "calendars"), {
            // TODO: Add data to save to Firestore database
        });
    }
    */
