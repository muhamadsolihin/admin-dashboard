import { Menu } from "@/types/Menu.interface";
import { defineStore } from "pinia";

export const useMenuStore = defineStore('menu', {
  state: () => {
    return {
      menu: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: "/src/assets/images/icons/menu/dashboard.svg",
          icon_active: "/src/assets/images/icons/menu/dashboard-active.svg",
          children: [],
        },
        {
          name: "Penarikan Dana",
          path: "/balance",
          icon: "/src/assets/images/icons/menu/balance.svg",
          icon_active: "/src/assets/images/icons/menu/balance-active.svg",
          children: [
            {
              name: "Saldo",
              path: "/balance/current",
            },
            {
              name: "Riwayat Saldo",
              path: "/balance/history",
            },
          ],
        },
        {
          name: "Pesanan Online",
          path: "/online-order",
          icon: "/src/assets/images/icons/menu/online-order.svg",
          icon_active: "/src/assets/images/icons/menu/online-order-active.svg",
          children: [
            {
              name: "Pengaturan",
              path: "/online-order/setting",
            },
            {
              name: "Cetak QR",
              path: "/online-order/print",
            },
          ],
        },
        {
          name: "Produk",
          path: "/product",
          icon: "/src/assets/images/icons/menu/item.svg",
          icon_active: "/src/assets/images/icons/menu/item-active.svg",
          children: [
            {
              name: "Kategori Produk",
              path: "/product",
            },
            {
              name: "Kelola Produk",
              path: "/product",
            },
            {
              name: "Opsi Tambahan",
              path: "/product",
            },
            {
              name: "Tipe Pesanan",
              path: "/product/order-type/list",
            },
            {
              name: "Pajak & Layanan",
              path: "/product",
            },
            {
              name: "Diskon",
              path: "/product/discount/list",
            },
            {
              name: "Ulasan",
              path: "/product/reviews/list",
            },
            {
              name: "Penerimaan Stok",
              path: "/product",
            },
            {
              name: "Pengurangan Stok",
              path: "/product",
            },
          ],
        },
        {
          name: "Riwayat Transaksi",
          path: "/transaction",
          icon: "/src/assets/images/icons/menu/transaction.svg",
          icon_active: "/src/assets/images/icons/menu/transaction-active.svg",
          children: [
            {
              name: "Transaksi",
              path: "/transaction",
            },
            {
              name: "Transaksi Kasbon",
              path: "/transaction",
            },
          ],
        },
        {
          name: "Laporan",
          path: "/report",
          icon: "/src/assets/images/icons/menu/report.svg",
          icon_active: "/src/assets/images/icons/menu/report-active.svg",
          children: [],
        },
        {
          name: "Toko",
          path: "/outlet/list",
          icon: "/src/assets/images/icons/menu/outlet.svg",
          icon_active: "/src/assets/images/icons/menu/outlet-active.svg",
          children: [],
        },
        {
          name: "Karyawan",
          path: "/employee",
          icon: "/src/assets/images/icons/menu/employee.svg",
          icon_active: "/src/assets/images/icons/menu/employee-active.svg",
          children: [
            {
              name: "Daftar Karyawan",
              path: "/employee/list",
            },
            // {
            //   name: "Daftar Hak Akses",
            //   path: "/employee",
            // },
          ],
        },
        {
          name: "Pelanggan",
          path: "/customer/list",
          icon: "/src/assets/images/icons/menu/customer.svg",
          icon_active: "/src/assets/images/icons/menu/customer-active.svg",
          children: [],
        },
        {
          name: "Profil",
          path: "/profile",
          icon: "/src/assets/images/icons/menu/profile.svg",
          icon_active: "/src/assets/images/icons/menu/profile-active.svg",
          children: [],
        },
        {
          name: "Pengaturan",
          path: "/setting",
          icon: "/src/assets/images/icons/menu/setting.svg",
          icon_active: "/src/assets/images/icons/menu/setting-active.svg",
          children: [
            {
              name: "Banner",
              path: "/setting/banner/list",
            },
            {
              name: "Debit",
              path: "/setting/debit/list",
            },
            {
              name: "E-Wallet",
              path: "/setting/wallet/list",
            },

          ],
        },
      ] as Menu[]
    };
  },
});
