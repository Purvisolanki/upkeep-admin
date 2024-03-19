import { adminNavigationConfig, landlordNavigationConfig, tenantNavigationConfig } from "app/configs/navigationConfig";

export const getUserData = (user) => ({
    uuid: `uuid_${user?.username}_${user?.email}`,
    from: "custom-db",
    role: 'admin',
    data: {
            displayName: `${user?.username}`,
        photoURL: "assets/images/logo/icmlogo.png",
            email: user?.email,
        settings: {
            layout: {},
            theme: {}
        },
        shortcuts: [],
        userData: user
    },
})

export const getNavigationConfig = (role) => {
  console.log(role);
    if (role === 'admin') {
      return adminNavigationConfig;
    } else if(role === 'Landlord'){
      return landlordNavigationConfig;
    }else if(role === 'Tenant'){
        return tenantNavigationConfig;
  }else 
  return adminNavigationConfig;
};

