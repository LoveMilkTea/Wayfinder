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

    //used as a global variable to display different views for logged in users
    //maybe change to behaviorsubject...
    public loginState:boolean = false;
    user: BehaviorSubject<User> = new BehaviorSubject(null)
    ref: any;
    App: any;
    db: any;
    roles: String[];

  constructor(public afAuth: AngularFireAuth) {
      if (!firebase.apps.length) {
          this.App = firebase.initializeApp(FIREBASE_CONFIG);
      } else {
          this.App = firebase.app();
      }
      this.db = this.App.database();
      this.ref = this.db.ref("users");
  }

    loginUser(newEmail: string, newPassword: string): firebase.Promise<any> {
        return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
    }

    resetPassword(email: string): firebase.Promise<any> {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    logoutUser(): firebase.Promise<any> {
        return this.afAuth.auth.signOut();
    }

    signupUser(newEmail: string, newPassword: string): firebase.Promise<any> {
        return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPassword);
    }

    createUser(newFirstName: string, newLastName: string) {

        //updating the firebase default user accounts
        var user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: `${newFirstName} ${newLastName}`,
            photoURL: "",
        }).then(() => {
            //creates an entry in the user db with the same uid as the authenticated account
            const userData = new User(user);
            this.db.ref("users").child(user.uid).set(userData);
        }).catch(function(error) {
            console.log(error);
        });

    }
    getUserRole() {
        var user = firebase.auth().currentUser;
        return user;
    }
}
