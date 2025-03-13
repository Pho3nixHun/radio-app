import { Component, input, output } from '@angular/core';
import { TagComponent } from '@app/shared/components/tag/tag.component';

export interface RadioLocation {
  country: string;
  state: string;
  flagUrl?: URL | null;
}

export interface RadioCardVM {
  favorite: boolean;
  name: string;
  url: URL | null;
  homepageUrl: URL | null;
  tags: string[];
  faviconUrl: URL | null;
  location: RadioLocation;
  codec: string;
  bitrate: number;
}

/**
 * Component for displaying a radio station card.
 */
@Component({
  selector: 'app-radio-card',
  templateUrl: './radio-card.component.html',
  imports: [TagComponent],
  standalone: true,
})
export class RadioCardComponent {
  public vm = input.required<RadioCardVM>();
  public play = output<void>();
  public favorite = output<boolean>();
}