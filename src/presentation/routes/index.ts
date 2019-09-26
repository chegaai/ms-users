import { factory as create } from './user/create'
import { factory as update } from './user/update'
import { factory as remove } from './user/remove'
import { factory as listAll } from './user/listAll'
import { factory as find } from './user/find'
import { factory as login } from './user/login'
import { factory as followGroup } from './user/followGroup'


export const routes = {
  create,
  update,
  remove,
  find,
  login,
  listAll,
  followGroup
}
