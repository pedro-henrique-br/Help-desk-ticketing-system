import { Avatar } from "@mui/material";

export const UserAvatar = (avatar: {
  name: string;
  avatarPath: string;
  width: string;
  height: string;
}) => {
  return (
    <Avatar
      sx={{ width: avatar.width, height: avatar.height }}
      alt={avatar.name}
      src={avatar.avatarPath}
    />
  );
};
