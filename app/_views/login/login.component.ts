import {Component,OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { User } from '../../_domains/user.domain';
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public user: User = new User();
    loading = false;
    error = '';

    constructor(public router: Router,
    private authenticationService: AuthenticationService,
    ) { }
    
    ngOnInit() {
        
    }

  //  login(){
      //  console.log("to home")
       // this.router.navigate(['home'])
  //  }


		
  login(fm) {
	console.log(localStorage.getItem('currentUser'));
	if (fm.form.valid){
		this.loading = true;
		this.authenticationService.login(this.user.username, this.user.password)
			.subscribe(result => {
			if (result === true) {
				// login successful
				
				this.authenticationService.getLoginUser()
					.then(() => this.router.navigate(['home'])).then(()=>console.log(localStorage.getItem('currentUser')));
			} 
			}, 
			err => { 
					if (err.status===401){
						this.error = "用户名或密码错误！";
						this.loading=false;
					} 
					else if (err.status===400){
						this.error = "HTTP请求错误！";
						this.loading=false;
					}
					else {
						this.error = "无法连接服务器，请检查网络与服务器是否正常！";
						this.loading=false;
					}
				  });
	  }
}


forgetPwd() {
	
}
}																																																																																