import store from './../store';
import * as MainActions from './../store/main/actions';

const APP_Storage = window.localStorage;

const LC_NAME = "sessionToken";

const Auth = {
  initAuth: () => {
    if(APP_Storage.getItem(LC_NAME)){
      store.dispatch(MainActions.setAuthHash(APP_Storage.getItem(LC_NAME)));
    }
  },
  getAuthHash: () => {
      const storeHash = store.getState().Main.auth_hash;
      if(storeHash === undefined){
        Auth.initAuth();
        return APP_Storage.getItem(LC_NAME);
      } else {
        return APP_Storage.getItem(LC_NAME) === storeHash ? storeHash : Auth.removeAuthHash();
      }
  },
  setAuthHash: (hash) => {
      APP_Storage.setItem(LC_NAME, hash);
      store.dispatch(MainActions.setAuthHash(hash));
  },
  removeAuthHash: () => {
      APP_Storage.removeItem(LC_NAME);
      store.dispatch(MainActions.setAuthHash(null));
      return null;
  },
};

export default Auth;