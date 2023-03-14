import { ChangeEvent, useState } from "react";

export function useSelectFile() {
  const [selectedFile, setSelectedFile] = useState<string>();

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    // console.log(event.target.files);
    /*
    FileList {0: File, length: 1}
    0: File
    lastModified: 1672657779958
    lastModifiedDate: Mon Jan 02 2023 20:09:39 GMT+0900 () {}
    name: "2023-01-02 20.09.34.png"
    size: 24757
    type: "image/png"
    webkitRelativePath: ""
    [[Prototype]]: File
    length: 1 */

    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    }
  }

  return {
    selectedFile, setSelectedFile, selectFile
  }
}