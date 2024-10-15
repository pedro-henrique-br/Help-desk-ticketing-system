import { Avatar } from "@mui/material";
import user from "../../utils/user";
import React from "react";
import { supabaseClient } from "../../utils/supabase";

export const UserAvatar = (avatar: {
  name: string;
  fileName: string;
  width: string;
  height: string;
}) => {

  const [avatarPath, setAvatarPath] = React.useState()

  const getUserAvatar = async () => {
    const fileUrl = await user.fetchUserAvatar(avatar.fileName)
    return fileUrl != undefined ? setAvatarPath(fileUrl as never) : ("")
  }
  
  React.useEffect(() => {
    const getUserAvatar = async () => {
      const fileUrl = await user.fetchUserAvatar(avatar.fileName)
      return fileUrl != undefined ? setAvatarPath(fileUrl as never) : ("")
    }
    getUserAvatar()
  }, [avatar.fileName]) 

  supabaseClient.supabase
  .channel("users")
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "users" },
    getUserAvatar
  )
  .subscribe();


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
