import {Component, OnInit} from '@angular/core';
import {Category} from "../../models/Category";
import {CategoryService} from "../../services/category.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
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

  isVisibleUpdate = false;

  isVisibleCreate = false;
  selectedCategoryId: string = '';
  categoryForm: FormGroup;
  constructor(private categoriesService: CategoryService,
              private fb: FormBuilder,
              private modal: NzModalService,
              private notification: NzNotificationService) {
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
    })
  }

  onPageChange(event: number) {
    this.requestBody.pageNo = event -1;
    this.fetchData();
  }

  onPageSizeChange(event: number) {
    this.requestBody.pageSize = event;
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
        this.categoriesService.deleteCategoriesById(id).subscribe(response=>{
          if(response['success']===true){
            this.categoriesList = this.categoriesList.filter(cat => cat.id !== id);
            this.notification.create(
              'success',
              'Success',
              'Category successfully deleted'
            );
          }else{
            this.modal.error({
              nzTitle: 'Delete error',
              nzContent: `${response['message']}`
            });
          }
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => {}
    });
  }

  handleCancel(){
    this.isVisibleUpdate = false;
    this.isVisibleCreate = false;
    this.cleanForm();
  }

  editCategory(id: string){
    const selectedCategory = this.categoriesList.find(cat => cat.id === id);
    this.categoryForm.patchValue(selectedCategory!);
    this.isVisibleUpdate = true;
  }

  updateCategory(){
    const category = this.categoryForm.value;
    this.categoriesService.updateCategory(category.id, category).subscribe(response=>{
      this.isVisibleUpdate = false;
      if(response['success']==true){
        this.notification.create(
          'success',
          'Success',
          'Category successfully updated'
        );
        this.fetchData();
        this.cleanForm();
      }
      else{
        this.modal.error({
          nzTitle: 'Update error',
          nzContent: `${response['message']}`
        });
        this.cleanForm();
      }
    });
  }

  showCreateModal(){
    this.isVisibleCreate = true;
  }

  createCategory(){
    this.categoriesService.createCategory(this.categoryForm.value).subscribe(response=>{
      if(response['success'] == true){
        this.fetchData();
        this.isVisibleCreate = false;
        this.cleanForm();
        this.notification.create(
          'success',
          'Success',
          'Category successfully created'
        );
      }
      else{
        this.modal.error({
          nzTitle: 'Create error',
          nzContent: `${response['message']}`
        });
        this.cleanForm();
      }
    });
  }

  cleanForm(){
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['']
    });
  }
}
