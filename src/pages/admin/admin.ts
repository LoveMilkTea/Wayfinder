import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {SubmitDataChooseCoordsPage} from "../submit-data-choose-coords/submit-data-choose-coords";

@IonicPage()
@Component({
    selector: 'page-admin',
    templateUrl: 'admin.html',
})
export class AdminPage {
    items: string[];
    filterValue: any;

    constructor(private afAuth: AngularFireAuth, private toast: ToastController, public navCtrl: NavController, public navParams: NavParams, public database: FirebaseProvider) {
        this.filterValue = 'showAll';
    }

    ionViewDidLoad() {
        const item = [];
        this.database.userInput.once('value').then(function (datakey) {
            datakey.forEach(function (data) {
                const temp = data.val();
                Object.assign(temp, {
                    'key': data.key
                });
                item.push(temp);
            });
        });
        this.items = item;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    approve(value) { // 'value' is the key for the entry
        this.database.userInput.child(value.key).update({'status': 'approved'});
        this.database.masterData = this.database.masterData.push();
        this.database.masterData.set({
            'name': value.pointName,
            'address': value.address,
            'lat': value.latitude,
            'lng': value.longitude,
            'description': value.description,
            'number': value.phone,
            'website': value.website,
            'type': value.type
        });
        this.filterItems(this.filterValue);
        //this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }

    deny(value) {
        this.database.userInput.child(value.key).update({'status': 'denied'});
        this.filterItems(this.filterValue);
    }

    editData(value) {
        this.navCtrl.push('EditSubmitDataPage', value);
    }

    deleteItem(value) { // 'value' is the key for the entry
        this.database.userInput.child(value.key).remove();
        this.filterItems(this.filterValue); // refresh the page
    }
    filterItems(value) {
        this.filterValue = value;
        const item = [];
        this.database.userInput.once('value').then(function (datakey) {
            datakey.forEach(function (data) {
                const temp = data.val();
                Object.assign(temp, {
                    'key': data.key
                });
                if (value === 'showAll') {
                    item.push(temp);
                } else if (temp.status === value){
                    item.push(temp);
                }
            });
        });
        this.items = item;
    }

    async logout() {
        const result = await this.afAuth.auth.signOut();
        this.navCtrl.setRoot('HomePage');
    }

    checkCoords(item){
        this.navCtrl.push(SubmitDataChooseCoordsPage, item);
        console.log(item);
    }


}
