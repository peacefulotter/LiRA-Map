import { Toast } from 'react-hot-toast';

export type ToastFunc = (
  content: { title: string; footer: string },
  options?:
    | Partial<
        Pick<
          Toast,
          | 'id'
          | 'icon'
          | 'duration'
          | 'ariaProps'
          | 'className'
          | 'style'
          | 'position'
          | 'iconTheme'
        >
      >
    | undefined,
) => string;
