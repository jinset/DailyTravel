package com.dailytravel;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.airbnb.android.react.maps.MapsPackage;
import me.nereo.multi_image_selector.MultiImagePackage;
//import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new MapsPackage(),
            new MultiImagePackage(),
//            new PickerPackage(),
            new RNFetchBlobPackage(),
            new ImagePickerPackage(),
          new ReactNativeLocalizationPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
