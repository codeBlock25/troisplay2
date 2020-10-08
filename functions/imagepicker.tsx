import { ChangeEvent, useState } from "react";
import { Button } from "@material-ui/core";
import { Image } from "@material-ui/icons";

export default function ImagePicker(): JSX.Element {
  const [image, setimage] = useState<string | ArrayBuffer | null>("");
  return (
    <section className="image_picker">
      <div
        className="image_picker_view"
        style={{ backgroundImage: `url(${image})` }}
      >
        {image !== "" ? <></> : <Image />}
      </div>
      <input
        type="file"
        id="profile_pic"
        accept=".png, .jpg, .jpeg"
        className="image_picker_input"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files.length <= 0) return;
          let file: File | Blob = e.target.files
            ? e.target.files[0]
            : new Blob([""]);
          let reader: FileReader = new FileReader();
          reader.onloadend = function (): void {
            setimage(reader.result);
          };
          reader.readAsDataURL(file);
        }}
      />
      <Button className="image_picker_btn">
        <label htmlFor="profile_pic" className="image_picker_label">
          set profile picture
        </label>
      </Button>
    </section>
  );
}
