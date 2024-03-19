// import i18next from 'i18next';
// import en from './i18n/en';
// import tr from './i18n/tr';
// import ar from './i18n/ar';
// import hin from './i18n/hin';
import LandlordHome from './landlordHome'

import { authRoles } from 'src/app/auth';
// i18next.addResourceBundle('en', 'landlordPage', en);
// i18next.addResourceBundle('tr', 'landlordPage', tr);
// i18next.addResourceBundle('ar', 'landlordPage', ar);
// // i18next.addResourceBundle('ind', 'examplePage', ind);
// i18next.addResourceBundle('hin', 'landlordPage', hin);



const landlordConfigHome = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.landlord,
  routes: [
    {
      path: 'landlordHome',
      element: <LandlordHome />,
    },
  ],
};

export default landlordConfigHome;