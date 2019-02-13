import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { genFiles, rootFile, genData, genGroups, genMembers } from './data';

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

    mock.onGet('/file').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, rootFile]);
        }, 1000);
      });
    });

    mock.onGet('/data').reply(config => {
      let {size} = config.params;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, genData(size || 200)]);
        }, 1000);
      });
    });

    //获取文件列表（分页）
    mock.onGet('/file/listpage').reply(config => {
      let {page, fullpath} = config.params;
      fullpath = fullpath || '';
      let mockFiles = genFiles(50);
      let total = mockFiles.length;
      mockFiles = mockFiles.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      mockFiles.forEach(file => {
        file.fullpath = (fullpath ? (fullpath + '/') : '') + file.fullpath;
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

    //获取部门列表（分页）
    mock.onGet('/group/listpage').reply(config => {
      let {page, id} = config.params;
      let mockGroups = genGroups(50);
      let total = mockGroups.length;
      mockGroups = mockGroups.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            list: mockGroups
          }]);
        }, 1000);
      });
    });

    //获取成员列表（分页）
    mock.onGet('/member/listpage').reply(config => {
      let {page, id} = config.params;
      let mockMmembers = genMembers(150);
      let total = mockMmembers.length;
      mockMmembers = mockMmembers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            list: mockMmembers
          }]);
        }, 1000);
      });
    });
  }
}