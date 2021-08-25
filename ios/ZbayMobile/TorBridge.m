#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(TorModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startTor:(int)socksPort controlPort:(int)controlPort)
RCT_EXTERN_METHOD(startHiddenService:(int)port)
RCT_EXTERN_METHOD(createDataDirectory)

@end
