const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input"),
  progressArea = document.querySelector(".progress-area"),
  uploadedArea = document.getElementById("uploadedArea");

let uploadedFiles = new Map();

form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  let file = target.files[0];
  if (file) {
    let fileName = file.name;
    if (fileName.length >= 12) {
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(file, fileName);
  }
}

function createObjectURL(file) {
  if (window.URL) {
    return window.URL.createObjectURL(file);
  } else if (window.webkitURL) {
    return window.webkitURL.createObjectURL(file);
  } else {
    return null;
  }
}

function uploadFile(file, name) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/upload.php");
  xhr.upload.addEventListener("progress", ({ loaded, total }) => {
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize = (fileTotal < 1024) ? fileTotal + " KB" : (loaded / (1024 * 1024)).toFixed(2) + " MB";
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <div style="color:#45f3ff" class="name">${name} • Uploading</div>
                              <div style="color:#45f3ff" class="percent">${fileLoaded}%</div>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;

    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;

    if (loaded == total) {
      progressArea.innerHTML = "";
      let uploadedHTML = `<div class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <div style="color:#45f3ff" class="name">${name} • Uploaded</div>
                                <div style="color:#45f3ff" class="size">${fileSize}</div>
                              </div>
                              <i class="fas fa-times delete"></i>
                            </div>
                          </div>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);

      const objectURL = createObjectURL(file);
      if (objectURL) {
        uploadedFiles.set(name, objectURL);
        saveUploadedFilesToLocalStorage();
        displayUploadedFiles();
      }
    }
  });

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // File upload is complete, add to uploadedFiles map and display
        const objectURL = createObjectURL(file);
        if (objectURL) {
          uploadedFiles.set(name, objectURL);
          saveUploadedFilesToLocalStorage();
          displayUploadedFiles();
        }
      } else {
        console.error("Error uploading file:", xhr.status, xhr.statusText);
      }
    }
  };

  let data = new FormData();
  data.append("file", file);
  xhr.send(data);
}

function saveUploadedFilesToLocalStorage() {
  localStorage.setItem("uploadedFiles", JSON.stringify([...uploadedFiles]));
}

function loadUploadedFilesFromLocalStorage() {
  const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles"));
  if (storedFiles) {
    uploadedFiles = new Map(storedFiles);
  }
}

function displayUploadedFiles() {
  uploadedArea.innerHTML = "";
  uploadedFiles.forEach((objectURL, name) => {
    let fileSize = getFileSize(objectURL);
    let uploadedHTML = `<div class="row">
                          <div class="content upload">
                            <i class="fas fa-file-alt"></i>
                            <div class="details">
                              <div style="color:#45f3ff" class="name">${name} • Uploaded</div>
                              <div style="color:#45f3ff" class="size">${fileSize}</div>
                            </div>
                            <i class="fas fa-times delete"></i>
                          </div>
                        </div>`;
    uploadedArea.insertAdjacentHTML("beforeend", uploadedHTML);
  });
}

function getFileSize(objectURL) {
  const blob = fetch(objectURL).then((res) => res.blob());
  return new Promise((resolve) => {
    blob.then((file) => {
      const size = file.size;
      const fileSize = (size < 1024) ? size + " B" : (size / 1024).toFixed(2) + " KB";
      resolve(fileSize);
    });
  });
}

uploadedArea.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const listItem = e.target.closest(".row");
    const fileName = listItem.querySelector(".name").textContent.split(" • ")[0];
    const objectURL = uploadedFiles.get(fileName);
    uploadedFiles.delete(fileName);
    saveUploadedFilesToLocalStorage();
    URL.revokeObjectURL(objectURL);
    listItem.remove();
  } else if (e.target.classList.contains("name")) {
    const fileName = e.target.textContent.split(" • ")[0];
    const objectURL = uploadedFiles.get(fileName);
    if (objectURL) {
      window.open(objectURL, "_blank");
    }
  }
});

// Load previously uploaded files from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
  loadUploadedFilesFromLocalStorage();
  displayUploadedFiles();
});