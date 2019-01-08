/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import "CDVInAppYapster.h"
#import "CDVInAppYapsterOptions.h"
#import "CDVUIInAppYapster.h"
#import "CDVWKInAppYapster.h"
#import <Cordova/CDVPluginResult.h>


#pragma mark CDVInAppYapster

@implementation CDVInAppYapster

- (void)pluginInitialize
{
    // default values
    self.usewkwebview = NO;

#if __has_include("CDVWKWebViewEngine.h")
    self.wkwebviewavailable = YES;
#else
    self.wkwebviewavailable = NO;
#endif
}

- (void)open:(CDVInvokedUrlCommand*)command
{
    NSString* options = [command argumentAtIndex:2 withDefault:@"" andClass:[NSString class]];
    CDVInAppYapsterOptions* browserOptions = [CDVInAppYapsterOptions parseOptions:options];
    if(browserOptions.usewkwebview && !self.wkwebviewavailable){
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:@{@"type":@"loaderror", @"message": @"usewkwebview option specified but but no plugin that supplies a WKWebView engine is present"}] callbackId:command.callbackId];
        return;
    }
    self.usewkwebview = browserOptions.usewkwebview;
    if(self.usewkwebview){
        [[CDVWKInAppYapster getInstance] open:command];
    }else{
        [[CDVUIInAppYapster getInstance] open:command];
    }
}

- (void)close:(CDVInvokedUrlCommand*)command
{
    if(self.usewkwebview){
        [[CDVWKInAppYapster getInstance] close:command];
    }else{
        [[CDVUIInAppYapster getInstance] close:command];
    }
}


- (void)show:(CDVInvokedUrlCommand*)command
{
    if(self.usewkwebview){
        [[CDVWKInAppYapster getInstance] show:command];
    }else{
        [[CDVUIInAppYapster getInstance] show:command];
    }
}

- (void)hide:(CDVInvokedUrlCommand*)command
{
    if(self.usewkwebview){
        [[CDVWKInAppYapster getInstance] hide:command];
    }else{
        [[CDVUIInAppYapster getInstance] hide:command];
    }
}


- (void)injectScriptCode:(CDVInvokedUrlCommand*)command
{
    if(self.usewkwebview){
        [[CDVWKInAppYapster getInstance] injectScriptCode:command];
    }else{
        [[CDVUIInAppYapster getInstance] injectScriptCode:command];
    }
}

- (void)injectScriptFile:(CDVInvokedUrlCommand*)command
{
     if(self.usewkwebview){
        [[CDVWKInAppYapster getInstance] injectScriptFile:command];
    }else{
        [[CDVUIInAppYapster getInstance] injectScriptFile:command];
    }
}

- (void)injectStyleCode:(CDVInvokedUrlCommand*)command
{
    if(self.usewkwebview){
        [[CDVWKInAppYapster getInstance] injectStyleCode:command];
    }else{
        [[CDVUIInAppYapster getInstance] injectStyleCode:command];
    }
}

- (void)injectStyleFile:(CDVInvokedUrlCommand*)command
{
    if(self.usewkwebview){
        [[CDVWKInAppYapster getInstance] injectStyleFile:command];
    }else{
        [[CDVUIInAppYapster getInstance] injectStyleFile:command];
    }
}

- (void)loadAfterBeforeload:(CDVInvokedUrlCommand*)command
{
    if(self.usewkwebview){
        [[CDVWKInAppYapster getInstance] loadAfterBeforeload:command];
    }else{
        [[CDVUIInAppYapster getInstance] loadAfterBeforeload:command];
    }
}


@end
