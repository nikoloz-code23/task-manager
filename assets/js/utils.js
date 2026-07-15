const createTaskObject = (id, title, status) => {
  return {
    id,
    title,
    status,
  };
};

const saveToLocalStorage = (key, data) => {
  try {
    if (!key || !data) {
      throw new Error("No key or data provided");
    }

    localStorage.setItem(key, JSON.stringify(data));
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

export {
  createTaskObject,
  saveToLocalStorage,
  getDataFromLocalStorage,
  getDataFetch,
  toggleElementVisibility,
  closeModalSafely,
};
