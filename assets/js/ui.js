import {
  createTaskObject,
  stringIsEmpty,
  saveToLocalStorage,
  stringAccessors,
} from "./utils.js";
import { TASK_STATUS, taskTemplate } from "./templates.js";

const taskNamePredicate = (taskTitle, compareAgainst) => {
  return taskTitle.toLocaleLowerCase().includes(compareAgainst);
};

const taskStatusPredicate = (taskStatus, compareAgainst) => {
  return taskStatus.toLocaleLowerCase() === compareAgainst;
};

export function renderTasks(tasks, wrapperElement, filterObject) {
  let tasksToRender = tasks;
  wrapperElement.innerHTML = "";

  if (filterObject) {
    const { taskName, taskStatus } = filterObject;
    const hasNameFilter = !stringIsEmpty(taskName);
    const hasStatusFilter = !stringIsEmpty(taskStatus) && taskStatus !== "all";

    if (hasNameFilter || hasStatusFilter) {
      // To ensure if somebody types the wrong filter in the URL.
      const taskStatusExists = Object.values(TASK_STATUS).includes(taskStatus);
      
      // De morgan's law.
      tasksToRender = tasksToRender.filter((task) => {
        // if hasNameFilter isn't empty (true)
        // hasNameFilter here will be false and activate the predicate.
        const matchesName =
          !hasNameFilter || taskNamePredicate(task.title, taskName);
        if(!taskStatusExists) return matchesName;

        const matchesStatus =
          !hasStatusFilter || taskStatusPredicate(task.completed, taskStatus)
        return matchesName && matchesStatus;
      });
    }
  }

  for (const element of tasksToRender) {
    const newTask = createTaskObject(
      element.id,
      element.title,
      element.completed,
      element.timestamp
    );
    wrapperElement.insertAdjacentHTML("beforeend", taskTemplate(newTask));
  }
}

// This doesn't need to be a closure, but I want to flex. Hope it's okay.
export function loadingTextAnimation(currentTaskDataStatus) {
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

export function updateFilterFormData(filterForm, filterData) {
  if (filterData) {
    try {
      const statusFilter = filterForm.querySelector(
        `option[value=${filterData.taskStatus}]`,
      );
      statusFilter.selected = true;
    } catch {
      console.log("The filter doesn't exist!");
    }

    const textFilter = filterForm.querySelector("#search");
    textFilter.value = filterData.taskName;
  }
}

export function updateTaskStatus(element, status, tasksData) {
  if (!element) return;
  const taskId = element.dataset.id;
  const taskIndex = tasksData.findIndex((element) => element.id == taskId);
  if (taskIndex === -1) console.error("Something went wrong!");
  tasksData[taskIndex].completed = status;
  saveToLocalStorage(stringAccessors.localTaskData, tasksData);
}
