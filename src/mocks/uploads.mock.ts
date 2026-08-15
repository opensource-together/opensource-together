const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

interface StoredUpload {
  bytes: Uint8Array;
  contentType: string;
}

type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string; status: number };

const uploads = new Map<string, StoredUpload>();

export async function storeMockImage(request: Request): Promise<UploadResult> {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return {
      success: false,
      error: "Invalid multipart form data",
      status: 400,
    };
  }

  const file = formData.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return { success: false, error: "An image file is required", status: 400 };
  }
  if (!file.type.startsWith("image/")) {
    return {
      success: false,
      error: "Only image files are supported",
      status: 400,
    };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      success: false,
      error: "Image must be 5MB or smaller",
      status: 413,
    };
  }

  const id = crypto.randomUUID();
  uploads.set(id, {
    bytes: new Uint8Array(await file.arrayBuffer()),
    contentType: file.type,
  });

  return {
    success: true,
    url: `${new URL(request.url).origin}/mock-uploads/${id}`,
  };
}

export const findMockUpload = (id: string) => uploads.get(id);

export const resetMockUploads = () => uploads.clear();
