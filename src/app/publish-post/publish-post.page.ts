import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import {ExploreService} from "../feed/explore.service";
import { UploadService } from '../upload.service';


@Component({
  selector: 'app-publish-post',
  templateUrl: './publish-post.page.html',
  styleUrls: ['./publish-post.page.scss'],
})
export class PublishPostPage implements OnInit {
  postForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private exploreService: ExploreService,
    private alertController: AlertController,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.postForm.valid) {
      const { title, description, imageUrl } = this.postForm.value;
      this.exploreService.addFeedDetail(description, imageUrl, title).subscribe(
        async response => {
          console.log('Feed added:', response);
          this.postForm.reset();
          const alert = await this.alertController.create({
            header: 'Success',
            message: 'Feed successfully added!',
            buttons: ['OK']
          });
          await alert.present();
        },
        async error => {
          console.error('Error adding feed:', error);
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'There was an error adding the feed.',
            buttons: ['OK']
          });
          await alert.present();
        }
      );
    }
  }

  fileSelected(event: any){
    const file = event.target.files[0];
    if(file){
      this.uploadService.uploadImage(file, this.uploadService.generateImagePath(file))
          .then(downloadUrl => {
            this.postForm.value.imageUrl = downloadUrl;
          })
          .catch(error => {
            console.error('Error uploading image:', error);
          });
    }
  }
}
