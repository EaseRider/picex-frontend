import { useCallback, useEffect, useRef, useState } from "react";
import "./UploadField.scss";

const styles = {
  inputWrapper: "input-wrapper",
  inputCover: "input-cover",
  helpText: "help-text",
  fileName: "file-name",
  fileNameStretch: "file-name spacer",
  fileExt: "file-ext",
  fileDrag: "file-drag",
  input: "input",
  loader: "loader",
  disabled: "disabled",
  loading: "loading",
  loaderItem: "loader-item",
  spacer: "spacer",
  button: "button",
  hover: "hover",
  imagePreview: "image-preview",
  preview: "preview",
  previewItem: "preview-item",
  previews: "previews",
};

const getExtFromType = (type) => {
  const parts = type.split("/");
  return parts[parts.length - 1];
};
const getExtFromName = (name) => {
  const parts = name.split(".");
  return parts[parts.length - 1];
};

const Loader = () => {
  return (
    <div className={styles.loader}>
      <span className={styles.loaderItem} />
      <span className={styles.loaderItem} />
      <span className={styles.loaderItem} />
    </div>
  );
};

const FilePreview = ({ data, onRemove, uploading, onUpload }) => {
  const [src, setSrc] = useState(null);
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    if (!data) {
      return;
    }
    const reader = new FileReader();
    let typeVal;
    if (data.type.match("text")) {
      typeVal = "text";
    } else if (data.type.match("image")) {
      typeVal = "image";
    } else {
      typeVal = data.type;
    }
    setType(typeVal);

    reader.onload = (e) => {
      setSrc(e.target.result);
      setLoading(false);
    };

    if (typeVal === "text") {
      reader.readAsText(data);
    } else if (typeVal === "image") {
      reader.readAsDataURL(data);
    } else {
      setSrc(false);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => loadData(), [data]);

  const componentWillMount = () => {
    loadData();
  };
  const componentWillReceiveProps = (newProps) => {
    loadData(newProps.data);
  };

  const loadingMsg = loading ? "loading data..." : null;
  const uploadingMsg = uploading ? <Loader /> : null;

  let preview;
  if (!loading && !uploading) {
    if (type === "text") {
      preview = <pre className={styles.preview}>{src}</pre>;
    } else if (type === "image") {
      preview = <img alt="preview" src={src} className={styles.imagePreview} />;
    } else {
      preview = <pre className={styles.preview}>no preview</pre>;
    }
  } else {
    preview = null;
  }
  const classes = [styles.previewItem, uploading ? styles.disabled : ""]
    .join(" ")
    .trim();
  return (
    <div className={classes}>
      {uploading}
      {loadingMsg}
      {preview}
      <div className={styles.fileNameStretch}>{data.name}</div>
      <button className={styles.button} onClick={onRemove}>
        remove
      </button>
      <button className={styles.button} onClick={() => onUpload(data)}>
        upload
      </button>
    </div>
  );
};

const FilePreviews = ({ fileList, removeItem, uploadFile }) => {
  return fileList.map((file, index) => {
    return (
      <FilePreview
        key={index}
        data={file}
        onRemove={() => removeItem(index)}
        onUpload={uploadFile}
      />
    );
  });
};

export default function UploadField({
  maxSize,
  name,
  multiple,
  label,
  onUpload,
}) {
  const [fileList, setFileList] = useState([]);
  const [hoverState, setHoverState] = useState(null);
  const uploadInputRef = useRef(null);

  const handleDragOver = (e) => {
    if ("preventDefault" in e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (e.type === "dragover") {
      setHoverState(styles.hover);
    } else {
      setHoverState(null);
    }
  };
  const handleFileSelect = (e) => {
    handleDragOver(e);
    let files = e.target.files || e.dataTransfer.files;

    files = Object.values(files);
    let newFileList = fileList.filter(
      (f) => !files.some((e) => isSameFile(f, e))
    );
    newFileList.push(...files);
    setFileList(newFileList);
  };
  /**
   *
   * @param {File} a
   * @param {File} b
   */
  const isSameFile = (a, b) => {
    return (
      a.size === b.size &&
      a.lastModified === b.lastModified &&
      a.name === b.name
    );
  };

  const removeItem = useCallback(
    (index) => {
      fileList.splice(index, 1);
      setFileList([...fileList]);
    },
    [fileList]
  );
  const removeFile = (file) => {
    const index = fileList.indexOf(file);
    removeItem(index);
  };
  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const index = fileList.indexOf(file);
      console.log("uploadFile", index, file, fileList);
      fileList[index].loading = true;
      setFileList(fileList);

      if (typeof file === "file" || !("size" in file)) {
        return reject(new Error("No file size"));
      }
      onUpload(file).then((data) => {
        resolve(data);
      });
    }).then(() => removeFile(file));
  };

  const uploadFiles = () => {
    fileList.forEach((file) => {
      uploadFile(file).then(() => {
        removeFile(file);
      });
    });
  };
  const selectFile = (e) => {
    e.preventDefault();
    uploadInputRef.current.click(e);
  };

  const dragClasses = [styles.fileDrag, hoverState].join(" ").trim();
  let fileExt;
  if (fileList.length === 1) {
    if (fileList[0].type) {
      fileExt = `.${getExtFromType(fileList[0].type)}`;
    } else {
      fileExt = `.${getExtFromName(fileList[0].name)}`;
    }
  } else {
    fileExt = null;
  }

  let extTail;
  if (fileExt) {
    extTail = <span className={styles.fileExt}>{fileExt}</span>;
  } else {
    extTail = null;
  }

  let fileNames;
  if (fileList.length > 1) {
    fileNames = `${fileList.length} Files`;
  } else if (fileList.length === 1) {
    fileNames = fileList[0].name.replace(fileExt, "");
  } else {
    fileNames = "No file chosen";
  }

  return (
    <div>
      <input type="hidden" name={`${name}:maxSize`} value={maxSize} />
      <div>
        <label>
          <span>{label}</span>
          <div
            className={dragClasses}
            onDragOver={handleDragOver}
            onDragLeave={handleDragOver}
            onDrop={handleFileSelect}
          >
            <div className={styles.inputWrapper}>
              <input
                type="file"
                tabIndex="-1"
                ref={uploadInputRef}
                className={styles.input}
                name={name}
                multiple={multiple}
                onChange={handleFileSelect}
              />
              <div className={styles.inputCover}>
                <button
                  className={styles.button}
                  type="button"
                  onClick={selectFile}
                >
                  Choose Files
                </button>
                <span className={styles.fileName}>{fileNames}</span>
                {extTail}
              </div>
            </div>
            <span className={styles.helpText}>or drop files here</span>
          </div>
        </label>
        <button className={styles.button} type="button" onClick={uploadFiles}>
          Upload All
        </button>
        <div className={styles.previews}>
          <FilePreviews
            fileList={fileList}
            removeItem={removeItem}
            uploadFile={uploadFile}
          />
        </div>
      </div>
    </div>
  );
}
