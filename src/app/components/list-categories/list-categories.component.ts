import {Component, OnInit} from '@angular/core';
import {Category} from "../../models/Category";
import {CategoryService} from "../../services/category.service";
import {first, take} from "rxjs";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";
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

  isVisible = false;

  selectedCategoryId: string = '';
  categoryForm: FormGroup;
  constructor(private categoriesService: CategoryService,
              private fb: FormBuilder,
              private modal: NzModalService) {
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['']
    });
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

  deleteCategoryById(id: string){
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this category?',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        console.log("hereeeee");
        this.categoriesService.deleteCategoriesById(id).subscribe(response=>{
          if(response['success']===true){
            this.categoriesList = this.categoriesList.filter(cat => cat.id !== id);
          }else{
            alert("Delete error");
          }
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => {}
    });
  }

  showUpdateModal(){
    this.isVisible = true;
  }

  handleCancel(){
    this.isVisible = false;
  }

  handleOk(){
    this.isVisible = false;
  }
  editCategory(id: string){
    const selectedCategory = this.categoriesList.find(cat => cat.id === id);
    this.categoryForm.patchValue(selectedCategory!);
    this.isVisible = true;
  }

  updateCategory(){
    const category = this.categoryForm.value;
    this.isVisible = false;
    this.categoriesService.updateCategory(category.id, category).subscribe(response=>{
      if(response['success']==true){
        this.fetchData();
      }
      else{
        alert("Update error");
      }
    });
  }
}
