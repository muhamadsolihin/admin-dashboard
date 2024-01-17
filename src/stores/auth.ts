import { defineStore } from "pinia";
import http from '@/http-common';
import { UserProfile } from "@/types/auth/UserProfile.interface";
import { UserAccess } from "@/types/auth/UserAccess.interface";

interface State {
  authType: number;
  email: string,
  phone: string,
  tokenFcm: string,
  settingPin: string,
  confirmationPin: string,
  selectedOtpMethod: number;
  userProfile: UserProfile;
  userAccess: UserAccess[];
  loadingProfile: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): State => {
    return {
      authType: 0,
      email: '',
      phone: '',
      tokenFcm: '',
      settingPin: '',
      confirmationPin: '',
      selectedOtpMethod: 1,
      userProfile: {} as UserProfile,
      userAccess: [],
      loadingProfile: false,
    };
  },
  getters: {
    getCurrentOutletId(): number {
      return this.userProfile.outlet_id;
    },
    getUserAccessByCode() {
      const userAccesses = this.userAccess;
      return function (code: string): UserAccess {
        const index = userAccesses.findIndex((e) => e.code == code);
        if (index != -1) {
          return userAccesses[index];
        } else {
          return {} as UserAccess;
        }
      };
    },
  },
  actions: {
    async checkAccountAvailability(payload: FormData) {
      try {
        const response = await http.post("/owl/v1/check-account", payload);
        return response.data;
      } catch (error) {
        return error;
      }
    },
    async checkPhoneAvailability(payload: {
      phone: string,
      method: number
    }) {
      try {
        const response = await http.post('/owl/v1/check-account/phone/regist', payload);
        return response.data;
      } catch (error) {
        return error;
      }
    },
    async checkEmailAvailability(payload: FormData) {
      try {
        const response = await http.post('/owl/v1/check-account/regist', payload);
        return response.data;
      } catch (error) {
        return error;
      }
    },
    async getUserMe() {
      this.loadingProfile = true;
      try {
        const response = await http.get("/owl/v1/me");
        if (response.data.status) {
          this.userProfile = response.data.data;
        }
        return response.data;
      } catch (error) {
        return error;
      } finally {
        this.loadingProfile = false;
      }
    },
    async fetchUserAccess() {
      try {
        const response = await http.get("/owl/v1/subscribe/access-user");
        if (response.data.status) {
          this.userAccess = response.data.data;
        }
        return response.data;
      } catch (error) {
        return error;
      }
    },
  },
});
