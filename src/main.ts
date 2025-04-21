import { ServerConfiguration } from './config/server';
import {ServerRunner} from "./infrastructure/bootstrap/server-runner";

const config = new ServerConfiguration();
config.app
const runner = new ServerRunner(config);

runner.run();
