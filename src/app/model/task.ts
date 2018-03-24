export class Task {
  id?: string;
  title: string;
  memo?: string;
  isDelete: boolean;
  checkbox: boolean;
}

export class Task2 {
  id?: string;
  title: string;
  discription: string[];
  color?: string;
  label?: string;
  reminder?: string;
  isDelete?: boolean;
}

export class Memo {
  id?: string;
  discription: string;
  isCompleat: boolean;
}
