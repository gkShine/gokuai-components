import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Files } from './data';

export default {
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //获取文件列表（分页）
    mock.onGet('/file/listpage').reply(config => {
      let {page, fullpath} = config.params;
      fullpath = fullpath || '';
      let total = mockFiles.length;
      mockFiles = mockFiles.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      mockFiles.forEach(file => {
        file.fullpath = fullpath + '/' + file.fullpath;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            list: mockFiles
          }]);
        }, 1000);
      });
    });
  }
}