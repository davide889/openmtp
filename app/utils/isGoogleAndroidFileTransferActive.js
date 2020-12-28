import { exec } from 'child_process';
import Promise from 'bluebird';
import { log } from './log';
import { checkIf } from './checkIf';

export const isProcessRunning = (query) => {
  checkIf(query, 'string');

  const { platform } = process;
  let cmd = '';

  switch (platform) {
    case 'win32':
      cmd = `tasklist`;
      break;
    case 'darwin':
      cmd = `pgrep -i "${query}"`;
      break;
    case 'linux':
      cmd = `ps -A`;
      break;
    default:
      break;
  }

  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        log.error(err, 'isProcessRunning -> err');

        return resolve(false);
      }

      if (stderr) {
        log.error(stderr, 'isProcessRunning -> stderr');

        return resolve(false);
      }

      return resolve(stdout?.toLowerCase()?.indexOf(query?.toLowerCase()) > -1);
    });
  }).catch((e) => {
    log.error(e, 'isProcessRunning -> catch');
  });
};

export const isGoogleAndroidFileTransferActive = async () => {
  const isAftRunning = await isProcessRunning('Android File Transfer');
  const isAftAgentRunning = await isProcessRunning(
    'Android File Transfer Agent'
  );

  return isAftRunning && isAftAgentRunning;
};
