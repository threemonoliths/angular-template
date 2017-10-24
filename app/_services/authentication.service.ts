import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

export function setTokenOptions(): RequestOptions{
    let headers = new Headers();
    let jwt = 'JWT ' + JSON.parse(localStorage.getItem('currentUser'))['token'];
    headers.append('Authorization', jwt);
    let options = new RequestOptions({ headers: headers });
    return options;
}
 
@Injectable()
export class AuthenticationService {
    public token: string;
 
    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }
 
    login(username: string, password: string): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("Cache-Control", "no-cache,no-store");
        //headers.append('authentication', `${student.token}`);
        let options = new RequestOptions({ headers: headers });
        
       // return this.http.post('http://172.27.21.162:5000/auth', JSON.stringify({ username: username, password: password }), options)

        return this.http.post('http://172.27.21.162:5000/auth', JSON.stringify({ username: username, password: password }), options)
            .map((response: Response) => {
               
                let token = response.json() && response.json().access_token;
              
                 if (token) {
                    this.token = token;
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
                    return true;
                } else {
                    return false;
                }
            });
    }

    getRolename() {

        let headers = new Headers();
        let jwt = 'JWT ' + JSON.parse(localStorage.getItem('currentUser'))['token'];
        //console.log(jwt);
        headers.append('Authorization', jwt);
        let options = new RequestOptions({ headers: headers });
       // return this.http.get('http://172.27.21.162:5000/api/loginuser', options)
       
    
      this.http.get('http://172.27.21.162:5000/api/loginuser', setTokenOptions())
       .map(resp => { return resp.json() }).toPromise().then(result => localStorage.setItem('loginuser', JSON.stringify(result)));


      
  let loginuser= localStorage.getItem('loginuser');
  
  
 var rolename=JSON.parse(loginuser).roles[0].rolename;






 return  rolename;
    }
 

    getLoginUser() {
        
                let headers = new Headers();
                let jwt = 'JWT ' + JSON.parse(localStorage.getItem('currentUser'))['token'];
                //console.log(jwt);
                headers.append('Authorization', jwt);
                let options = new RequestOptions({ headers: headers });
               // return this.http.get('http://172.27.21.162:5000/api/loginuser', options)
               let loginuser= localStorage.getItem('loginuser');
               
               this.http.get('http://172.27.21.162:5000/api/loginuser', setTokenOptions())
               .map(resp => { return resp.json() }).toPromise().then(result => localStorage.setItem('loginuser', JSON.stringify(result)));
             
               var rolename=JSON.parse(loginuser).roles[0].rolename;
              
              console.log(rolename); 
            
            return  this.http.get('http://172.27.21.162:5000/api/loginuser', setTokenOptions())
               .map(resp => { return resp.json() }).toPromise().then(result => localStorage.setItem('loginuser', JSON.stringify(result)));
        
              
    
            }
         

    
    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginuser');
    }

    
}