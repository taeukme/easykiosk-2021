import axios from "axios";

export function getRestaurant(id: number) {
  return axios.get(`/restaurant-categories/${id}`);
}
