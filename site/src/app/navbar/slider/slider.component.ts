import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'navbar-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.css']
})
export class NavbarSliderComponent implements OnInit, OnDestroy {
    @Input()
    public images: string[] = [];

    public currentBannerIndex = 0;
    public bannerInterval: any;
    private time = 10000; // 10sec

    public ngOnInit(): void {
        this.bannerInterval = setInterval(() => {
            this.nextImage();
        }, this.time);
    }

    public ngOnDestroy(): void {
        if (this.bannerInterval) {
            clearInterval(this.bannerInterval);
        }
    }

    private nextImage() {
        let nextCurrentBannerIndex = this.currentBannerIndex + 1;

        if (nextCurrentBannerIndex >= this.images.length) {
            nextCurrentBannerIndex = 0;
        }

        this.currentBannerIndex = nextCurrentBannerIndex;
    }
}