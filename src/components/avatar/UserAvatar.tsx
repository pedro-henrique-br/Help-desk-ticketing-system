import { Avatar } from "@mui/material";

export const UserAvatar = (user: {name: string, avatarPath: string}) => {
  return (
    <Avatar
      sx={{ width: "130px", height: "130px" }}
      alt={user.name}
      src={user.avatarPath}
    />
  );
};
