import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {User} from '../../models/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FIREBASE_CONFIG } from "./../../app.firebase.config";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';


@Injectable()
export class AuthProvider {
    loginState:boolean = false;
    user: BehaviorSubject<User> = new BehaviorSubject(null)
    ref: any;
    App: any;
    db: any;
    roles: String[];
    currentUser: any;

  constructor(public afAuth: AngularFireAuth) {
      if (!firebase.apps.length) {
          this.App = firebase.initializeApp(FIREBASE_CONFIG);
      } else {
          this.App = firebase.app();
      }
      this.db = this.App.database();
      this.ref = this.db.ref("users");
      afAuth.authState.subscribe((user: firebase.User) => {
          this.currentUser = user;
      })
  }

    /***************** LOG-IN USER FUNCTION ****************/

    /**
     *  Logs in the user using the firebase API
     *  @param {string} value - user's email, {string} value - user's password
     *  @return {firebase.promise}
     */

    loginUser(newEmail: string, newPassword: string): firebase.Promise<any> {
        return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
    }

    /***************** RESET USER PASSWORD FUNCTION ****************/

    /**
     *  Resets the user's password using the firebase API
     *  @param {string} value - user's email
     *  @return {firebase.promise}
     */

    resetPassword(email: string): firebase.Promise<any> {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    /***************** LOG OUT USER FUNCTION ****************/

    /**
     *  Logs out the user using the firebase API
     *  @param  none
     *  @return {firebase.promise}
     */

    logoutUser(): firebase.Promise<any> {
        return this.afAuth.auth.signOut();
    }

    /***************** SIGN UP NEW USER FUNCTION ****************/

    /**
     *  Signs up a new user authentication account using the firebase API
     *  @param {string} value - user's email, {string} value - user's password
     *  @return {firebase.promise}
     */

    signupUser(newEmail: string, newPassword: string): firebase.Promise<any> {
        return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPassword);
    }

    /***************** CREATE USER FUNCTION ****************/

    /**
     *  Creates a corresponding user account db entry from the authentication user
     *  The authentication user and user account are mapped to eachother by the same uid
     *  @param {string} value - user's first name, {string} value - user's last name
     *  @return {firebase.promise}
     */
    createUser(newFirstName: string, newLastName: string) {
        let user = firebase.auth().currentUser;
        //updating the firebase default user accounts
        if(user) {
            user.updateProfile({
                displayName: `${newFirstName} ${newLastName}`,
                photoURL: "",
            }).then(() => {
                //creates an entry in the user db with the same uid as the authenticated account
                const userData = new User(user, newFirstName, newLastName);
                this.db.ref("users").child(user.uid).set(userData);
            }).catch(function (error) {
                console.log(error);
            });
        }

        user.sendEmailVerification().then(function() {
            console.log("work?");
        }).catch(function(error) {
            console.log(error);
            console.log("fail");
        });

    }
}
