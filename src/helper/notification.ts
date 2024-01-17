import { ElNotification } from "element-plus";

export const showSuccessNotif = (message: string) => {
  ElNotification({
    title: "Sukses",
    type: "success",
    duration: 3000,
    customClass: "successNotif",
    message: message,
  });
};

export const showErrorNotif = (message: string) => {
  ElNotification({
    title: "Error",
    type: "error",
    duration: 5000,
    customClass: "errorNotif",
    message: message,
  });
};

export const showInfoNotif = (message: string) => {
  ElNotification({
    title: "Info",
    type: "info",
    duration: 6000,
    customClass: "infoNotif",
    message: message,
  });
};
