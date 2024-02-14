import { ref } from "vue";

import image1 from "./images/kelly-sikkema-RebHa8QJBok-unsplash.jpg";
import image2 from "./images/kelly-sikkema-W1YXmzDp6Lc-unsplash.jpg";
import image3 from "./images/kelly-sikkema-YXWoEn5uOvg-unsplash.jpg";
import image4 from "./images/kelly-sikkema-ZjWJdVTGYJA-unsplash.jpg";

const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis finibus, quam in porttitor ullamcorper, felis arcu consectetur sapien, non fringilla dolor lacus in mi. In lobortis non eros sit amet posuere.";

export const slides = ref([
  {
    image: image1,
    text: text
  },
  {
    image: image2,
    text: text
  },
  {
    image: image3,
    text: text
  },
  {
    image: image4,
    text: text
  }
]);