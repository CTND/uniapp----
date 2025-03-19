import { IUserInfo } from '../../TUICallService/interface';
export type TUserInfoExcludeVolumeContextValue = {
    localUserInfoExcludeVolume: IUserInfo;
    remoteUserListExcludeVolume: IUserInfo[];
};
export declare const UserInfoExcludeVolumeContextKey = "UserInfoExcludeVolumeContextKey";
