import { useState } from "react";

import { uploadForm } from "../api/bookingApi";

export default function UploadForm({ bookingId }) {
  const [file, setFile] = useState(null);

  const submit = async () => {
    const formData = new FormData();

    formData.append("file", file);

    await uploadForm(bookingId, formData);

    alert("Uploaded");
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button className="btn btn-primary" onClick={submit}>
        Upload
      </button>
    </div>
  );
}
