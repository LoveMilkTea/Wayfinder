import {Component} from '@angular/core';
import {IonicPage, NavController, LoadingController, Loading, AlertController, NavParams, ToastController} from 'ionic-angular';
import {User} from "../../models/user";
import {AngularFireAuth} from "angularfire2/auth"
import {AuthProvider} from "../../providers/auth/auth";
import {NgForm} from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { SignupPage } from '../signup/signup';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    user = {} as User;
    loginForm:FormGroup;
    public loading:Loading;

    constructor(public authData: AuthProvider, public alertCtrl: AlertController, public navCtrl: NavController, public loadingCtrl: LoadingController, public formBuilder: FormBuilder) {
        this.loginForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    loginUser() {
        if (!this.loginForm.valid) {
            console.log(this.loginForm.value);
        } else {
            this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
                .then(authData => {
                    this.navCtrl.setRoot('AdminPage');
                }, error => {
                    console.log("never");
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

