package com.trustory;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.horcrux.svg.SvgPackage;
import com.gettipsi.reactnativetwittersdk.TwitterReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.bitgo.randombytes.RandomBytesPackage;

import fr.bamlab.rnimageresizer.ImageResizerPackage;

import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.kevinejohn.RNMixpanel.*;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new RNMixpanel(),
                    new MainReactPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
                    new RNFirebasePackage(),
                    new RNFirebaseMessagingPackage(),
                    new RNFirebaseNotificationsPackage(),
                    new RNCWebViewPackage(),
                    new SvgPackage(),
                    new TwitterReactPackage(),
                    new VectorIconsPackage(),
                    new RandomBytesPackage(),
                    new ImageResizerPackage(),
                    new ImagePickerPackage(),
                    new RNGestureHandlerPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
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
