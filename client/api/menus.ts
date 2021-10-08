import axios from "axios";

export function getMenus(categoryId: number) {
  return axios.get(`/menus?category.id=${categoryId}`);
}
