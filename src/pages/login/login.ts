import {Component} from '@angular/core';
import {IonicPage, NavController, LoadingController, Loading, AlertController, ToastController} from 'ionic-angular';
import {User} from "../../models/user";
import {AuthProvider} from "../../providers/auth/auth";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { SignupPage } from '../signup/signup';
import app = firebase.app;
import { MapPage } from "../map/map";
import { FIREBASE_CONFIG } from "./../../app.firebase.config";
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    user = {} as User;
    loginForm:FormGroup;
    public loading:Loading;
    App: any;
    db: any;

    constructor(public authData: AuthProvider, public alertCtrl: AlertController, public navCtrl: NavController, public loadingCtrl: LoadingController, public formBuilder: FormBuilder) {
        this.loginForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });
        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            this.App = firebase.app();
        }
        this.db = this.App.database();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    loginUser() {
        if (!this.loginForm.valid) {
            console.log(this.loginForm.value);
        } else {
            this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
                .then( () => {
                    this.authData.loginState = true;
                     let user = firebase.auth().currentUser;
                    let uid = user.uid;
                    this.db.ref("users").once("value", (snapshot)=> {
                         if(snapshot.val()[uid].roles) {
                             let temp = snapshot.val()[uid].roles;
                             if (temp.admin === true) {
                                 this.navCtrl.setRoot('AdminPage');
                             } else {
                                 this.navCtrl.setRoot(MapPage);
                             }
                         }
                         });
                }, error => {
                    this.loading.dismiss().then(() => {
                        let alert = this.alertCtrl.create({
                            message: `${error.message} Please try again`,
                            buttons: [
                                {
                                    text: "Ok",
                                    role: 'cancel'
                                }
                            ]
                        });
                        alert.present();
                    });
                });

            this.loading = this.loadingCtrl.create({
                dismissOnPageChange: true,
            });
            this.loading.present();
        }
    }
    createAccount() {
        this.navCtrl.push('SignupPage');
    }
}

