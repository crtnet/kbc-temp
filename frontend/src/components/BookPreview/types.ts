export interface BookPreviewProps {
  title: string;
  genre: string;
  character?: string;
  setting?: string;
  theme?: string;
  tone?: string;
  onClose?: () => void;
  visible: boolean;
}

export interface StyleProps {
  visible: boolean;
}
