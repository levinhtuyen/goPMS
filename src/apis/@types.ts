export interface ResponseDto<D = any> {
  code: number;
  message: string;
  error: string | null;
  data: D | null;
  timestamp: number;
}
