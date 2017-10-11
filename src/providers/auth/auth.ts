import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';


@Injectable()
export class AuthProvider {

    public loginState:boolean = false;

  constructor(public afAuth: AngularFireAuth) {

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

    updateUser(newFirstName: string, newLastName: string) {
      console.log("here");
        var user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: `${newFirstName} ${newLastName}`,
            photoURL: "",
        }).then(function() {
            console.log(user);
        }).catch(function(error) {
            console.log("fail");
        });

    }

    getUser(): boolean {
        var user = this.afAuth.auth.currentUser;

        if (user) {
            return true;
        } else {
            return false;
        }
    }

}
