import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared.service';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

    constructor(private dataService: DataService, private router: Router) {}
    imgUrl: any; 
    msg = "";
    photoUpdated = false;
    ngOnInit(){
        this.getData();    
    }

    selectFile(event: any) { 
        if (!event.target.files[0] || event.target.files[0].length == 0) {
            this.msg = 'You must select an image';
            return;
        }
    
        const file = event.target.files[0];
        const mimeType = file.type;
        if (!mimeType.match(/image\/*/)) {
            this.msg = 'Only images are supported';
            return;
        }
    
        const reader = new FileReader();
            reader.onload = (_event) => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                if (img.width <= 310 && img.height <= 325) {
                    this.imgUrl = reader.result;
                    let data =this.dataService.getDataF();
                    data.url =this.imgUrl;

                    data.isOnload = false;


                    this.dataService.setData(data);
                } else {
                    this.msg = 'Image dimensions must be 310x325 pixels or smaller';
                    event.target.value = '';
                }
            };
        };
    
        reader.readAsDataURL(file);
    }
    getData() {
        return this.dataService.getDataF();
    }

    onEditProfile() { 

        let data =this.dataService.getDataF();
        
        data.isOnload = false;
        this.dataService.setData(data);


        this.router.navigate(['/']);
    }

    routeToUserRegistrationPg() {
        this.router.navigate(['/user-registration']);
    }
}




