import { taskTemplate } from "./templates.js";
import {
  createTaskObject,
  saveToLocalStorage,
  getDataFromLocalStorage,
  getDataFetch,
  toggleElementVisibility,
  closeModalSafely,
} from "./utils.js";
import { validateTaskName } from "./validation.js";

document.addEventListener("DOMContentLoaded", async (e) => {
  const mainElement = document.querySelector("main");
  const newTaskButton = mainElement.querySelector("#new-task-button");
  const modalElement = mainElement.querySelector("#new-task-modal");
  const tasksWrapperElement = mainElement.querySelector(".tasks-wrapper");
  const noTasksParagraph = mainElement.querySelector(".no-tasks");

  const newTaskForm = modalElement.querySelector(".new-task-form");
  const closeButton = modalElement.querySelector(".close-button");

  const taskNameValidation = newTaskForm.querySelector(".input-validation");

  newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);

    if (validateTaskName(formProps.title)) {
      closeModalSafely(modalElement, taskNameValidation, newTaskForm);

      const newTask = taskTemplate({
        id: 2,
        title: formProps.title,
        completed: formProps.status,
      });

      if (!noTasksParagraph.hasAttribute("inert")) {
        toggleElementVisibility(noTasksParagraph);
      }
      tasksWrapperElement.insertAdjacentHTML("beforeend", newTask);
      return;
    }
    taskNameValidation.innerText = "Task name is empty!";
  });

  newTaskForm.addEventListener("click", (e) => {
    e.stopPropagation();
    const element = e.target;

    if (element.classList.contains("close-button")) {
      closeModalSafely(modalElement, taskNameValidation, newTaskForm);
    }
  });

  newTaskButton.addEventListener("click", () => {
    toggleElementVisibility(modalElement);
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

  document.addEventListener("keydown", (e) => {
    if (!modalElement.hasAttribute("inert") && e.key === "Escape") {
      closeModalSafely(modalElement, taskNameValidation, newTaskForm);
    }
  });

  tasksWrapperElement.addEventListener("click", (e) => {
    const element = e.target;

    if (element.classList.contains("delete-button")) {
      const task = element.closest(".task");
      task.remove();

      const tasks = tasksWrapperElement.children;
      console.log(tasks);
      if (tasks.length <= 0) {
        toggleElementVisibility(noTasksParagraph);
      }
    }
  });
});
