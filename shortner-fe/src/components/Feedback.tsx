import React, { useState } from "react";
import { Tooltip, IconButton, Typography, Snackbar } from "@material-ui/core";

interface IProps {
  slug: string;
}

interface IState {
  showSnackBar: boolean;
}

export default function FeedBack(props: IProps) {
  const [display, setDisplay] = useState<IState>({
    showSnackBar: false,
  });
  if (!props.slug) return null;
  else
    return (
      <div>
        <Typography display="inline">
          Here is the shortened url {props.slug}
        </Typography>
        <Tooltip title="Copy to Clipboard">
          <IconButton
            aria-label="copyToClipboard"
            onClick={() => {
              navigator.clipboard.writeText(props.slug);
              setDisplay({ showSnackBar: true });
            }}
          >
            <i className="fa fa-clipboard" aria-hidden="false"></i>
          </IconButton>
        </Tooltip>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={display.showSnackBar}
          autoHideDuration={2000}
          message="URL copied to clipboard"
          onClose={() => {
            setDisplay({ showSnackBar: false });
          }}
        />
      </div>
    );
}
