import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

declare var google;

@Injectable()
export class DistanceMatrixService {

    service = new google.maps.DistanceMatrixService();

    constructor() {
    }

    getDistance(start, destination) {
        this.service.getDistanceMatrix({
                origins: [start],
                destinations: [destination],
                travelMode: google.maps.TravelMode.WALKING,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                durationInTraffic: false,
                avoidHighways: false,
                avoidTolls: false
            },
            (response, status) => {
                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    console.log('Error:', status);
                } else {
                    console.log(response);
                }
            });
    }

}
