import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';import {Http} from '@angular/http';
import { SubmitDataPage } from "../submit-data/submit-data";
import { SubmitDataChooseCoordsPage } from "../submit-data-choose-coords/submit-data-choose-coords";

@Component({
    selector: 'submit-data-landing-page',
    templateUrl: 'submit-data-landing.html'
})

export class SubmitDataLandingPage {
    token: any;

    constructor(public navCtrl: NavController, public loading: LoadingController, private toast: ToastController, public http: Http) {

    }
    /***************** GO TO SUBMIT DATA PAGE FUNCTION ****************/

    /**
     *  Directs the user to the main submit data page
     *  @param none
     *  @return none
     */

    goMainPage(){
        this.token = ({'token': true});
        this.navCtrl.push(SubmitDataPage, this.token);
    }

    /***************** GO TO BROWSE MAP PAGE FUNCTION ****************/

    /**
     *  Directs the user to a map to browse for coordinates to submit
     *  @param none
     *  @return none
     */
    goMap(){
        this.navCtrl.push(SubmitDataChooseCoordsPage);
    }

}
