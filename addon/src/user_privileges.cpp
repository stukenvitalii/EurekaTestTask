//
// Created by stukenvitalii on 19.06.2024.
//
#include "user_privileges.h"
#include <windows.h>
#include <lm.h>
#include <string>

#pragma comment(lib, "netapi32.lib")

std::string getUserPrivilege(const std::string& username) {
    USER_INFO_1* userInfo;
    NET_API_STATUS status = NetUserGetInfo(NULL, std::wstring(username.begin(), username.end()).c_str(), 1, (LPBYTE*)&userInfo);

    if (status == NERR_Success) {
        DWORD privileges = userInfo->usri1_priv;
        NetApiBufferFree(userInfo);

        switch (privileges) {
            case USER_PRIV_ADMIN:
                return "Администратор";
            case USER_PRIV_USER:
                return "Пользователь";
            case USER_PRIV_GUEST:
                return "Гость";
            default:
                return "Неизвестно";
        }
    }

    return "";
}

