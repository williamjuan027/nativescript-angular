import { platformNativeScriptDynamic } from "@nativescript/angular/platform";
import { animationsTraceCategory } from "@nativescript/angular/trace";
import { setCategories, enable } from "@nativescript/core/trace";
import {
  GridLayout,
  ItemSpec,
  GridUnitType,
} from '@nativescript/core/ui/layouts/grid-layout';
import {
  HorizontalAlignment,
  VerticalAlignment,
} from '@nativescript/core/ui/enums/enums';

import { AppModule } from "./app.module";

import { LottieView } from 'nativescript-lottie';

setCategories(animationsTraceCategory);
enable();

class LaunchAnimation extends GridLayout {
  lottieView: LottieView;
  animatedContainer: GridLayout;
  finished = false;

  constructor() {
    super();

    // setup container to house launch animation
    this.animatedContainer = new GridLayout();
    this.animatedContainer.style.zIndex = 100;
    this.animatedContainer.backgroundColor = '#4caef7';
    this.animatedContainer.className = 'w-full h-full';

    // any creative animation can be put inside
    this.animatedContainer.addRow(new ItemSpec(1, GridUnitType.STAR));
    this.animatedContainer.addRow(new ItemSpec(1, GridUnitType.AUTO));
    this.animatedContainer.addRow(new ItemSpec(1, GridUnitType.STAR));

    this.lottieView = new LottieView();
    this.lottieView.height = 300;
    this.lottieView.width = 300;
    this.lottieView.autoPlay = false;
    this.lottieView.loop = false;
    this.lottieView.src = 'lottie/pinjump.json';

    GridLayout.setRow(this.lottieView, 1);
    this.animatedContainer.addChild(this.lottieView);

    // add animation to top row since booted app will insert into bottom row
    GridLayout.setRow(this.animatedContainer, 1);
    this.addChild(this.animatedContainer);
  }

  startAnimation() {
    this.lottieView.completionBlock = () => this.finished ? this.fadeOut() : this.startAnimation();
    this.lottieView.playAnimation();
  }

  cleanup() {
    this.finished = true;
  }

  fadeOut() {
    this.animatedContainer
      .animate({
        opacity: 0,
        duration: 400,
      })
      .then(() => {
        this._removeView(this.animatedContainer);
        this.animatedContainer = null;
        this.lottieView = null;
      });
  }

}

platformNativeScriptDynamic({
  launchView: new LaunchAnimation(),
}).bootstrapModule(AppModule);
