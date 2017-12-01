import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {SubmitDataPage} from "../submit-data/submit-data";
import {AlertController} from 'ionic-angular';
import {MapProvider} from "../../providers/map/map";

declare var google;

@Component({
    selector: 'submit-data-coords-page',
    templateUrl: 'submit-data-choose-cords.html'
})

export class SubmitDataChooseCoordsPage {
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    lat: any;
    long: any;
    url: any;
    address: any;
    loader: any;
    adminCheckLat: any;
    adminCheckLong: any;
    marker: any;
    latLng


    constructor(public navCtrl: NavController, private alertCtrl: AlertController, public loading: LoadingController, public http: Http, public mapProvider: MapProvider, public navParams: NavParams) {
    this.adminCheckLat = this.navParams.get('latitude');
    this.adminCheckLong = this.navParams.get('longitude');
    this.latLng = {lat: this.adminCheckLat, lng: this.adminCheckLong};

    }

    /***************** PAGE LOADING FUNCTION ****************/

    /**
     *  this.adminCheckLat is only set if an admin user was directed to this page from the admin console. The admin uses this map
     *  to check that the user submitted coordinate is correct.
     *  If the admin user was directed here, this function calls a function to load the user submitted point
     *  @param none
     *  @return none
     */

    ionViewDidLoad() {
        this.loadMap();
        if (this.adminCheckLat){
            this.loadAdminCoord();
        }

    }

    /***************** ADMIN LOAD COORDINATE FUNCTION ****************/

    /**
     *  Loads the user submitted coordinate that the admin user is checking
     *  @param none
     *  @return none
     */

    loadAdminCoord() {
        this.marker = new google.maps.Marker({
            position: this.latLng,
            map: this.map,
        });
    }

    /***************** GET USER CLICKED COORDS FUNCTION ****************/

    /**
     *  IF the user was directed to this page to be used to click a location and load it into the form to submit data, then
     *  this function gets the coords that the user clicked on
     *  @param none
     *  @return none
     */

    getCoords() {
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.long}&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;
        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.address = data.results[0].formatted_address;
        });
        this.loader = this.loading.create({
            content: "Getting Coordinates..."
        });
        this.loader.present().then(() => {
            setTimeout(() => {
                let alert = this.alertCtrl.create({
                    title: 'Submit This Point',
                    subTitle: 'Would you to use the following information to submit your point?',
                    message: `Latitude: ${this.lat}  \n Longitude: ${this.long} \n\n Address: ${this.address}`,
                    buttons: [
                        {
                            text: 'ok',
                            role: 'approve',
                            handler: () => {
                                this.navCtrl.push(SubmitDataPage, {
                                    'token': false,
                                    'lat': this.lat,
                                    'long': this.long,
                                    'address': this.address
                                });
                            }
                        },
                        {
                            text: 'cancel',
                            role: 'cancel',
                            handler: () => {
                            }
                        }],
                });
                alert.present();
                this.loader.dismiss();
            }, 3000);
        })
    }

    /***************** GET ADDRESS FUNCTION ****************/

    /**
     *  Uses Google Maps API to find an associated address to the submitted location
     *  @param none
     *  @return {Object} - The user's address
     */

    getAddress() {
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.long}&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;

        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.address = data.results[0].formatted_address;
        });
        return this.address;
    }

    /***************** LOAD MAP FUNCTION ****************/

    /**
     *  Loads the Google map on the page. Only sets up a click listener if the user was directed from the submit data points
     *  page.
     *  @param none
     *  @return none
     */


    loadMap() {
        this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapProvider.mapStyle);
        if(!this.adminCheckLat) {
            google.maps.event.addListener(this.map, 'click', (event) => {
                this.lat = event.latLng.lat();
                this.long = event.latLng.lng();
                this.getCoords();
            });
        }
        this.map.setZoom(17);

    }

    /***************** RETURN FUNCTION ****************/

    /**
     *  Allows the admin to return to the previous page and complete reviewing the user submitted point
     *  @param none
     *  @return none
     */

    return() {
        this.navCtrl.pop();
    }

}
