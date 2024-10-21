import { View, Image, Text } from "react-native";
import getAvatarLink from "../../services/dicebear-avt";
const UserAvatar = ({
  size = 60,
  src = getAvatarLink("CodOceaner"),
  className,
}) => {
  return (
    <Image
      source={{ uri: src }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className={className}
    />
  );
};

export default UserAvatar;
