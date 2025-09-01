import { injectable } from "inversify"
import { v2 as cloudinary } from "cloudinary"
import type { UploadApiResponse } from "cloudinary"
import type { IFileUploadService, UploadKind, UploadOptions, UploadUserRole } from "../../application/interfaces/services/IFileUploadService.ts"

function ensureCloudinaryConfigured() {
  if (
    !cloudinary.config().cloud_name ||
    !cloudinary.config().api_key ||
    !cloudinary.config().api_secret
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }
}

function toSafePublicId(fileName: string): string {
  const base = fileName.replace(/\\s+/g, "_")
  return base.replace(/[^a-zA-Z0-9._-]/g, "_")
}

@injectable()
export class FileUploadService implements IFileUploadService {
  private configured = false

  private configureOnce() {
    if (!this.configured) {
      ensureCloudinaryConfigured()
      this.configured = true
    }
  }

  async upload(
    user: UploadUserRole,
    userId: string,
    kind: UploadKind,
    fileName: string,
    data: Buffer,
    options?: UploadOptions,
  ): Promise<string> {
    this.configureOnce()

    const folder = `${user}/${userId}/${kind}`
    const publicId = toSafePublicId(fileName)

    let resourceType: "image" | "raw"
    if (fileName.toLowerCase().endsWith(".pdf")) {
      resourceType = "raw"
    } else {
      resourceType = "image"
    }

    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: resourceType,
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error)
          if (!result) return reject(new Error("Cloudinary returned empty result"))
          resolve(result)
        },
      )

      uploadStream.end(data)
    })

    return uploadResult.secure_url || uploadResult.url
  }
}



