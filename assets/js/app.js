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
} from "./utils.js";
import { validateTaskName } from "./validation.js";

// Enum-like object, to make sure I won't have any typos when trying
// to access any of them.
const stringAccessors = {
  localTaskData: "taskData",
  sessionLastId: "lastId",
};

// This doesn't need to be a closure, but I want to flex. Hope it's okay.
function loadingTextAnimation(currentTaskDataStatus) {
  // Since it's a closure, these are essentially private variables!
  let dots = "";
  let loadingText = "Loading";

  function closureFunction() {
    dots += ".";
    if (dots.length > 3) {
      dots = "";
    }
    currentTaskDataStatus.innerText = loadingText + dots;
  }

  return closureFunction;
}

async function getTasks(dataWrapperElement) {
  const dataLocalStorage = getDataFromLocalStorage(
    stringAccessors.localTaskData,
  );
  if (dataLocalStorage.length > 0) {
    tasksCache = dataLocalStorage;
  } else {
    const dataFetch = await getDataFetch(
      "https://jsonplaceholder.typicode.com/todos?_limit=5",
    );
    if (dataFetch.length <= 0) console.error("Something went wrong!");
    tasksCache = dataFetch.map((element) =>
      createTaskObject(element.id, element.title, element.completed),
    );
    saveToLocalStorage(stringAccessors.localTaskData, tasksCache);
  }

  const lastTask = tasksCache.at(-1);
  saveToSessionStorage(stringAccessors.sessionLastId, lastTask.id);

  for (const element of tasksCache) {
    const newTask = createTaskObject(
      element.id,
      element.title,
      element.completed,
    );
    dataWrapperElement.insertAdjacentHTML("beforeend", taskTemplate(newTask));
  }
}

// I would have these tasks be UUID's to not have to have this,
// but since the API uses a numeric Id, I'll just roll with it.
function setAndReturnNextIdToSessionStorage() {
  let lastTaskId = getDataFromSessionStorage(stringAccessors.sessionLastId);
  lastTaskId++;
  saveToSessionStorage(stringAccessors.sessionLastId, lastTaskId);
  return lastTaskId;
}

function changeTaskStatus(element, status) {
  if (!element) return;
  const taskId = element.dataset.id;
  const taskIndex = tasksCache.findIndex((element) => element.id == taskId);
  if (taskIndex === -1) console.error("Something went wrong!");
  tasksCache[taskIndex].completed = status;
  saveToLocalStorage(stringAccessors.localTaskData, tasksCache);
}

let tasksCache = [];

document.addEventListener("DOMContentLoaded", async (e) => {
  const mainElement = document.querySelector("main");
  const newTaskButton = mainElement.querySelector("#new-task-button");
  const modalElement = mainElement.querySelector("#new-task-modal");
  const tasksWrapperElement = mainElement.querySelector(".tasks-wrapper");
  const currentTaskDataStatus = mainElement.querySelector(
    ".current-data-status",
  );

  const newTaskForm = modalElement.querySelector(".new-task-form");
  const taskTitleInput = modalElement.querySelector("#task-title");
  const closeButton = modalElement.querySelector(".close-button");

  const taskNameValidation = newTaskForm.querySelector(".input-validation");

  const animationLoop = loadingTextAnimation(currentTaskDataStatus);
  const intervalId = setInterval(animationLoop, 200);

  setTimeout(async () => {
    clearInterval(intervalId);
    toggleElementVisibility(currentTaskDataStatus);
    await getTasks(tasksWrapperElement);
    //currentTaskDataStatus.innerText = "No tasks yet...";
  }, 2000);

  newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);

    if (validateTaskName(formProps.title)) {
      closeModalSafely(modalElement, taskNameValidation, newTaskForm);

      let lastTaskId = setAndReturnNextIdToSessionStorage();

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
        changeTaskStatus(taskElement, TASK_STATUS.notCompleted);
        element.classList.remove("status-completed");
        element.classList.add("status-not-completed");
        return;
      }
      changeTaskStatus(taskElement, TASK_STATUS.completed);
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
        newTaskForm.requestSubmit();
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
