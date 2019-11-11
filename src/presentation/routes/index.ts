import setPassword from './user/setPassword'
import { factory as find } from './user/find'
import { factory as getMe } from './user/getMe'
import { factory as login } from './user/login'
import { factory as create } from './user/create'
import { factory as remove } from './user/remove'
import recoverPassword from './user/recoverPassword'
import { factory as listAll } from './user/listAll'
import requestPasswordRecovery from './user/requestPasswordRecovery'


export const routes = {
  create,
  getMe,
  remove,
  find,
  login,
  listAll,
  requestPasswordRecovery,
  recoverPassword,
  setPassword
}
