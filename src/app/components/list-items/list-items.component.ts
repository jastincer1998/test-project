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

  selectedCategoryId: string = '';
  itemForm: FormGroup;
  constructor(private itemService: ItemService,
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
  editItem(id: string){
    this.itemService.getItemsById(id).subscribe(response=>{
      let selectedItem = response['data'];
      this.itemForm.patchValue(selectedItem!);
      this.isVisible = true;
    });
  }

  updateItem(){
    const item = this.itemForm.value;
    const body = {
      code: item.code,
      name: item.name,
      description: item.description,
      defaultPrice: item.defaultPrice,
      defaultCost: item.defaultCost
    }
    this.isVisible = false;
    this.itemService.updateItem(item.id, body).subscribe(response=>{
      if(response['success']==true){
        this.fetchData();
      }
      else{
        this.modal.error({
          nzTitle: 'Update error',
          nzContent: `${response['message']}`
        });
      }
    });
  }
}
