import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FeedItemComponent } from './feed-item.component'; // Adjust path as per your project structure

@NgModule({
  declarations: [FeedItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [FeedItemComponent] // Export FeedItemComponent
})
export class FeedItemModule {}