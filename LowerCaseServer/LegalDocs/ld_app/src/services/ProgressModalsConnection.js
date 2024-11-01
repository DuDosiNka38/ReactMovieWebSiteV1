import DownloadFilePm from "../progress-modals/Document/DownloadFile.pm";
import SaveSettingsPm from "../progress-modals/Settings/SaveSettings.pm";
import CheckLocationsPm from "../progress-modals/Synchronization/CheckLocations.pm";
import store from "../store";
import * as ProgressModalActions from "../store/progress-modal/actions";




const ProgressModalConnection = () => {
  store.dispatch(
    ProgressModalActions.addModals([
      {
        type: "SAVE_SETTINGS",
        component: SaveSettingsPm
      },
      {
        type: "DOWNLOAD_FILE",
        component: DownloadFilePm
      },
      {
        type: "CHECK_LOCATIONS",
        component: CheckLocationsPm
      },
    ])
  );
};

export default ProgressModalConnection;
