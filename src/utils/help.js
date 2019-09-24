import defaultSettings from '../defaultSettings';
import { Base64 } from 'js-base64';
import oss from 'ali-oss';


export function constructOSSClient() {
  const client = new oss({
      accessKeyId: Base64.decode(defaultSettings.accessKeyId),
      accessKeySecret: Base64.decode(defaultSettings.accessKeySecret),
      region: defaultSettings.region,
      bucket: Base64.decode(defaultSettings.bucket),
  });
  return client;
}
