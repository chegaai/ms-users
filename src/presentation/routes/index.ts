import find from './user/find'
import getMe from './user/getMe'
import login from './user/login'
import update from './user/update'
import create from './user/create'
import removeOne from './user/removeOne'
import removeMe from './user/removeMe'
import listAll from './user/listAll'
import setPassword from './user/setPassword'
import recoverPassword from './user/recoverPassword'
import usernameAvailability from './user/username-availability'
import requestPasswordRecovery from './user/requestPasswordRecovery'


export const routes = {
  find,
  getMe,
  login,
  update,
  create,
  removeOne,
  removeMe,
  listAll,
  setPassword,
  recoverPassword,
  usernameAvailability,
  requestPasswordRecovery
}
