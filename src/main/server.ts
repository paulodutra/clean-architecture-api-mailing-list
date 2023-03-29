import 'module-alias/register'
import { MongoHelper } from '@/external/repositories/mongodb/helper'

MongoHelper.connect('mongodb://localhost:27017/clean-arch')
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running...')
    })
  })
  .catch(console.error)

