import find from  './user/find'
import getMe from  './user/getMe'
import login from  './user/login'
import update from './user/update'
import create from  './user/create'
import remove from  './user/remove'
import listAll from  './user/listAll'
import setPassword from './user/setPassword'
import recoverPassword from './user/recoverPassword'
import requestPasswordRecovery from './user/requestPasswordRecovery'


export const routes = {
  find,
  getMe,
  login,
  update,
  create,
  remove,
  listAll,
  setPassword,
  recoverPassword,
  requestPasswordRecovery
}
