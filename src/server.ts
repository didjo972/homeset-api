// start the Express server
import {app} from './app';

class Server {
    public static runServe = (port: number) => {
        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log('################################################');
            // eslint-disable-next-line no-console
            console.log(`# Env = ${process.env.NODE_ENV}`);
            // eslint-disable-next-line no-console
            console.log(`# App name = ${process.env.NODE_APP}`);
            // eslint-disable-next-line no-console
            console.log(`# Server started at http://localhost:${port}`);
            // eslint-disable-next-line no-console
            console.log('################################################');
        });
    };
}

export default Server;
