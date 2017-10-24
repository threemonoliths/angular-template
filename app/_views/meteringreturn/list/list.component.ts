import {Component,OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/debounceTime';

import {ConfirmationService} from 'primeng/primeng';
//import {Message} from 'primeng/primeng';
import {LazyLoadEvent} from 'primeng/primeng';
import {DataTable} from 'primeng/primeng';

import { MeteringReturn } from '../../../_domains/meteringreturn.domain';
import { MeteringReturnService } from '../../../_services/meteringreturn.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';


@Component({
    templateUrl: './list.component.html'
})
export class MeteringReturnListComponent implements OnInit {

    public meteringreturnList:Array<MeteringReturn>;
    private selectedMeteringReturn = new MeteringReturn();

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
        private meteringreturnService: MeteringReturnService,
        private eventbusService: EventBusService,
        private confirmationService: ConfirmationService) {
    }

    //面包屑组件导航相关数据
    labelstr = '回罐单管理';
    urlstr = frontendUrl + '/#/home/meteringreturn';
    
    ngOnInit() {
        this.eventbusService.addCrumb(this.labelstr,this.urlstr);
        //初始化默认分页对象
        this.sort.field='billdate';
        this.sort.order='desc';
        //订阅搜索流，输入后300毫秒执行查询操作
        this.searchModels.debounceTime(300)
                         //.distinctUntilChanged()
                         .map(model => this.loadPage(model,this.sort,1,this.recordsPerPage).then(()=>this.dt.reset())).subscribe();
    }

    //获取datatable数据，初始化及单击页码时都将调用
    loadLazy(event: LazyLoadEvent) {
        this.loadPage(this.model, this.sort, event.first/this.recordsPerPage+1, this.recordsPerPage);
    } 

    //设置datatable总记录数与当前页的数据集
    loadPage(model, sort, page, per_page): any{
        return this.meteringreturnService.listOnePage(model,sort,page,per_page).then(result => { this.meteringreturnList = result['items'];
                   this.totalRecords = result['meta']['total']}).catch((error)=>
                    this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error})
            );
    }
    
    //新增按钮事件
    new(): void {
        this.meteringreturnService.isUpdate=false;
        this.router.navigateByUrl('/home/meteringreturn/form');
    }
    
    //更新按钮事件
    update(): void {
        if (this.selectedMeteringReturn.id!=null){
            this.meteringreturnService.isUpdate=true;
            this.meteringreturnService.initUpdate(this.selectedMeteringReturn)
                .then(result => this.meteringreturnService.updateMeteringReturn= result)
                .then(() => this.router.navigateByUrl('/home/meteringreturn/updateform')).catch((error)=>
                this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error})); 
        } else {
            this.confirmationService.confirm({
                message: '请选择一个回灌单进行修改！',
                accept: () => {
                }
            });
        }
    }
     //审核按钮事件
    audit() :void {
        this.meteringreturnService.isAudit= true;
        this.update()
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

    delete(): void {
        if (this.selectedMeteringReturn.id!=null){
            this.confirmationService.confirm({
                message: '确定要删除回灌单：'+this.selectedMeteringReturn.billno+' 吗？',
                accept: () => {
                    this.meteringreturnService.delete(this.selectedMeteringReturn.id)
                        .then(()=>  this.loadPage(this.model,this.sort,1,this.recordsPerPage).then(() =>
                        this.eventbusService.addMsgs({severity:'success', summary:'删除回灌单成功', detail:'单号: '+this.selectedMeteringReturn.billno}))).then(()=>this.dt.reset())
                }
            });   
        } else {
            this.confirmationService.confirm({
                message: '请选择一个回灌单进行删除！',
                accept: () => {
                }
            });
        }
    }
}