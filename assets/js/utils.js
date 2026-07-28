// Enum-like object, to make sure I won't have any typos when trying
// to access any of them.
const stringAccessors = {
  localTaskData: "taskData",
  sessionLastId: "lastId",
};

const createTaskObject = (id, title, completed, date = undefined) => {
  const currentDate = new Date();
  const timestampString = 
    date || 
    currentDate.getFullYear() + '/' + currentDate.getMonth()+1 + '/' + currentDate.getDate() + "  " + 
    currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
  return {
    id,
    title,
    completed: completed.toString(),
    timestamp: timestampString
  };
};

function stringIsEmpty(str) {
  return !str || str.length === 0;
}

const createFilterObject = (taskName, taskStatus) => {
  if (!taskName && !taskStatus) return undefined;
  return {
    taskName,
    taskStatus,
  };
};

const saveToLocalStorage = (key, data) => {
  try {
    if (!key || data === undefined || data === null) {
      throw new Error("No key or data provided");
    }

    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
};

const saveToSessionStorage = (key, data) => {
  try {
    if (!key || data === undefined) {
      throw new Error("No key or data provided");
    }

    sessionStorage.setItem(key, data);
  } catch (error) {
    console.error(error);
  }
};

const getDataFromLocalStorage = (key) => {
  try {
    if (!key) {
      throw new Error("No key provided");
    }
    const data = localStorage.getItem(key);
    if (!data) {
      return [];
    }

    const parsedData = JSON.parse(data);
    if (parsedData.length === 0) {
      return [];
    }
    return parsedData;
  } catch (error) {
    console.error(error.message);
  }
};

const getDataFromSessionStorage = (key) => {
  try {
    if (!key) {
      throw new Error("No key provided");
    }
    const data = sessionStorage.getItem(key);
    if (!data) {
      return undefined;
    }

    return data;
  } catch (error) {
    console.error(error.message);
  }
};

const getDataFetch = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
    return undefined;
  }
};

const toggleElementVisibility = (element) => {
  element.inert = !element.inert;
};

const closeModalSafely = (element, validation, form) => {
  toggleElementVisibility(element);
  validation.innerText = "";
  if (form) {
    form.reset();
  }
};

function checkForFilterURL() {
  const urlQuery = Object.fromEntries(
    new URLSearchParams(window.location.search),
  );

  if ("search-task" in urlQuery && "filter-by" in urlQuery) {
    return createFilterObject(
      urlQuery["search-task"].toLocaleLowerCase(),
      urlQuery["filter-by"].toLocaleLowerCase(),
    );
  }
  return undefined;
}

export {
  stringAccessors,
  stringIsEmpty,
  createTaskObject,
  createFilterObject,
  saveToLocalStorage,
  saveToSessionStorage,
  getDataFromLocalStorage,
  getDataFromSessionStorage,
  getDataFetch,
  toggleElementVisibility,
  closeModalSafely,
  checkForFilterURL,
};
