import { ref } from "vue";

import image1 from "./images/kelly-sikkema-RebHa8QJBok-unsplash.jpg";
import image2 from "./images/kelly-sikkema-W1YXmzDp6Lc-unsplash.jpg";
import image3 from "./images/kelly-sikkema-YXWoEn5uOvg-unsplash.jpg";
import image4 from "./images/kelly-sikkema-ZjWJdVTGYJA-unsplash.jpg";

const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis finibus, quam in porttitor ullamcorper, felis arcu consectetur sapien, non fringilla dolor lacus in mi. In lobortis non eros sit amet posuere.";

export const slides = ref([
  {
    image: image1,
    text: "This is slide 1",
    height: "100vh"
  },
  {
    image: image2,
    text: "2. " + text,
    height: "250vh"
  },
  {
    image: image3,
    text: "This is slide 3",
    height: "500vh"
  },
  {
    image: image4,
    text: "This is slide 4",
    height: "100vh"
  }
]);