import { taskTemplate, TASK_STATUS } from "./templates.js";
import {
  createTaskObject,
  saveToLocalStorage,
  getDataFromLocalStorage,
  saveToSessionStorage,
  getDataFromSessionStorage,
  getDataFetch,
  toggleElementVisibility,
  closeModalSafely,
  createFilterObject,
  checkForFilterURL,
  stringAccessors,
} from "./utils.js";
import {
  renderTasks,
  loadingTextAnimation,
  updateFilterFormData,
  updateTaskStatus,
} from "./ui.js";
import { validateTaskName } from "./validation.js";

async function getTasks() {
  const dataLocalStorage =
    getDataFromLocalStorage(stringAccessors.localTaskData) || [];
  let data = dataLocalStorage;

  if (dataLocalStorage.length === 0) {
    try {
      const dataFetch = await getDataFetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=5",
      );
      if (dataFetch.length == 0)
        throw new Error("Could not get data from the server.");

      data = dataFetch.map((element) =>
        createTaskObject(element.id, element.title, element.completed),
      );
      saveToLocalStorage(stringAccessors.localTaskData, data);
    } catch (error) {
      console.error("Failed to fetch or process tasks", error);
      return [];
    }
  }
  return data;
}

function setLastId() {
  const lastTask = tasksCache.at(-1);
  saveToSessionStorage(stringAccessors.sessionLastId, lastTask.id ? lastTask.id : 0);
}

// I would have these tasks be UUID's to not have to have this,
// but since the API uses a numeric Id, I'll just roll with it.
function saveNextId() {
  let lastTaskId = getDataFromSessionStorage(stringAccessors.sessionLastId);
  lastTaskId++;
  saveToSessionStorage(stringAccessors.sessionLastId, lastTaskId);
  return lastTaskId;
}

let tasksCache = [];
let filterData = undefined;

document.addEventListener("DOMContentLoaded", async (e) => {
  const mainElement = document.querySelector("main");
  const newTaskButton = mainElement.querySelector("#new-task-button");
  const modalElement = mainElement.querySelector("#new-task-modal");
  const tasksWrapperElement = mainElement.querySelector(".tasks-wrapper");
  const currentTaskDataStatus = mainElement.querySelector(
    ".current-data-status",
  );
  const filterForm = mainElement.querySelector(".filter-wrapper");

  const newTaskForm = modalElement.querySelector(".new-task-form");
  const taskTitleInput = modalElement.querySelector("#task-title");
  const closeButton = modalElement.querySelector(".close-button");

  const taskNameValidation = newTaskForm.querySelector(".input-validation");

  const animationLoop = loadingTextAnimation(currentTaskDataStatus);
  const intervalId = setInterval(animationLoop, 200);

  setTimeout(async () => {
    clearInterval(intervalId);
    toggleElementVisibility(currentTaskDataStatus);
    tasksCache = await getTasks();
    filterData = checkForFilterURL();
    setLastId();

    updateFilterFormData(filterForm, filterData);

    renderTasks(tasksCache, tasksWrapperElement, filterData);
    //currentTaskDataStatus.innerText = "No tasks yet...";
  }, 2000);

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(filterForm);
    const formProps = Object.fromEntries(formData);
    const querySelector = new URLSearchParams(formData).toString();

    const newUrl = `${window.location.pathname}?${querySelector}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    filterData = createFilterObject(
      formProps["search-task"].toLocaleLowerCase(),
      formProps["filter-by"].toLocaleLowerCase(),
    );
    renderTasks(tasksCache, tasksWrapperElement, filterData);
  });

  newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if (validateTaskName(formProps.title)) {
      closeModalSafely(modalElement, taskNameValidation, newTaskForm);

      let lastTaskId = saveNextId();

      const newTask = createTaskObject(
        lastTaskId,
        formProps.title,
        formProps.completed,
      );

      tasksCache = [...tasksCache, newTask];
      saveToLocalStorage(stringAccessors.localTaskData, tasksCache);

      if (!currentTaskDataStatus.hasAttribute("inert")) {
        toggleElementVisibility(currentTaskDataStatus);
      }
      tasksWrapperElement.insertAdjacentHTML(
        "beforeend",
        taskTemplate(newTask),
      );
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
    taskTitleInput.focus();
  });

  document.addEventListener("change", (e) => {
    const element = e.target;

    if (element.classList.contains("status-select")) {
      const taskElement = element.closest(".task");

      if (element.value === TASK_STATUS.notCompleted) {
        updateTaskStatus(taskElement, TASK_STATUS.notCompleted, tasksCache);
        element.classList.remove("status-completed");
        element.classList.add("status-not-completed");
        return;
      }
      updateTaskStatus(taskElement, TASK_STATUS.completed, tasksCache);
      element.classList.remove("status-not-completed");
      element.classList.add("status-completed");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (modalElement.hasAttribute("inert")) return;
    switch (e.key) {
      case "Escape":
        closeModalSafely(modalElement, taskNameValidation, newTaskForm);
        break;
      case "Enter":
        e.preventDefault();
        const activeForm = e.target.closest("form");
        if (activeForm) {
          activeForm.requestSubmit();
        }
        break;
    }
  });

  tasksWrapperElement.addEventListener("click", (e) => {
    const element = e.target;

    if (element.classList.contains("delete-button")) {
      const task = element.closest(".task");
      const taskId = task.dataset.id;
      if (taskId === undefined) console.error("Something went wrong!");
      task.remove();

      // This is one way to do it.
      //tasksCache = tasksCache.filter((element) => element.id != taskId);

      // But this saves CPU cycles, as it stops at the index I need.
      const taskIndex = tasksCache.findIndex((element) => element.id == taskId);
      if (taskIndex !== -1) {
        tasksCache.splice(taskIndex, 1);
      }
      saveToLocalStorage(stringAccessors.localTaskData, tasksCache);

      const tasks = tasksWrapperElement.children;
      if (tasks.length <= 0) {
        saveToSessionStorage(stringAccessors.sessionLastId, 0);

        toggleElementVisibility(currentTaskDataStatus);
        currentTaskDataStatus.innerText = "No tasks yet...";
      }
    }
  });
});
