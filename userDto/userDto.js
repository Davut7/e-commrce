module.exports = class UserDto {
  id;
  email;
  isActivated;
  activationLinkExpirationTime;
  constructor(model) {
    this.id = model._id;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.activationLinkExpirationTime = model.activationLinkExpirationTime;
  }
};
