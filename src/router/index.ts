import { getModule } from 'vuex-module-decorators';
import { createRouter, createWebHistory } from 'vue-router';
import LoginModule from '@/store/modules/LoginModule';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'Beranda',
      redirect: '/dashboard',
      component: () => import('@/layouts/Home.vue'),
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/outlet',
          name: 'Toko',
          redirect: '/outlet/list',
          children: [
            {
              path: '/outlet/list',
              name: 'Daftar Toko',
              component: () => import('@/views/outlet/list/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/outlet/add',
              name: 'Tambah Toko',
              component: () => import('@/views/outlet/add/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/outlet/update/:uuid',
              name: 'Edit Toko',
              component: () => import('@/views/outlet/update/index.vue'),
              meta: {
                requireAuth: true
              }
            },
          ]
        },
        {
          path: '/balance',
          redirect: '/balance/current',
          name: 'Saldo',
          children: [
            {
              path: '/balance/current',
              name: 'Saldo Saat Ini',
              component: () => import('@/views/balance/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/balance/history',
              name: 'Riwayat Saldo',
              component: () => import('@/views/balance/history/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/balance/add',
              name: 'Cairkan Saldo',
              component: () => import('@/views/balance/create/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/balance/detail/:id',
              name: 'Detail Pencairan',
              component: () => import('@/views/balance/detail/index.vue'),
              meta: {
                requireAuth: true
              }
            },
          ]
        },
        {
          path: '/product',
          name: 'produk',
          redirect: '/product/order-type/list',
          children: [
            {
              path: '/product/order-type/list',
              name: 'Daftar Tipe Pesanan',
              component: () => import('@/views/products/order-type/list/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/product/order-type/add',
              name: 'Tambah Tipe Pesanan',
              component: () => import('@/views/products/order-type/add/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/product/order-type/update/:uuid',
              name: 'Edit Tipe Pesanan',
              component: () => import('@/views/products/order-type/update/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/product/reviews/list',
              name: 'list-review',
              component: () => import('@/views/products/review/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/product/discount/list',
              name: 'list-diskon',
              component: () => import('@/views/products/discount/list/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/product/discount/add',
              name: 'add-diskon',
              component: () => import('@/views/products/discount/add/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/product/discount/update/:uuid',
              name: 'update-diskon',
              component: () => import('@/views/products/discount/update/index.vue'),
              meta: {
                requireAuth: true
              }
            },
          ]
        },
        {
          path: '/employee',
          name: 'Karyawan',
          redirect: '/employee/list',
          children: [
            {
              path: '/employee/list',
              name: 'Daftar Karyawan',
              component: () => import('@/views/employees/list/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/employee/add',
              name: 'Tambah Karyawan',
              component: () => import('@/views/employees/add/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/employee/update/:uuid',
              name: 'Edit Karyawan',
              component: () => import('@/views/employees/update/index.vue'),
              meta: {
                requireAuth: true
              }
            },
          ]
        },
        {
          path: '/customer',
          name: 'Pelanggan',
          redirect: '/customer/list',
          children: [
            {
              path: '/customer/list',
              name: 'Daftar Pelanggan',
              component: () => import('@/views/customer/list/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/customer/add',
              name: 'Tambah Pelanggan',
              component: () => import('@/views/customer/add/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/customer/update/:uuid',
              name: 'Edit Pelanggan',
              component: () => import('@/views/customer/update/index.vue'),
              meta: {
                requireAuth: true
              }
            },
          ]
        },
        {
          path: '/setting',
          name: 'Pengaturan',
          redirect: '/setting/banner/list',
          children: [
            {
              path: '/setting/banner/list',
              name: 'Daftar Banner',
              component: () => import('@/views/settings/banners/list/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/setting/banner/add',
              name: 'Tambah Banner',
              component: () => import('@/views/settings/banners/add/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/setting/banner/update/:uuid',
              name: 'Edit Banner',
              component: () => import('@/views/settings/banners/update/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/setting/debit/list',
              name: 'Daftar Akun Debit',
              component: () => import('@/views/settings/debit/list/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/setting/debit/add',
              name: 'Tambah Akun Debit',
              component: () => import('@/views/settings/debit/add/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/setting/debit/update/:uuid',
              name: 'Edit Akun Debit',
              component: () => import('@/views/settings/debit/update/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/setting/wallet/list',
              name: 'Daftar Akun E-wallet',
              component: () => import('@/views/settings/wallet/list/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/setting/wallet/add',
              name: 'Tambah akun E-wallet',
              component: () => import('@/views/settings/wallet/add/index.vue'),
              meta: {
                requireAuth: true
              }
            },
            {
              path: '/setting/wallet/update/:uuid',
              name: 'Edit Akun wallet',
              component: () => import('@/views/settings/wallet/update/index.vue'),
              meta: {
                requireAuth: true
              }
            },
          ]
        }
      ]
    },
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Unauthenticated',
      component: () => import('@/layouts/Full.vue'),
      children: [
        {
          path: '/login',
          name: 'Login',
          component: () => import('@/views/login/index.vue'),
          meta: {
            guest: true
          }
        },
        {
          path: '/login/enter-pin',
          name: 'Masukkan PIN',
          component: () => import('@/views/login/enter-pin/index.vue'),
          meta: {
            guest: true
          }
        },
        {
          path: '/registration',
          name: 'Registrasi',
          component: () => import('@/views/registration/index.vue'),
          meta: {
            guest: true
          }
        },
        {
          path: '/registration/step',
          name: 'Alur Registrasi',
          component: () => import('@/views/registration/step/index.vue'),
          meta: {
            guest: true
          }
        },
        {
          path: '/registration/outlet',
          name: 'Registrasi Outlet',
          component: () => import('@/views/registration/form/index.vue'),
          meta: {
            guest: true
          }
        },

      ]
    },
  ]
});

const auth = getModule(LoginModule);

router.beforeEach((to, from) => {
  if (to.path == '/login' && auth.isLoggedIn) {
    return {
      path:
        to.query.redirect == undefined || to.query.redirect == null
          ? '/'
          : to.query.redirect,
    };
  }

  if (to.path == '/registration' && auth.isLoggedIn) {
    return { path: '/' };
  }

  if (!to.meta.requireAuth && auth.isLoggedIn) {
    // this route is for guest only, check if not logged in
    // if not, redirect to dashboard or home page.
    return {
      path: '/',
    };
  }

  if (to.meta.requireAuth && !auth.isLoggedIn) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: '/login',
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    };
  }

  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

export default router;
