import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"
import { db, auth } from "./firebase";
    
export const addCalendar = async (calendarData) => {
    const user = auth.currentUser;
    // Checks if there is a user logged in
    if (!user) return null;

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
        return docRef.id;
    } catch (error) {
        console.error("Error adding calendar: ", error);
        return null;
    }
};

export const fetchUserCalendars = async () => {
    // this will reload Firebase as well as the current user
    await auth.currentUser?.reload();

    // checks if there is a user logged in and if not, so currentUser=Null, it just returns
    if (!auth.currentUser) return [];

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

export const updateUserCalendar = async (userId, calendarId, updatedData) => {
    if (!userId || !calendarId) throw new Error("Missing user ID or calendar ID.");
    try {
        await updateDoc(doc(db, "calendars", userId, "userCalendars", calendarId), updatedData);
        return true;
    } catch (error) {
        console.error("Firestore update failed:", error);
        throw error;
    }
}

export const deleteCalendar = async (calendarId) => {
    const user = auth.currentUser;
    if (!user || !calendarId) return;

    try {
        const docRef = doc(db, "calendars", user.uid, "userCalendars", calendarId);
        await deleteDoc(docRef);
        console.log(`Calendar ${calendarId} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting calendar: ", error);
    }
};

export const purgeUserCalendars = async (userId) => {
    if (!userId) return;
    try {
        const root = collection(db, "calendars", userId, "userCalendars");
        const snapshot = await getDocs(root);
        const deletions = snapshot.docs.map((d) => deleteDoc(d.ref));
        await Promise.all(deletions);
        console.log(`Purged ${deletions.length} calendars for ${userId}`);
    } catch (err) {
        console.error("Calendar purge failed:", err);
        throw err;
    }
};

export const updateUserEmailInFirestore = async (uid, newEmail) => {
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {email: newEmail });
    console.log("Firestore email updated.");
  } catch (err) {
    console.error("Error updating email in Firestore:", err.message);
  }
};