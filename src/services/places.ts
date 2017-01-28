import {Injectable} from "@angular/core";
import {Place} from "../models/place";
import {Location} from "../models/location";
import {Storage} from "@ionic/storage";
import {File} from "ionic-native";

declare var cordova: any;

@Injectable()
export class PlacesService {
  private places: Place[] = [];

  constructor(private storage: Storage) {}

  addPlace(title: string, description: string, location: Location, imageUrl: string) {
    const place = new Place(title, description, location, imageUrl);
    this.places.push(place);
    this.storage.set('places', this.places)
      .then()
      .catch(
        error => {
          this.places.splice(this.places.indexOf(place), 1);
        }
      )
  }

  loadPlaces() {
    return this.places.slice();
  }

  fetchPlaces() {
    this.storage.get('places')
      .then(
        (places: Place[]) => {
          this.places = places != null ? places : [];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  deletePlace(index: number) {
    const place = this.places[index];
    this.places.splice(index, 1);
    this.storage.set('palces', this.places)
      .then(
        () => {
          this.removeFile(place);
        }
      )
      .catch(
        error => console.log(error)
      );
  }

  private removeFile(place: Place) {
    const currentName = place.imageUrl.replace(/^.*[\\\/]/, '');
    File.removeFile(cordova.file.dataDirectory, currentName)
      .then(
        () => console.log('Removed file')
      )
      .catch(
        () => {
          console.log('Error while removing File');
          this.addPlace(place.title, place.description, place.location, place.imageUrl);
        }
      )
  }


}
