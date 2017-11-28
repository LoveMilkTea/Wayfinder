import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    LoadingController,
    Loading,
    AlertController,
    ToastController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { MapPage }  from '../map/map';

@IonicPage()
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html',
})
export class SignupPage {
    public signupForm:FormGroup;
    public loading:Loading;

    constructor(public nav: NavController, public authData: AuthProvider,
                public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
                public alertCtrl: AlertController, private toast: ToastController) {

        this.signupForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
            first:[],
            last:[],
        });
    }

    signupUser(){
        var data = {email: `${this.signupForm.value.email}`,
                    photoURL: "",
                    displayName: `${this.signupForm.value.first} ${this.signupForm.value.last}`};
        if (!this.signupForm.valid){
            console.log(this.signupForm.value);
        } else {
            this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password)
                .then(() => {
                    this.authData.createUser(this.signupForm.value.first, this.signupForm.value.last);
                    this.authData.loginUser(this.signupForm.value.email, this.signupForm.value.password);
                    this.nav.setRoot(MapPage);
                }, (error) => {
                    this.loading.dismiss().then( () => {
                        var errorMessage: string = error.message;
                        let alert = this.alertCtrl.create({
                            message: errorMessage,
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
            this.toast.create({
                message: `Account Created, Check email for verification.`,
                duration: 3000
            }).present();
        }
    }

}
