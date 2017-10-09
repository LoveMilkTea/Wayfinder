import {Component} from '@angular/core';
import {IonicPage, NavController, LoadingController, Loading, AlertController, NavParams, ToastController} from 'ionic-angular';
import {User} from "../../models/user";
import {AngularFireAuth} from "angularfire2/auth"
import {AuthProvider} from "../../providers/auth/auth";
import {NgForm} from "@angular/forms";

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
    public loading:Loading;

    constructor(public authData: AuthProvider, public alertCtrl: AlertController, private toast: ToastController, public navCtrl: NavController, public navParams: NavParams,  public loadingCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    login(user: User) {
        // this is for validation
        // if (!this.loginForm.valid){
        //     console.log(this.loginForm.value);
        // } else {
        console.log(user);
        this.authData.loginUser(user.email, user.password)
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

