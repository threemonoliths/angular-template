import {Component,Inject,forwardRef} from '@angular/core';
import {HomeComponent} from '../home/home.component';

@Component({
    selector: 'app-footer',
    template: `
        <div class="footer">
            <div class="card clearfix">
                <span class="footer-text-left">使用 Angular 4.0 开发</span>
                <span class="footer-text-right"><span class="ui-icon ui-icon-copyright"></span>  <span>2017-2018 安徽祥云科技有限公司 版权所有</span></span>
            </div>
        </div>
    `
})
export class AppFooter {

}