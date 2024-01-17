# Makasi POS Web Dashboard
Makasi POS adalah aplikasi yang digunakan oleh berbagai macam usaha ritel maupun non ritel untuk memudahkan transaksi jual beli dan proses operasional usaha.

## UI Design :art:
https://www.figma.com/file/Wn7uT3TbKigzpEHvE0DrD2/Makasi-POS?node-id=6434%3A11797&t=rMOPkt5bqTrny1PI-1

## Postman API Documentation
https://documenter.getpostman.com/view/21049589/VUjMp69Q

## Build Setup
``` bash
# install dependencies
$ npm install  

# serve with hot reload
$ npm run dev  

# build for production and launch server
$ npm run build
```

## Libraries :books:

| Purpose | Plugin |
| ------ | ------ |
| Build Tool | [Vite](https://vitejs.dev/guide/) |
| UI framework | [Element Plus](https://element-plus.org/en-US/) |
| CSS framework | [Bootstrap](https://getbootstrap.com/) |
| State management | [Vuex](https://vuex.vuejs.org/) |
| Router | [Vue Router](https://router.vuejs.org/introduction.html) |
| Make http requests | [Axios](https://axios.nuxtjs.org/) |
| Form validation | [VeeValidate](https://vee-validate.logaretm.com/v4/) |
| Manipulate and display dates and times | [Moment.js](https://momentjs.com/) |
| Drag and drop zones for file | [vue3-dropzone](https://github.com/Yaxian/vue3-dropzone) |

## Global Components
### Title Component
The atoms component for title and subtitle text

Attributes: 
| Props | Type | Require | Accepted Values | Default |
| ------ | ------ |  ------ | ------ | ------ |
| title | string | true | Any string | - |
| subtitle | string | false | Any string | - |

Example:
```
<mks-title
 title="Daftar Karyawan"
 subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit."
></mks-title>
```

### Badge Component

The atoms component for badge, labels, or chips  

Attributes:
| Props | Type | Require | Accepted Values | Default |
| ------ | ------ | ------ | ------ | ------ |
| color | string | true | primary / secondary / success / danger / warning / info / light | - |

Example:
```
<mks-badge  color="primary">Aktif</mks-badge>
```

### Button Component

The moleculs component for buttons  

Attributes:
| Props | Type | Require | Accepted Values | Default |
| ------ | ------ | ------ | ------ | ------ |
| color | string | false | primary / secondary / success / danger / warning / info / light | primary |
| size | string | false | sm / lg | - |
| loading | boolean | false | true / false | false |
| disable | boolean | false | true / false | false |

Example:
```
<mks-button  type="submit"  color="primary">
 Submit
</mks-button>

<mks-button  type="submit"  color="success"  size="lg">
 <div  class="d-flex flex-row align-items-center">
  <span  class="me-2">Tambah</span><img  src="@/assets/images/icons/plus.svg" alt="icon">
 </div>
</mks-button>
```


# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.  

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:


1. Disable the built-in TypeScript Extension

1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette

2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`

2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
