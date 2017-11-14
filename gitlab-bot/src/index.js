import app from './server'
import configuration from './configuration'

app.listen(configuration.port, () => console.log(`waiting for anything on ${configuration.port}`));
