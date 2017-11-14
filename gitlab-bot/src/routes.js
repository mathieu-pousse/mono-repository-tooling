import { Router } from 'express';
import { tracker } from './tracker';
const routes = Router();

routes.get('/', function (req, res) {
  console.log(req)
  res.send('for sanity!')
})

routes.post('/tracker', function (request, response) {
  response.send('👌 - don\'t worry')
  tracker.dispatch(request)
})


export default routes;
