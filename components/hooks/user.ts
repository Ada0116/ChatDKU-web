import { API_ENDPOINTS } from "@/lib/constants";

// Client for Django's core app:
//   GET  /user/       -> { netid, username, role }          (core.views.HealthView)
//   GET  /user/upload -> { netid, document: string[] }      (core.views.UploadView)
//   POST /user/upload -> multipart field `file_` -> { message }
//
// There is no delete endpoint on UploadView — see deleteDocument below.

export interface UserProfile {
  netid: string;
  name: string;
  role: string;
}

export interface UploadedDocument {
  /** UploadView identifies documents by filename; there are no numeric ids. */
  id: string;
  filename: string;
  uploadedAt?: Date;
}

export class UserAPI {
  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await fetch(API_ENDPOINTS.USER, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      const data = await response.json();
      return {
        netid: data.netid ?? "",
        name: data.username || "User",
        role: data.role ?? "",
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return { netid: "", name: "User", role: "" };
    }
  }

  async uploadDocument(file: File): Promise<UploadedDocument | null> {
    try {
      const formData = new FormData();
      // UploadView's serializer field is `file_`, and it only accepts PDFs <=10MB.
      formData.append("file_", file);

      const response = await fetch(API_ENDPOINTS.FILE_UPLOAD, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload document: ${response.status}`);
      }

      // The backend responds with { message } only, so the row is built locally.
      return { id: file.name, filename: file.name, uploadedAt: new Date() };
    } catch (error) {
      console.error("Error uploading document:", error);
      return null;
    }
  }

  async getUploadedDocuments(): Promise<UploadedDocument[]> {
    try {
      const response = await fetch(API_ENDPOINTS.FILE_UPLOAD, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status}`);
      }

      const data = await response.json();
      const filenames: string[] = Array.isArray(data?.document) ? data.document : [];
      return filenames.map((filename) => ({ id: filename, filename }));
    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  }

  /**
   * Not supported: core.views.UploadView exposes GET and POST only, so there is
   * no way to remove an uploaded document from the client yet.
   */
  async deleteDocument(_documentId: string): Promise<never> {
    throw new Error("Deleting uploads is not supported by the backend yet");
  }
}

export const userAPI = new UserAPI();
