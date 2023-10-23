import {
  authorize,
  getSetting,
  openSetting,
  showModal,
} from '@tarojs/taro';

const albumAuthError = err => {
  if (err.errMsg === 'authorize:fail auth deny') {
    showModal({
      title: '相册授权',
      content: '授权已拒绝，请先开启相册授权',
      success: res => {
        if (res.confirm) {
          openSetting();
        }
      }
    });
  }
};
export const getWechatSetting = async () => {
  return new Promise((resolve, reject) => {
    getSetting({
      //获取权限
      success: res => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          resolve(res);
        } else {
          authorize({
            scope: 'scope.writePhotosAlbum',
            success(result) {
              resolve(result);
            },
            fail(err) {
              albumAuthError(err);
              reject(err);
            }
          });
        }
      }
    });
  });
};
