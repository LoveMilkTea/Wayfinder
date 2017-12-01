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

    constructor(public navCtrl: NavController, public navParams: NavParams, public database: FirebaseProvider) {
        this.filterValue = 'showAll';
    }

    /***************** PAGE LOAD FUNCTION ****************/

    /**
     *  Creates an array of item keys to facilite filtering in the filterItems() function
     *  @param none
     *  @return none
     */

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

    /***************** APPROVE SUBMITTED POINT FUNCTION ****************/

    /**
     *  Approves a point item from a submitter
     *  Creates a new point item in the firebase master data db (testpoints)
     *  @param {Object} value - contains point data submitted by the user
     *  @return none
     */

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

    /***************** DENY SUBMITTED POINT FUNCTION ****************/

    /**
     *  Denies a point item from a submitter
     *  Sets the item in the user input firebase db to denied
     *  @param {Object} value - contains point data submitted by the user
     *  @return none
     */

    deny(value) {
        this.database.userInput.child(value.key).update({'status': 'denied'});
        this.filterItems(this.filterValue);
    }

    /***************** EDIT SUBMITTED POINT FUNCTION ****************/

    /**
     *  Directs the admin user to a page to edit a user's submission
     *  @param {Object} value - contains point data submitted by the user, passed as a parameter to be used in the edit data page
     *  @return none
     */

    editData(value) {
        this.navCtrl.push('EditSubmitDataPage', value);
    }

    /***************** DELETE SUBMITTED POINT FUNCTION ****************/

    /**
     *  Deletes the submitted point from the UserInput firebase db
     *  Sets the item in the user input firebase db to denied
     *  @param {Object} value - contains point data submitted by the user
     *  @return none
     */

    deleteItem(value) { // 'value' is the key for the entry
        this.database.userInput.child(value.key).remove();
        this.filterItems(this.filterValue); // refresh the page
    }

    /***************** FILTER SUBMITTED POINTS FUNCTION ****************/

    /**
     *  Filters the submitted points on the admin's console view
     *  @param {Object} value - contains point data submitted by the user
     *  @return none
     */

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

    /***************** CHECK SUBMITTED POINT FUNCTION ****************/

    /**
     *  Directs the admin to a map that contains the submitted coordinate so the admin can verify the location
     *  @param {Object} value - contains point data submitted by the user
     *  @return none
     */
    checkCoords(value){
        this.navCtrl.push(SubmitDataChooseCoordsPage, value);
    }


}
