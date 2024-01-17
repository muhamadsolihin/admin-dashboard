<template>
  <el-scrollbar class="pe-2">
    <div class="d-flex flex-column align-items-center main-logo">
      <img class="logo" src="@/assets/images/logo.png" alt="logo" />
    </div>
    <div class="d-flex flex-column justify-content-start">
      <ul class="menu">
        <li
          v-for="(mn, indexMn) in menu"
          :key="indexMn"
          @click="menuClicked(mn.name, indexMn)"
        >
          <router-link :to="mn.path" v-slot="{ href, navigate, isActive, isExactActive }">
            <div
              class="d-flex flex-row"
              :class="
                (isActive && isExactActive) || openedMenu == indexMn
                  ? 'active-list'
                  : 'inactive-list'
              "
            >
              <img
                class="me-3"
                :src="
                  (isActive && isExactActive) || openedMenu == indexMn
                    ? mn.icon_active
                    : mn.icon
                "
                alt="icon"
              />
              <a
                :href="href"
                :class="{ active: (isActive && isExactActive) || openedMenu == indexMn }"
                @click="navigate"
                >{{ mn.name }}</a
              >
              <div class="ms-auto" v-if="mn.children.length > 0">
                <img
                  src="@/assets/images/icons/chevron-down.svg"
                  style="width: 6px"
                  v-if="openedMenu != indexMn"
                />
                <img
                  src="@/assets/images/icons/chevron-up.svg"
                  style="width: 6px"
                  v-else
                />
              </div>
            </div>
          </router-link>

          <el-collapse-transition>
            <div
              class="child-menu my-2"
              v-if="mn.children.length != 0 && openedMenu == indexMn"
            >
              <ul>
                <li
                  v-for="(ch, indexCh) in mn.children"
                  :key="indexCh"
                  @click="childClicked(ch.path)"
                >
                  <router-link
                    :to="ch.path"
                    v-slot="{ href, navigate, isActive, isExactActive }"
                  >
                    <a
                      :href="href"
                      :class="{ active: isActive && isExactActive }"
                      @click="navigate"
                      >{{ ch.name }}</a
                    >
                  </router-link>
                </li>
              </ul>
            </div>
          </el-collapse-transition>
        </li>
      </ul>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMenuStore } from "@/stores/menu";

const openedMenu = ref<number>(0);

const menuStore = useMenuStore();
const menu = menuStore.menu;
const route = useRoute();

const emit = defineEmits(["setTitle", "childClicked"]);

const searchTitle = () => {
  menu.forEach((mn, indexMn) => {
    if (mn.path == route.path) {
      openedMenu.value = indexMn;
      emit("setTitle", mn.name);
    }
    if (mn.children.length > 0) {
      mn.children.forEach((ch) => {
        if (ch.path == route.path) {
          openedMenu.value = indexMn;
          emit("setTitle", mn.name);
        }
      });
    }
  });
};

const menuClicked = (name: string, index: number) => {
  changeTitle(name);
  showChild(index);
};
const router = useRouter();
const childClicked = (routePath: string) => {
  router.push(routePath);
  emit("childClicked", true);
};

const showChild = (val: number) => {
  openedMenu.value = val;
};

const changeTitle = (val: string) => {
  emit("setTitle", val);
};

onMounted(() => {
  searchTitle();
});
</script>

<style lang="scss" scoped>
.main-logo {
  background-color: white;
  .logo {
    width: 90px;
    height: 90px;
    margin: 50px 0;
  }
}

.menu {
  list-style: none;
  padding: 0;
  li {
    a {
      text-decoration: none;
      color: #878d9f;
      font-size: 14px;
      font-weight: 500;
    }
    .active {
      color: #000;
    }
  }
  .inactive-list {
    padding: 10px 15px;
  }
  .active-list {
    padding: 10px 15px;
    background: #fff3f4;
    border-radius: 10px;
  }
  .child-menu {
    border-left: 1px solid #e60023;
    padding-left: 22px;
    margin-left: 22px;
    ul {
      list-style: none;
      padding: 0;
      li {
        padding: 3px 10px;
        a {
          color: #878d9f;
          font-size: 12px;
          font-weight: 500;
        }
        .active {
          color: #e60023;
        }
      }
    }
  }
}
</style>
