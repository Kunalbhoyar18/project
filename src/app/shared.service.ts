
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private sharedData: any;

  constructor(private http: HttpClient) { }

  setData(data: any) {
    this.sharedData = data;
  }

  getDataF() {
    return this.sharedData;
  }
  getData(): Observable<any[]> {
    this.sharedData =  this.http.get<any[]>('http://localhost:3000/posts');
    return this.sharedData; 
  }
}