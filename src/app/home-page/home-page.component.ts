import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../shared.service';
import { Router } from '@angular/router';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
export interface Tag {
    name: string;
}

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit, OnDestroy, AfterViewInit {

    fileError: string | null = null;
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    tags: Tag[] = [{name: 'cricket'}, {name: 'football'}, {name: 'hockey'}];

    private _announcer = inject(LiveAnnouncer);
    public get announcer() {
        return this._announcer;
    }
    public set announcer(value) {
        this._announcer = value;
    }

    registerForm!: FormGroup;
    submitted = false;
    closeResult!: string;
    displayProfileUpload = true;
    selectedState!: string;
    selectedAge!: string;
    states: { code: string, name: string }[] = [
        { code: '--None--', name: '--None--' },
        { code: 'Andhra Pradesh', name: 'Andhra Pradesh' },
        { code: 'Arunachal Pradesh', name: 'Arunachal Pradesh' },
        { code: 'Assam', name: 'Assam' },
        { code: 'Bihar', name: 'Bihar' },
        { code: 'Chhattisgarh', name: 'Chhattisgarh' },
        { code: 'Goa', name: 'Goa' },
        { code: 'Gujarat', name: 'Gujarat' },
        { code: 'Haryana	', name: 'Haryana' },
        { code: 'Himachal Pradesh	', name: 'Himachal Pradesh' },
        { code: 'Jharkhand', name: 'Jharkhand' },
        { code: 'Karnataka', name: 'Karnataka' },
        { code: 'Madhya Pradesh	', name: 'Madhya Pradesh' },
        { code: 'Maharashtra', name: 'Maharashtra' },
        { code: 'Manipur', name: 'Manipur' },
        { code: 'Meghalaya', name: 'Meghalaya' },
        { code: 'Mizoram', name: 'Mizoram' },
        { code: 'Nagaland', name: 'Nagaland' },
        { code: 'Odisha', name: 'Odisha' },
        { code: 'Punjab', name: 'Punjab' },
        { code: 'Rajasthan', name: 'Rajasthan' },
        { code: 'Sikkim', name: 'Sikkim' },
        { code: 'Tamil Nadu', name: 'Tamil Nadu' },
        { code: 'Telangana', name: 'Telangana' },
        { code: 'Tripura', name: 'Tripura' },
        { code: 'Uttar Pradesh', name: 'Uttar Pradesh' },
        { code: 'Uttarakhand', name: 'Uttarakhand' },
        { code: 'West Bengal', name: 'West Bengal' },
        // Add more states here...
    ];

    selectedCountry!: string;
    countries: { code: string, name: string }[] = [
        { code: '--None--', name: '--None--' },
        { code: 'India', name: 'India' },
        // { code: 'England', name: 'England' },
        // Add more states here...
    ];

    @ViewChild('content') contentRef!: ElementRef<HTMLInputElement>;

    constructor(private router: Router,private formBuilder: FormBuilder, 
    private modalService: NgbModal, private dataService: DataService) { }
    getData() {
        if(!this.getDataF()){
        return this.dataService.getData().subscribe((posts: any[]) => {
            if (posts && posts.length > 0) {
                // Assuming you want to populate the form with the first post
                const firstPost = posts[0];
                this.registerForm.patchValue({
                    firstName: this.getDataF().firstName ? this.getDataF().firstName : firstPost.firstName ,
                    lastName: firstPost.lastName,
                    email : firstPost.email,
                    phone: firstPost.phone,
                    age : firstPost.age,
                    state :firstPost.state,
                    country : firstPost.country,
                    address : firstPost.address,
                    isSubscribed : firstPost.isSubscribed,
                    url :firstPost.url, 
                    addressType: firstPost.addressType,
                    homeAddress1: firstPost.homeAddress1,
                    homeAddress2: firstPost.homeAddress2,
                    companyAddress1: firstPost.companyAddress1,
                    companyAddress2: firstPost.companyAddress2,
                    tags : firstPost.tags
                });
                this.selectedState = firstPost.state;
                this.selectedCountry = firstPost.country;
                this.selectedAge = firstPost.age;
                this.url = firstPost.url;
                this.displayProfileUpload = !firstPost.url;
            }
          });
        }
        return this.getDataF();
        //return this.dataService.getData();
    }
    getDataF() {
        return this.dataService.getDataF();
    }
    ngOnInit(): void {
        this.getData();
        //this.getDataF();
        // Initialize postForm with form controls
        this.registerForm = this.formBuilder.group({
            firstName: [this.getDataF()?.firstName, Validators.required],
            lastName: [this.getDataF()?.lastName || '', Validators.required],
            email: [this.getDataF()?.email || '', [Validators.required, Validators.email]],
            phone: [this.getDataF()?.phone, [Validators.required, Validators.pattern(/^\(541\) 7\d{2}-\d{4}$/)]],
            age : [this.getDataF()?.age],
            state : [this.getDataF()?.state],
            country : [this.getDataF()?.country],
            address : [this.getDataF()?.address],
            isSubscribed : [this.getDataF()?.isSubscribed],
            url : [this.getDataF()?.url], 
            addressType: [this.getDataF()?.addressType],
            homeAddress1: [this.getDataF()?.homeAddress1],
            homeAddress2: [this.getDataF()?.homeAddress2],
            companyAddress1: [this.getDataF()?.companyAddress1],
            companyAddress2: [this.getDataF()?.companyAddress2],
            tags : [this.getDataF()?.tags],
            });
            this.selectedState = this.getDataF().state;
            this.selectedCountry = this.getDataF().country;
            this.selectedAge = this.getDataF().age;
            this.tags = this.getDataF()?.tags;

            this.url = this.getDataF()?.url;
            this.displayProfileUpload = !this.getDataF()?.url;
    }

    ngAfterViewInit() {
        // if(this.getDataF()) {

        if(this.getDataF() && this.getDataF().isOnload == false){
            this.open(this.contentRef);
        }
    }

    onStateChange(event: any) {
        const selectedStateCode = event?.target?.value; 
        if (selectedStateCode) {
            this.selectedState = selectedStateCode;
        }
    }

    onCountryChange(event: any) {
        const selectedCountryCode = event?.target?.value; 
        if (selectedCountryCode) {
            this.selectedCountry = selectedCountryCode;
        }
    }

    onAgeChange(event: any) {
       const ag = event?.target?.value;
        console.log('Selected age:', ag);
        this.selectedAge = ag;
    }

    get f() { return this.registerForm.controls; }

    onSubmit() {
        console.log('hi inside submit')
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }

        this.registerForm.get('state')?.setValue(this.selectedState); 
        this.registerForm.get('country')?.setValue(this.selectedCountry); 
        this.registerForm.get('age')?.setValue(this.selectedAge); 
        this.registerForm.get('url')?.setValue(this.url); 
        console.log('this.registerForm.value----',this.registerForm.value);
        this.dataService.setData(this.registerForm.value);
        this.router.navigate(['/user-profile']);
    }

    open(content:any) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

    
    ngOnDestroy(): void {
        this.modalService.dismissAll();
    }

    url: any; 
    msg = "";

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
                    this.msg = '';
                    this.url = reader.result as string;
                    this.displayProfileUpload = false;
                } else {
                    this.msg = 'Image dimensions must be 310x325 pixels or smaller';
                    event.target.value = '';
                }
            };
        };
    
        reader.readAsDataURL(file);
        
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            this.tags.push({name: value});
        }

        event.chipInput!.clear();
    }

    remove(tag: Tag): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    edit(tag: Tag, event: MatChipEditedEvent) {
        const value = event.value.trim();
        if (!value) {
            this.remove(tag);
            return;
        }

        const index = this.tags.indexOf(tag);
        if (index >= 0) {
            this.tags[index].name = value;
        }
    }
}



