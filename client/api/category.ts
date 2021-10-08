import axios from "axios";

export function getCategories(restaurantId: number) {
  return axios.get(`/restaurant-categories?restaurant.id=${restaurantId}`);
}
