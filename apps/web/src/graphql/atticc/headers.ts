import { ATTICC_API_SECRET } from '@app/config'

export const ATTIC_DEFAULT_HEADERS = {
  'content-type': 'application/json',
  'x-hasura-admin-secret': ATTICC_API_SECRET,
}
