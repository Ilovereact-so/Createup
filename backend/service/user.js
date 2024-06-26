const userDAO = require('../dao/user');

class userService {
    loginUser(userDto) {
    const {password, userdata, usertype } = userDto;
    return userDAO.loginUser(password, userdata, usertype);
  }
  checkAccount(userDto) {
    const { username, email } = userDto;
    return userDAO.checkAccount(username, email);
  }
  searchAccount(userDto) {
    const { username, email } = userDto;
    return userDAO.searchAccount(username, email);
  }
  authUser(userDto) {
    const {access_token} = userDto;
    return userDAO.authUser(access_token);
  }
  async signupUser(userDto) {
    const { username, email, password } = userDto;
    const hashPassword = await password
    return userDAO.signupUser(username, email, hashPassword);
  }
  async logoutUser(userDto) {
    const { at, rt } = userDto;
    return userDAO.logoutUser(at, rt);
  }
  async viewProject(userDto) {
    const {access_token} = userDto;
    return userDAO.viewProject(access_token);
  }
}

module.exports = new userService();
