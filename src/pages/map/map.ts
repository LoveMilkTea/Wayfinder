import { Component, ViewChild, ElementRef, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Select } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {isNullOrUndefined} from "util";
import * as Fuse from 'fuse.js';
import { Geolocation } from '@ionic-native/geolocation';
import { DistanceMatrixService } from '../../services/distanceMatrixService/distanceMatrixService';
import {MapProvider} from "../../providers/map/map";
import {FirebaseProvider} from "../../providers/firebase/firebase";

declare var google;
let stash = []; // Array to contain Markers on the map
let eventStash = [];
let timedStash = [];

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

    /***************** PAGE LOADING FUNCTION ****************/

    /**
     * Prepares the map page for use (onload)
     *  Loads all the data from firebase, loads the map, gets user geolocation, and places the
     *  user marker
     *  @param none
     *  @return none
     */

    ionViewDidLoad() {
        this.loadTagData(); // Load all the data from firebase once
        this.loadMap();
        this.getLatLng();
        this.addTimedEvent('UH End of Year Bash','A end of the year party for all UH Manoa students!', 'http://curvysewingcollective.com/wp-content/uploads/2017/10/CSC-Party-Time-400x400.png', 21.296967, -157.821814, 5);
    }

    /***************** IONIC SEARCH MENU FUNCTIONS ****************/

    /**
     * Searches for a point in the ionic search menu
     * @param {string} input - Value given by the user through the ionic search menu
     * @return none
     */

    searchPoints(input) {
        this.isSearching = true;
        let fuse = new Fuse(this.searchList, this.fuseOptions)

        if (input === '') {
            this.searchList = this.geoMarkers;
        } else {
            this.searchList = fuse.search(input);
        }
    }

    /**
     * Stops the search menu
     * @param none
     * @return none
     */

    stopSearch() {
        this.isSearching = false;
    }

    /**
     * Turns isSeacrching to true and shows all the matching searches in the ionic menu
     * @param none
     * @return none
     */

    showSearch() {
        this.isSearching = true;
    }

    /***************** RETRIEVING DATA FROM FIREBASE FUNCTIONS ****************/

    /**
     * Lodas locationList for populating selector menus Called in loadTags();
     * @param - none
     * @return - none
     */

    loadLocationsList() {
        for (let i = 0; i <= this.geoMarkers.length - 1; i++) {
            this.locationsList.push({
                value: i,
                text: this.geoMarkers[i].name
            });
        }
    }

    /**
     * Retrieves the tags from Firebase and populates them on the map
     * @param - none
     * @return - none
     */

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

    /***************** MARKER PLACING FUNCTIONS ****************/

    /**
     * Adds a marker / point to the map containing the info in the form of a info window
     * @param {object} location - Location object containing necessary location data
     * @param {int} location.key - Key index that the location is at (used to retrieve indexed images)
     * @param {int} location.lat - Latitude value of the given location
     * @param {int} location.lng - Longitude value of the given location
     * @param {string} location.type - Holds info for the icon type of the marker
     * @param {string} location.name - Name of the given location
     * @return none
     */

    addMarker(location) {
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
        }));
    }

    /**
     * Adds a marker / point to the map from the explore page
     * @param {object} location - Location object containing necessary location data
     * @param {int} location.key - Key index that the location is at (used to retrieve indexed images)
     * @param {int} location.lat - Latitude value of the given location
     * @param {int} location.lng - Longitude value of the given location
     * @param {string} location.type - Holds info for the icon type of the marker
     * @param {string} location.name - Name of the given location
     * @return none
     */

    addExpMarker(index) {
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
        }));
    }

    /**
     * Creates info window when a marker is selected or added
     * @param {Object} location - Location that is selected
     * @param {string} location.name - Name of the selected location
     * @param {int} location.key - Key given to indexed location
     * @param {string} location.description - Description of the selected location
     * @param {string} location.address - Address of the selected location
     * @param {string} location.number - Phone number of the selected location
     *
     * @return {Object} infoContent - HTML info window object to display
     */

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

    /**
     * Places the current location marker of the user
     * @param none
     * @return none
     */

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

    /**
     * Adds a timed event marker to the map
     * @param {string} event - The event name
     * @param {string} description - The event description
     * @param {string} image - The event image source
     * @param {int} lat - The latitude of the event
     * @param {int} lng - The longitude of the event
     * @param {int} hours - The hours of the event
     */

    addTimedEvent(event, description, image, lat, lng, hours) {
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

    /***************** DIRECTION ROUTING FUNCTIONS ****************/

    /**
     * Creates direction display from users current location to the end location
     * @param none
     * @return none
     */

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

    /**
     * Creates direction display from a given location to the end location
     * @param {Object} location - Location being directed from
     * @param {int} location.lat - Latitude of starting location
     * @param {int} location.lng - Longitude of starting location
     */

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

    /**
     * Initializes the Google maps directions routing from the expxlore page
     * @param none
     * @return none
     */

    createExpRoute() {
        this.clearRoute();
        this.inRoute = true;
        this.isInfoWindowOpen = true;

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);

        this.calculateAndDisplayExpRoute(this.directionsService, this.directionsDisplay);
    }

    /**
     * Calculates the shortest distance to the destination using Google Directions Matrix API
     * and displays the route on the map from the explore page
     * @param {object] directionsService - directionsService provided by the Google directions API
     * @param {object} directionsDisplay - directionsDisplay provided by the Google directions API
     * @return none
     */

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

    /**
     * Clears direction display route by setting it to null
     * @param none
     * @return none
     */

    clearRoute() {
        if (this.directionsDisplay != null) {
            this.directionsDisplay.setMap(null);
            this.directionsDisplay = null;
        }
    }

    /***************** SEARCH STARTING / STOPPING FUNCTIONS ****************/

    /**
     * Starts search for the directional routing to a point on the map
     * Clears all routes, markers, and infoWindows on the map
     * @param none
     * @return none
     */

    searchStart() {
        if (!this.inRoute) {
            if (this.marker) {
                this.marker.setMap(null);
            }
            this.clearAllMarkers();
            this.inRoute = true;
            this.searchingStart = true;
        }
        else {
            this.clearRoute();
            if (this.infoWindow) {
                this.infoWindow.close();
                this.marker.setMap(null);
            }
            this.isInfoWindowOpen = false;
            this.inRoute = false;
            this.searchingStart = false;
            this.stopTrack();
            this.showCurrLocation();
        }
    }

    /**
     * Stops the direction routing to a point on the map
     * Sets infoWindow, routes, and searching to false to clear the map
     * @param none
     * @return none
     */

    searchStop() {
        this.isInfoWindowOpen = false;
        this.inRoute = false;
        this.searchingStart = false;
        this.showCurrLocation();
    }

    /***************** STREETVIEW FUNCTIONS ****************/

    /**
     * Toggles streetview on and off
     * @param none
     * @return none
     */

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

    /**
     * Checks if streetview is currently in use
     * @param none
     * @return true - If streetview is in use
     *         false - If streetview is not in use
     */

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

    /***************** FILTERING FUNCTIONS ****************/

    /**
     * Opens the filtering menu
     * @param none
     * @return none
     */

    doFilter() {
        this.filterSelect.open();
    }

    /**
     * Filters the markers by the category selected and adds them to the map
     * @param {string} category - Category to filter by
     * @return none
     */

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

    /***************** MARKER CLEARING AND PLACING FUNCTIONS ****************/

    /**
     *  Called by HTML file that changes the state of the add / remove marker button
     *      calls clearAllMarkers or placeAllMarkers based on state of the button
     *  @param none
     *  @return none
     */

    changeAllMarkers() {
        if (this.changeIcon === true) {
            this.clearAllMarkers();
        } else {
            this.changeIcon = true;
            this.placeAllMarkers();
        }
    }

    /**
     * Clears all data points on the map
     * @param - None
     */

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

    /**
     * Places all markers on the map
     * @param none
     * @return none
     */

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

    /***************** USER LOCATION FUNCTIONS ****************/

    /**
     * Gets latitude and longitude of the users current location
     * @param none
     * @return none
     */

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

    /**
     * Places marker at users current latitude / longitude location using HTML5 geolocation
     * @param - None
     */

    showCurrLocation() {
        if (this.latLng) {
            this.userMarker.setMap(this.map);
            this.map.setCenter(this.latLng);
            this.userMarker.setPosition(this.latLng);
            this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
            this.map.setZoom(15);
        }
    }

    /**
     * Uses HTML5 Geolocation to track latitude and longitude of the user
     * @param none
     * @return none
     */

    trackLocation() {
        this.navId = navigator.geolocation.watchPosition((position) => {

                var newPoint = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);


                if (this.userMarker) {
                    this.userMarker.setPosition(newPoint);
                    this.userMarker.setMap(this.map);
                    this.map.setZoom(15);
                    this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
                }

                this.map.setZoom(15);
                this.map.setCenter(newPoint);

            },
            (error) => {
                console.log(error);
            }, {
                timeout: 5000
            });

    }

    /**
     * Stops the HTML5 Geolocation tracking of the user
     * @param none
     * @return none
     */

    stopTrack() {
        navigator.geolocation.clearWatch(this.navId);
        this.userMarker.setMap(null);
    }

    /***************** MAP LOADING FUNCTIONS ****************/

    /**
     * Loads Google Maps API with custom features and styling
     * @param none
     * @return none
     */

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
        this.map.setZoom(15);
    }

    /**
     * Sets up the search parameters for fuzzy search
     */

    fuseOptions: Fuse.FuseOptions = {
        caseSensitive: false,
        keys: ['address', 'description', 'name', 'type'],
        threshold: 0.5,
        shouldSort: true,
    };

    /**
     * Holds icon SVG data and styling
     */

    icons = {
        food: {
            // Spoon and fork icon
            path: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
            fillColor: '#fea3aa',
            strokeColor: '#CA3157',
            strokeWeight: 0.5,
            fillOpacity: 0.8, // you need this defined, there are no defaults.
        },
        drink: {
            // Drink glass icon
            path: 'M6 4l4.03 36.47C10.26 42.46 11.95 44 14 44h20c2.05 0 3.74-1.54 3.97-3.53L42 4H6zm18 34c-3.31 0-6-2.69-6-6 0-4 6-10.8 6-10.8S30 28 30 32c0 3.31-2.69 6-6 6zm12.65-22h-25.3l-.88-8h27.07l-.89 8z',
            fillColor: '#fea3aa',
            strokeColor: '#CA3157',
            strokeWeight: 0.5,
            fillOpacity: 0.8,
        },
        classroom: {
            // School icon
            path: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
            fillColor: '#518A61',
            strokeColor: '#007c34',
            strokeWeight: 0.5,
            fillOpacity: 0.8,
        },
        entertainment: {
            // Event seat icon
            path: 'M4 18v3h3v-3h10v3h3v-6H4zm15-8h3v3h-3zM2 10h3v3H2zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z',
            fillColor: '#b19cd9',
            strokeColor: '#4E2683',
            strokeWeight: 0.5,
            fillOpacity: 0.8,
        },
        housing: {
            // Home icon
            path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
            fillColor: '#fdfd96',
            strokeColor: '#FFB804',
            strokeWeight: 0.5,
            fillOpacity: 0.8,
        },
        library: {
            // Library icon
            path: 'M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z',
            fillColor: '#8BDBCD',
            strokeColor: '#229298',
            strokeWeight: 0.5,
            fillOpacity: 0.8,
        },
        parking: {
            // Local parking icon
            path: 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z',
            fillColor: '#ff6961',
            strokeColor: '#8B0000',
            strokeWeight: 0.5,
            fillOpacity: 0.8,
        },
        recreational: {
            // Local event icon
            path: 'M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z',
            fillColor: '#b2cefe',
            strokeColor: '#006ECE',
            strokeWeight: 0.5,
            fillOpacity: 0.8,
        },
        service: {
            // Business center icon
            path: 'M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z',
            fillColor: '#f8b88b',
            strokeColor: '#CA4729',
            strokeWeight: 0.5,
            fillOpacity: 0.8,
        },
        bathroom: {
            // wc icon
            path: 'M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4zM18 22v-6h3l-2.54-7.63C18.18 7.55 17.42 7 16.56 7h-.12c-.86 0-1.63.55-1.9 1.37L12 16h3v6h3zM7.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm9 0c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z',
            fillColor: '#B8BDB9',
            strokeColor: '#000000',
            strokeWeight: 0.5,
            fillOpacity: 0.8,
        },
    };
}
