import styles from "./Modal.module.css";
import Button from "../Button";

export default function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div>{children}</div>
        <div className={styles.modalButton}>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
