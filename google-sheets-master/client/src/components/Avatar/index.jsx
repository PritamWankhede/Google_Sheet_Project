import {
  Avatar as ChakraUIAvatar,
  MenuList,
  MenuButton,
  Menu,
  MenuItem,
  Portal,
} from "@chakra-ui/react";

const Avatar = ({ user, logout }) => {
  const { name, colorCode } = user;

  return (
    <Menu placement="bottom-end">
      <MenuButton>
        <ChakraUIAvatar name={name} bg={colorCode} color="white" />
      </MenuButton>
      <Portal>
        <MenuList zIndex={999}>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default Avatar;
