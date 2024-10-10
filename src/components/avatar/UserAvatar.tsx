import { Avatar } from "@mui/material";
import user from "../../utils/user";
import React from "react";

export const UserAvatar = (avatar: {
  name: string;
  fileName: string;
  width: string;
  height: string;
}) => {

  const [avatarPath, setAvatarPath] = React.useState()

  React.useEffect(() => {
    const getUserAvatar = async () => {
      const fileUrl = await user.fetchUserAvatar(avatar.fileName)
      return fileUrl != undefined ? setAvatarPath(fileUrl as never) : ("")
    }
    getUserAvatar()
  }, [avatar.fileName]) 

  if(avatarPath != null && avatarPath != undefined){
    return (
    <Avatar
      sx={{ width: avatar.width, height: avatar.height }}
      alt={avatar.name}
      src={avatarPath}
    />
    )
  }

  if(avatarPath === undefined || avatarPath === null){
    return (
    <Avatar
      sx={{ width: avatar.width, height: avatar.height }}
    />
    )
  }
};
