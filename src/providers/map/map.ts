import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

/***************** MAP PROVIDER ****************/

/**
 *  Used to hold hard coded data to eliminate redundant code.
 */
export class MapProvider {
    mapStyle = {
        zoom: 15,
        zoomControl: false,
        fullscreenControl: false,
        center: {
            lat: 21.2969, lng: -157.8171
        },
        mapTypeControlOptions: {
            mapTypeIds: ['styled_map']
        },
        styles: [
            {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "lightness": "20"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "lightness": "10"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "lightness": "25"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#ffbb00"
                    },
                    {
                        "saturation": 43.400000000000006
                    },
                    {
                        "lightness": 37.599999999999994
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#00FF6A"
                    },
                    {
                        "saturation": -1.0989010989011234
                    },
                    {
                        "lightness": 11.200000000000017
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            // Remove the next five if we want labels back
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },

            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": "30"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#FFC200"
                    },
                    {
                        "saturation": -61.8
                    },
                    {
                        "lightness": 45.599999999999994
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#24a95a"
                    },
                    {
                        "lightness": "29"
                    },
                    {
                        "saturation": "-58"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#FF0300"
                    },
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 51.19999999999999
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#FF0300"
                    },
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 52
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "transit.station.bus",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "transit.station.bus",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#00b1ff"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#00ffda"
                    },
                    {
                        "saturation": "-50"
                    },
                    {
                        "lightness": "25"
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "lightness": "30"
                    }
                ]
            }
        ]
    };
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



constructor(public http: Http) {
    console.log('Hello MapProvider Provider');
  }

}
