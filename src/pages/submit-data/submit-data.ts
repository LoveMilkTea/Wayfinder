import { Component} from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';
import { Http } from '@angular/http';
import { MapPage } from "../map/map";
import {AuthProvider} from "../../providers/auth/auth";
import {FirebaseProvider} from "../../providers/firebase/firebase";

@Component({
    selector: 'submit-page',
    templateUrl: 'submit-data.html'
})

export class SubmitDataPage {
    childRef: any;
    latitude: any;
    longitude: any;
    loader: any;
    url: any;
    address: any;
    token: any;
    user: any;
    firstName: any;
    lastName: any;
    email: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, private toast: ToastController, public http: Http, public authData: AuthProvider, public database: FirebaseProvider) {

        this.token = this.navParams.get('token');
        if(!this.token) {
            this.latitude = this.navParams.get('lat');
            this.longitude = this.navParams.get('long');
            this.address = this.navParams.get('address');
        }
        this.user = firebase.auth().currentUser;
        if(this.user){
            this.email = this.user.email;
            let uid = this.user.uid;
            this.database.users.once("value", (snapshot)=> {
                if(snapshot.val()[uid]) {
                    this.firstName = snapshot.val()[uid].firstName;
                    this.lastName = snapshot.val()[uid].lastName;
                }
            });
        }
    }

    /***************** PAGE LOADING FUNCTION ****************/

    /**
     *  Checks a token that is set if the user was directed from the "Use Current Location" option
     *  Gets the user's location
     *  @param none
     *  @return none
     */

    ionViewDidLoad() {
      if(this.token){
          this.getCurrLocation();
      }
    }

    /***************** SUBMIT USER POINT FUNCTION ****************/

    /**
     *  Takes data from the user submitted form and submits it into the User Input firebase db
     *  @param {Object} - NgForm data
     *  @return none
     */

    onSubmit(formData: NgForm) {
        for (var element in formData.value) {
            if(formData.value[element] === undefined){
                formData.value[element] = "n/a";
            }
        }
        Object.assign(formData.value, {'status': 'pending'});
        this.childRef = this.database.userInput.push();
        this.childRef.set(formData.value);
        this.toast.create({
            message: `Your point has been submitted! Wait for admin approval.`,
            duration: 3000
        }).present();
        this.navCtrl.setRoot(MapPage);
    }

    /***************** GET USER'S LOCATION FUNCTION ****************/

    /**
     *  Gets the user's current location
     *  @param none
     *  @return none
     */

    getCurrLocation () {
        this.loader = this.loading.create({
            content: "Getting Coordinates..."
        })

        if(navigator.geolocation) {
            this.loader.present().then( () => {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.getAddress();
                    this.loader.dismiss();
                })
            })

        }
    }

    /***************** GET ADDRESS FUNCTION ****************/

    /**
     *  Uses Google Maps API to find an associated address to the submitted location
     *  @param none
     *  @return none
     */

    getAddress() {
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;

        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.address = data.results[0].formatted_address;
        });
    }

}
