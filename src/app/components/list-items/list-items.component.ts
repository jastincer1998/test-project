import { Component } from '@angular/core';
import {Category} from "../../models/Category";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../services/category.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {ItemService} from "../../services/item.service";
import {Item} from "../../models/Item";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent {
  itemList: Item[] = [];

  itemDetails: Item | undefined;
  loading: boolean = true;

  total = 0;
  pageSize = 10;
  currentPageIndex = 0;

  requestBody: any = {}

  isVisible = false;
  isVisibleCreate = false;
  isVisibleDetails = false;
  itemForm: FormGroup;
  selectedCategory: any;

  selected: any;
  allCategories: Category[] = [];
  constructor(private itemService: ItemService,
              private categoryService: CategoryService,
              private fb: FormBuilder,
              private modal: NzModalService,
              private notification: NzNotificationService
              ) {
    this.itemForm = this.fb.group({
      id: [''],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      defaultPrice: [],
      defaultCost: []
    });
    const requestBody = {
      "pageNo": 0,
      "pageSize": 100000,
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
      localStorage.setItem("itemList", JSON.stringify(this.itemList));
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
      localStorage.setItem("itemList", JSON.stringify(this.itemList));
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
            this.notification.create(
              'success',
              'Success',
              'Item successfully deleted'
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

  showCreateModal(){
    this.isVisibleCreate = true;
  }
  handleCancel(){
    this.isVisible = false;
    this.isVisibleCreate = false;
    this.isVisibleDetails = false;
    this.cleanForm();
  }

  handleOk(): void {
    this.isVisibleDetails = false;
  }
  editItem(id: string){
    this.itemService.getItemsById(id).subscribe(response=>{
      let selectedItem = response['data'];
      this.itemForm.patchValue(selectedItem!);
      this.isVisible = true;
    });
    this.cleanForm();
  }

  getItemDetails(id: string){
    this.itemService.getItemsById(id).subscribe(response=>{
      if(response['success'] == true){
        this.itemDetails = response['data'];
        this.isVisibleDetails = true;
      }else{
        this.modal.error({
          nzTitle: 'Details error',
          nzContent: `${response['message']}`
        });
      }
    });
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
    this.itemService.updateItem(item.id, body).subscribe(response=>{
      this.isVisible = false;
      if(response['success']==true){
        this.fetchData();
        this.cleanForm();
        this.notification.create(
          'success',
          'Success',
          'Item successfully updated'
        );
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
    if(this.selectedCategory===undefined){
      this.modal.warning({
        nzTitle: 'Warning',
        nzContent: 'Please choose a category for the item'
      });
    }else{
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
          this.notification.create(
            'success',
            'Success',
            'Item successfully created'
          );
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
  }

  onSelectionChange(){
    if(this.selected !== null){
      this.itemList = JSON.parse(localStorage.getItem("itemList")!);
      const categorySelected = this.allCategories.find(cat=>cat.id===this.selected);
      this.itemList = this.itemList.filter((item)=>item.category === categorySelected!.name);
    }else{
      this.itemList = JSON.parse(localStorage.getItem("itemList")!);
    }
  }
  cleanForm(){
    this.itemForm = this.fb.group({
      id: [''],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      defaultPrice: [],
      defaultCost: []
    });
  }
}
