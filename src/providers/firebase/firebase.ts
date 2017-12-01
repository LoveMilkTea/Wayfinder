import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';

@Injectable()

/***************** PROVIDER CLASS ****************/

/**
 *  This class is used as a provider to establish the db and be used across the app
 */

export class FirebaseProvider {
    App: any;
    db: any;
    userInput: any;
    masterData: any;
    users: any;


  constructor(public http: Http) {
      if (!firebase.apps.length) {
          this.App = firebase.initializeApp(FIREBASE_CONFIG);
      } else {
          this.App = firebase.app();
      }
      this.db = this.App.database();
      this.userInput = this.db.ref('/dataPoints/');
      this.masterData = this.db.ref('/testPoints');
      this.users = this.db.ref('/users');
      console.log(this.masterData);
  }
}
