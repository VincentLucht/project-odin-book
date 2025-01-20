export interface ValidationError {
  [key: string]: string;
}

export interface ResponseError {
  message?: string;
  errors?: ExpressError[];
}

export interface ExpressError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}
