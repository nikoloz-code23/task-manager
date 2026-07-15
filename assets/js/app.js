import { taskTemplate } from "./templates.js";
import {
  createTaskObject,
  saveToLocalStorage,
  getDataFromLocalStorage,
  getDataFetch,
} from "./utils.js";

document.addEventListener("DOMContentLoaded", async (e) => {
  const mainElement = document.querySelector("main");
  const newTaskButton = mainElement.querySelector("#new-task-button");
  const modalElement = mainElement.querySelector("#new-task-modal");
  const tasksWrapperElement = mainElement.querySelector(".tasks-wrapper");

  newTaskButton.addEventListener("click", () => {
    modalElement.classList.toggle("modal-not-visible");
    modalElement.classList.toggle("modal-visible");

    /*
    tasksWrapperElement.insertAdjacentHTML(
      "beforeend",
      taskTemplate({
        id: 2,
        title: "hey",
        completed: false,
      }),
    );
    */
  });

  document.addEventListener("change", (e) => {
    const element = e.target;

    if (element.classList.contains("status-select")) {
      if (element.value === "not-completed") {
        element.classList.remove("status-completed");
        element.classList.add("status-not-completed");
        return;
      }
      element.classList.remove("status-not-completed");
      element.classList.add("status-completed");
    }
  });
});
