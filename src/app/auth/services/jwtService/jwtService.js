import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import jwtDecode from "jwt-decode";
import jwtServiceConfig from "./jwtServiceConfig";
import { API_ROUTES } from "src/app/constant/apiRoutes";
import { APIRequest } from "src/app/utils/APIRequest";
import { useNavigate } from "react-router-dom";
// import { getUserData } from "app/theme-layouts/shared-components/chatPanel/store/userSlice";
import { getNavigationConfig, getUserData } from "src/app/utils/User";
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("onAutoLogout", "Invalid access_token");
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit("onNoAccessToken");

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "access_token expired");
    }
  };

  // createUser =  async(data) => {
  //   return new Promise(async(resolve, reject) => {
  //     const formData = new FormData();

  //   // Append form data fields to the FormData object
  //   Object.keys(data).forEach(key => {
  //     formData.append(key, data[key]);
  //   });

  //     const response = await fetch(`https://reileadsapi.exerboost.in/upkeep/app/auth/signup`, {
  //       method: 'POST',
  //       // headers: {
  //       // Authorization: ` ${token}`
  //         body:formData
  //       })
  //       const signupData = await response.json();
  //       console.log(signupData,'response')
  //   return signupData; // You can handle the response as needed
  //     })
  //       .then((response) => {
  //         console.log(response, "response");
  //         this.setSession(response.data.access_token);
  //         resolve(response.data.user);
  //       })
  //       .catch((error) => {
  //         console.log(error,'error is')
  //         reject(error)
  //       });
  //   }

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      // Append form data fields to the FormData object
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      APIRequest.post(API_ROUTES.signUp, formData)
        .then((response) => {
          // navigate('/sign-in')
          window.location.href = "/sign-in";
          return response;
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  // signInWithEmailAndPassword = (email, password) => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(jwtServiceConfig.signIn, {
  //         data: {
  //           email,
  //           password,
  //         },
  //       })
  //       .then((response) => {
  //         if (response.data.user) {
  //           this.setSession(response.data.access_token);
  //           resolve(response.data.user);
  //           this.emit("onLogin", response.data.user);
  //         } else {
  //           reject(response.data.error);
  //         }
  //       });
  //   });
  // };

  getUser = () => {
    return new Promise((resolve, reject) => {
      APIRequest.get(API_ROUTES.getMe)
        .then((response) => {
          const loginuser = response.result;
          console.log(loginuser, "loginuser");
          const user = getUserData(loginuser);
          
      localStorage.setItem("user_role", user.role);
          resolve(user);
          // console.log(user);
          this.setRole(user.role);

          // resolve(getUserData(response.result));
          console.log(user.role);
          this.emit("onLogin", user);
          // return user;
        })
        .catch((error) => {
          console.log(error);
          this.logout();
          this.emit("onAutoLogout", "Invalid access_token");
          reject(new Error("Invalid access_token"));
          // reject(error); // This line might be redundant, as you've already handled the error and rejected the promise above.
        });
    });
  };

  signInWithEmailAndPassword = (username, password) => {
    return new Promise((resolve, reject) => {
      APIRequest.post(API_ROUTES.signIn, {
        username: username,
        password: password,
      })
        .then((response) => {
          console.log(response.result.token, "token 162");
          this.setSession(response.result.token);
          resolve(this.getUser());
          // this.emit("onLogin", getUserData(response.result));
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  // signInWithToken = () => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(jwtServiceConfig.accessToken, {
  //         data: {
  //           access_token: this.getAccessToken(),
  //         },
  //       })
  //       .then((response) => {
  //         if (response.data.user) {
  //           this.setSession(response.data.access_token);
  //           resolve(response.data.user);
  //         } else {
  //           this.logout();
  //           reject(new Error("Failed to login with token."));
  //         }
  //       })
  //       .catch((error) => {
  //         this.logout();
  //         reject(new Error("Failed to login with token."));
  //       });
  //   });
  // };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      const access_token = this.getAccessToken();

      if (access_token) {
        const decoded = jwtDecode(access_token);
        this.setSession(access_token);
        resolve(getUserData({ name: decoded.name, email: decoded.email }));
      } else {
        this.logout();
        reject(new Error("Failed to login with token."));
      }
    });
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setRole = (role) => {
    if (role) {
      localStorage.setItem("user_role", role);
      // Retrieve data from localStorage
      const myRole = localStorage.getItem("user_role");
      console.log(myRole, "myrole");

      // if (myRole !== null) {
      //   console.log(myRole, "myrole");
      //   // getNavigationConfig(myRole);
      // } else {
      //   console.log("No data found");
      // }
      // // axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem("user_role");
      // delete axios.defaults.headers.common.Authorization;
    }
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem("jwt_access_token", access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem("jwt_access_token");
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit("onLogout", "Logged out");
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem("jwt_access_token");
  };
}

const instance = new JwtService();

export default instance;
