import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {NgForm} from "@angular/forms";
import { UploadService } from 'src/app/upload.service';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-feed-modal',
  templateUrl: './feed-modal.component.html',
  styleUrls: ['./feed-modal.component.scss'],
})
export class FeedModalComponent  implements OnInit {
  @ViewChild('f',{static: true}) form!: NgForm;
  @Input()title!: string;
  imageUrl! : string;
  constructor(private modalCtrl:ModalController, private uploadService: UploadService) { }

  ngOnInit() {

  }

  onCancel(){
    this.modalCtrl.dismiss();
  }
  onAddPost(){
    if(!this.form.valid){
      return;
    }
    this.modalCtrl.dismiss({
      feedData:
        {imageUrl: this.imageUrl,
        description: this.form.value['description'],
        title:this.form.value['title']
        }
      },
      'confirm');
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
