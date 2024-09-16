import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {AlertController, LoadingController} from '@ionic/angular';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {UserService} from "../../user/user.service";
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { getDownloadURL } from 'firebase/storage';
import { UploadService } from 'src/app/upload.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {



  registerForm!: FormGroup;

  imageUrl: string = '';
  cameraImage: string = '';


  constructor(private authService: AuthService,private userService: UserService,private loadingCtrl: LoadingController,private router:Router, private alertController: AlertController, private uploadService: UploadService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(7)]),
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }
/*  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      const valid = urlPattern.test(control.value);
      return valid ? null : { invalidUrl: true };
    };
  }
*/
  async alert(mess: string){
    const alert = await this.alertController.create({
      header: 'Error',
      message: mess,
      buttons: ['OK']
    });
    await alert.present();
  }

  onRegister(){
    this.userService.usernameExists(this.registerForm.value.username).subscribe(usernameExists =>{
      this.userService.emailExists(this.registerForm.value.email).subscribe(emailExists =>{
      if(usernameExists)
        this.alert('Username ' + this.registerForm.value.username +' is already taken!');
      if(emailExists)
        this.alert('Email ' + this.registerForm.value.email +' is already in usage!');
      if(usernameExists || emailExists)
        return;
    this.loadingCtrl.create({message:"Registering..."}).then((loadingEl)=>{
      loadingEl.present();
      
      this.authService.register(this.registerForm.value).subscribe(resData=>{
        console.log(resData);
        loadingEl.dismiss();
        this.router.navigateByUrl('/explore')
        this.addUser(resData.localId);
      });
    })
    
      
  })
  });

  }

  addUser(id: string) {
    const email = this.registerForm.value.email;
    const name = this.registerForm.value.name;
    const surname = this.registerForm.value.surname;
    const username = this.registerForm.value.username;
//    const photoUrl = this.registerForm.value.photoUrl;

    this.userService.addUserDetail(id, email, name, surname, username, this.imageUrl).subscribe(
      () => {
        console.log('User added successfully');
      },
      error => {
        console.error('Error adding user:', error);
      }
    );
  }
  goToLogin() {
    this.router.navigateByUrl('/log-in');
  }


fileSelected(event: any){
  const file = event.target.files[0];
  if(file){
    this.uploadService.uploadImage(file, this.uploadService.generateImagePath(file))
        .then(downloadUrl => {
          this.imageUrl = downloadUrl;
        })
        .catch(error => {
          console.error('Error uploading image:', error);
        });
  }
}
async takePhoto() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64, // Get the result as base64 string
      source: CameraSource.Camera
    });

    const base64String = `data:image/jpeg;base64,${image.base64String}`;
    const blob = this.uploadService.dataURLtoBlob(base64String);
    const path = this.uploadService.generateImagePath(image);

    this.uploadService.uploadImage(blob, path)
      .then(downloadUrl => {
        this.imageUrl = downloadUrl;
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  } catch (error) {
    console.error('Error capturing image:', error);
  }
}



}
