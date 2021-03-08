# HW4: ListMaker 2000
**SI669 Fall 2020**

## Video Walkthrough
See the [Demo Video](https://youtu.be/bdeskk3JXYk).

## Learning Goals
This homework will give you practice working with CRUD and Firebase.

## Project Goals
The ListMaker 2000 (LM2K) app is already fully functioning in terms of CRUD within the app’s memory (this is effectively the same as week7ListMaker1000 with no dummy data, a different name, and a different color scheme). Your goal is to connect LM2K to Firebase, so that all changes made in the app are made persistent across launches of the app.

## What to Do
1. Accept the GitHub Classroom invitation.
2. Clone this repo to your local machine.
3. `cd` into the directory that was created when you cloned the repo (it should be called `hw4-listmaker2000-<your-github-id>`).
4. Run `yarn install` to install all dependencies.
5. Integrate a firebase project that you “own” into the app (this can be the project you created in week8 or a new one).
6. Modify existing functions and/or add new functions so that all modifications of application data (create, update, delete) are reflected in both your Firestore DB and your app’s UI.
7. Implement the functionality that displays a message on the home screen when the list is empty.
8. Push your final changes to GitHub before the deadline.
9. Create a screencast video and submit the link to Canvas before the deadline.
10. Indicate in your Canvas comments which requirements (including extra credit) you believe you met.

## Notes
* Be sure to show that the effects of all types of data modification (create, update, delete) persist across app launches.
* :exclamation: You don't need to show the Firebase console in your video as the one in Demo Videos. Showing just your phone screen will be adequate.
* You will want to `get()` data from Firebase *after* the constructor has run, i.e., in `componentDidMount()`. Initialize the data model (`this.state.theList`) to an empty list in the constructor and then update it with the data from Firebase using `setState()` in `componentDidMount()`. This will save you some headaches! Your "empty list" message may flash on the screen briefly before the list loads--this is OK for this assignment.
* You may get an error telling you that a Firebase 'app' has already been initialized. There are cases where, almost no matter where you put it, the statement `firebase.initializeApp(firebaseConfig)` will be executed more than once, producing this error. See [this article](https://github.com/vercel/next.js/issues/1999) or [this one](https://stackoverflow.com/questions/43331011/firebase-app-named-default-already-exists-app-duplicate-app) for advice on how to guard against this.
* Be sure to put your Firebase Config information in a 'secret' file, and be sure to exclude that file from your git repo by updating your `.gitconfig`.
* Feel free to change the color scheme if you'd like. You can make other (minor) stylistic changes as well, provided it's still easy to see all of the app functionality.

## Grading (up to 120 points)
| No. | Requirement  | Points |
| --- | ------------- | ------------- |
| 1 | Create operations result in correct changes to Home Screen list | 10  |
| 2 | Update operations result in correct changes to Home Screen list | 10 |
| 3 | Delete operations result in correct changes to Home Screen list | 10 |
| 4 | Create operations result in correct changes to Firestore DB, and these changes are reflected after the app restarts | 25 |
| 5 | Update operations result in correct changes to Firestore DB, and these changes are reflected after the app restarts | 25 |
| 6 | Delete operations result in correct changes to Firestore DB, and these changes are reflected after the app restarts | 25 |
| 7 |  HomeScreen displays a “list empty” message when there are no items in the list | 15 |
|   | **Total** | **120**

## Extra Credit
For extra credit you can 
* make it so that the “Save” button in the details screen is disabled if there is no text in the text box.
* present a confirmation dialogue when the user tries to delete an item, and only deletes the item if the user confirms

See the [Demo Video](https://youtu.be/xDLquY98oVI) for an example of how these should work.

## Grading (up to 4 points)
| No. | Requirement  | Points |
| --- | ------------- | ------------- |
| 1 | Save button is visually “greyed out” to indicate it is disabled when there is no text in the details screen text box | 1  |
| 2 |  Save button does not receive clicks and does not operate (data is not saved, no navigation occurs) when there is no text in the details screen box | 1 |
| 3 | A confirmation dialog is displayed when the user tries to delete an item, and the delete only occurs if the user confirms the operation | 2 |
|   | **Total** | **4**
