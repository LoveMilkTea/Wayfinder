import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { FIREBASE_CONFIG } from "./../../app.firebase.config";
import * as firebase from 'firebase';
import * as _ from 'underscore/underscore';
import {AuthProvider} from "../../providers/auth/auth";
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
    selector: 'points-page',
    templateUrl: 'points.html'
})

export class PointsPage {
    @ViewChild('commentText') commentText;
    ref: any;
    App: any;
    db: any;
    name: any;
    address: any;
    number: any;
    description: any;
    key: any;
    public comments: any[];
    image: any;
    date: any;
    showAdd: any;
    user: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, private toast: ToastController, public authData: AuthProvider) {
        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            this.App = firebase.app();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("/testPoints/");
        this.name = this.navParams.get('name');
        this.address = this.navParams.get('address');
        this.number = this.navParams.get('number');
        this.description = this.navParams.get('description');
        this.key = String(this.navParams.get('key'));
        if (this.navParams.get('key') > 163) {
            this.image =  "../../assets/images/uhLogo.jpg";
        } else {
            if (!isNaN(this.navParams.get('key'))) {
                this.image = "https://manoanow.org/app/map/images/" + this.key + ".png";
            } else {
                this.image = "../../assets/images/uhLogo.jpg";
            }
        }
        this.date = new Date();
        this.showAdd = false;
        this.user = firebase.auth().currentUser;
        }

    ionViewDidLoad() {
      this.showComments();
    }

    showComments() {
        var item = [];
        this.ref.child(this.key).child("comments").once("value")
            .then((dataPoints) => {
                item = dataPoints.val();
                this.comments = _.toArray(item);
        });

    }

    addComments(formData: NgForm){
        if(this.user) {
            this.date = new Date().toString();
            Object.assign(formData.value, {'dateTime': this.date});
            Object.assign(formData.value, {'userName': this.user.displayName});
            let comments = this.ref.child(this.key);
            comments.child('/comments').push(formData.value);
            this.showComments();
            this.toggleAddButton();
            this.commentText.value = "";
        }
    }
    toggleAddButton() {
        this.showAdd = !this.showAdd;
    }
    getDate(comment: any) {
        return new Date(comment.dateTime).getMonth() + 1 + '/' + new Date(comment.dateTime).getDate() + '/' + new Date(comment.dateTime).getFullYear()
    }
    logIn(){
        this.navCtrl.push(LoginPage);
    }

}
