export interface RequestOptions {
  url: string;
  method: "POST" | "PATCH" | "DELETE" | "PUT";
  parameters?: Record<string, any> | null;
  body?: any;
  options?: RequestInit;
}
