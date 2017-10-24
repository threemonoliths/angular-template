import {Component,OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms'; 

import {ConfirmationService} from 'primeng/primeng';
//import {Message} from 'primeng/primeng';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';

import { Role, Permission } from '../../../_domains/role.domain';
import { RoleService } from '../../../_services/role.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';
import { Subject }  from 'rxjs/Subject';
import {DataTable} from 'primeng/primeng';
import {LazyLoadEvent} from 'primeng/primeng';


@Component({
    templateUrl: './list.component.html'
})
export class RoleListComponent implements OnInit {

    public roleList:Array<Role>;
    private selectedRoles = new Array<Role>();


   

    @ViewChild(DataTable) dt: DataTable;

    //datatable每页显示条目数、总条目数
    recordsPerPage = 15;
    totalRecords = 0;

    //datatable排序对象
    sort: any = new Object();

    //搜索框ngModel，保存查询参数
    model: any = new Object();
    //每当在输入框输入时（keyup），向流中发送搜索model
    private searchModels = new Subject<any>();
    search(): void {
        this.searchModels.next(this.model);
    }


      constructor(public router: Router,
        public activeRoute: ActivatedRoute,
        private roleService: RoleService,
        private eventbusService: EventBusService,
        private confirmationService: ConfirmationService) {
      }

      labelstr = '角色管理';
      urlstr = frontendUrl + '/#/home/role';

      //msgs: Message[] = [];
    
      ngOnInit() {
        this.roleService.list().then(result => this.roleList = result);
        this.eventbusService.addCrumb(this.labelstr,this.urlstr);
        //订阅搜索流，输入后300毫秒执行查询操作
        this.searchModels.debounceTime(300)
                         //.distinctUntilChanged()
                         .map(model => this.loadPage(model,this.sort,1,this.recordsPerPage).then(()=>this.dt.reset())).subscribe(); 
      }

      
    
      public getRolesByPage(page: Number): void {
        console.log('页码>' + page);
      }
    
      public pageChanged(event): void {
        this.router.navigateByUrl('/workspace/user/usertable/page/1');
      }
    
      public newRole(): void {
        this.roleService.isUpdate=false;
        this.router.navigateByUrl('/home/role/form');
      }
    //获取datatable数据，初始化及单击页码时都将调用
    loadLazy(event: LazyLoadEvent) {
        this.loadPage(this.model, this.sort, event.first/this.recordsPerPage+1, this.recordsPerPage);
    } 

    //设置datatable总记录数与当前页的数据集
    loadPage(model, sort, page, per_page): any{
        return this.roleService.listOnePage(model,sort,page,per_page).then(result => { this.roleList = result['items'];
                   this.totalRecords = result['meta']['total']}).catch((error)=>
                    this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error})
            );
    }
    
        //datatable自定义排序事件处理函数
    mySort(event){
        this.sort.field=event.field;
        let ord = event.order;
        if (ord==-1) {
            this.sort.order = 'desc'
        } else {
            this.sort.order = 'asc'
        }
        this.loadPage(this.model, this.sort, 1, this.recordsPerPage);
    }
      updateRole(): void {
        //console.log(this.selectedRoles.length);
        if (this.selectedRoles.length == 1){
          this.roleService.isUpdate=true;
          //this.roleService.updateRole.permissions = new Array<Permission>();
          this.roleService.initUpdate(this.selectedRoles[0])
            .then(result => this.roleService.updateRole = result).then(() => this.router.navigateByUrl('/home/role/updateform')); 
        } else {
          this.confirmationService.confirm({
            message: '请选择一个角色进行修改！',
            accept: () => {

            }
          });
        }
      }

     //  deleteRole(){
      //   console.log("in deleteRole!")
       // this.showSuccess();
     //  }

      //showSuccess() {
       // this.msgs = [];
        //this.msgs.push({severity:'success', summary:'Success Message', detail:'Message sent'});
     // }
}