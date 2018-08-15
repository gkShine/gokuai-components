import ThumbnailItem from '../thumbnail/src/thumbnail-item';

ThumbnailItem.install = function(Vue) {
  Vue.component(ThumbnailItem.name, ThumbnailItem);
};

export default ThumbnailItem;
