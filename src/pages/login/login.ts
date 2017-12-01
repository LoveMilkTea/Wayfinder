import {Component} from '@angular/core';
import {IonicPage, NavController, LoadingController, Loading, AlertController, ToastController} from 'ionic-angular';
import {User} from "../../models/user";
import {AuthProvider} from "../../providers/auth/auth";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmailValidator} from '../../validators/email';
import {SignupPage} from '../signup/signup';
import {ResetPasswordPage} from '../reset-password/reset-password';
import app = firebase.app;
import {MapPage} from "../map/map";
import * as firebase from 'firebase/app';
import {FirebaseProvider} from "../../providers/firebase/firebase";

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    user = {} as User;
    loginForm: FormGroup;
    public loading: Loading;

    constructor(public authData: AuthProvider, public alertCtrl: AlertController, public navCtrl: NavController, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public database: FirebaseProvider) {

        this.loginForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });
    }

    /***************** LOG IN USER FUNCTION ****************/

    /**
     *  Logs in the user and directs to map page for user and admin console for administrators
     *  @param none
     *  @return none
     */

    loginUser() {
        if (!this.loginForm.valid) {
            console.log(this.loginForm.value);
        }
        else {
            this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
                .then(() => {
                    let user = firebase.auth().currentUser;
                    if (user.emailVerified === false) {
                        this.loading.dismiss().then(() => {
                            let alert = this.alertCtrl.create({
                                message: `Email Not verfied. Please check email and verify before logging in`,
                                buttons: [
                                    {
                                        text: "Ok",
                                        role: 'cancel'
                                    }
                                ]
                            });
                            alert.present();
                        });
                        this.authData.logoutUser();
                    } else {
                        this.authData.loginState = true;
                        let uid = user.uid;
                        this.database.users.once("value", (snapshot) => {
                            if (snapshot.val()[uid].roles) {
                                let temp = snapshot.val()[uid].roles;
                                if (temp.admin === true) {
                                    this.navCtrl.setRoot('AdminPage');
                                } else {
                                    this.navCtrl.setRoot(MapPage);
                                }
                            }
                        });
                    }
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

    /***************** CREATE USER ACCOUNT FUNCTION ****************/

    /**
     *  Directs users to a form page to sign up for a user account
     *  @param none
     *  @return none
     */
    createAccount() {
        this.navCtrl.push('SignupPage');
    }

    /***************** RESET PASSWORD FUNCTION ****************/

    /**
     *  Directs users to a form page to reset user's password
     *  @param none
     *  @return none
     */
    goToResetPassword() {
        this.navCtrl.push('ResetPasswordPage');
    }
}

