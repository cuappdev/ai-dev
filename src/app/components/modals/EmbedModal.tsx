export interface EmbedModalProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EmbedModal({ loading, setLoading }: EmbedModalProps) {
  console.log(loading);
  console.log(setLoading);

  return <h1>Embed</h1>;
}
