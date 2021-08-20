#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(TorModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startTor)
RCT_EXTERN_METHOD(startHiddenService)
RCT_EXTERN_METHOD(createDataDirectory)

@end
