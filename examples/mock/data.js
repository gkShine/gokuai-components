import Mock from 'mockjs'

const Files = [];

let gen = (length) => {
  let dirLength = Mock.Random.integer(0, length);
  for (let i = 0; i < length; i++) {
    let dir = 0;
    if (i < dirLength) {
      dir = 1;
    }
    let filename = Mock.Random.cname();
    filename = dir ? filename : filename + '.' + Mock.Random.string('lower', 1, 4);
    let file = {
      "mount_id": Mock.Random.integer(1, 10000),
      "hash": Mock.Random.string(40),
      "dir": Mock.Random.integer(0, 1),
      "fullpath": filename,
      "filename": filename,
      "filehash": dir ? "" : Mock.Random.string(40),
      "filesize": dir ? "" : Mock.Random.integer(0, 1073741824),
      "last_member_name": Mock.Random.cname(),
      "last_dateline": Date.parse(Mock.Random.datetime()) / 1000,
      "thumb": Mock.Random.dataImage('125x125'),
      "previewUrl": Mock.Random.dataImage()
    };
    Files.push(Mock.mock(file));
  }
};

gen(1000);

export {Files};