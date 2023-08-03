import { Component } from '@angular/core';
import {Category} from "../../models/Category";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../services/category.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {ItemService} from "../../services/item.service";
import {Item} from "../../models/Item";

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent {
  itemList: Item[] = [];
  loading: boolean = true;

  total = 0;
  pageSize = 10;
  currentPageIndex = 0;

  requestBody: any = {}

  isVisible = false;
  isVisibleCreate = false;
  itemForm: FormGroup;
  selectedCategory: any;

  allCategories: Category[] = [];
  constructor(private itemService: ItemService,
              private categoryService: CategoryService,
              private fb: FormBuilder,
              private modal: NzModalService) {
    this.itemForm = this.fb.group({
      id: [''],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      defaultPrice: [0],
      defaultCost: [0]
    });
    const requestBody = {
      "pageNo": 0,
      "pageSize": 2000,
      "filters": null
    }
    this.categoryService.getCategories(requestBody).subscribe(response=>{
      this.allCategories = response['items'];
    });
  }

  ngOnInit(): void {
    this.requestBody = {
      "pageNo": this.currentPageIndex,
      "pageSize": this.pageSize,
      "filters": null
    }
    this.itemService.getAllItems(this.requestBody).subscribe(response=>{
      this.loading = false;
      this.itemList = response['items'];
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
    this.itemService.getAllItems(this.requestBody).subscribe(response=>{
      this.loading = false;
      this.itemList = response['items'];
    })
  }

  deleteItemById(id: string){
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this item?',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.itemService.deleteItemById(id).subscribe(response=>{
          if(response['success']===true){
            this.itemList = this.itemList.filter(it => it.id !== id);
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

  showCreateModal(){
    this.isVisibleCreate = true;
  }
  handleCancel(){
    this.isVisible = false;
    this.isVisibleCreate = false;
    this.cleanForm();
  }

  editItem(id: string){
    this.itemService.getItemsById(id).subscribe(response=>{
      let selectedItem = response['data'];
      this.itemForm.patchValue(selectedItem!);
      this.isVisible = true;
    });
    this.cleanForm();
  }

  updateItem(){
    const item = this.itemForm.value;
    const body = {
      code: item.code,
      name: item.name,
      description: item.description,
      defaultPrice: item.defaultPrice,
      defaultCost: item.defaultCost,
    }
    this.isVisible = false;
    this.itemService.updateItem(item.id, body).subscribe(response=>{
      if(response['success']==true){
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

  createItem(){
    const item = this.itemForm.value;
    const body = {
      code: item.code,
      name: item.name,
      description: item.description,
      defaultPrice: item.defaultPrice,
      defaultCost: item.defaultCost,
      categoryId: this.selectedCategory
    }
    this.itemService.createItem(body).subscribe(response=>{
      if(response['success'] == true){
        this.fetchData();
        this.isVisibleCreate = false;
        this.cleanForm();
        this.modal.success({
          nzTitle: 'Item successfully created'
        })
        this.cleanForm();
      }
      else{
        this.modal.error({
          nzTitle: 'Create error',
          nzContent: `${response['message']}`
        });
        this.isVisibleCreate = false;
        this.cleanForm();
      }
    });
  }

  cleanForm(){
    this.itemForm = this.fb.group({
      id: [''],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      defaultPrice: [0],
      defaultCost: [0]
    });
  }
}
