#include <napi.h>
#include "user_privileges.h"

Napi::String GetUserPrivilege(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    std::string username = info[0].As<Napi::String>();
    std::string privilege = getUserPrivilege(username);
    return Napi::String::New(env, privilege);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "getUserPrivilege"), Napi::Function::New(env, GetUserPrivilege));
    return exports;
}

NODE_API_MODULE(user_privileges, Init)
