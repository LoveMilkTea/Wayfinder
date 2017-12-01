import {Component, ViewChild, ElementRef, Injectable} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
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
    App: any;
    db: any;
    ref: any;
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

    ionViewDidLoad() {
        this.loadMap();
        if (this.adminCheckLat){
            this.loadAdminCoord();
        }

    }

    loadAdminCoord() {
        console.log("put the marker down");
        this.marker = new google.maps.Marker({
            position: this.latLng,
            map: this.map,
            //icon: this.mapProvider.icons[data.type],
        });
    }


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

    getAddress() {
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.long}&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;

        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.address = data.results[0].formatted_address;
        });
        return this.address;
    }

    loadMap() {

        this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapProvider.mapStyle);
        if(!this.adminCheckLat) {
            google.maps.event.addListener(this.map, 'click', (event) => {
                this.lat = event.latLng.lat();
                this.long = event.latLng.lng();
                this.getCoords();
            });
        }

    }
    return() {
        this.navCtrl.pop();
    }

}
