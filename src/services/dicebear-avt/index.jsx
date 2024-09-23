const getAvatarLink = (fullName) => {
  return `https://api.dicebear.com/9.x/adventurer-neutral/png?seed=${fullName}`;
};
export default getAvatarLink;
