import { Component, ViewChild, ElementRef, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Select } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { isNullOrUndefined } from "util";
import * as Fuse from 'fuse.js';
import { Geolocation } from '@ionic-native/geolocation';
import { DistanceMatrixService } from '../../services/distanceMatrixService/distanceMatrixService';
import {MapProvider} from "../../providers/map/map";
import {FirebaseProvider} from "../../providers/firebase/firebase";

declare var google;
let stash = []; // Array to contain Markers on the map
let eventStash = [];

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',

})

export class MapPage {

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('filterSelect') filterSelect: Select;
    map: any;
    panorama: any;
    marker: any;
    startMarker: any;
    endMarker: any;
    public geoMarkers: any[]; // Holds all the marker data
    loader: any; // Holds the module for loading
    infoWindow: any;
    streetTag: any;
    locationsList: any = []; //array to populate menu with\
    searchList: any[]; //array that will be used for searching. Eventually make this function like locationsList?
    exploreIndex: any;
    exploreIndex2: any;
    currentLat: any;
    currentLng: any;
    latLng: any;
    jsonData: any;
    directionsService: any;
    directionsDisplay: any;
    location: any;
    startValue: any; // Values for destination and location
    endValue: any;
    typeList = ["Classroom", "Food", "Entertainment", "Housing", "Library", "Parking", "Recreational", "Service", "Bathroom"];
    userMarker: any;
    changeIcon: boolean = false;
    isSearching: boolean = false;
    isInfoWindowOpen: boolean = false;
    searchingStart: boolean = false;
    inRoute: boolean = false;
    navId: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, public http: Http, private geolocation: Geolocation, public distanceMatrixService: DistanceMatrixService, public mapProvider: MapProvider, public database: FirebaseProvider) {
        this.exploreIndex = navParams.get('locationIndex');
        this.exploreIndex2 = navParams.get('locationIndex2');
        this.currentLat = navParams.get('currentLat');
        this.currentLng = navParams.get('currentLng');

        this.geolocation.getCurrentPosition().then((resp) => {
            this.currentLat = resp.coords.latitude;
            this.currentLng = resp.coords.longitude;
        }).catch((error) => {
            console.log('Error getting location', error);
        });

        this.geolocation.getCurrentPosition().then((resp) => {
            this.currentLat = resp.coords.latitude;
            this.currentLng = resp.coords.longitude;
        }).catch((error) => {
            console.log('Error getting location', error);
        });

        this.geolocation.getCurrentPosition().then((resp) => {
            this.currentLat = resp.coords.latitude;
            this.currentLng = resp.coords.longitude;
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    ionViewDidLoad() {
        this.loadTagData(); // Load all the data from firebase once
        this.loadMap();
        this.getLatLng();
        this.addTimedEvent('UH End of Year Bash','A end of the year party for all UH Manoa students!', 'http://curvysewingcollective.com/wp-content/uploads/2017/10/CSC-Party-Time-400x400.png', 21.296967, -157.821814, 5);
    }

    searchPoints(input) {
        this.isSearching = true;
        let fuse = new Fuse(this.searchList, this.fuseOptions)

        if (input === '') {
            this.searchList = this.geoMarkers;
        } else {
            this.searchList = fuse.search(input);
        }
    }

    stopSearch() {
        this.isSearching = false;
    }

    showSearch() {
        this.isSearching = true;
    }

    // Load up locationsList for populating selector menus. Called in loadTags();
    loadLocationsList() {
        for (let i = 0; i <= this.geoMarkers.length - 1; i++) {
            this.locationsList.push({
                value: i,
                text: this.geoMarkers[i].name
            });
        }
    }

    // Retrieves the tags from Firebase and populates them on map.
    loadTagData() {
        // Load the tag data into the geoMarkers variable
        this.geoMarkers = [];
        this.database.masterData.once("value")

            .then((dataPoints) => {

                dataPoints.forEach((dataPoint) => {
                    this.geoMarkers.push({
                        key: dataPoint.key,
                        address: dataPoint.val().address,
                        description: dataPoint.val().description,
                        lat: dataPoint.val().lat,
                        lng: dataPoint.val().lng,
                        name: dataPoint.val().name,
                        number: dataPoint.val().number,
                        website: dataPoint.val().website,
                        type: dataPoint.val().type.toLowerCase(),
                    });
                });
            })
            .then(() => {
                //
                // DOES THIS FOR THE EXPLORE
                //
                if (this.exploreIndex && this.currentLat && this.currentLng) {
                    this.createExpRoute();
                }
                else if (!this.exploreIndex && this.exploreIndex2) {
                    this.addExpMarker(this.exploreIndex2);
                }

                this.searchList = this.geoMarkers.slice();

                this.loadLocationsList();
            })

    }


    // Pass in the entire object now that key field holds image index
    addMarker(location) {
        if (this.marker) {
            this.clearStarterMarker();
        }

        this.stopSearch();

        const geoData = this.geoMarkers.slice();
        const imgIndex = location.key;

        this.endValue = {
            lat: location.lat, lng: location.lng
        };

        this.marker = new google.maps.Marker({
            position: this.endValue,
            title: 'University of Hawaii at Manoa',
            map: this.map,
            icon: this.mapProvider.icons[location.type],
        });

        let info = this.getInfoWindowData(location);
        this.infoWindow = new google.maps.InfoWindow({
            content: info,
            maxWidth: 350
        });
        google.maps.event.addListener(this.infoWindow, 'domready', (() => {
            document.getElementById("infoIcon").addEventListener("click", () => {
                this.navCtrl.push("PointsPage", location);
            });
        }));
        this.infoWindow.open(this.map, this.marker);
        this.isInfoWindowOpen = true;

        this.streetTag = new google.maps.InfoWindow({
            content: '<div style="color: #259975" class="street-tag">' + location.name + '</div>',
        });

        google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
            this.isInfoWindowOpen = false;
            this.clearStarterMarker();
        }));
    }

    addExpMarker(index) {
        if (this.marker) {
            this.clearStarterMarker();
        }

        const geoData = this.geoMarkers.slice();
        const location = geoData[index];

        this.endValue = {lat: location.lat, lng: location.lng};

        this.marker = new google.maps.Marker({
            position: this.endValue,
            title: 'University of Hawaii at Manoa',
            map: this.map,
            icon: this.mapProvider.icons[location.type],
        });

        let info = this.getInfoWindowData(location);
        this.infoWindow = new google.maps.InfoWindow({
            content: info,
            maxWidth: 350
        });
        this.infoWindow.open(this.map, this.marker);
        this.isInfoWindowOpen = true;

        this.streetTag = new google.maps.InfoWindow({
            content: '<div style="color: #259975" class="street-tag">' + location.name + '</div>',
        });

        google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
            this.isInfoWindowOpen = false;
            this.clearStarterMarker();
        }));
    }

    clearStarterMarker() {
        this.marker.setMap(null);
    }

    clearRoute() {
        if (this.directionsDisplay != null) {
            this.directionsDisplay.setMap(null);
            this.directionsDisplay = null;
        }
    }

    calculateAndDisplayRoute(directionsService, directionsDisplay, sValue, eValue) {
        const geoData = this.geoMarkers.slice();
        let origin = {lat: geoData[sValue].lat, lng: geoData[sValue].lng};
        let destination = {lat: geoData[eValue].lat, lng: geoData[eValue].lng};
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    // For explore page routing
    createExpRoute() {
        /*if (this.marker) {
         this.clearStarterMarker();
         }*/
        let renderOptions = {
            map: this.map,
            suppressMarkers: true
        }

        this.clearRoute();
        this.inRoute = true;
        this.isInfoWindowOpen = true;

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer(renderOptions);
        this.directionsDisplay.setMap(this.map);

        this.calculateAndDisplayExpRoute(this.directionsService, this.directionsDisplay);
    }

    // For explore page routing
    calculateAndDisplayExpRoute(directionsService, directionsDisplay) {
        const geoData = this.geoMarkers;
        let origin = {lat: this.currentLat, lng: this.currentLng};
        let destination = {lat: geoData[this.exploreIndex].lat, lng: geoData[this.exploreIndex].lng};

        this.addMarker(geoData[this.exploreIndex]);

        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    searchStart() {
        if (!this.inRoute) {
            if (this.marker) {
                this.clearStarterMarker();
            }
            this.clearAllMarkers();
            this.inRoute = true;
            this.searchingStart = true;
        }
        else {
            console.log("hi");
            this.clearRoute();
            if (this.infoWindow) {
                this.infoWindow.close();
                this.clearStarterMarker();
            }
            this.isInfoWindowOpen = false;
            this.inRoute = false;
            this.searchingStart = false;
            this.stopTrack();
            this.showCurrLocation();
        }
    }

    searchStop() {
        this.isInfoWindowOpen = false;
        this.inRoute = false;
        this.searchingStart = false;
        this.showCurrLocation();
    }

    directFromCurrentLocation() {
        this.searchingStart = false;

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);

        let origin = this.latLng;
        let destination = this.endValue;

        this.directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, (response, status) => {
            if (status === 'OK') {
                this.directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    directFromLocation(location) {
        this.searchingStart = false;

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);

        let origin = {lat: location.lat, lng: location.lng};
        let destination = this.endValue;

        this.directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, (response, status) => {
            if (status === 'OK') {
                this.directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    // Could be useful if needed.
    toggleStreetView() {
        this.panorama.setPosition(this.endValue);
        if (!this.inStreetView()) {
            if (this.infoWindow && this.marker && this.streetTag) {
                this.infoWindow.close();
                this.marker.setMap(this.panorama);
                this.streetTag.open(this.panorama, this.marker);
            }
            this.panorama.setVisible(true);
        } else {
            if (this.infoWindow && this.marker && this.streetTag) {
                this.streetTag.close();
                this.marker.setMap(this.map);
                this.infoWindow.open(this.map, this.marker);
            }
            this.panorama.setVisible(false);
        }
    }

    inStreetView() {
        if (this.panorama) {
            if (this.panorama.getVisible()) {
                return true;
            }
            else {
                return false;
            }
        }
    }


    // Gets data from locations.json file if needed
    getGeoData() {
        this.http.get('assets/data/locations.json')
            .map((res) => res.json())
            .subscribe(data => {
                this.jsonData = data;
            }, (rej) => {
                console.error("Could not load local data", rej)
            });
    }

    doFilter() {
        this.filterSelect.open();
    }

    filterMarker(category) {
        let criteria = category.charAt(0).toLowerCase() + category.slice(1);
        // For "dual-layered" filtering clean out the "changeAllMarkers call"
        this.clearAllMarkers();
        this.changeIcon = true;

        this.infoWindow = new google.maps.InfoWindow({
            maxWidth: 350
        });

        for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
            let data = this.geoMarkers[i],
                latLng = new google.maps.LatLng(data.lat, data.lng);

            if (data.type === criteria) {

                // Creating a marker and putting it on the map
                this.marker = new google.maps.Marker({
                    position: latLng,
                    map: this.map,
                    icon: this.mapProvider.icons[data.type],
                });

                // Push into a Markers array
                stash.push(this.marker);

                let info = this.getInfoWindowData(data);

                google.maps.event.addListener(this.marker, 'click', (() => {
                    this.infoWindow.setContent(info);
                    this.isInfoWindowOpen = true;
                    this.marker.setPosition({lat: data.lat, lng: data.lng});
                    this.infoWindow.open(this.map, this.marker);
                    document.getElementById("infoIcon").addEventListener("click", () => {
                        this.navCtrl.push("PointsPage", data);
                    });
                    this.endValue = latLng;
                    this.streetTag = new google.maps.InfoWindow({
                        content: '<div style="color: #259975" class="street-tag">' + data.name + '</div>',
                    });
                }));

                google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
                    this.isInfoWindowOpen = false;
                }));
            } else {
                console.log("Category: " + criteria + " does not exist!");
            }
        }

        this.map.setCenter({lat: 21.2969, lng: -157.8171});
        this.map.setZoom(15);

    }

    changeAllMarkers() {
        if (this.changeIcon === true) {
            if (stash.length !== 0) {
                for (let i = 0; i < stash.length; i++) {
                    stash[i].setMap(null);
                }
                stash.length = 0;
                this.changeIcon = false;
            } else {
                console.log('Stash array does not exist!');
            }
        } else if (this.changeIcon === false) {
            this.changeIcon = true;
            this.placeAllMarkers();
        }
    }

    clearAllMarkers() {
        if (stash) {
            for (let i = 0; i < stash.length; i++) {
                stash[i].setMap(null);
            }
            stash.length = 0;
            this.changeIcon = false;
        } else {
            console.log('Stash array does not exist!');
        }
    }

    getInfoWindowData(location) {
        let imgSrc;
        let infoContent = '<div class="ui grid windowContainer">';
        if (location.name) {
            if (location.name.toLowerCase() == 'n/a') {
                location.name = '';
            }
            infoContent += '<div id="windowHead">' + location.name + '</div>'
        }
        if (location.key) {
            if (location.key > 163) {
                imgSrc = "../../assets/images/uhLogo.jpg";
            } else {
                if (!isNaN(location.key)) {
                    imgSrc = "https://manoanow.org/app/map/images/" + location.key + ".png";
                } else {
                    imgSrc = "../../assets/images/uhLogo.jpg";
                }
            }
            infoContent += '<img class="ui fluid image info" src="' + imgSrc + '">'
        }
        if (location.description) {
            if (location.description.toLowerCase() == 'n/a') {
                location.description = '';
            }
            else {
                infoContent += '<div id="windowDesc">' + location.description + '</div>'
            }
        }
        if (location.address) {
            if (location.address.toLowerCase() == 'n/a') {
                location.address = '';
            }
            else {
                infoContent += '<div id="windowAddress"><span style="font-weight: bold; color: #259975;">Address: </span>' + location.address + '</div>'
            }
        }
        if (location.number) {
            if (location.number.toString().toLowerCase() == 'n/a') {
                location.number = '';
            }
            else {
                infoContent += '<div id="windowPhone"><span style="font-weight: bold; color: #259975;">Phone: </span>' + location.number + '</div>'
            }
        }
        infoContent += '<i id="infoIcon">' + '&#9432;' + '</i>';
        infoContent += '</div>';

        return infoContent;
    }

    placeTimedMarker() {
        var uh = {lat: 21.3159, lng: 157.8033};
        this.marker = new google.maps.Marker({
            position: uh,
            map: this.map,
            animation: google.maps.Animation.BOUNCE
        });
        timedStash.push(this.marker);

        setTimeout(function () {
            if (timedStash) {
                for (let i = 0; i < timedStash.length; i++) {
                    timedStash[i].setMap(null);
                }
                timedStash.length = 0;
                this.changeIcon = false;
            } else {
                console.log('Stash array does not exist!');
            }
        }, 2000);
    }

    placeAllMarkers() {
        this.clearAllMarkers();

        this.infoWindow = new google.maps.InfoWindow({
            maxWidth: 350
        });

        for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
            let data = this.geoMarkers[i],
                latLng = new google.maps.LatLng(data.lat, data.lng);

            // Creating a marker and putting it on the map
            this.marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                icon: this.mapProvider.icons[data.type],
            });

            stash.push(this.marker);
            let info = this.getInfoWindowData(data);

            google.maps.event.addListener(this.marker, 'click', (() => {
                this.infoWindow.setContent(info);
                this.isInfoWindowOpen = true;
                this.marker.setPosition({lat: data.lat, lng: data.lng});
                this.marker.setIcon(this.mapProvider.icons[data.type]);
                this.infoWindow.open(this.map, this.marker);
                document.getElementById("infoIcon").addEventListener("click", () => {
                    this.navCtrl.push("PointsPage", data);
                });
                this.endValue = latLng;
                this.streetTag = new google.maps.InfoWindow({
                    content: '<div style="color: #259975" class="street-tag">' + data.name + '</div>',
                });
            }))

            google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
                this.isInfoWindowOpen = false;
            }));

            this.changeIcon = true;
            this.map.setCenter({lat: 21.2969, lng: -157.8171});
            this.map.setZoom(15);
        }
    }

    addTimedEvent(event, description, image, lat, lng, hours){
        let infoContent = '<div class="ui grid windowContainer">';
            infoContent += '<div id="windowHead">' + event + '</div>'
            infoContent += '<img class="ui fluid image info" src="' + image + '">'
            infoContent += '<div id="windowDesc">' + description + '</div>'
            infoContent += '</div>';

        let miliseconds = 3.6e+6
        let duration = miliseconds * hours;
        this.infoWindow = new google.maps.InfoWindow({
            maxWidth: 400
        });

        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: this.map,
            title: event,
            draggable: false,
            animation: google.maps.Animation.DROP
        });
        eventStash.push(this.marker);

        //http://themocracy.com/wp-content/uploads/2016/12/Parties.jpg used as a sample image
        google.maps.event.addListener(this.marker, 'click', (() => {
            this.infoWindow.setContent(infoContent);
            this.isInfoWindowOpen = true;
            this.marker.setPosition({lat: lat, lng: lng});
            this.infoWindow.open(this.map, this.marker);
        }))

        google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
            this.isInfoWindowOpen = false;
        }));

        setTimeout(function () {
            if (eventStash) {
                for (let i = 0; i < eventStash.length; i++) {
                    eventStash[i].setMap(null);
                }
                eventStash.length = 0;
                this.changeIcon = false;
            } else {
                console.log('Stash array does not exist!');
            }
            // Markers disappear after 200000 seconds (proof of concept for timed events
        }, duration);
    }

    getLatLng() {
        if (this.currentLat && this.currentLng && !this.latLng) {
            this.latLng = {
                lat: this.currentLat,
                lng: this.currentLng
            };
        }
        else if (!this.latLng) {
            this.loader = this.loading.create({
                content: "Getting Coordinates..."
            })
            if (navigator.geolocation) {
                this.loader.present().then(() => {
                    navigator.geolocation.getCurrentPosition((position) => {
                            this.currentLat = position.coords.latitude;
                            this.currentLng = position.coords.longitude;
                            this.latLng = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            this.loader.dismiss();
                        },
                        (err) => {
                            console.log(err);
                            this.getLatLng();
                        },
                        {enableHighAccuracy: true, timeout: 12 * 1000, maximumAge: 0});

                });
            }
        }
    }

    // Use HTML5 geolocation to get current lat/lng and place marker there
    showCurrLocation() {
        if (this.latLng) {
            this.userMarker.setMap(this.map);
            this.map.setCenter(this.latLng);
            this.userMarker.setPosition(this.latLng);
            this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
            this.map.setZoom(17);
        }
    }


    // Use HTML5 Geolocation to track lat/lng
    trackLocation() {
        this.navId = navigator.geolocation.watchPosition((position) => {

                var newPoint = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);


                if (this.userMarker) {
                    this.userMarker.setPosition(newPoint);
                    this.userMarker.setMap(this.map);
                    this.map.setZoom(17);
                    this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
                }

                this.map.setZoom(17);
                this.map.setCenter(newPoint);

            },
            (error) => {
                console.log(error);
            }, {
                timeout: 5000
            });

    }

    stopTrack() {
        navigator.geolocation.clearWatch(this.navId);
        this.userMarker.setMap(null);
    }

    loadMap() {
        //
        this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapProvider.mapStyle);
        this.panorama = new google.maps.StreetViewPanorama(
            document.getElementById('map'), {
                addressControl: false,
                panControl: false,
                enableCloseButton: false,
                zoomControl: false
            });
        this.panorama.setVisible(false);
        this.map.setStreetView(this.panorama);

// Set up a default marker.
        this.userMarker = new google.maps.Marker({
            position: {
                lat: 21.2969, lng: -157.8171
            },
            title: 'University of Hawaii at Manoa',
            icon: {
                // Walking Directions
                path: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7',
                fillColor: '#1B9A74',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8, // you need this defined, there are no defaults.
                scale: 1.75
            }

        });
        this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
    }

// Set up search params for the fuzzy search
    fuseOptions: Fuse.FuseOptions = {
        caseSensitive: false,
        keys: ['address', 'description', 'name', 'type'],
        threshold: 0.5,
        shouldSort: true,
    };
}