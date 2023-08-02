import {Component, OnInit} from '@angular/core';
import {Category} from "../../models/Category";
import {CategoryService} from "../../services/category.service";
import {first, take} from "rxjs";
import {NzTableQueryParams} from "ng-zorro-antd/table";
@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css']
})
export class ListCategoriesComponent implements OnInit{
  categoriesList: Category[] = [];
  loading: boolean = true;

  total = 0;
  pageSize = 10;
  currentPageIndex = 0;

  requestBody: any = {}
  constructor(private categoriesService: CategoryService) {
  }

  ngOnInit(): void {
    this.requestBody = {
      "pageNo": this.currentPageIndex,
      "pageSize": this.pageSize,
      "filters": null
    }
    this.categoriesService.getCategories(this.requestBody).subscribe(response=>{
      this.loading = false;
      this.categoriesList = response['items'];
      this.total = response['total'];
      console.log("totalc: " + this.total);
    })
  }

  onPageChange(event: number) {
    this.requestBody.pageNo = event -1;
    console.log("catList: " + this.requestBody.pageNo);
    this.fetchData();
  }

  onPageSizeChange(event: number) {
    this.requestBody.pageSize = event;
    console.log("catList from here: " + JSON.stringify(this.categoriesList, null, 2));

    this.fetchData();
  }

  fetchData() {
    this.categoriesService.getCategories(this.requestBody).subscribe(response=>{
      this.loading = false;
      this.categoriesList = response['items'];
    })
  }
}
