import { Service, ResponseUtils, logger } from '@service-fw';
import { router, errorMessages } from './storage';
import config from 'config';
import { initDB } from './storage/dao';

const _svc_conf = config.get<{ name: string; port: number }>('service');
const _logger = logger(_svc_conf.name);

ResponseUtils.registerErrorMessages(errorMessages);

Service({
  name: _svc_conf.name,
  router: router,
  hooks: {
    init: async () => {
      _logger.info(config);
    },
    ready: async () => {
      await initDB();
      _logger.info('ready ...');
    },
    destroy: async () => {
      _logger.info('destroy ...');
    }
  }
}, _svc_conf.port);
