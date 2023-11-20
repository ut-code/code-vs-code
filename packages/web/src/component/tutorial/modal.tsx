import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Pagination from "@mui/material/Pagination";
import type { TutorialDialogPropsStep } from "./TutorialDialogs";
import { tutorialDialogs } from "./TutorialDialogs";

interface ModalProps {
  id: number;
}

export default function Modal(ModalProps: ModalProps) {
  const [open, setOpen] = useState(true);
  const [page, setPage] = useState(1);
  const { id: tutorialId } = ModalProps;

  // ページごとのデータ
  const tutorialDialog = tutorialDialogs[tutorialId - 1];

  const [currentPageData, setCurrentPageData] = useState<
    TutorialDialogPropsStep | undefined
  >(tutorialDialog?.steps[0]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    setCurrentPageData(tutorialDialog?.steps[pageNumber - 1]);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      目標:{tutorialDialog?.goal}
      <br />
      <Button variant="outlined" onClick={handleOpen}>
        説明を見る
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        PaperProps={{ style: { height: "600px", width: "1000px" } }}
      >
        <DialogContent>{currentPageData?.content}</DialogContent>
        <Pagination
          count={tutorialDialog?.steps.length || 0}
          page={page}
          onChange={(e, pages) => handlePageChange(pages)}
          color="primary"
          sx={{ justifyContent: "center" }}
        />
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
