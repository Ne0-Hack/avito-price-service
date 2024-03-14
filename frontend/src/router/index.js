import {createRouter, createWebHistory} from "vue-router";

const routes = [
  {path: "/", name: "login", component: () => import("@/templates/LoginTemplate.vue")},
  {path: "/dash", component: () => import("@/templates/DasboardTemplate.vue"), children: [
      {path: '', name: "dashboard", component: () => import("@/templates/OverviewTemplate.vue")},
      {path: "storage", name: "storage", component: () => import("@/templates/StorageTemplate.vue")},
      {path: "matrix", name: "matrix", component: () => import("@/templates/MatrixListTemplate.vue")},
      {path: "matrix/:matrix_id", name: "matrix_item", component: () => import("@/templates/MatrixItemTemplate.vue")},
      {path: "matrix/new/:matrix_id", name: "matrix_new", component: () => import("@/templates/MatrixNewTemplate.vue")},
  ]},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router