import {Component, Injectable} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {MapPage} from "../map/map";
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
    selector: 'page-explore',
    templateUrl: 'explore.html',
})

@Injectable()
export class ExplorePage {

    currentLocation: string;
    currentLat: any;
    currentLng: any;
    url: string;
    dist: Array<any> = [];
    dur: Array<any> = [];
    direct: boolean;

    public expLocations: string =
        "21.2989380,-157.8185730" + // Warrior Rec Center
        "|21.2984350,-157.8188780" + // Campus Center
        "|21.3004500,-157.8161520" + // Hamilton Library
        "|21.2943550,-157.8186020" + // Stan Sheriff Center
        "|21.2993160,-157.8150410" + // Kennedy Theatre
        "|21.3008300,-157.8156720"   // Paradise Palms Cafe
        ;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
        this.direct = false;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.currentLat = position.coords.latitude;
                this.currentLng = position.coords.longitude;
                this.currentLocation = this.currentLat + "," + this.currentLng;
                //this.findDistanceAndDuration();
            })
        }
        else {
            console.log("Location blocked");
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ExplorePage');
    }

    mapTo(value) {
        this.direct = true;
        this.navCtrl.push(MapPage, {
            locationIndex: value.toString(),
            currentLat: this.currentLat,
            currentLng: this.currentLng
        });
    }

    showLocation(value) {
        if(this.direct == false) {
            this.navCtrl.push(MapPage, {
                locationIndex2: value.toString()
            });
        }
    }

    // will check if app has access to user current location to calculate distance from point of interest
    hasCurrLocation() {
        if (this.currentLocation) {
            return true;
        }
        else {
            return false;
        }
    }

    //must add 'Allow-Control-Allow-Origin: *' Chrome plugin to local browser
    findDistanceAndDuration() {
        this.url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.currentLocation}&destinations=${this.expLocations}&mode=walking&units=imperial&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;

        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.loadDistanceAndDuration(data);

        });
    }

    loadDistanceAndDuration(data) {
        var length = data.rows[0].elements.length;
        for (var i = 0; i < length; i++) {
            this.dist.push("(" + data.rows[0].elements[i].distance.text + ")");
            this.dur.push(data.rows[0].elements[i].duration.text);
        }
    }
}