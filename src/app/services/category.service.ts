import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Category} from "../models/Category";
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(requestBody: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Category/Search`, requestBody);
  }

  deleteCategoriesById(id: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Category/${id}/Remove`, {});
  }

  updateCategory(id: string, body: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Category/${id}`, body);
  }
}
