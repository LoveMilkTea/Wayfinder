import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import {FirebaseProvider} from "../../providers/firebase/firebase";

@IonicPage()
@Component({
    selector: 'edit-submit-page',
    templateUrl: 'edit-submit-data.html'
})

export class EditSubmitDataPage {
    latitude: any;
    longitude: any;
    pointName: string;
    address: string;
    description: string;
    email: string;
    phone: string;
    type: string;
    website: string;
    dataKey: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, private toast: ToastController, public database: FirebaseProvider) {

        // Set the values to repopulate the form
        this.pointName = this.navParams.get('pointName');
        this.latitude = this.navParams.get('latitude');
        this.longitude = this.navParams.get('longitude');
        this.address = this.navParams.get('address');
        this.description = this.navParams.get('description');
        this.phone = this.navParams.get('phone');
        this.type = this.navParams.get('type');
        this.email = this.navParams.get('email');
        this.website = this.navParams.get('website');
        this.dataKey = this.navParams.get('key');
    }

    /***************** EDIT USER SUBMITTED POINT FUNCTION ****************/

    /**
     *  Submits the form data that the admin entered to the User Input firebase db
     *  @param none
     *  @return none
     */

    onSubmit(formData: NgForm) {
        for (var element in formData.value) {
            this.database.userInput.child(this.dataKey).update({ [element] : formData.value[element]});
        }
        this.toast.create({
            message: `Edit Complete`,
            duration: 3000
        }).present();
        this.navCtrl.setRoot('AdminPage');
    }

}
