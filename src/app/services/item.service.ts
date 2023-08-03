import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  getAllItems(requestBody: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Item/Search`, requestBody);
  }

  createItem(requestBody: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Item`, requestBody);
  }
  deleteItemById(id: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Item/${id}/Remove`, {});
  }

  updateItem(id: string, body: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Item/${id}`, body);
  }

  getItemsById(id: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Item/${id}`, {});
  }
}
